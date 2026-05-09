import { Hono } from 'hono'
import { neon } from '@neondatabase/serverless'

const app = new Hono()

// ══════════════════════════════════════════════════════════════════════════
// Neon DB 연결
// ══════════════════════════════════════════════════════════════════════════
const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_1PBkOmAWRcf2@ep-round-recipe-aqdgkjfj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
const sql = neon(DATABASE_URL)

// 유튜브 URL → ID 추출 (서버단 공통 유틸)
function extractYoutubeId(input: string): string {
  const s = (input ?? '').trim()
  if (!s) return ''
  // 이미 ID만 있는 경우 (11자 영숫자+하이픈+언더바)
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s
  // youtu.be/ID 또는 youtube.com?v=ID 등 다양한 형식
  const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : s
}

// DB 행 → 앱 객체 변환
function rowToShop(r: any) {
  return {
    id:            r.id,
    name:          r.name,
    category:      r.category,
    tags:          r.tags ?? [],
    price:         r.price ?? '',
    address:       r.address ?? '',
    district:      r.district ?? '',
    lat:           parseFloat(r.lat) || 37.5326,
    lng:           parseFloat(r.lng) || 127.0246,
    smartPlaceUrl: r.smart_place_url ?? '',
    youtubeId:     r.youtube_id ?? '',
    featured:      r.featured ?? false,
    thumbnail:     r.thumbnail ?? '',
    phone:         r.phone ?? '',
    desc:          r.description ?? '',
    active:          r.active ?? true,
    displayMode:     r.display_mode ?? 'both',
    plan:            r.plan ?? 'basic',
    paidUntil:       r.paid_until ?? null,
    paymentStatus:   r.payment_status ?? 'unpaid',
    paymentMemo:     r.payment_memo ?? '',
    views:           parseInt(r.view_cnt) || 0,
    feedSP:          parseInt(r.feed_sp)  || 0,
    mapSP:           parseInt(r.map_sp)   || 0,
  }
}

// ══════════════════════════════════════════════════════════════════════════
// 데이터 구조
// ══════════════════════════════════════════════════════════════════════════
interface Shop {
  id: number
  name: string
  category: string
  tags: string[]
  price: string
  address: string
  district: string
  lat: number
  lng: number
  smartPlaceUrl: string
  youtubeId: string
  featured: boolean
  thumbnail: string
  phone: string
  desc: string
  active: boolean
}

function calcDist(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371, dL = (la2 - la1) * Math.PI / 180, dO = (lo2 - lo1) * Math.PI / 180
  const a = Math.sin(dL / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dO / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ══════════════════════════════════════════════════════════════════════════
// API 라우트
// ══════════════════════════════════════════════════════════════════════════

// 샵 목록
app.get('/api/shops', async (c) => {
  const cat     = c.req.query('category') ?? ''
  const q       = (c.req.query('q') ?? '').toLowerCase()
  const lat     = parseFloat(c.req.query('lat') ?? '')
  const lng     = parseFloat(c.req.query('lng') ?? '')
  const nearby  = c.req.query('nearby') === '1'
  const shuffle = c.req.query('shuffle') === '1'

  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true
    ORDER BY s.featured DESC, s.id ASC
  `
  let list = rows.map(rowToShop) as any[]

  if (cat && cat !== 'all') list = list.filter((s:any) => s.category === cat)
  if (q) list = list.filter((s:any) =>
    s.name.toLowerCase().includes(q) ||
    (s.tags||[]).some((t:string) => t.toLowerCase().includes(q)) ||
    s.district.toLowerCase().includes(q)
  )
  if (nearby && !isNaN(lat) && !isNaN(lng)) {
    list = list
      .map((s:any) => ({ ...s, dist: calcDist(lat, lng, s.lat, s.lng) }))
      .filter((s:any) => s.dist <= 20)
      .sort((a:any, b:any) => a.dist - b.dist)
  } else if (shuffle) {
    // Fisher-Yates 완전 랜덤 셔플
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return c.json(list)
})

// 주소 → 좌표 변환 (네이버 지오코딩)
app.get('/api/geocode', async (c) => {
  const query = c.req.query('query') ?? ''
  if (!query) return c.json({ error: 'query required' }, 400)
  try {
    const res = await fetch(
      `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`,
      { headers: {
        'X-NCP-APIGW-API-KEY-ID': 'xjjg4490h8',
        'X-NCP-APIGW-API-KEY':    'RB4DFA4ZEF2iHtkerlNrqzoG8P8YHwE2UddGrAtD',
      }}
    )
    const data = await res.json() as any
    if (!data.addresses?.length) return c.json({ error: '주소를 찾을 수 없어요' }, 404)
    const addr = data.addresses[0]
    // 시/도 + 구 + 동 조합 (예: 서울시 강남구 논현동)
    const elements = addr.addressElements || []
    const sido   = elements.find((e:any) => e.types?.includes('SIDO'))?.longName || ''
    const sigungu= elements.find((e:any) => e.types?.includes('SIGUGUN'))?.longName || ''
    const dong   = elements.find((e:any) => e.types?.includes('DONGMYUN') || e.types?.includes('RI'))?.longName || ''
    const district = [sido, sigungu, dong].filter(Boolean).join(' ')
      || addr.roadAddress?.split(' ').slice(0,3).join(' ') || ''
    return c.json({
      lat:      parseFloat(addr.y),
      lng:      parseFloat(addr.x),
      address:  addr.roadAddress || addr.jibunAddress,
      district,
    })
  } catch(e) {
    return c.json({ error: '지오코딩 실패' }, 500)
  }
})

// 전체 샵 (지도용)
app.get('/api/shops/all', async (c) => {
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.active = true ORDER BY s.id ASC
  `
  return c.json(rows.map(rowToShop))
})

// 샵 단건
app.get('/api/shops/:id', async (c) => {
  const id = +c.req.param('id')
  const rows = await sql`
    SELECT s.*, COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0) as feed_sp, COALESCE(st.map_sp,0) as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    WHERE s.id = ${id}
  `
  if (!rows.length) return c.json({ error: 'not found' }, 404)
  return c.json(rowToShop(rows[0]))
})

// 샵 추가
app.post('/api/admin/shops', async (c) => {
  const body = await c.req.json()
  const tags = Array.isArray(body.tags)
    ? body.tags
    : (body.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean)
  const rows = await sql`
    INSERT INTO shops
      (name, category, tags, price, address, district, lat, lng,
       smart_place_url, youtube_id, featured, thumbnail, phone, description, active, display_mode)
    VALUES
      (${body.name ?? '새 업체'}, ${body.category ?? '피부관리'}, ${tags},
       ${body.price ?? ''}, ${body.address ?? ''}, ${body.district ?? ''},
       ${parseFloat(body.lat) || 37.5326}, ${parseFloat(body.lng) || 127.0246},
       ${body.smartPlaceUrl ?? ''}, ${extractYoutubeId(body.youtubeId ?? '')},
       ${body.featured ?? false},
       ${body.thumbnail ?? ''},
       ${body.phone ?? ''}, ${body.desc ?? ''}, true, ${body.displayMode ?? 'both'})
    RETURNING *
  `
  const shop = rows[0]
  await sql`INSERT INTO stats (shop_id) VALUES (${shop.id}) ON CONFLICT DO NOTHING`
  return c.json(rowToShop(shop))
})

// 샵 수정
app.put('/api/admin/shops/:id', async (c) => {
  const id   = +c.req.param('id')
  const body = await c.req.json()
  const tags = Array.isArray(body.tags)
    ? body.tags
    : (body.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean)
  const rows = await sql`
    UPDATE shops SET
      name            = ${body.name},
      category        = ${body.category},
      tags            = ${tags},
      price           = ${body.price ?? ''},
      address         = ${body.address ?? ''},
      district        = ${body.district ?? ''},
      lat             = ${parseFloat(body.lat) || 37.5326},
      lng             = ${parseFloat(body.lng) || 127.0246},
      smart_place_url = ${body.smartPlaceUrl ?? ''},
      youtube_id      = ${extractYoutubeId(body.youtubeId ?? '')},
      featured        = ${body.featured ?? false},
      thumbnail       = ${body.thumbnail ?? ''},
      phone           = ${body.phone ?? ''},
      description     = ${body.desc ?? ''},
      active          = ${body.active ?? true},
      display_mode    = ${body.displayMode ?? 'both'}
    WHERE id = ${id}
    RETURNING *
  `
  if (!rows.length) return c.json({ error: 'not found' }, 404)
  await sql`INSERT INTO stats (shop_id) VALUES (${id}) ON CONFLICT DO NOTHING`
  return c.json(rowToShop(rows[0]))
})

// 구독/결제 정보 수정
app.put('/api/admin/shops/:id/payment', async (c) => {
  const id   = +c.req.param('id')
  const body = await c.req.json()
  const rows = await sql`
    UPDATE shops SET
      plan           = ${body.plan ?? 'basic'},
      paid_until     = ${body.paidUntil || null},
      payment_status = ${body.paymentStatus ?? 'unpaid'},
      payment_memo   = ${body.paymentMemo ?? ''}
    WHERE id = ${id}
    RETURNING *
  `
  if (!rows.length) return c.json({ error: 'not found' }, 404)
  return c.json(rowToShop(rows[0]))
})

// 샵 삭제
app.delete('/api/admin/shops/:id', async (c) => {
  const id = +c.req.param('id')
  await sql`DELETE FROM shops WHERE id = ${id}`
  return c.json({ ok: true })
})

// 트래킹 — 영상 조회
app.post('/api/track/view/:id', async (c) => {
  const id = +c.req.param('id')
  await sql`
    INSERT INTO stats (shop_id, view_cnt) VALUES (${id}, 1)
    ON CONFLICT (shop_id) DO UPDATE SET view_cnt = stats.view_cnt + 1
  `
  return c.json({ ok: true })
})
// 트래킹 — 피드 예약클릭
app.post('/api/track/sp/:id', async (c) => {
  const id = +c.req.param('id')
  await sql`
    INSERT INTO stats (shop_id, feed_sp) VALUES (${id}, 1)
    ON CONFLICT (shop_id) DO UPDATE SET feed_sp = stats.feed_sp + 1
  `
  return c.json({ ok: true })
})
// 트래킹 — 지도 예약클릭
app.post('/api/track/mapsp/:id', async (c) => {
  const id = +c.req.param('id')
  await sql`
    INSERT INTO stats (shop_id, map_sp) VALUES (${id}, 1)
    ON CONFLICT (shop_id) DO UPDATE SET map_sp = stats.map_sp + 1
  `
  return c.json({ ok: true })
})

// 어드민 통계
app.get('/api/admin/stats', async (c) => {
  const rows = await sql`
    SELECT s.id, s.name, s.category, s.thumbnail, s.youtube_id,
           s.featured, s.active, s.lat, s.lng, s.smart_place_url,
           s.address, s.district, s.phone,
           COALESCE(st.view_cnt,0) as view_cnt,
           COALESCE(st.feed_sp,0)  as feed_sp,
           COALESCE(st.map_sp,0)   as map_sp
    FROM shops s LEFT JOIN stats st ON s.id = st.shop_id
    ORDER BY (COALESCE(st.view_cnt,0)+COALESCE(st.feed_sp,0)+COALESCE(st.map_sp,0)) DESC
  `
  const totals = await sql`
    SELECT
      SUM(view_cnt) as total_views,
      SUM(feed_sp)  as total_feed_sp,
      SUM(map_sp)   as total_map_sp
    FROM stats
  `
  const activeCount = await sql`SELECT COUNT(*) as cnt FROM shops WHERE active = true`
  const t = totals[0] || {}
  return c.json({
    stats: rows.map(r => ({
      id:        r.id,
      name:      r.name,
      category:  r.category,
      thumbnail: r.thumbnail,
      youtubeId: r.youtube_id,
      featured:  r.featured,
      active:    r.active,
      views:     parseInt(r.view_cnt) || 0,
      feedSP:    parseInt(r.feed_sp)  || 0,
      mapSP:     parseInt(r.map_sp)   || 0,
      lat:          parseFloat(r.lat) || 0,
      lng:          parseFloat(r.lng) || 0,
      smartPlaceUrl: r.smart_place_url ?? '',
      address:      r.address ?? '',
      district:     r.district ?? '',
      phone:        r.phone ?? '',
    })),
    totalViews:  parseInt(t.total_views)   || 0,
    totalFeedSP: parseInt(t.total_feed_sp) || 0,
    totalMapSP:  parseInt(t.total_map_sp)  || 0,
    totalShops:  parseInt(activeCount[0].cnt) || 0,
  })
})

// 입점 문의 접수
app.post('/api/inquiry', async (c) => {
  const body = await c.req.json()
  if (!body.name || !body.phone) return c.json({ error: 'required' }, 400)
  await sql`
    INSERT INTO inquiries (name, owner, category, area, phone, url, youtube_url, message)
    VALUES (${body.name}, ${body.owner??''}, ${body.category??''}, ${body.area??''}, ${body.phone},
            ${body.url??''}, ${body.youtubeUrl??''}, ${body.message??''})
  `
  return c.json({ ok: true })
})

// 입점 문의 목록 (관리자용)
app.get('/api/admin/inquiries', async (c) => {
  const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`
  return c.json(rows)
})

// favicon
app.get('/favicon.ico', (c) => favicon(c))
app.get('/favicon.svg', (c) => favicon(c))
function favicon(c: any) {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle">💄</text></svg>`,
    { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400' } }
  )
}

// 썸네일 파일 업로드 API (base64 → Data URL 저장)
app.post('/api/admin/upload-thumbnail', async (c) => {
  const body = await c.req.json()
  const { shopId, dataUrl } = body
  if (!dataUrl || !shopId) return c.json({ error: 'required' }, 400)
  await sql`UPDATE shops SET thumbnail = ${dataUrl} WHERE id = ${shopId}`
  return c.json({ ok: true, url: dataUrl })
})

app.get('/admin', (c) => c.html(adminPage()))
app.get('/map-admin', (c) => c.redirect('/admin'))
app.get('/map', (c) => c.html(mapPage()))
app.get('/', (c) => c.html(mainPage()))

// ══════════════════════════════════════════════════════════════════════════
// 메인 페이지
// ══════════════════════════════════════════════════════════════════════════
const NAVER_CLIENT_ID = 'xjjg4490h8'
const CATEGORIES = ['전체', '마사지', '헤드스파', '피부관리', '헤어', '메이크업', '왁싱', '반영구', '병원', '그외']
const CAT_EMOJI:  Record<string, string> = {
  '전체': '🏠', '마사지': '💆', '헤드스파': '🧖', '피부관리': '✨', '헤어': '💇', '메이크업': '💄', '왁싱': '🌸', '반영구': '👁', '병원': '🏥', '그외': '🌟',
}

function mainPage() { return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D; --pink2:#FF8FA3;
  --green:#03C75A; --green2:#02a84e;
  --bg:#0a0a0a;
  --hd:50px; --cat:44px; --nav:60px;
  --safe:env(safe-area-inset-bottom,0px);
}
html,body{height:100%;background:var(--bg);color:#fff;
  font-family:'Pretendard',-apple-system,sans-serif;overflow:hidden}

/* 헤더 */
.hd{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--hd);
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:space-between;padding:0 16px}
.logo{font-size:19px;font-weight:800;display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none}
.logo-icon{width:28px;height:28px;background:var(--pink);border-radius:8px;
  display:flex;align-items:center;justify-content:center;font-size:14px}
.logo em{color:var(--pink);font-style:normal}
.hd-badge{font-size:10px;font-weight:700;background:rgba(255,77,125,.15);
  color:var(--pink);padding:3px 8px;border-radius:8px;border:1px solid rgba(255,77,125,.25)}
.hd-right{display:flex;align-items:center;gap:8px}
.search-btn{background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;
  cursor:pointer;padding:6px;display:flex;align-items:center;justify-content:center;
  border-radius:10px;transition:color .2s}
.search-btn:active{color:#fff}

/* 검색바 */
.search-bar{position:fixed;top:var(--hd);left:0;right:0;z-index:302;
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,77,125,.2);
  padding:10px 12px;
  transform:translateY(-110%);opacity:0;
  transition:transform .3s cubic-bezier(.32,1,.23,1),opacity .25s;
  pointer-events:none}
.search-bar.open{transform:translateY(0);opacity:1;pointer-events:auto}
.search-inner{display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:0 14px;height:42px}
.search-bar.open .search-inner{border-color:rgba(255,77,125,.4)}
.search-inner i{color:rgba(255,255,255,.35);font-size:14px;flex-shrink:0}
.search-input{flex:1;background:none;border:none;outline:none;
  color:#fff;font-size:15px;font-family:inherit;font-weight:500}
.search-input::placeholder{color:rgba(255,255,255,.25)}
.search-clear{background:none;border:none;color:rgba(255,255,255,.3);
  font-size:16px;cursor:pointer;padding:4px;display:none;flex-shrink:0}
.search-clear.show{display:block}
.search-hint{font-size:11px;color:rgba(255,255,255,.25);margin-top:7px;
  padding:0 4px;line-height:1.5}

/* 카탈로그 탭바 */
.cat-bar{position:fixed;top:calc(var(--hd) + var(--sb,0px));left:0;right:0;z-index:299;height:var(--cat);
  background:rgba(10,10,10,.93);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06);display:none}
.cat-bar.show{display:block}
.cat-scroll{display:flex;align-items:center;gap:6px;
  overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cp{flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:20px;
  padding:5px 14px;font-size:12px;font-weight:600;
  background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);
  cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
.cp.active{background:var(--pink);border-color:var(--pink);color:#fff;
  box-shadow:0 2px 10px rgba(255,77,125,.35)}

/* 피드 화면 */
#feedScreen{
  position:fixed;
  top:calc(var(--hd) + var(--cat) + var(--sb,0px));
  left:0;right:0;
  height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--nav) - env(safe-area-inset-bottom,0px));
  overflow-y:scroll;
  scroll-snap-type:y mandatory;
  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
  display:none;background:#000;}
#feedScreen::-webkit-scrollbar{display:none;}
#feedScreen.active{display:block;}
#mapScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:var(--nav);
  display:none;}
#mapScreen.active{display:block;}
#inquiryScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:var(--nav);
  overflow-y:auto;display:none;background:var(--bg);}
#inquiryScreen.active{display:block;}

/* 입점문의 스타일 */
.iq-wrap{max-width:480px;margin:0 auto;padding:24px 16px 48px}
.iq-hero{text-align:center;padding:28px 0 20px}
.iq-badge{display:inline-block;background:rgba(255,77,125,.12);
  border:1px solid rgba(255,77,125,.3);color:var(--pink);
  font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;margin-bottom:14px}
.iq-title{font-size:26px;font-weight:900;line-height:1.25;margin-bottom:8px}
.iq-sub{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6}
.iq-benefits{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
.iq-benefit{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px 12px;text-align:center}
.iq-benefit .icon{font-size:24px;margin-bottom:6px}
.iq-benefit .bl{font-size:12px;font-weight:700;margin-bottom:2px}
.iq-benefit .bs{font-size:10px;color:rgba(255,255,255,.35);line-height:1.4}
/* 요금 안내 */
.iq-pricing{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
.iq-plan{border-radius:16px;padding:16px 14px;text-align:center;position:relative;overflow:hidden}
.iq-plan.free{background:linear-gradient(135deg,rgba(3,199,90,.15),rgba(3,199,90,.05));
  border:1.5px solid rgba(3,199,90,.35)}
.iq-plan.paid{background:linear-gradient(135deg,rgba(255,77,125,.15),rgba(255,77,125,.05));
  border:1.5px solid rgba(255,77,125,.3)}
.iq-plan .plan-tag{font-size:10px;font-weight:800;letter-spacing:.5px;
  padding:2px 8px;border-radius:99px;display:inline-block;margin-bottom:10px}
.iq-plan.free .plan-tag{background:rgba(3,199,90,.2);color:#03C75A}
.iq-plan.paid .plan-tag{background:rgba(255,77,125,.2);color:var(--pink)}
.iq-plan .plan-icon{font-size:28px;margin-bottom:8px}
.iq-plan .plan-price{font-size:20px;font-weight:900;margin-bottom:4px}
.iq-plan.free .plan-price{color:#03C75A}
.iq-plan.paid .plan-price{color:var(--pink)}
.iq-plan .plan-name{font-size:12px;font-weight:700;margin-bottom:6px}
.iq-plan .plan-desc{font-size:10px;color:rgba(255,255,255,.4);line-height:1.5}
/* 폼 */
.iq-form{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:20px;padding:20px 16px;margin-bottom:12px}
.iq-form h3{font-size:15px;font-weight:800;margin-bottom:16px}
.iq-field{margin-bottom:12px}
.iq-field label{display:block;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.4);margin-bottom:6px;letter-spacing:.3px}
.iq-field input,.iq-field select,.iq-field textarea{
  width:100%;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);
  border-radius:10px;padding:11px 13px;font-size:14px;color:#fff;
  font-family:inherit;outline:none;transition:border-color .2s;resize:none}
.iq-field input:focus,.iq-field select:focus,.iq-field textarea:focus{border-color:var(--pink)}
.iq-field select option{background:#1a1a1a}
.iq-field textarea{height:80px;line-height:1.5}
.iq-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
/* 개인정보 동의 */
.iq-agree{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
  border-radius:14px;padding:14px;margin-bottom:12px}
.iq-agree-title{font-size:12px;font-weight:800;margin-bottom:8px;
  display:flex;align-items:center;gap:6px}
.iq-agree-body{font-size:10px;color:rgba(255,255,255,.3);line-height:1.7;
  max-height:80px;overflow-y:auto;margin-bottom:10px;
  padding:8px;background:rgba(0,0,0,.2);border-radius:8px}
.iq-agree-check{display:flex;align-items:center;gap:8px;cursor:pointer}
.iq-agree-check input[type=checkbox]{
  width:18px;height:18px;accent-color:var(--pink);cursor:pointer;flex-shrink:0}
.iq-agree-check span{font-size:12px;font-weight:700;color:rgba(255,255,255,.7)}
.iq-agree-check span b{color:var(--pink)}
.iq-submit{width:100%;background:var(--pink);color:#fff;border:none;
  border-radius:14px;padding:16px;font-size:15px;font-weight:800;
  cursor:pointer;font-family:inherit;transition:opacity .15s;margin-top:4px}
.iq-submit:hover{opacity:.88}
.iq-submit:active{opacity:.75}
.iq-notice{font-size:11px;color:rgba(255,255,255,.2);text-align:center;line-height:1.7;margin-top:12px}
.iq-done{display:none;text-align:center;padding:48px 20px}
.iq-done .done-icon{font-size:56px;margin-bottom:16px}
.iq-done .done-title{font-size:20px;font-weight:800;margin-bottom:8px}
.iq-done .done-sub{font-size:13px;color:rgba(255,255,255,.4);line-height:1.7}

/* 하단탭 */
.tabbar{position:fixed;bottom:0;left:0;right:0;z-index:300;height:var(--nav);
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;padding-bottom:var(--safe)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  cursor:pointer;border:none;background:none;font-family:inherit;
  transition:color .2s;padding-top:4px}
.tab i{font-size:22px;transition:transform .2s}
.tab.active{color:#fff}
.tab.active i{color:var(--pink);transform:scale(1.1)}

/* 피드 카드 */
.fi{
  scroll-snap-align:start;
  scroll-snap-stop:always;
  height:calc(100dvh - var(--hd) - var(--cat) - var(--sb,0px) - var(--nav) - env(safe-area-inset-bottom,0px));
  flex-shrink:0;
  display:flex;flex-direction:column;overflow:hidden;background:#000;
}
.yt-area{flex:1;position:relative;overflow:hidden;background:#000}
.yt-area iframe{
  position:absolute;inset:0;width:100%;height:100%;border:none;}

/* 업체 정보 바 */
.shop-bar{flex-shrink:0;padding:18px 14px 14px;
  display:flex;align-items:flex-end;gap:10px;position:relative;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.98))}
.shop-bar::before{content:'';position:absolute;top:-44px;left:0;right:0;height:44px;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.7));pointer-events:none}
.shop-bar-info{flex:1;min-width:0}
.shop-bar-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px}
.shop-bar-name{font-size:17px;font-weight:800;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
.shop-bar-loc{font-size:11px;color:rgba(255,255,255,.5);
  display:flex;align-items:center;gap:4px}
.shop-bar-loc i{color:var(--green);font-size:10px;flex-shrink:0}
.shop-bar-desc{font-size:11px;color:rgba(255,255,255,.4);line-height:1.5;
  margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;
  -webkit-box-orient:vertical;overflow:hidden}
.btn-book{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:3px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:10px 14px;font-size:12px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 4px 16px rgba(3,199,90,.4);min-width:64px}
.btn-book i{font-size:16px}
.btn-book span{font-size:10px;font-weight:700}
.btn-book:active{background:var(--green2);transform:scale(.96)}

/* 로딩/빈상태 */
.feed-spin{height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a}
.spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);
  border-top-color:var(--pink);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.feed-empty{height:100%;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;color:rgba(255,255,255,.25);
  scroll-snap-align:start;background:#0a0a0a}
.feed-empty i{font-size:48px}
.feed-empty p{font-size:14px;font-weight:600}

/* ── 지도 화면 ── */
#naverMap{position:absolute;top:0;left:0;right:0;bottom:0;}

/* 지도 위 카테고리 필터 (floating) */
.map-cat-bar{
  position:absolute;top:10px;left:0;right:0;z-index:100;
  display:flex;gap:6px;overflow-x:auto;
  padding:0 12px;scrollbar-width:none;pointer-events:auto}
.map-cat-bar::-webkit-scrollbar{display:none}
.mc{flex-shrink:0;border:none;border-radius:20px;
  padding:7px 14px;font-size:12px;font-weight:700;
  background:rgba(18,18,18,.88);backdrop-filter:blur(12px);
  color:rgba(255,255,255,.65);
  cursor:pointer;font-family:inherit;transition:all .2s;
  white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,.35)}
.mc.active{
  background:var(--pink);color:#fff;
  box-shadow:0 3px 14px rgba(255,77,125,.45)}

/* 내 주변 FAB */
.nearby-fab{
  position:absolute;top:56px;right:12px;z-index:100;
  background:rgba(18,18,18,.9);backdrop-filter:blur(10px);
  border:1.5px solid rgba(255,255,255,.15);border-radius:50px;
  padding:8px 13px;display:flex;align-items:center;gap:5px;
  font-size:11px;font-weight:700;color:#fff;cursor:pointer;
  box-shadow:0 2px 12px rgba(0,0,0,.5);font-family:inherit;transition:all .2s}
.nearby-fab i{color:var(--pink);font-size:12px}
.nearby-fab.on{background:var(--pink);border-color:var(--pink)}
.nearby-fab.on i{color:#fff}

/* ── 지도 위 팝업 카드 (두바이쿠키맵 스타일) ── */
.map-popup{
  position:absolute;bottom:16px;left:12px;right:12px;
  z-index:200;
  background:#111;border-radius:20px;
  overflow:hidden;
  box-shadow:0 8px 32px rgba(0,0,0,.7);
  border:1px solid rgba(255,255,255,.1);
  transform:translateY(20px) scale(.96);
  opacity:0;pointer-events:none;
  transition:transform .32s cubic-bezier(.34,1.56,.64,1),opacity .25s}
.map-popup.show{
  transform:translateY(0) scale(1);
  opacity:1;pointer-events:auto}

/* 팝업 유튜브 영역 */
.mp-yt{
  position:relative;width:100%;padding-top:52%;
  background:#000;overflow:hidden}
.mp-yt iframe{position:absolute;inset:0;width:100%;height:100%;border:none}
.mp-yt-thumb{
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;cursor:pointer}
.mp-play-btn{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);cursor:pointer;transition:background .2s}
.mp-play-btn:hover{background:rgba(0,0,0,.15)}
.mp-play-icon{
  width:52px;height:52px;border-radius:50%;
  background:rgba(255,255,255,.92);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.4)}
.mp-play-icon i{color:#111;font-size:20px;margin-left:3px}

/* 팝업 정보 영역 */
.mp-info{padding:13px 14px 14px;display:flex;align-items:flex-start;gap:10px}
.mp-info-main{flex:1;min-width:0}
.mp-badge{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.2);
  padding:2px 8px;border-radius:6px;margin-bottom:5px}
.mp-name{
  font-size:17px;font-weight:800;line-height:1.2;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:4px}
.mp-meta{
  font-size:11px;color:rgba(255,255,255,.4);
  display:flex;align-items:center;gap:6px;margin-bottom:5px}
.mp-meta i{font-size:10px}
.mp-desc{
  font-size:12px;color:rgba(255,255,255,.5);line-height:1.45;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.mp-actions{display:flex;flex-direction:column;gap:6px;flex-shrink:0}
.mp-book{
  display:flex;align-items:center;justify-content:center;gap:5px;
  background:var(--green);color:#fff;border:none;border-radius:11px;
  padding:9px 12px;font-size:11px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 3px 12px rgba(3,199,90,.4)}
.mp-book:active{background:var(--green2)}
.mp-close{
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);
  border-radius:11px;width:38px;height:38px;
  cursor:pointer;font-size:14px;color:rgba(255,255,255,.5)}
.mp-close:active{background:rgba(255,255,255,.15)}
.mp-tags{
  display:flex;gap:4px;flex-wrap:wrap;margin-top:6px}
.mp-tag{
  font-size:10px;background:rgba(255,255,255,.07);
  color:rgba(255,255,255,.5);padding:3px 8px;border-radius:8px}

/* ── 하단 미니카드 패널 제거 ── */
:root{--panel-h:0px}

/* 네이버 지도 커스텀 마커 → 인라인 스타일로 처리, CSS 불필요 */

/* 피드용 바텀시트 */
.dim{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:400;
  pointer-events:none;transition:background .3s}
.dim.on{background:rgba(0,0,0,.6);pointer-events:auto}
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:401;
  background:#141414;border-radius:24px 24px 0 0;
  transform:translateY(100%);transition:transform .38s cubic-bezier(.32,1,.23,1);
  max-height:85vh;display:flex;flex-direction:column;
  padding-bottom:calc(20px + var(--safe));
  box-shadow:0 -4px 30px rgba(0,0,0,.5)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:38px;height:4px;background:rgba(255,255,255,.1);
  border-radius:4px;margin:14px auto 0;flex-shrink:0}
.sheet-img{width:calc(100% - 28px);height:180px;object-fit:cover;
  border-radius:16px;margin:14px 14px 0;flex-shrink:0}
.sheet-body{padding:16px 18px 0;overflow-y:auto;flex:1}
.s-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 8px;border-radius:6px;margin-bottom:6px}
.s-name{font-size:22px;font-weight:800;margin-bottom:6px;line-height:1.2}
.s-addr{font-size:12px;color:rgba(255,255,255,.45);
  display:flex;align-items:center;gap:5px;margin-bottom:4px}
.s-phone{font-size:12px;color:rgba(255,255,255,.4);
  display:flex;align-items:center;gap:5px;margin-bottom:10px}
.s-desc{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:10px;line-height:1.5}
.s-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}
.s-tag{font-size:11px;background:rgba(255,255,255,.07);
  color:rgba(255,255,255,.6);padding:4px 10px;border-radius:9px;font-weight:500}
.s-price{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:18px}
.s-price span{color:var(--pink2);font-size:18px;font-weight:800}
.s-actions{display:flex;gap:10px}
.s-book{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:15px;font-size:15px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  box-shadow:0 4px 16px rgba(3,199,90,.35)}
.s-book:active{background:var(--green2)}
.s-map-btn{flex-shrink:0;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:15px 16px;cursor:pointer;
  font-size:18px;color:rgba(255,255,255,.6)}

/* 인앱 브라우저 */
.inapp-bg{
  position:fixed;inset:0;z-index:800;
  background:rgba(0,0,0,.5);
  opacity:0;pointer-events:none;transition:opacity .3s}
.inapp-bg.show{opacity:1;pointer-events:auto}
.inapp-sheet{
  position:fixed;bottom:0;left:0;right:0;z-index:801;
  height:92dvh;
  background:#111;border-radius:22px 22px 0 0;
  display:flex;flex-direction:column;
  transform:translateY(100%);
  transition:transform .38s cubic-bezier(.32,1,.23,1);
  box-shadow:0 -6px 40px rgba(0,0,0,.6)}
.inapp-sheet.show{transform:translateY(0)}
.inapp-bar{
  flex-shrink:0;height:52px;
  display:flex;align-items:center;gap:8px;
  padding:0 12px;
  border-bottom:1px solid rgba(255,255,255,.07)}
.inapp-handle{
  position:absolute;top:8px;left:50%;transform:translateX(-50%);
  width:36px;height:4px;background:rgba(255,255,255,.15);border-radius:4px}
.inapp-title{
  flex:1;font-size:13px;font-weight:700;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  color:rgba(255,255,255,.75)}
.inapp-btn{
  flex-shrink:0;width:36px;height:36px;
  border:none;border-radius:10px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;font-family:inherit;transition:background .15s}
.inapp-btn-ext{
  background:rgba(255,255,255,.07);color:rgba(255,255,255,.5)}
.inapp-btn-ext:active{background:rgba(255,255,255,.14)}
.inapp-btn-close{
  background:rgba(255,77,125,.15);color:var(--pink)}
.inapp-btn-close:active{background:rgba(255,77,125,.28)}
.inapp-iframe{
  flex:1;border:none;width:100%;background:#fff;
  border-radius:0 0 22px 22px}
.inapp-loader{
  position:absolute;top:52px;left:0;right:0;
  height:2px;background:rgba(255,255,255,.07);
  overflow:hidden;pointer-events:none}
.inapp-loader::after{
  content:'';position:absolute;top:0;left:-60%;
  width:60%;height:100%;background:var(--pink);
  animation:loader-slide 1.2s ease-in-out infinite}
@keyframes loader-slide{to{left:110%}}
.inapp-loader.done{display:none}

/* 토스트 */
.toast{position:fixed;bottom:calc(var(--nav)+12px);left:50%;
  transform:translateX(-50%) translateY(8px);
  background:rgba(20,20,20,.97);color:#fff;border:1px solid rgba(255,255,255,.1);
  padding:10px 20px;border-radius:22px;font-size:13px;font-weight:600;
  z-index:600;opacity:0;transition:opacity .25s,transform .25s;
  pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>

<header class="hd">
  <div class="logo" id="logoBtn">
    <div class="logo-icon">💄</div>
    마이<em>뷰티</em>맵
  </div>
  <div class="hd-right">
    <span class="hd-badge">BETA</span>
    <button class="search-btn" id="searchToggleBtn" onclick="toggleSearch()" aria-label="검색">
      <i class="fas fa-search" id="searchBtnIcon"></i>
    </button>
  </div>
</header>

<!-- 검색바 -->
<div class="search-bar" id="searchBar">
  <div class="search-inner">
    <i class="fas fa-search"></i>
    <input class="search-input" id="searchInput" type="search"
      placeholder="샵 이름, 지역, 태그 검색..."
      oninput="onSearchInput(this.value)"
      onkeydown="if(event.key==='Enter'){this.blur();}"
    />
    <button class="search-clear" id="searchClear" onclick="clearSearch()"><i class="fas fa-times-circle"></i></button>
  </div>
  <div class="search-hint">예) 강남 마사지 &nbsp;·&nbsp; 눈썹문신 &nbsp;·&nbsp; 리프팅</div>
</div>

<!-- 카탈로그 탭바 (피드 전용) -->
<div class="cat-bar show" id="catBar">
  <div class="cat-scroll">
    ${CATEGORIES.map((c, i) => `<button class="cp${i === 0 ? ' active' : ''}" onclick="filterFeed(this,'${c === '전체' ? 'all' : c}')">${CAT_EMOJI[c]} ${c}</button>`).join('')}
  </div>
</div>

<!-- 피드 화면 -->
<main id="feedScreen" class="active">
  <div class="feed-spin"><div class="spinner"></div></div>
</main>

<!-- 지도 화면: iframe -->
<section id="mapScreen">
  <!-- 카테고리 필터 -->
  <div class="map-cat-bar" id="mapCatBar">
    ${CATEGORIES.map((c, i) => `<button class="mc${i === 0 ? ' active' : ''}" onclick="filterMap(this,'${c === '전체' ? 'all' : c}')">${CAT_EMOJI[c]} ${c}</button>`).join('')}
  </div>
  <!-- 지도 iframe -->
  <iframe id="mapFrame" src="/map" style="position:absolute;inset:0;width:100%;height:100%;border:none;"></iframe>
</section>

<!-- 입점문의 화면 -->
<section id="inquiryScreen">
  <div class="iq-wrap">

    <!-- 히어로 -->
    <div class="iq-hero">
      <div class="iq-badge">✨ 파트너 모집 중</div>
      <div class="iq-title">마이뷰티맵에<br>내 샵을 등록하세요</div>
      <div class="iq-sub">유튜브 영상으로 홍보하고<br>더 많은 고객에게 닿을 수 있어요</div>
    </div>

    <!-- 혜택 카드 -->
    <div class="iq-benefits">
      <div class="iq-benefit">
        <div class="icon">▶️</div>
        <div class="bl">유튜브 영상 홍보</div>
        <div class="bs">업체 유튜브 영상을<br>피드에 자동 노출</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">🗺️</div>
        <div class="bl">지도 핀 등록</div>
        <div class="bs">네이버 지도 위에<br>업체 핀 표시</div>
      </div>
      <div class="iq-benefit">
        <div class="icon">📅</div>
        <div class="bl">예약 연동</div>
        <div class="bs">스마트플레이스<br>바로 예약 연결</div>
      </div>

    </div>

    <!-- 요금 안내 -->
    <div class="iq-pricing">
      <div class="iq-plan free">
        <div class="plan-tag">추천</div>
        <div class="plan-icon">🎬</div>
        <div class="plan-price">6개월 무료</div>
        <div class="plan-name">촬영 플랜</div>
        <div class="plan-desc">
          촬영비 <b style="color:#03C75A">3만원</b> 내시면<br>
          <b style="color:#03C75A">6개월 무료</b> 게재<br>
          <span style="font-size:9px;opacity:.6">이후 월 10,000원</span>
        </div>
      </div>
      <div class="iq-plan paid">
        <div class="plan-tag">기본</div>
        <div class="plan-icon">📍</div>
        <div class="plan-price">월 1만원</div>
        <div class="plan-name">기본 플랜</div>
        <div class="plan-desc">영상 없이<br>맵 게재만<br><b style="color:var(--pink)">월 10,000원</b></div>
      </div>
    </div>

    <!-- 신청 폼 -->
    <div class="iq-form" id="iqForm">
      <h3>📝 입점 신청서</h3>
      <div class="iq-row2">
        <div class="iq-field">
          <label>대표님 성함 *</label>
          <input type="text" id="iq-owner" placeholder="홍길동">
        </div>
        <div class="iq-field">
          <label>연락처 *</label>
          <input type="tel" id="iq-phone" placeholder="010-0000-0000">
        </div>
      </div>
      <div class="iq-field">
        <label>샵 이름 *</label>
        <input type="text" id="iq-name" placeholder="예) 글로우 스킨 강남점">
      </div>
      <div class="iq-row2">
        <div class="iq-field">
          <label>업종 *</label>
          <select id="iq-cat">
            <option value="">선택</option>
            <option>마사지</option><option>헤드스파</option><option>피부관리</option>
            <option>헤어</option><option>메이크업</option><option>왁싱</option><option>반영구</option>
            <option>병원</option><option>그외</option>
          </select>
        </div>
        <div class="iq-field">
          <label>지역 *</label>
          <input type="text" id="iq-area" placeholder="예) 강남구">
        </div>
      </div>
      <div class="iq-field">
        <label>스마트플레이스 URL</label>
        <input type="url" id="iq-url" placeholder="https://naver.me/...">
      </div>
      <div class="iq-field">
        <label>문의사항</label>
        <textarea id="iq-msg" placeholder="궁금한 점이나 요청사항을 적어주세요"></textarea>
      </div>
    </div>

    <!-- 개인정보 수집·이용 동의 -->
    <div class="iq-agree">
      <div class="iq-agree-title">🔒 개인정보 수집·이용 동의</div>
      <div class="iq-agree-body">
        <b>수집 항목:</b> 성함, 연락처, 샵명, 업종, 지역, 스마트플레이스 URL, 문의사항<br>
        <b>수집 목적:</b> 입점 검토 및 상담 연락<br>
        <b>보유 기간:</b> 입점 검토 완료 후 1년 또는 동의 철회 시까지<br>
        <b>제3자 제공:</b> 없음 (내부 검토 목적으로만 사용)<br><br>
        귀하는 개인정보 수집·이용에 동의를 거부할 권리가 있으며, 동의 거부 시 입점 신청이 제한될 수 있습니다.
      </div>
      <label class="iq-agree-check">
        <input type="checkbox" id="iq-agree-chk">
        <span>위 개인정보 수집·이용에 <b>(필수)</b> 동의합니다</span>
      </label>
    </div>

    <button class="iq-submit" onclick="submitInquiry()">
      <i class="fas fa-paper-plane" style="margin-right:6px"></i>입점 신청하기
    </button>

    <!-- 완료 메시지 -->
    <div class="iq-done" id="iqDone">
      <div class="done-icon">🎉</div>
      <div class="done-title">신청이 접수됐어요!</div>
      <div class="done-sub">담당자가 확인 후<br>1~2일 내로 연락드릴게요.</div>
    </div>

    <div class="iq-notice">
      입력하신 정보는 입점 검토 목적으로만 사용되며<br>
      제3자에게 제공되지 않습니다. (개인정보보호법 준수)
    </div>
  </div>
</section>

<!-- 하단 탭바 -->
<nav class="tabbar">
  <button class="tab active" id="tab-feed" onclick="switchTab('feed')">
    <i class="fas fa-play-circle"></i>영상
  </button>
  <button class="tab" id="tab-map" onclick="switchTab('map')">
    <i class="fas fa-map-marker-alt"></i>지도
  </button>
  <button class="tab" id="tab-inquiry" onclick="switchTab('inquiry')">
    <i class="fas fa-store"></i>입점문의
  </button>
</nav>

<!-- 피드 전용 딤 + 바텀시트 -->
<div class="dim" id="dim" onclick="closeFeedSheet()"></div>
<div class="sheet" id="sheet">
  <div class="sheet-handle"></div>
  <img class="sheet-img" id="sImg" src="" alt=""/>
  <div class="sheet-body">
    <div class="s-cat"  id="sCat"></div>
    <div class="s-name" id="sName"></div>
    <div class="s-addr"><i class="fas fa-map-pin" style="color:var(--green)"></i><span id="sAddr"></span></div>
    <div class="s-phone"><i class="fas fa-phone" style="color:rgba(255,255,255,.3)"></i><span id="sPhone"></span></div>
    <div class="s-desc" id="sDesc"></div>
    <div class="s-tags" id="sTags"></div>
    <div class="s-price">시술 <span id="sPrice"></span></div>
    <div class="s-actions">
      <button class="s-book" id="sBook" onclick="openInapp()">
        <i class="fas fa-calendar-check"></i> 네이버 예약하기
      </button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>

<!-- 인앱 브라우저 -->
<div class="inapp-bg" id="inappBg" onclick="closeInapp()"></div>
<div class="inapp-sheet" id="inappSheet">
  <div class="inapp-handle"></div>
  <div class="inapp-bar">
    <span class="inapp-title" id="inappTitle">예약하기</span>
    <button class="inapp-btn inapp-btn-ext" id="inappExtBtn" onclick="openInappExternal()" title="외부 브라우저로 열기">
      <i class="fas fa-external-link-alt"></i>
    </button>
    <button class="inapp-btn inapp-btn-close" onclick="closeInapp()" title="닫기">
      <i class="fas fa-times"></i>
    </button>
  </div>
  <div class="inapp-loader" id="inappLoader"></div>
  <iframe class="inapp-iframe" id="inappFrame" src="" allowfullscreen></iframe>
</div>



<script>
// ── 전역 ──────────────────────────────────────────────────────────────────
let allShops   = [];
let mapCat     = 'all';
let nearbyOn   = false;
let userLat    = null;
let userLng    = null;
let curShop    = null;
let naverMap   = null;
let mapInited  = false;
let nvMarkers  = {};   // id -> {marker, overlay}
let userMarker = null;

const CAT_CLASS = {
  '마사지':'cat-massage', '헤드스파':'cat-headspa',
  '피부관리':'cat-skin', '헤어':'cat-hair', '메이크업':'cat-makeup',
  '왁싱':'cat-wax', '반영구':'cat-perm', '병원':'cat-hospital', '그외':'cat-etc',
};

// ── 탭 전환 ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  ['feed','map','inquiry'].forEach(t => {
    const tabEl = document.getElementById('tab-'+t);
    const scrEl = document.getElementById(t+'Screen');
    if(tabEl) tabEl.classList.toggle('active', t===tab);
    if(scrEl) scrEl.classList.toggle('active', t===tab);
  });
  document.getElementById('catBar').classList.toggle('show', tab==='feed');

  // PC wrapper 표시/숨김: 피드 탭이 아닐 때 숨기고, 피드 탭으로 돌아오면 다시 보이기
  const pcWrapper = document.getElementById('feed-pc-wrapper');
  if (pcWrapper) {
    pcWrapper.style.display = (tab === 'feed') ? '' : 'none';
  }

  if (tab==='map') {
    closeMapPopup();
    initMap();
    // 지도가 display:none 상태에서 로드됐을 수 있어서
    // 탭 전환 후 iframe에 fitBounds 재실행 요청
    setTimeout(() => {
      const frame = document.getElementById('mapFrame');
      if (frame) frame.contentWindow.postMessage({ type: 'fitBounds' }, '*');
    }, 300);
  }
  if (tab==='feed') {
    closeMapPopup();
  }
}

// ── 로고 5번 탭 → 관리자 선택 팝업 ─────────────────────────────────────
let logoCnt=0, logoTmr;
document.getElementById('logoBtn').addEventListener('click', ()=>{
  logoCnt++;
  clearTimeout(logoTmr);
  logoTmr = setTimeout(()=>{logoCnt=0;}, 800);
  if (logoCnt >= 5) {
    logoCnt = 0;
    showAdminPicker();
  }
});

function showAdminPicker() {
  const pw = prompt('관리자 비밀번호');
  if (pw === null) return;
  if (pw !== '0907') { showToast('❌ 비밀번호가 틀렸어요'); return; }
  location.href = '/admin';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 피드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let feedCat = 'all';
let searchQ = '';
let searchTimer = null;

// ─────────────────────────────────────────────
// 피드: CSS scroll-snap 방식 (JS 높이계산 없음)
// ─────────────────────────────────────────────

function feedCardHTML(s) {
  // iframe을 바로 박음. src는 비워두고 Observer가 보일 때 채움
  // data-src에 URL 저장, src는 비워둠 → Observer가 보일 때 src로 이동
  const ytSrc = 'https://www.youtube.com/embed/' + s.youtubeId
    + '?playsinline=1&rel=0&modestbranding=1&color=white';
  const ytArea = s.youtubeId
    ? '<div class="yt-area">'
        + '<iframe data-src="' + ytSrc + '" src="about:blank"'
        + ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen"'
        + ' allowfullscreen></iframe>'
      + '</div>'
    : '<div class="yt-area"></div>';
  // data-shop JSON 이스케이프 버그 → data-id/url/name 개별 속성으로 분리
  const safeUrl  = (s.smartPlaceUrl||'').replace(/"/g,'&quot;');
  const safeName = (s.name||'').replace(/"/g,'&quot;');
  const bookBtn = s.smartPlaceUrl
    ? '<button class="btn-book"'
        + ' data-id="' + s.id + '"'
        + ' data-url="' + safeUrl + '"'
        + ' data-name="' + safeName + '"'
        + ' onclick="'
            + 'curShop={id:+this.dataset.id,name:this.dataset.name,smartPlaceUrl:this.dataset.url};'
            + 'openInapp()">'
        + '<i class="fas fa-calendar-check"></i><span>예약하기</span></button>'
    : '';
  return '<div class="fi">'
    + ytArea
    + '<div class="shop-bar">'
      + '<div class="shop-bar-info">'
        + '<div class="shop-bar-cat">' + (s.category||'') + '</div>'
        + '<div class="shop-bar-name">' + (s.name||'') + '</div>'
        + '<div class="shop-bar-loc"><i class="fas fa-map-marker-alt"></i><span>'
          + (s.address || s.district || '') + (s.price ? ' · ' + s.price : '') + '</span></div>'
        + (s.desc ? '<div class="shop-bar-desc">' + s.desc + '</div>' : '')
      + '</div>'
      + bookBtn
    + '</div>'
  + '</div>';
}

async function loadFeed(cat='all', q='') {
  feedCat = cat;
  const scr = document.getElementById('feedScreen');

  scr.innerHTML = '<div class="feed-spin"><div class="spinner"></div></div>';

  let url = '/api/shops?category=' + encodeURIComponent(cat==='all'?'':cat) + '&shuffle=1';
  if (q) url += '&q=' + encodeURIComponent(q);
  const shops = await fetch(url).then(r=>r.json());

  if (!shops.length) {
    scr.innerHTML = '<div class="feed-empty"><i class="fas fa-search"></i><p>'
      + (q ? '"'+q+'" 검색 결과가 없어요' : '등록된 샵이 없어요') + '</p></div>';
    return;
  }

  // 카드 렌더
  scr.innerHTML = shops.map(feedCardHTML).join('');
  scr.scrollTop = 0;

  // 이전 Observer 해제
  if (scr._obs) scr._obs.disconnect();

  // 화면에 보이는 카드 iframe만 src 활성화 → 로딩 집중, 메모리 절약
  // root:null = 뷰포트 기준 (feedScreen이 fixed라 동일)
  // root:scr 쓰면 display:none 상태에선 Observer 트리거 안됨 → 영상 미노출
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const ifr = en.target.querySelector('iframe[data-src]');
      if (!ifr) return;
      if (en.isIntersecting) {
        if (ifr.src !== ifr.dataset.src) ifr.src = ifr.dataset.src;
      } else {
        if (ifr.src !== 'about:blank') ifr.src = 'about:blank';
      }
    });
  }, { root: null, threshold: 0.5 });

  scr._obs = obs;
  scr.querySelectorAll('.fi').forEach((card) => obs.observe(card));

  // Observer가 첫 카드를 놓칠 경우 대비 — 첫 번째 iframe 즉시 강제 세팅
  const firstIfr = scr.querySelector('iframe[data-src]');
  if (firstIfr && firstIfr.src !== firstIfr.dataset.src) {
    firstIfr.src = firstIfr.dataset.src;
  }
}

function filterFeed(btn, cat) {
  document.querySelectorAll('.cp').forEach((b)=>b.classList.remove('active'));
  btn.classList.add('active');
  loadFeed(cat, searchQ);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 검색
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let searchOpen = false;

function toggleSearch() {
  searchOpen = !searchOpen;
  const bar  = document.getElementById('searchBar');
  const icon = document.getElementById('searchBtnIcon');
  const catBar = document.getElementById('catBar');
  bar.classList.toggle('open', searchOpen);
  icon.className = searchOpen ? 'fas fa-times' : 'fas fa-search';
  // 검색바 높이(62px)만큼 catBar 아래로
  document.documentElement.style.setProperty('--sb', searchOpen ? '62px' : '0px');
  if (searchOpen) {
    setTimeout(()=>document.getElementById('searchInput').focus(), 320);
  } else {
    clearSearch();
  }
}

function onSearchInput(val) {
  searchQ = val.trim();
  document.getElementById('searchClear').classList.toggle('show', !!searchQ);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const activeTab = document.getElementById('mapScreen').classList.contains('active') ? 'map' : 'feed';
    if (activeTab === 'map') {
      loadMapShops(mapCat, nearbyOn, searchQ);
    } else {
      loadFeed(feedCat, searchQ);
    }
  }, 350);
}

function clearSearch() {
  searchQ = '';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  document.getElementById('searchClear').classList.remove('show');
  const activeTab = document.getElementById('mapScreen').classList.contains('active') ? 'map' : 'feed';
  if (activeTab === 'map') {
    loadMapShops(mapCat, nearbyOn, '');
  } else {
    loadFeed(feedCat, '');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 네이버 지도
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function waitNaverMap(cb, tries=0) {
  if (window.naver && window.naver.maps) { cb(); return; }
  if (tries > 40) { showToast('지도 로드 실패. 새로고침 해주세요'); return; }
  setTimeout(()=>waitNaverMap(cb, tries+1), 200);
}

function initMap() {
  if (mapInited) {
    if (naverMap) {
      naverMap.autoResize();
      loadMapShops(mapCat, nearbyOn, searchQ);
    }
    return;
  }
  // display:none 우회: naverMap 크기를 window 기준으로 강제 지정
  const hd  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hd') || '56');
  const nav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav') || '60');
  const nm  = document.getElementById('naverMap');
  nm.style.width  = window.innerWidth  + 'px';
  nm.style.height = (window.innerHeight - hd - nav) + 'px';
  waitNaverMap(()=>{
    mapInited = true;
    naverMap = new naver.maps.Map('naverMap', {
      center: new naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      mapTypeId: naver.maps.MapTypeId.NORMAL,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
    });
    naver.maps.Event.addListener(naverMap, 'click', ()=>closeMapPopup());
    loadMapShops('all', false);
  });
}

function catClass(cat) { return CAT_CLASS[cat] || ''; }

// 카테고리별 배경색 (인라인 스타일용)
const CAT_COLOR = {
  '마사지':'#10B981', '헤드스파':'#6366F1',
  '피부관리':'#FF4D7D', '헤어':'#F59E0B', '메이크업':'#C084FC',
  '왁싱':'#EC4899', '반영구':'#06B6D4', '병원':'#3B82F6', '그외':'#8B5CF6',
};
function pinColor(cat) { return CAT_COLOR[cat] || '#FF4D7D'; }

// DOM 엘리먼트 방식으로 마커 생성 (썸네일 카드형)
function buildMarkerEl(shop, selected) {
  const ac   = pinColor(shop.category);
  const scale = selected ? 'scale(1.12)' : 'scale(1)';
  const shadow = selected
    ? '0 6px 24px rgba(0,0,0,.7)'
    : '0 3px 12px rgba(0,0,0,.5)';
  const border = selected ? '2px solid #fff' : '2px solid rgba(255,255,255,.4)';

  // 썸네일: 유튜브 우선 → 등록 썸네일 → 카테고리 색 배경
  const thumbUrl = shop.youtubeId
    ? 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg'
    : shop.thumbnail || '';

  const wrap = document.createElement('div');
  wrap.style.cssText = [
    'display:flex;flex-direction:column;align-items:center;',
    'cursor:pointer;',
    'transform:' + scale + ';transition:transform .2s;',
  ].join('');

  // 카드 본체
  const card = document.createElement('div');
  card.style.cssText = [
    'border-radius:10px;overflow:hidden;',
    'box-shadow:' + shadow + ';',
    'border:' + border + ';',
    'width:90px;',
    'background:#111;',
  ].join('');

  // 썸네일 영역
  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = 'width:90px;height:56px;overflow:hidden;position:relative;';

  if (thumbUrl) {
    const img = document.createElement('img');
    img.src = thumbUrl;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    img.onerror = function() {
      if (this.src.includes('maxresdefault')) {
        this.onerror = function() { imgWrap.style.background = ac; this.style.display='none'; };
        this.src = 'https://img.youtube.com/vi/' + shop.youtubeId + '/hqdefault.jpg';
      } else { imgWrap.style.background = ac; this.style.display='none'; }
    };
    imgWrap.appendChild(img);
  } else {
    imgWrap.style.background = ac;
    imgWrap.style.display = 'flex';
    imgWrap.style.alignItems = 'center';
    imgWrap.style.justifyContent = 'center';
    imgWrap.innerHTML = '<span style="font-size:22px">💄</span>';
  }

  // 유튜브 아이콘 뱃지
  if (shop.youtubeId) {
    const ytBadge = document.createElement('div');
    ytBadge.style.cssText = [
      'position:absolute;bottom:3px;right:3px;',
      'background:rgba(255,0,0,.85);border-radius:3px;',
      'padding:1px 4px;font-size:9px;color:#fff;font-weight:700;',
    ].join('');
    ytBadge.textContent = '▶';
    imgWrap.appendChild(ytBadge);
  }

  // 업체명 라벨
  const label = document.createElement('div');
  label.style.cssText = [
    'font-size:10px;font-weight:800;color:#fff;',
    'padding:4px 5px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
    'text-align:center;',
    'background:rgba(0,0,0,.75);',
    'font-family:-apple-system,sans-serif;',
    'border-top:1px solid rgba(255,255,255,.1);',
  ].join('');
  label.textContent = shop.name;

  card.appendChild(imgWrap);
  card.appendChild(label);

  // 말풍선 꼬리
  const tail = document.createElement('div');
  tail.style.cssText = [
    'width:0;height:0;',
    'border-left:7px solid transparent;',
    'border-right:7px solid transparent;',
    'border-top:9px solid ' + (selected ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.4)') + ';',
    'margin-top:-1px;',
  ].join('');

  wrap.appendChild(card);
  wrap.appendChild(tail);
  wrap.onclick = (e) => { e.stopPropagation(); selectShopOnMap(shop.id); };
  return wrap;
}

function createNaverMarker(shop, selected=false) {
  const el  = buildMarkerEl(shop, selected);
  const pos = new naver.maps.LatLng(shop.lat, shop.lng);
  const overlay = new naver.maps.CustomOverlay({
    position: pos,
    content: el,
    anchor: new naver.maps.Point(45, 74),
    zIndex: selected ? 200 : (shop.featured ? 100 : 10),
    map: naverMap,
  });
  return overlay;
}

function fitMapToBounds(shops) {
  if (!shops.length || !naverMap) return;
  if (shops.length === 1) {
    naverMap.setCenter(new naver.maps.LatLng(shops[0].lat, shops[0].lng));
    naverMap.setZoom(14);
  } else {
    const lats = shops.map(s => s.lat);
    const lngs = shops.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    naverMap.fitBounds(bounds, { top: 80, right: 60, bottom: 140, left: 60 });
    setTimeout(() => {
      if (naverMap.getZoom() > 14) naverMap.setZoom(14);
    }, 350);
  }
}

function renderNaverMarkers(shops) {
  Object.values(nvMarkers).forEach(o => o.setMap(null));
  nvMarkers = {};
  if (!shops.length) return;
  shops.forEach(shop => {
    nvMarkers[shop.id] = createNaverMarker(shop, false);
  });
  // 지도 렌더 완료 후 fitBounds (타이밍 넉넉히)
  setTimeout(() => fitMapToBounds(shops), 100);
  setTimeout(() => fitMapToBounds(shops), 600);
}

function selectShopOnMap(id) {
  const shop = allShops.find(s=>s.id===id);
  if (!shop) return;
  curShop = shop;
  fetch('/api/track/view/'+id, {method:'POST'});

  // 마커 선택 상태 갱신
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (!s) return;
    overlay.setContent(buildMarkerEl(s, +sid===id));
    overlay.setZIndex(+sid===id ? 200 : (s.featured?100:10));
  });

  // 지도 중심 이동 (팝업 높이만큼 위로 offset)
  naverMap.panTo(new naver.maps.LatLng(shop.lat, shop.lng));



  // ── 지도 위 팝업 카드 열기 ──
  openMapPopup(shop);
}

// ── 지도 위 팝업 카드 ──────────────────────────────────────────────────────
let popupYtLoaded = false;

function openMapPopup(shop) {
  const popup = document.getElementById('mapPopup');
  const ytEl  = document.getElementById('mpYt');

  // 유튜브 or 썸네일
  if (shop.youtubeId) {
    const ytThumb = 'https://img.youtube.com/vi/' + shop.youtubeId + '/maxresdefault.jpg';
    ytEl.innerHTML = \`
      <div class="mp-yt-thumb-wrap" style="position:relative;width:100%;padding-top:52%;background:#111;overflow:hidden">
        <img src="\${ytThumb}"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;cursor:pointer"
          onerror="if(this.src.includes('maxresdefault')){this.src=this.src.replace('maxresdefault','hqdefault')}else{this.style.display='none'}"
          onclick="loadYtInPopup('\${shop.youtubeId}')" alt=""/>
        <div onclick="loadYtInPopup('\${shop.youtubeId}')"
          style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                 background:rgba(0,0,0,.3);cursor:pointer">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.93);
                      display:flex;align-items:center;justify-content:center;
                      box-shadow:0 4px 20px rgba(0,0,0,.5)">
            <i class="fas fa-play" style="color:#111;font-size:20px;margin-left:4px"></i>
          </div>
        </div>
      </div>
    \`;
  } else if (shop.thumbnail) {
    ytEl.innerHTML = \`<img src="\${shop.thumbnail}"
      onerror="this.style.display='none'"
      style="width:100%;height:160px;object-fit:cover;display:block" alt=""/>\`;
  } else {
    ytEl.innerHTML = '';
  }

  // 텍스트 정보
  const bg = pinColor(shop.category);
  document.getElementById('mpBadge').innerHTML =
    \`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:\${bg};margin-right:4px"></span>\${shop.category}\`;
  document.getElementById('mpName').textContent  = shop.name;
  document.getElementById('mpMeta').innerHTML    =
    \`<i class="fas fa-map-marker-alt" style="color:var(--green)"></i>\${shop.district}&nbsp;·&nbsp;\${shop.price}\`;
  document.getElementById('mpDesc').textContent  = shop.desc || '';
  document.getElementById('mpTags').innerHTML    =
    shop.tags.map(t=>\`<span class="mp-tag">\${t}</span>\`).join('');

  const bookEl = document.getElementById('mpBook');
  bookEl.style.opacity      = shop.smartPlaceUrl ? '1' : '.35';
  bookEl.style.pointerEvents= shop.smartPlaceUrl ? 'auto' : 'none';

  popup.classList.add('show');
}

function loadYtInPopup(ytId) {
  document.getElementById('mpYt').innerHTML = \`
    <div style="position:relative;width:100%;padding-top:52%;background:#000">
      <iframe style="position:absolute;inset:0;width:100%;height:100%;border:none"
        src="https://www.youtube.com/embed/\${ytId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1"
        allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>
    </div>
  \`;
}

function closeMapPopup() {
  document.getElementById('mapPopup').classList.remove('show');
  // 유튜브 멈추기
  document.getElementById('mpYt').innerHTML = '';
  // 마커 선택 해제
  Object.entries(nvMarkers).forEach(([sid, overlay])=>{
    const s = allShops.find(x=>x.id===+sid);
    if (s) { overlay.setContent(buildMarkerEl(s,false)); overlay.setZIndex(s.featured?100:10); }
  });
  curShop = null;
}

async function loadMapShops(cat, nearby, q='') {
  let url = '/api/shops?category='+encodeURIComponent(cat==='all'?'':cat);
  if (nearby && userLat) url += '&nearby=1&lat='+userLat+'&lng='+userLng;
  if (q) url += '&q='+encodeURIComponent(q);
  const res = await fetch(url);
  allShops  = await res.json();
  renderNaverMarkers(allShops);
}

function filterMap(btn, cat) {
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  mapCat = cat;
  const frame = document.getElementById('mapFrame');
  if (frame) frame.contentWindow.postMessage({ type:'filterCat', cat }, '*');
}

function toggleNearby() {
  const fab = document.getElementById('nearbyFab');
  if (nearbyOn) {
    nearbyOn=false; userLat=null; userLng=null;
    fab.classList.remove('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변';
    if (userMarker) { userMarker.setMap(null); userMarker=null; }
    loadMapShops(mapCat, false);
    return;
  }
  if (!navigator.geolocation) { showToast('위치 서비스를 지원하지 않아요'); return; }
  showToast('📍 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat=pos.coords.latitude; userLng=pos.coords.longitude;
    nearbyOn=true;
    fab.classList.add('on');
    fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변 ON';
    if (userMarker) userMarker.setMap(null);
    userMarker = new naver.maps.Marker({
      position: new naver.maps.LatLng(userLat, userLng),
      map: naverMap,
      icon: {
        content:'<div style="width:16px;height:16px;border-radius:50%;background:#FF4D7D;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
        anchor: new naver.maps.Point(8,8),
      }
    });
    naverMap.setCenter(new naver.maps.LatLng(userLat, userLng));
    naverMap.setZoom(14);
    loadMapShops(mapCat, true);
    showToast('📍 내 주변 샵을 찾았어요!');
  }, ()=>{ showToast('위치 권한이 필요해요'); }, {timeout:8000,enableHighAccuracy:true});
}

// ── 피드 바텀시트 (피드 탭 전용) ─────────────────────────────────────────
function openFeedSheet(id) {
  const s = allShops.find(x=>x.id===id);
  if (!s) return;
  curShop = s;
  fetch('/api/track/view/'+id,{method:'POST'});
  document.getElementById('sImg').src            = s.thumbnail;
  document.getElementById('sCat').textContent    = s.category;
  document.getElementById('sName').textContent   = s.name;
  document.getElementById('sAddr').textContent   = s.address;
  document.getElementById('sPhone').textContent  = s.phone||'';
  document.getElementById('sDesc').textContent   = s.desc||'';
  document.getElementById('sPrice').textContent  = s.price;
  document.getElementById('sTags').innerHTML     = s.tags.map(t=>\`<span class="s-tag">\${t}</span>\`).join('');
  const bookEl = document.getElementById('sBook');
  bookEl.style.opacity = s.smartPlaceUrl ? '1' : '.4';
  bookEl.style.pointerEvents = s.smartPlaceUrl ? 'auto' : 'none';
  document.getElementById('dim').classList.add('on');
  document.getElementById('sheet').classList.add('open');
}
function closeFeedSheet() {
  document.getElementById('dim').classList.remove('on');
  document.getElementById('sheet').classList.remove('open');
}
// 피드 예약 트래킹
function trackSP() { if(curShop) fetch('/api/track/sp/'+curShop.id,{method:'POST'}); }
// 지도 예약 트래킹
function trackMapSP(id) { fetch('/api/track/mapsp/'+id,{method:'POST'}); }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 인앱 브라우저
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let inappUrl = '';

function openInapp() {
  if (!curShop || !curShop.smartPlaceUrl) { showToast('예약 링크가 없어요'); return; }
  trackSP();
  inappUrl = curShop.smartPlaceUrl;

  // 타이틀 세팅
  document.getElementById('inappTitle').textContent = curShop.name + ' 예약하기';

  // iframe 로드
  const frame  = document.getElementById('inappFrame');
  const loader = document.getElementById('inappLoader');
  loader.classList.remove('done');
  frame.src = '';
  setTimeout(() => { frame.src = inappUrl; }, 30);
  frame.onload = () => loader.classList.add('done');

  // 시트 열기
  document.getElementById('inappBg').classList.add('show');
  document.getElementById('inappSheet').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeInapp() {
  document.getElementById('inappBg').classList.remove('show');
  document.getElementById('inappSheet').classList.remove('show');
  document.body.style.overflow = '';
  // iframe src 초기화 (백그라운드 재생 방지)
  setTimeout(() => { document.getElementById('inappFrame').src = ''; }, 400);
}

function openInappExternal() {
  if (inappUrl) window.open(inappUrl, '_blank', 'noopener');
}

// 인앱 시트 스와이프 다운 닫기
(function(){
  const sheet = document.getElementById('inappSheet');
  let sy = 0, dragging = false;
  sheet.addEventListener('touchstart', e => {
    // 아이프레임 위면 무시
    if (e.target.closest('iframe')) return;
    sy = e.touches[0].clientY; dragging = true;
  }, {passive:true});
  sheet.addEventListener('touchend', e => {
    if (!dragging) return; dragging = false;
    if (e.changedTouches[0].clientY - sy > 80) closeInapp();
  }, {passive:true});
})();

// 스와이프 다운으로 피드 시트 닫기
let tsY=0;
const sh=document.getElementById('sheet');
sh.addEventListener('touchstart',e=>{tsY=e.touches[0].clientY},{passive:true});
sh.addEventListener('touchend',  e=>{if(e.changedTouches[0].clientY-tsY>70)closeFeedSheet()},{passive:true});

// ── 토스트 ───────────────────────────────────────────────────────────────
let toastTmr;
function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTmr);
  toastTmr=setTimeout(()=>t.classList.remove('show'),2600);
}

function submitInquiry() {
  const owner = document.getElementById('iq-owner').value.trim();
  const phone = document.getElementById('iq-phone').value.trim();
  const name  = document.getElementById('iq-name').value.trim();
  const cat   = document.getElementById('iq-cat').value;
  const area  = document.getElementById('iq-area').value.trim();
  const agreed = document.getElementById('iq-agree-chk').checked;
  if (!owner || !phone || !name || !cat || !area) {
    showToast('⚠️ 필수 항목을 모두 입력해 주세요');
    return;
  }
  if (!agreed) {
    showToast('⚠️ 개인정보 수집·이용에 동의해 주세요');
    return;
  }
  const url = document.getElementById('iq-url').value.trim();
  const msg = document.getElementById('iq-msg').value.trim();
  fetch('/api/inquiry', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, owner, category:cat, area, phone, url, message:msg })
  }).then(r => r.json()).then(() => {
    document.getElementById('iqForm').style.display = 'none';
    document.querySelector('.iq-agree').style.display = 'none';
    document.querySelector('.iq-submit').style.display = 'none';
    document.getElementById('iqDone').style.display = 'block';
    document.getElementById('iqDone').scrollIntoView({behavior:'smooth'});
  }).catch(() => {
    showToast('❌ 전송에 실패했어요. 다시 시도해 주세요');
  });
}

loadFeed('all');
</script>
</body>
</html>`
}

// ══════════════════════════════════════════════════════════════════════════
// 지도 전용 페이지 (/map) - iframe으로 임베드됨
// ══════════════════════════════════════════════════════════════════════════
function mapPage() { return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0a;
  font-family:-apple-system,'Pretendard',sans-serif}
#naverMap{width:100%;height:100%;}

/* ── 하단 카드 (모바일) ── */
#card{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  background:#141414;
  border-radius:22px 22px 0 0;
  box-shadow:0 -4px 40px rgba(0,0,0,.8);
  border-top:1px solid rgba(255,255,255,.08);
  transform:translateY(100%);
  transition:transform .32s cubic-bezier(.22,.68,0,1.2);
  overflow-y:auto;   /* hidden 제거 → 스크롤 가능 */
  max-height:85vh;
}
#card.open{transform:translateY(0)}

/* ── PC: 오른쪽 사이드 패널 ── */
@media(min-width:768px){
  #card{
    top:0;bottom:0;right:0;left:auto;
    width:360px;
    border-radius:0;
    border-top:none;
    border-left:1px solid rgba(255,255,255,.08);
    box-shadow:-4px 0 40px rgba(0,0,0,.8);
    /* iframe 부모가 100vh보다 작을 수 있으므로 100% 사용 */
    max-height:100%;
    transform:translateX(100%);
    transition:transform .32s cubic-bezier(.22,.68,0,1.2);
    overflow-y:auto;
    /* 스크롤바 스타일 */
    scrollbar-width:thin;
    scrollbar-color:rgba(255,255,255,.15) transparent;
  }
  #card.open{transform:translateX(0)}
  .card-handle{display:none}
  .card-close{top:14px;right:14px}
}

/* PC: padding-top hack으로 16:9 비율 안정적 확보 (overflow-y:auto 컨테이너 안에서도 정확) */
@media(min-width:768px){
  .card-media{
    aspect-ratio:unset;
    height:auto;
    flex-shrink:0;
  }
}
.card-handle{width:36px;height:4px;border-radius:2px;
  background:rgba(255,255,255,.18);margin:10px auto 0;flex-shrink:0}

/* 미디어 영역 (유튜브 or 썸네일) — padding-top:56.25% hack으로 16:9 비율 안정 확보 */
.card-media{
  position:relative;
  width:100%;
  padding-top:56.25%;   /* 9/16 = 56.25% → 16:9 비율 */
  background:#000;
  overflow:hidden;
  flex-shrink:0;
}
.card-media > *{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
}
.card-media img{object-fit:cover;display:block}
.card-media iframe{border:none}
/* 썸네일 위 플레이 버튼 */
.play-btn{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.3);cursor:pointer;transition:background .2s;
}
.play-btn:hover{background:rgba(0,0,0,.15)}
.play-icon{
  width:52px;height:52px;border-radius:50%;
  background:rgba(255,0,0,.9);display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.5);
}
.play-icon svg{margin-left:3px}
/* 카드 상단 뱃지 오버레이 */
.card-overlay{
  position:absolute;top:10px;left:10px;right:10px;
  display:flex;justify-content:space-between;align-items:flex-start;
  pointer-events:none;
}
.card-cat-badge{
  font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;
  color:#fff;letter-spacing:.3px;backdrop-filter:blur(4px);
  background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.2);
}
.card-feat-badge{
  font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;
  color:#fff;background:#FF4D7D;
}
.card-close{
  position:absolute;top:10px;right:10px;
  width:30px;height:30px;border-radius:50%;
  background:rgba(0,0,0,.6);backdrop-filter:blur(6px);
  border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  pointer-events:auto;
}

/* 카드 바디 */
.card-body{padding:14px 16px 28px}
.card-name{
  font-size:18px;font-weight:800;color:#fff;
  margin-bottom:8px;letter-spacing:-.4px;
}
/* 위치 + 가격 한 줄 */
.card-meta{
  display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;
}
.card-location{
  display:flex;align-items:center;gap:4px;
  font-size:12px;color:rgba(255,255,255,.45);
}
.card-location svg{flex-shrink:0}
.card-price{
  font-size:12px;font-weight:700;color:#FF4D7D;
  background:rgba(255,77,125,.12);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,77,125,.2);
}
/* 설명 */
.card-desc{
  font-size:13px;color:rgba(255,255,255,.55);
  line-height:1.55;margin-bottom:12px;
}
/* 태그 */
.card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.card-tag{
  font-size:11px;color:rgba(255,255,255,.45);
  background:rgba(255,255,255,.06);padding:3px 9px;
  border-radius:999px;border:1px solid rgba(255,255,255,.09);
}
/* 예약 버튼 */
.btn-reserve{
  width:100%;height:46px;border-radius:14px;border:none;
  background:#03C75A;color:#fff;
  font-size:14px;font-weight:800;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  font-family:inherit;letter-spacing:-.2px;transition:opacity .15s;
}
.btn-reserve:hover{opacity:.88}
</style>
</head>
<body>
<div id="naverMap"></div>

<!-- 하단 카드 -->
<div id="card">
  <div class="card-handle"></div>
  <!-- 미디어 -->
  <div class="card-media" id="cardMedia">
    <!-- 썸네일+플레이버튼 래퍼: 전체 클릭 시 재생 -->
    <div id="thumbWrap" style="position:absolute;inset:0;cursor:pointer" onclick="playVideo()">
      <img id="cardThumb" src="about:blank" alt="" style="width:100%;height:100%;object-fit:cover;display:block">
      <div class="play-btn" id="playBtn" style="display:none">
        <div class="play-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    </div>
    <!-- 실제 유튜브 iframe (클릭 후 로드) -->
    <iframe id="cardIframe" src="about:blank" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen style="display:none;position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>
    <!-- 오버레이 뱃지 -->
    <div class="card-overlay">
      <span id="cardCatBadge" class="card-cat-badge"></span>
      <span id="cardFeatBadge" class="card-feat-badge" style="display:none">⭐ PICK</span>
    </div>
    <button class="card-close" onclick="closeCard()">✕</button>
  </div>
  <!-- 바디 -->
  <div class="card-body">
    <div class="card-name" id="cardName"></div>
    <div class="card-meta">
      <span class="card-location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span id="cardAddress"></span>
      </span>
      <span class="card-price" id="cardPrice"></span>
    </div>
    <div class="card-desc" id="cardDesc"></div>
    <div class="card-tags" id="cardTags"></div>
    <button class="btn-reserve" id="btnReserve" onclick="openReserve()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      네이버 예약하기
    </button>
  </div>
</div>

<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=xjjg4490h8"></script>
<script>
const CAT_COLOR = {
  '마사지':'#10B981','헤드스파':'#6366F1','피부관리':'#FF4D7D',
  '헤어':'#F59E0B','메이크업':'#C084FC','왁싱':'#EC4899','반영구':'#06B6D4','병원':'#3B82F6','그외':'#8B5CF6'
};

let map = null, markers = [], curCat = 'all', curShop = null;

window.addEventListener('message', e => {
  if (e.data?.type === 'filterCat') { curCat = e.data.cat; renderMarkers(); }
  if (e.data?.type === 'fitBounds') {
    // 지도 크기 재계산 후 fitBounds 재실행
    if (map) {
      map.autoResize();
      setTimeout(() => fitToBounds(curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat)), 200);
    }
  }
});

/* ── 카드 닫기 ── */
function closeCard() {
  document.getElementById('card').classList.remove('open');
  // iframe 정지 (src='' 하면 브라우저가 현재URL로 변환 → about:blank 사용)
  document.getElementById('cardIframe').src = 'about:blank';
  document.getElementById('cardIframe').style.display = 'none';
  document.getElementById('thumbWrap').style.display = 'block';
  document.getElementById('playBtn').style.display = 'none';
  curShop = null;
}

/* ── 유튜브 재생 ── */
function playVideo() {
  // 유튜브 없으면 아무것도 안 함
  if (!curShop?.youtubeId) return;
  const iframe = document.getElementById('cardIframe');
  // mute=1 필수 → 모바일 autoplay 정책 통과 (앱으로 안 튕김)
  // 소리는 사용자가 영상 탭해서 직접 켤 수 있음
  iframe.src = \`https://www.youtube.com/embed/\${curShop.youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&color=white&iv_load_policy=3\`;
  iframe.style.display = 'block';
  document.getElementById('thumbWrap').style.display = 'none';
}

/* ── 예약 (지도 트래킹 포함) ── */
function openReserve() {
  if (!curShop?.smartPlaceUrl) return;
  // 지도 예약 트래킹
  fetch('/api/track/mapsp/' + curShop.id, { method: 'POST' }).catch(()=>{});
  window.open(curShop.smartPlaceUrl, '_blank');
}

/* ── 카드 열기 ── */
function openCard(shop) {
  curShop = shop;
  const color = CAT_COLOR[shop.category] || '#FF4D7D';

  const iframe   = document.getElementById('cardIframe');
  const thumbWrap = document.getElementById('thumbWrap');
  const thumb    = document.getElementById('cardThumb');
  const playBtn  = document.getElementById('playBtn');

  // ── 유튜브 있음 → 카드 열리자마자 바로 iframe 재생 (썸네일 단계 없음) ──
  if (shop.youtubeId) {
    // mute=1 로 autoplay 정책 통과 → 앱으로 안 튕김
    iframe.src = \`https://www.youtube.com/embed/\${shop.youtubeId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&color=white&iv_load_policy=3\`;
    iframe.style.display = 'block';
    thumbWrap.style.display = 'none';
    playBtn.style.display = 'none';

  // ── 유튜브 없음 → 사진(썸네일)만 표시, 클릭 불가 ──
  } else {
    iframe.src = 'about:blank';
    iframe.style.display = 'none';
    thumbWrap.style.display = 'block';
    thumbWrap.style.cursor = 'default';
    thumbWrap.onclick = null;  // 클릭 이벤트 제거 (사진만)
    playBtn.style.display = 'none';

    thumb.onerror = null;
    thumb.src = 'about:blank';
    const imgSrc = shop.thumbnail || '';
    if (imgSrc) {
      thumb.style.display = 'block';
      thumb.onerror = function() { this.style.display = 'none'; };
      thumb.src = imgSrc;
    } else {
      thumb.style.display = 'none';
    }
  }

  // 뱃지
  const catBadge = document.getElementById('cardCatBadge');
  catBadge.textContent = shop.category;
  catBadge.style.background = color + '99';

  document.getElementById('cardFeatBadge').style.display = shop.featured ? 'block' : 'none';

  // 텍스트
  document.getElementById('cardName').textContent = shop.name;
  document.getElementById('cardAddress').textContent = shop.address || shop.district || '';
  document.getElementById('cardPrice').textContent = shop.price;
  document.getElementById('cardDesc').textContent = shop.desc || '';

  // 태그
  document.getElementById('cardTags').innerHTML =
    (shop.tags || []).map(t => \`<span class="card-tag">#\${t}</span>\`).join('');

  // 예약 버튼
  const reserveBtn = document.getElementById('btnReserve');
  reserveBtn.style.display = shop.smartPlaceUrl ? 'flex' : 'none';

  document.getElementById('card').classList.add('open');
  window.parent.postMessage({ type:'shopSelected', id: shop.id }, '*');
  map.panTo(new naver.maps.LatLng(shop.lat, shop.lng));
  // position:fixed 카드가 iframe 첫 렌더 시 뷰포트 밖에 숨는 문제 해결
  // → map.autoResize()로 강제 리페인트 트리거
  requestAnimationFrame(() => { try { map.autoResize(); } catch(e){} });
}

/* 마커 생성 */
function makeMarker(shop) {
  const color = CAT_COLOR[shop.category] || '#FF4D7D';
  const html = \`<div style="
    display:inline-flex;flex-direction:column;align-items:center;
    cursor:pointer;transform-origin:bottom center;transition:transform .15s;
  " onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform='scale(1)'">
    <div style="
      background:\${color};color:#fff;
      font-size:11px;font-weight:800;
      padding:5px 12px;border-radius:999px;
      white-space:nowrap;
      box-shadow:0 3px 12px rgba(0,0,0,.5);
      border:2px solid rgba(255,255,255,.4);
      letter-spacing:-.2px;line-height:1;
      font-family:-apple-system,sans-serif;
    ">\${shop.name}</div>
    <div style="
      width:6px;height:6px;border-radius:50%;
      background:\${color};margin-top:3px;
      box-shadow:0 0 0 2px rgba(255,255,255,.3);
    "></div>
  </div>\`;
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(shop.lat, shop.lng),
    map: map,
    icon: {
      content: html,
      anchor: new naver.maps.Point(0, 0),
    },
    zIndex: shop.featured ? 100 : 10,
  });
  naver.maps.Event.addListener(marker, 'click', (e) => {
    e.domEvent?.stopPropagation?.();
    openCard(shop);
  });
  return marker;
}

/* 마커 렌더링 */
let allShops = [];
function renderMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  const list = curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat);
  list.forEach(s => markers.push(makeMarker(s)));
  // 업체 전체가 보이도록 자동 범위 조정
  fitToBounds(list);
}

/* 전체 업체가 화면에 들어오도록 범위 조정 */
function fitToBounds(list) {
  if (!list.length || !map) return;
  if (list.length === 1) {
    // 업체 1개: 적당한 줌(14)으로 중앙 표시
    map.setCenter(new naver.maps.LatLng(list[0].lat, list[0].lng));
    map.setZoom(14);
  } else {
    const lats = list.map(s => s.lat);
    const lngs = list.map(s => s.lng);
    const sw = new naver.maps.LatLng(Math.min(...lats), Math.min(...lngs));
    const ne = new naver.maps.LatLng(Math.max(...lats), Math.max(...lngs));
    const bounds = new naver.maps.LatLngBounds(sw, ne);
    map.fitBounds(bounds, { top:80, right:60, bottom:140, left:60 });
    // fitBounds 후 너무 가까이 줌인됐으면 최대 줌 14로 제한
    setTimeout(() => {
      if (map.getZoom() > 14) map.setZoom(14);
    }, 350);
  }
}

/* 지도 초기화 — 네이버 지도 스크립트 완전 로드 후 실행 */
function waitNaver(cb, t=0) {
  if (window.naver && window.naver.maps && window.naver.maps.Map) { cb(); return; }
  if (t > 50) return; // 10초 초과 포기
  setTimeout(() => waitNaver(cb, t+1), 200);
}

async function initMap() {
  map = new naver.maps.Map('naverMap', {
    center: new naver.maps.LatLng(36.5, 127.5),
    zoom: 7,
    mapTypeControl:  false,
    scaleControl:    false,
    logoControl:     false,
    mapDataControl:  false,
  });
  map.addListener('click', closeCard);

  const res = await fetch('/api/shops');
  allShops  = await res.json();
  renderMarkers();
}

window.onload = () => waitNaver(initMap);
</script>
</body>
</html>`
}

// ══════════════════════════════════════════════════════════════════════════
// 관리자 페이지
// ══════════════════════════════════════════════════════════════════════════
function adminPage() { return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>관리자 – 마이뷰티맵</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--pink:#FF4D7D;--green:#03C75A;--bg:#0a0a0a;--card:#141414;--border:rgba(255,255,255,.08)}
body{font-family:'Pretendard',sans-serif;background:var(--bg);color:#fff;min-height:100vh}

/* ── 상단바 ── */
.top{background:rgba(16,16,16,.98);border-bottom:1px solid var(--border);
  padding:0 16px;height:54px;display:flex;align-items:center;gap:12px;
  position:sticky;top:0;z-index:50;backdrop-filter:blur(10px)}
.back{font-size:20px;color:rgba(255,255,255,.5);text-decoration:none}
.back:hover{color:#fff}
.ttl{font-size:17px;font-weight:800;flex:1}
.add-btn{background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;font-family:inherit;white-space:nowrap}

/* ── 탭바 ── */
.tabbar{display:flex;border-bottom:1px solid var(--border);background:rgba(16,16,16,.9);
  position:sticky;top:54px;z-index:40}
.tabbtn{flex:1;padding:13px 4px;text-align:center;font-size:12px;font-weight:700;
  color:rgba(255,255,255,.35);background:none;border:none;cursor:pointer;
  font-family:inherit;border-bottom:2px solid transparent;transition:all .2s}
.tabbtn.on{color:var(--pink);border-bottom-color:var(--pink)}
.tabbtn i{display:block;font-size:16px;margin-bottom:3px}

/* ── 내용 공통 ── */
.wrap{max-width:640px;margin:0 auto;padding:14px 14px 80px}

/* ── 요약 카드 ── */
.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.sv{background:var(--card);border:1px solid var(--border);border-radius:14px;
  padding:14px 8px;text-align:center}
.sv-n{font-size:24px;font-weight:800;color:#FF8FA3}
.sv-l{font-size:10px;color:rgba(255,255,255,.3);margin-top:3px;font-weight:600}

/* ── 업체 카드 ── */
.shop-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:14px;margin-bottom:10px}
.sc-top{display:flex;gap:10px;align-items:flex-start}
.sc-thumb{width:60px;height:60px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.06)}
.sc-info{flex:1;min-width:0}
.sc-name{font-size:15px;font-weight:700;display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.sc-cat{font-size:11px;color:var(--pink);font-weight:600;margin-top:3px}
.sc-addr{font-size:11px;color:rgba(255,255,255,.3);margin-top:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-mode{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;
  padding:2px 7px;border-radius:6px;margin-top:4px}
.mode-both{background:rgba(3,199,90,.12);color:var(--green)}
.mode-feed{background:rgba(255,77,125,.12);color:var(--pink)}
.mode-map{background:rgba(100,149,237,.15);color:#6495ed}
.sc-fields{display:grid;grid-template-columns:1fr 1fr;gap:5px;
  border-top:1px solid var(--border);margin-top:10px;padding-top:10px}
.sc-f{font-size:10px;color:rgba(255,255,255,.3)}
.sc-f strong{display:block;color:rgba(255,255,255,.65);font-size:11px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.sc-btns{display:flex;gap:6px;margin-top:10px}
.btn-edit{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  color:#fff;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1}
.btn-del{background:rgba(255,77,125,.1);border:1px solid rgba(255,77,125,.2);
  color:var(--pink);border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex:1}
.badge{font-size:10px;font-weight:700;padding:2px 6px;border-radius:5px}
.b-feat{background:rgba(255,77,125,.15);color:var(--pink)}
.b-hide{background:rgba(255,255,255,.07);color:rgba(255,255,255,.3)}

/* ── 통계 ── */
.stat-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:12px;margin-bottom:10px;display:flex;gap:12px;align-items:center}
.stat-thumb{width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0}
.stat-body{flex:1;min-width:0}
.stat-top{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.stat-rank{width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:800;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.rank1{background:#FFD700;color:#000}
.rank2{background:#C0C0C0;color:#000}
.rank3{background:#CD7F32;color:#fff}
.rankN{background:rgba(255,255,255,.1);color:rgba(255,255,255,.5)}
.stat-name{font-size:14px;font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stat-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.stat-num{background:rgba(255,255,255,.04);border:1px solid var(--border);
  border-radius:8px;padding:7px 4px;text-align:center}
.sn-n{font-size:16px;font-weight:800}
.sn-l{font-size:9px;color:rgba(255,255,255,.3);margin-top:1px;font-weight:600}
.c-view .sn-n{color:#FF8FA3}
.c-feed .sn-n{color:var(--green)}
.c-map  .sn-n{color:#6495ed}

/* ── 입점문의 ── */
.inq-card{background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:14px;margin-bottom:10px}
.inq-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.inq-name{font-size:14px;font-weight:700}
.inq-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;
  background:rgba(255,77,125,.12);color:var(--pink)}
.inq-time{font-size:10px;color:rgba(255,255,255,.25);margin-left:auto}
.inq-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.inq-kv{font-size:11px;color:rgba(255,255,255,.35)}
.inq-kv strong{color:rgba(255,255,255,.7);font-weight:600}
.inq-msg{font-size:12px;color:rgba(255,255,255,.45);line-height:1.6;
  border-top:1px solid var(--border);margin-top:8px;padding-top:8px}

/* ── 모달 ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;
  display:flex;align-items:flex-end;justify-content:center}
.modal-bg.hidden{display:none}
.modal{background:#1c1c1c;border-radius:22px 22px 0 0;width:100%;max-width:640px;
  max-height:92vh;overflow-y:auto;padding:18px 16px 48px}
.modal-handle{width:36px;height:4px;background:rgba(255,255,255,.1);
  border-radius:4px;margin:0 auto 16px}
.modal-ttl{font-size:18px;font-weight:800;margin-bottom:16px}
.field{margin-bottom:12px}
.field label{display:block;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.4);margin-bottom:5px;letter-spacing:.3px}
.field input,.field select,.field textarea{
  width:100%;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);
  border-radius:10px;padding:10px 12px;color:#fff;font-size:14px;
  font-family:inherit;outline:none;transition:border-color .2s}
.field input:focus,.field textarea:focus{border-color:var(--pink)}
.field select option{background:#1c1c1c}
.field textarea{resize:vertical;min-height:70px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-actions{display:flex;gap:10px;margin-top:18px}
.btn-save{flex:1;background:var(--pink);color:#fff;border:none;border-radius:12px;
  padding:14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}
.btn-cancel{background:rgba(255,255,255,.07);color:rgba(255,255,255,.6);
  border:1.5px solid rgba(255,255,255,.1);border-radius:12px;
  padding:14px 18px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}

/* ── 썸네일 업로드 ── */
.thumb-wrap{display:flex;gap:10px;align-items:flex-start}
.thumb-preview{width:70px;height:70px;border-radius:10px;object-fit:cover;
  background:rgba(255,255,255,.06);border:1.5px solid var(--border);flex-shrink:0}
.thumb-right{flex:1;display:flex;flex-direction:column;gap:6px}
.upload-btn{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.12);
  color:#fff;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;text-align:center}
.upload-btn:hover{background:rgba(255,255,255,.13)}
.thumb-url-inp{width:100%;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);
  border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;font-family:inherit;outline:none}
.thumb-url-inp::placeholder{color:rgba(255,255,255,.25)}

/* ── 유튜브 미리보기 ── */
.yt-preview{margin-top:6px;border-radius:10px;overflow:hidden;
  background:#000;aspect-ratio:16/9;display:none}
.yt-preview iframe{width:100%;height:100%;border:none}

/* ── 지오코딩 ── */
.geo-row{display:flex;gap:8px}
.geo-btn{flex-shrink:0;background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:0 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;
  height:42px;display:flex;align-items:center;gap:5px;white-space:nowrap}
.geo-status{margin-top:6px;font-size:11px;display:none}

/* ── 노출방식 선택 ── */
.mode-select{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mode-opt{border:1.5px solid var(--border);border-radius:10px;padding:10px 6px;
  text-align:center;cursor:pointer;transition:all .2s;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.4)}
.mode-opt .mo-icon{font-size:20px;margin-bottom:4px}
.mode-opt.sel-both{border-color:var(--green);background:rgba(3,199,90,.08);color:var(--green)}
.mode-opt.sel-feed{border-color:var(--pink);background:rgba(255,77,125,.08);color:var(--pink)}
.mode-opt.sel-map {border-color:#6495ed;background:rgba(100,149,237,.08);color:#6495ed}

/* ── 빈 상태 ── */
.empty{text-align:center;padding:48px 16px;color:rgba(255,255,255,.2);font-size:14px}

/* ── 섹션 라벨 ── */
.sec-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.25);
  letter-spacing:.5px;margin-bottom:10px;padding-left:2px}

/* ── 플랜/결제 뱃지 ── */
.b-plan-shoot{background:rgba(3,199,90,.18);color:#03C75A;border:1px solid rgba(3,199,90,.3)}
.b-plan-basic{background:rgba(255,77,125,.13);color:var(--pink);border:1px solid rgba(255,77,125,.25)}
.b-paid{background:rgba(3,199,90,.15);color:#03C75A}
.b-unpaid{background:rgba(255,165,0,.15);color:#FFA500}
.b-expired{background:rgba(255,77,125,.15);color:var(--pink)}
.b-free{background:rgba(99,149,237,.15);color:#6495ed}

/* ── 구독관리 탭 ── */
.pay-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px}
.pay-sv{background:var(--card);border:1px solid var(--border);border-radius:12px;
  padding:12px 8px;text-align:center}
.pay-sv-n{font-size:20px;font-weight:800}
.pay-sv-l{font-size:9px;color:rgba(255,255,255,.3);margin-top:3px;font-weight:600}
.pay-card{background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:14px;margin-bottom:10px}
.pay-card.status-expired{border-color:rgba(255,77,125,.35);background:rgba(255,77,125,.04)}
.pay-card.status-unpaid{border-color:rgba(255,165,0,.3);background:rgba(255,165,0,.03)}
.pay-card.status-paid{border-color:rgba(3,199,90,.25);background:rgba(3,199,90,.03)}
.pay-card.status-free{border-color:rgba(99,149,237,.3);background:rgba(99,149,237,.03)}
.pay-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.pay-thumb{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;
  background:rgba(255,255,255,.06)}
.pay-info{flex:1;min-width:0}
.pay-name{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pay-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:2px}
.pay-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}
.pay-body{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.pay-kv{font-size:10px;color:rgba(255,255,255,.3);background:rgba(255,255,255,.04);
  border-radius:8px;padding:7px 10px}
.pay-kv strong{display:block;font-size:12px;color:#fff;font-weight:700;margin-top:2px}
.pay-memo{font-size:11px;color:rgba(255,255,255,.4);background:rgba(255,255,255,.04);
  border-radius:8px;padding:8px 10px;margin-bottom:10px;line-height:1.5;
  display:flex;gap:6px;align-items:flex-start}
.pay-btns{display:flex;gap:6px}
.btn-pay-edit{flex:1;background:rgba(3,199,90,.12);border:1px solid rgba(3,199,90,.25);
  color:#03C75A;border-radius:8px;padding:8px 10px;font-size:12px;font-weight:700;
  cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px}
.btn-pay-edit:hover{background:rgba(3,199,90,.2)}
.pay-filter{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.pf-btn{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.4);border-radius:8px;padding:6px 12px;font-size:11px;
  font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.pf-btn.on{background:rgba(255,77,125,.15);border-color:rgba(255,77,125,.35);color:var(--pink)}

/* ── 결제 수정 모달 ── */
.pay-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:300;
  display:flex;align-items:flex-end;justify-content:center}
.pay-modal-bg.hidden{display:none}
.pay-modal{background:#1c1c1c;border-radius:22px 22px 0 0;width:100%;max-width:640px;
  max-height:88vh;overflow-y:auto;padding:20px 16px 48px}
.pm-handle{width:36px;height:4px;background:rgba(255,255,255,.1);
  border-radius:4px;margin:0 auto 18px}
.pm-ttl{font-size:18px;font-weight:800;margin-bottom:6px}
.pm-sub{font-size:12px;color:rgba(255,255,255,.35);margin-bottom:20px}
.pm-plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.pm-plan-opt{border:2px solid var(--border);border-radius:12px;padding:14px 10px;
  text-align:center;cursor:pointer;transition:all .2s}
.pm-plan-opt .po-icon{font-size:24px;margin-bottom:6px}
.pm-plan-opt .po-name{font-size:13px;font-weight:800;margin-bottom:3px}
.pm-plan-opt .po-price{font-size:11px;color:rgba(255,255,255,.4)}
.pm-plan-opt.sel-shoot{border-color:#03C75A;background:rgba(3,199,90,.1)}
.pm-plan-opt.sel-shoot .po-name{color:#03C75A}
.pm-plan-opt.sel-basic{border-color:var(--pink);background:rgba(255,77,125,.1)}
.pm-plan-opt.sel-basic .po-name{color:var(--pink)}
.pm-status-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.pm-status-opt{border:1.5px solid var(--border);border-radius:10px;padding:10px 6px;
  text-align:center;cursor:pointer;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.35);transition:all .2s}
.pm-status-opt.sel-paid{border-color:#03C75A;background:rgba(3,199,90,.1);color:#03C75A}
.pm-status-opt.sel-unpaid{border-color:#FFA500;background:rgba(255,165,0,.1);color:#FFA500}
.pm-status-opt.sel-expired{border-color:var(--pink);background:rgba(255,77,125,.1);color:var(--pink)}
.pm-status-opt.sel-free{border-color:#6495ed;background:rgba(100,149,237,.1);color:#6495ed}
</style>
</head>
<body>

<!-- 상단바 -->
<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">관리자 대시보드</span>
  <button class="add-btn" onclick="openModal()">
    <i class="fas fa-plus"></i> 업체 추가
  </button>
</div>

<!-- 탭바 -->
<div class="tabbar">
  <button class="tabbtn on" id="tab-shops" onclick="switchTab('shops')">
    <i class="fas fa-store"></i>업체 관리
  </button>
  <button class="tabbtn" id="tab-stats" onclick="switchTab('stats')">
    <i class="fas fa-chart-bar"></i>통계
  </button>
  <button class="tabbtn" id="tab-pay" onclick="switchTab('pay')">
    <i class="fas fa-credit-card"></i>구독관리
  </button>
  <button class="tabbtn" id="tab-inq" onclick="switchTab('inq')">
    <i class="fas fa-envelope"></i>입점문의
  </button>
</div>

<!-- 내용 -->
<div class="wrap">
  <!-- 요약 (업체/통계 탭 공통) -->
  <div class="summary" id="summaryBox">
    <div class="sv"><div class="sv-n" id="sv-shops">-</div><div class="sv-l">💄 등록 샵</div></div>
    <div class="sv"><div class="sv-n" id="sv-views">-</div><div class="sv-l">👁 영상조회</div></div>
    <div class="sv"><div class="sv-n" id="sv-clicks">-</div><div class="sv-l">📍 예약클릭</div></div>
  </div>

  <!-- 패널들 -->
  <div id="panel-shops"></div>
  <div id="panel-stats" style="display:none"></div>
  <div id="panel-pay"   style="display:none"></div>
  <div id="panel-inq"   style="display:none"></div>
</div>

<!-- 업체 추가/수정 모달 -->
<div class="modal-bg hidden" id="modalBg" onclick="bgClick(event)">
<div class="modal" id="modal">
  <div class="modal-handle"></div>
  <div class="modal-ttl" id="modalTtl">업체 추가</div>

  <!-- 노출 방식 -->
  <div class="field">
    <label>📡 노출 방식</label>
    <div class="mode-select">
      <div class="mode-opt sel-both" id="mo-both" onclick="setMode('both')">
        <div class="mo-icon">🎬🗺️</div>영상 + 지도
      </div>
      <div class="mode-opt" id="mo-feed" onclick="setMode('feed')">
        <div class="mo-icon">🎬</div>영상만
      </div>
      <div class="mode-opt" id="mo-map" onclick="setMode('map')">
        <div class="mo-icon">🗺️</div>지도만
      </div>
    </div>
    <input type="hidden" id="f-mode" value="both"/>
  </div>

  <!-- 기본 정보 -->
  <div class="field">
    <label>업체명 *</label>
    <input id="f-name" type="text" placeholder="예: 밸런스 엘 스트레칭"/>
  </div>
  <div class="row2">
    <div class="field">
      <label>카테고리 *</label>
      <select id="f-cat">
        <option>마사지</option><option>헤드스파</option><option>피부관리</option>
        <option>헤어</option><option>메이크업</option><option>왁싱</option><option>반영구</option>
        <option>병원</option><option>그외</option>
      </select>
    </div>
    <div class="field">
      <label>가격대</label>
      <input id="f-price" type="text" placeholder="예: 5만원~"/>
    </div>
  </div>

  <!-- 썸네일 -->
  <div class="field">
    <label>🖼️ 썸네일 이미지</label>
    <div class="thumb-wrap">
      <img id="thumbPreview" class="thumb-preview"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E📷%3C/text%3E%3C/svg%3E"/>
      <div class="thumb-right">
        <label class="upload-btn" for="thumbFile">
          <i class="fas fa-upload"></i> 파일 선택
        </label>
        <input type="file" id="thumbFile" accept="image/*" style="display:none" onchange="handleThumbFile(event)"/>
        <input class="thumb-url-inp" id="f-thumb" type="text" placeholder="또는 이미지 URL 직접 입력"
          oninput="updateThumbPreview(this.value)"/>
      </div>
    </div>
  </div>

  <!-- 유튜브 -->
  <div class="field" id="ytField">
    <label>🎬 유튜브 URL (또는 영상 ID)</label>
    <input id="f-yt" type="text" placeholder="https://youtu.be/xxxxx 또는 영상ID"
      oninput="previewYt(this.value)"/>
    <div class="yt-preview" id="ytPreview">
      <iframe id="ytFrame" src="" allow="autoplay;encrypted-media" allowfullscreen></iframe>
    </div>
  </div>

  <!-- 주소 -->
  <div class="field" id="addrField">
    <label>📍 주소 *</label>
    <div class="geo-row">
      <input id="f-addr" type="text" placeholder="예: 서울 강남구 논현로 123" style="flex:1"
        onkeydown="if(event.key==='Enter'){event.preventDefault();geocodeAddr()}"/>
      <button class="geo-btn" onclick="geocodeAddr()" id="geoBtn">
        <i class="fas fa-crosshairs"></i> 좌표찾기
      </button>
    </div>
    <div class="geo-status" id="geoStatus"></div>
  </div>
  <div class="row2" id="distRow">
    <div class="field">
      <label>구/지역 <small style="color:rgba(255,255,255,.25)">(자동)</small></label>
      <input id="f-dist" type="text" placeholder="강남구"/>
    </div>
    <div class="field">
      <label>전화번호</label>
      <input id="f-phone" type="text" placeholder="02-1234-5678"/>
    </div>
  </div>
  <div class="row2" id="latRow">
    <div class="field">
      <label>위도 <small style="color:rgba(255,255,255,.25)">(자동)</small></label>
      <input id="f-lat" type="number" step="0.000001" placeholder="자동입력"/>
    </div>
    <div class="field">
      <label>경도 <small style="color:rgba(255,255,255,.25)">(자동)</small></label>
      <input id="f-lng" type="number" step="0.000001" placeholder="자동입력"/>
    </div>
  </div>

  <!-- 스마트플레이스 -->
  <div class="field">
    <label>📅 네이버 예약 URL</label>
    <input id="f-url" type="text" placeholder="https://naver.me/xxxxx"/>
  </div>

  <!-- 기타 -->
  <div class="field">
    <label>태그 (쉼표로 구분)</label>
    <input id="f-tags" type="text" placeholder="리프팅, 보습, 트러블케어"/>
  </div>
  <div class="field">
    <label>업체 소개</label>
    <textarea id="f-desc" placeholder="업체 간단 소개"></textarea>
  </div>
  <div class="row2">
    <div class="field">
      <label>상단 노출</label>
      <select id="f-feat">
        <option value="false">일반</option>
        <option value="true">⭐ 추천 상단</option>
      </select>
    </div>
    <div class="field">
      <label>공개 여부</label>
      <select id="f-active">
        <option value="true">공개</option>
        <option value="false">비공개</option>
      </select>
    </div>
  </div>

  <div class="modal-actions">
    <button class="btn-cancel" onclick="closeModal()">취소</button>
    <button class="btn-save"   onclick="saveShop()"><i class="fas fa-save"></i> 저장하기</button>
  </div>
</div>
</div>

<!-- ───── 결제 수정 모달 ───── -->
<div class="pay-modal-bg hidden" id="payModalBg" onclick="if(event.target===this)closePayModal()">
<div class="pay-modal" id="payModal">
  <div class="pm-handle"></div>
  <div class="pm-ttl">💳 결제 / 구독 관리</div>
  <div class="pm-sub" id="pmShopName">업체명</div>

  <!-- 플랜 선택 -->
  <div class="field"><label>📦 플랜 선택</label></div>
  <div class="pm-plan-grid">
    <div class="pm-plan-opt sel-shoot" id="pm-plan-shoot" onclick="setPmPlan('shoot')">
      <div class="po-icon">🎬</div>
      <div class="po-name">촬영 플랜</div>
      <div class="po-price">촬영비 3만원 · 6개월 무료<br>이후 월 10,000원</div>
    </div>
    <div class="pm-plan-opt" id="pm-plan-basic" onclick="setPmPlan('basic')">
      <div class="po-icon">📍</div>
      <div class="po-name">기본 플랜</div>
      <div class="po-price">영상 없이 맵만<br>월 10,000원</div>
    </div>
  </div>

  <!-- 결제 상태 -->
  <div class="field"><label>📊 결제 상태</label></div>
  <div class="pm-status-grid">
    <div class="pm-status-opt" id="pm-st-paid"    onclick="setPmStatus('paid')">✅<br>결제완료</div>
    <div class="pm-status-opt" id="pm-st-free"    onclick="setPmStatus('free')">🎁<br>무료기간</div>
    <div class="pm-status-opt" id="pm-st-unpaid"  onclick="setPmStatus('unpaid')">💳<br>미결제</div>
    <div class="pm-status-opt" id="pm-st-expired" onclick="setPmStatus('expired')" style="grid-column:span 1">⚠️<br>만료</div>
    <div></div><div></div>
  </div>

  <!-- 만료일 -->
  <div class="field">
    <label>📆 구독 만료일 <small style="color:rgba(255,255,255,.25)">(빈칸 = 미설정)</small></label>
    <input id="pm-until" type="date" style="width:100%;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;color:#fff;font-size:14px;font-family:inherit;outline:none"/>
  </div>

  <!-- 빠른 만료일 설정 -->
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:-6px;margin-bottom:14px">
    <button onclick="addMonths(1)"  style="flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);border-radius:8px;padding:7px 6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+1개월</button>
    <button onclick="addMonths(3)"  style="flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);border-radius:8px;padding:7px 6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+3개월</button>
    <button onclick="addMonths(6)"  style="flex:1;background:rgba(3,199,90,.12);border:1px solid rgba(3,199,90,.25);color:#03C75A;border-radius:8px;padding:7px 6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+6개월</button>
    <button onclick="addMonths(12)" style="flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);border-radius:8px;padding:7px 6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">+12개월</button>
  </div>

  <!-- 메모 -->
  <div class="field">
    <label>📝 메모 <small style="color:rgba(255,255,255,.25)">(입금자명, 결제방식 등)</small></label>
    <textarea id="pm-memo" placeholder="예) 홍길동 계좌이체 30,000원 24.01.15" style="width:100%;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-family:inherit;outline:none;resize:vertical;min-height:60px"></textarea>
  </div>

  <div class="modal-actions">
    <button class="btn-cancel" onclick="closePayModal()">취소</button>
    <button class="btn-save"   onclick="savePayment()"><i class="fas fa-save"></i> 저장하기</button>
  </div>
</div>
</div>

<script>
/* ═══════════════════════════════════════════════════════
   상태
═══════════════════════════════════════════════════════ */
let editId   = null;
let payEditId = null;
let pmPlan   = 'shoot';
let pmStatus = 'unpaid';
let curTab   = 'shops';
let shopData = [];
let thumbDataUrl = '';

/* ═══════════════════════════════════════════════════════
   탭 전환
═══════════════════════════════════════════════════════ */
function switchTab(t) {
  curTab = t;
  ['shops','stats','pay','inq'].forEach(x => {
    document.getElementById('tab-'+x).classList.toggle('on', x===t);
    document.getElementById('panel-'+x).style.display = x===t ? 'block' : 'none';
  });
  document.getElementById('summaryBox').style.display =
    (t==='shops'||t==='stats') ? 'grid' : 'none';
  document.querySelector('.add-btn').style.display =
    t==='shops' ? 'flex' : 'none';
  if (t==='inq') loadInquiries();
  if (t==='pay') renderPayments();
}

/* ═══════════════════════════════════════════════════════
   구독관리 탭 렌더
═══════════════════════════════════════════════════════ */
let payFilter = 'all';

function renderPayments(filter) {
  if (filter !== undefined) payFilter = filter;
  const p = document.getElementById('panel-pay');
  const list = shopData;
  if (!list.length) { p.innerHTML = '<div class="empty">등록된 업체가 없어요</div>'; return; }
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E💄%3C/text%3E%3C/svg%3E";

  // 요약 집계
  const total   = list.length;
  const paid    = list.filter(s => s.paymentStatus==='paid').length;
  const free    = list.filter(s => s.paymentStatus==='free').length;
  const unpaid  = list.filter(s => s.paymentStatus==='unpaid').length;
  const expired = list.filter(s => s.paymentStatus==='expired').length;

  // 만료 임박(30일 이내) 계산
  const soon = list.filter(s => {
    if (!s.paidUntil) return false;
    const diff = Math.ceil((new Date(s.paidUntil) - new Date()) / 86400000);
    return diff >= 0 && diff <= 30;
  }).length;

  // 필터링
  let filtered = list;
  if (payFilter === 'paid')    filtered = list.filter(s => s.paymentStatus==='paid');
  else if (payFilter === 'free')    filtered = list.filter(s => s.paymentStatus==='free');
  else if (payFilter === 'unpaid')  filtered = list.filter(s => s.paymentStatus==='unpaid');
  else if (payFilter === 'expired') filtered = list.filter(s => s.paymentStatus==='expired');
  else if (payFilter === 'soon')    filtered = list.filter(s => {
    if (!s.paidUntil) return false;
    const diff = Math.ceil((new Date(s.paidUntil) - new Date()) / 86400000);
    return diff >= 0 && diff <= 30;
  });

  // 정렬: 만료임박 → 만료 → 미결제 → 무료 → 결제완료
  const order = {expired:0, unpaid:1, soon:2, free:3, paid:4};
  filtered = [...filtered].sort((a,b) => {
    const ao = order[a.paymentStatus]??9;
    const bo = order[b.paymentStatus]??9;
    if (ao !== bo) return ao - bo;
    if (a.paidUntil && b.paidUntil)
      return new Date(a.paidUntil) - new Date(b.paidUntil);
    return 0;
  });

  const filterBtns = [
    {k:'all',   label:\`전체 \${total}\`},
    {k:'paid',  label:\`✅ 결제 \${paid}\`},
    {k:'free',  label:\`🎁 무료 \${free}\`},
    {k:'unpaid',label:\`💳 미결제 \${unpaid}\`},
    {k:'expired',label:\`⚠️ 만료 \${expired}\`},
    {k:'soon',  label:\`🔔 임박 \${soon}\`},
  ].map(b => \`<button class="pf-btn\${payFilter===b.k?' on':''}" onclick="renderPayments('\${b.k}')">\${b.label}</button>\`).join('');

  const cards = filtered.map(s => {
    const img = s.thumbnail || (s.youtubeId ? 'https://img.youtube.com/vi/'+s.youtubeId+'/maxresdefault.jpg' : fallback);
    const plan = s.plan || 'basic';
    const st   = s.paymentStatus || 'unpaid';
    const statusClass = \`status-\${st}\`;

    // 만료일 표시
    let expiryHtml = '<strong>미설정</strong>';
    if (s.paidUntil) {
      const d    = new Date(s.paidUntil);
      const diff = Math.ceil((d - new Date()) / 86400000);
      const dateStr = d.toLocaleDateString('ko-KR',{year:'2-digit',month:'2-digit',day:'2-digit'});
      if (diff > 30)       expiryHtml = \`<strong style="color:#03C75A">\${dateStr}</strong>\`;
      else if (diff > 0)   expiryHtml = \`<strong style="color:#FFA500">\${dateStr} (\${diff}일 남음)</strong>\`;
      else                 expiryHtml = \`<strong style="color:var(--pink)">\${dateStr} (\${Math.abs(diff)}일 경과)</strong>\`;
    }

    // 결제상태 텍스트
    const stMap = {paid:'✅ 결제완료', free:'🎁 무료기간', unpaid:'💳 미결제', expired:'⚠️ 만료'};
    const stColor = {paid:'#03C75A', free:'#6495ed', unpaid:'#FFA500', expired:'var(--pink)'};

    return \`
    <div class="pay-card \${statusClass}">
      <div class="pay-top">
        <img class="pay-thumb" src="\${img}" onerror="this.src='\${fallback}'"/>
        <div class="pay-info">
          <div class="pay-name">\${s.name}</div>
          <div class="pay-sub">\${s.category} · \${s.district||''}</div>
          <div class="pay-badges">
            \${plan==='shoot'
              ? '<span class="badge b-plan-shoot">🎬 촬영플랜</span>'
              : '<span class="badge b-plan-basic">📍 기본플랜</span>'}
            <span class="badge" style="background:rgba(255,255,255,.07);color:\${stColor[st]||'#fff'}">\${stMap[st]||st}</span>
          </div>
        </div>
      </div>
      <div class="pay-body">
        <div class="pay-kv">📆 만료일\${expiryHtml}</div>
        <div class="pay-kv">📋 플랜<strong>\${plan==='shoot'?'촬영 (3만+월1만)':'기본 (월1만)'}</strong></div>
      </div>
      \${s.paymentMemo ? \`<div class="pay-memo"><i class="fas fa-sticky-note" style="color:rgba(255,255,255,.25);flex-shrink:0;margin-top:1px"></i><span>\${s.paymentMemo}</span></div>\` : ''}
      <div class="pay-btns">
        <button class="btn-pay-edit" data-id="\${s.id}" onclick="openPayModal(+this.dataset.id)">
          <i class="fas fa-edit"></i> 결제 정보 수정
        </button>
      </div>
    </div>\`;
  }).join('') || '<div class="empty">해당 항목이 없어요</div>';

  p.innerHTML = \`
    <div class="pay-summary">
      <div class="pay-sv"><div class="pay-sv-n" style="color:#03C75A">\${paid}</div><div class="pay-sv-l">✅ 결제완료</div></div>
      <div class="pay-sv"><div class="pay-sv-n" style="color:#6495ed">\${free}</div><div class="pay-sv-l">🎁 무료기간</div></div>
      <div class="pay-sv"><div class="pay-sv-n" style="color:#FFA500">\${unpaid}</div><div class="pay-sv-l">💳 미결제</div></div>
      <div class="pay-sv"><div class="pay-sv-n" style="color:var(--pink)">\${expired}</div><div class="pay-sv-l">⚠️ 만료</div></div>
    </div>
    <div class="pay-filter">\${filterBtns}</div>
    \${cards}
  \`;
}

/* ═══════════════════════════════════════════════════════
   결제 모달
═══════════════════════════════════════════════════════ */
function openPayModal(id) {
  const s = shopData.find(x => x.id === id);
  if (!s) return;
  payEditId = id;
  document.getElementById('pmShopName').textContent = s.name + ' · ' + (s.category||'');
  setPmPlan(s.plan || 'basic');
  setPmStatus(s.paymentStatus || 'unpaid');
  // 만료일
  const until = s.paidUntil ? s.paidUntil.slice(0,10) : '';
  document.getElementById('pm-until').value = until;
  document.getElementById('pm-memo').value  = s.paymentMemo || '';
  document.getElementById('payModalBg').classList.remove('hidden');
}

function closePayModal() {
  document.getElementById('payModalBg').classList.add('hidden');
}

function setPmPlan(plan) {
  pmPlan = plan;
  ['shoot','basic'].forEach(k => {
    document.getElementById('pm-plan-'+k).className =
      'pm-plan-opt' + (k===plan ? ' sel-'+k : '');
  });
}

function setPmStatus(st) {
  pmStatus = st;
  ['paid','free','unpaid','expired'].forEach(k => {
    document.getElementById('pm-st-'+k).className =
      'pm-status-opt' + (k===st ? ' sel-'+k : '');
  });
}

function addMonths(n) {
  const base = document.getElementById('pm-until').value
    ? new Date(document.getElementById('pm-until').value)
    : new Date();
  base.setMonth(base.getMonth() + n);
  document.getElementById('pm-until').value = base.toISOString().slice(0,10);
}

async function savePayment() {
  if (!payEditId) return;
  const body = {
    plan:          pmPlan,
    paymentStatus: pmStatus,
    paidUntil:     document.getElementById('pm-until').value || null,
    paymentMemo:   document.getElementById('pm-memo').value.trim(),
  };
  const r = await fetch('/api/admin/shops/'+payEditId+'/payment', {
    method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  });
  if (r.ok) {
    closePayModal();
    await loadAll();
    if (curTab === 'pay') renderPayments();
    showPayToast('✅ 결제 정보가 저장됐어요');
  } else {
    alert('저장 실패: ' + r.status);
  }
}

let payToastTmr;
function showPayToast(msg) {
  let t = document.getElementById('payToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'payToast';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 20px;border-radius:999px;font-size:13px;font-weight:700;z-index:9999;transition:opacity .3s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.5)';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(payToastTmr);
  payToastTmr = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

/* ═══════════════════════════════════════════════════════
   데이터 로드
═══════════════════════════════════════════════════════ */
async function loadAll() {
  const d = await (await fetch('/api/admin/stats')).json();
  document.getElementById('sv-shops').textContent  = d.totalShops;
  document.getElementById('sv-views').textContent  = (d.totalViews||0).toLocaleString();
  document.getElementById('sv-clicks').textContent = ((d.totalFeedSP||0)+(d.totalMapSP||0)).toLocaleString();
  shopData = d.stats;
  renderShops(d.stats);
  renderStats(d.stats);
}

async function loadInquiries() {
  const panel = document.getElementById('panel-inq');
  panel.innerHTML = '<div class="empty"><i class="fas fa-spinner fa-spin"></i></div>';
  const rows = await (await fetch('/api/admin/inquiries')).json();
  if (!rows.length) {
    panel.innerHTML = '<div class="empty">📭 접수된 입점문의가 없어요</div>';
    return;
  }
  panel.innerHTML = rows.map(r => {
    const d = new Date(r.created_at);
    const dt = d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'})
             + ' ' + d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
    return \`
    <div class="inq-card">
      <div class="inq-top">
        <span class="inq-name">\${r.owner||r.name||'이름없음'}</span>
        \${r.category ? \`<span class="inq-badge">\${r.category}</span>\` : ''}
        <span class="inq-time">\${dt}</span>
      </div>
      <div class="inq-row">
        <span class="inq-kv">🏪 샵명 <strong>\${r.name||'-'}</strong></span>
        <span class="inq-kv">📍 지역 <strong>\${r.area||'-'}</strong></span>
        <span class="inq-kv">📞 연락처 <strong>\${r.phone||'-'}</strong></span>
      </div>
      \${r.url ? \`<div class="inq-row"><span class="inq-kv">🔗 URL <strong style="color:#6495ed">\${r.url}</strong></span></div>\` : ''}
      \${r.message ? \`<div class="inq-msg">💬 \${r.message}</div>\` : ''}
    </div>\`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   업체 렌더
═══════════════════════════════════════════════════════ */
function modeLabel(m) {
  if (m==='feed') return '<span class="sc-mode mode-feed">🎬 영상전용</span>';
  if (m==='map')  return '<span class="sc-mode mode-map">🗺️ 지도전용</span>';
  return '<span class="sc-mode mode-both">🎬🗺️ 영상+지도</span>';
}

function planLabel(s) {
  const plan = s.plan || 'basic';
  const st   = s.paymentStatus || 'unpaid';
  // 플랜 뱃지
  const planBadge = plan === 'shoot'
    ? '<span class="badge b-plan-shoot">🎬 촬영플랜</span>'
    : '<span class="badge b-plan-basic">📍 기본플랜</span>';
  // 결제 상태 뱃지
  let stBadge = '';
  if (st === 'paid')    stBadge = '<span class="badge b-paid">✅ 결제완료</span>';
  else if (st === 'free') stBadge = '<span class="badge b-free">🎁 무료기간</span>';
  else if (st === 'expired') stBadge = '<span class="badge b-expired">⚠️ 만료</span>';
  else                  stBadge = '<span class="badge b-unpaid">💳 미결제</span>';
  // 만료일
  let expiry = '';
  if (s.paidUntil) {
    const d   = new Date(s.paidUntil);
    const now = new Date();
    const diff = Math.ceil((d - now) / 86400000);
    const dateStr = d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'});
    expiry = diff > 0
      ? \`<span class="badge" style="background:rgba(255,255,255,.08);color:rgba(255,255,255,.45)">📆 \${dateStr} (\${diff}일)</span>\`
      : \`<span class="badge b-expired">📆 만료 (\${Math.abs(diff)}일 경과)</span>\`;
  }
  return planBadge + stBadge + expiry;
}

function renderShops(list) {
  const p = document.getElementById('panel-shops');
  if (!list.length) { p.innerHTML='<div class="empty">등록된 업체가 없어요</div>'; return; }
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E💄%3C/text%3E%3C/svg%3E";
  const thumb = s => s.thumbnail || (s.youtubeId ? 'https://img.youtube.com/vi/'+s.youtubeId+'/maxresdefault.jpg' : fallback);
  p.innerHTML = list.map(s => \`
    <div class="shop-card" id="card-\${s.id}">
      <div class="sc-top">
        <img class="sc-thumb" src="\${thumb(s)}" onerror="this.src='\${fallback}'"/>
        <div class="sc-info">
          <div class="sc-name">
            \${s.name}
            \${s.featured ? '<span class="badge b-feat">추천</span>' : ''}
            \${!s.active  ? '<span class="badge b-hide">비공개</span>' : ''}
          </div>
          <div class="sc-cat">\${s.category}</div>
          <div class="sc-addr">\${s.address||''}</div>
          \${modeLabel(s.displayMode||'both')}
        </div>
      </div>
      <!-- 플랜 + 결제상태 뱃지 -->
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        \${planLabel(s)}
        \${s.paymentMemo ? \`<span class="badge" style="background:rgba(255,255,255,.06);color:rgba(255,255,255,.4);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="\${s.paymentMemo}">📝 \${s.paymentMemo}</span>\` : ''}
      </div>
      <div class="sc-fields">
        <div class="sc-f">🎬 유튜브<strong>\${s.youtubeId||'미등록'}</strong></div>
        <div class="sc-f">📅 예약URL<strong>\${s.smartPlaceUrl?'등록됨':'미등록'}</strong></div>
        <div class="sc-f">👁 조회<strong>\${(s.views||0).toLocaleString()}</strong></div>
        <div class="sc-f">📍 예약클릭<strong>\${((s.feedSP||0)+(s.mapSP||0)).toLocaleString()}</strong></div>
      </div>
      <div class="sc-btns">
        <button class="btn-edit" data-id="\${s.id}" onclick="openModal(+this.dataset.id)"><i class="fas fa-edit"></i> 수정</button>
        <button class="btn-pay-edit" data-id="\${s.id}" onclick="openPayModal(+this.dataset.id)"><i class="fas fa-credit-card"></i> 결제</button>
        <button class="btn-del"  data-id="\${s.id}" data-name="\${s.name.replace(/"/g,'&quot;')}" onclick="delShop(+this.dataset.id,this.dataset.name)"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  \`).join('');
}

/* ═══════════════════════════════════════════════════════
   통계 렌더
═══════════════════════════════════════════════════════ */
function renderStats(list) {
  const p = document.getElementById('panel-stats');
  if (!list.length) { p.innerHTML='<div class="empty">데이터가 없어요</div>'; return; }
  const sorted = [...list].sort((a,b)=>
    (b.views+b.feedSP+b.mapSP)-(a.views+a.feedSP+a.mapSP));
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E💄%3C/text%3E%3C/svg%3E";
  p.innerHTML = sorted.map((s,i) => {
    const rc = i===0?'rank1':i===1?'rank2':i===2?'rank3':'rankN';
    const img = s.thumbnail || (s.youtubeId?'https://img.youtube.com/vi/'+s.youtubeId+'/maxresdefault.jpg':fallback);
    return \`
    <div class="stat-card">
      <img class="stat-thumb" src="\${img}" onerror="this.src='\${fallback}'"/>
      <div class="stat-body">
        <div class="stat-top">
          <div class="stat-rank \${rc}">\${i+1}</div>
          <div class="stat-name">\${s.name}</div>
        </div>
        <div class="stat-nums">
          <div class="stat-num c-view">
            <div class="sn-n">\${(s.views||0).toLocaleString()}</div>
            <div class="sn-l">👁 영상조회</div>
          </div>
          <div class="stat-num c-feed">
            <div class="sn-n">\${(s.feedSP||0).toLocaleString()}</div>
            <div class="sn-l">📹 피드예약</div>
          </div>
          <div class="stat-num c-map">
            <div class="sn-n">\${(s.mapSP||0).toLocaleString()}</div>
            <div class="sn-l">🗺 지도예약</div>
          </div>
        </div>
      </div>
    </div>\`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   노출 방식 선택
═══════════════════════════════════════════════════════ */
function setMode(m) {
  document.getElementById('f-mode').value = m;
  ['both','feed','map'].forEach(x => {
    const el = document.getElementById('mo-'+x);
    el.className = 'mode-opt' + (x===m ? ' sel-'+x : '');
  });
}

/* ═══════════════════════════════════════════════════════
   썸네일
═══════════════════════════════════════════════════════ */
function handleThumbFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    thumbDataUrl = ev.target.result;
    document.getElementById('f-thumb').value = '';
    document.getElementById('thumbPreview').src = thumbDataUrl;
  };
  reader.readAsDataURL(file);
}

function updateThumbPreview(url) {
  thumbDataUrl = '';
  if (url.trim()) {
    document.getElementById('thumbPreview').src = url.trim();
  }
}

/* ═══════════════════════════════════════════════════════
   유튜브
═══════════════════════════════════════════════════════ */
function extractYoutubeId(input) {
  const s = (input||'').trim();
  if (!s) return '';
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const re = new RegExp('(?:youtu\\.be/|youtube\\.com/(?:watch\\?(?:.*&)?v=|embed/|shorts/|v/))([A-Za-z0-9_-]{11})');
  const m = s.match(re);
  return m ? m[1] : s;
}

function previewYt(input) {
  const id  = extractYoutubeId(input);
  const box = document.getElementById('ytPreview');
  if (!id) { box.style.display='none'; return; }
  box.style.display='block';
  document.getElementById('ytFrame').src =
    'https://www.youtube.com/embed/'+id+'?mute=1&controls=1';
}

/* ═══════════════════════════════════════════════════════
   지오코딩
═══════════════════════════════════════════════════════ */
async function geocodeAddr() {
  const addr = document.getElementById('f-addr').value.trim();
  if (!addr) { alert('주소를 먼저 입력하세요'); return; }
  const btn = document.getElementById('geoBtn');
  const st  = document.getElementById('geoStatus');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 검색중...';
  st.style.display = 'block';
  st.style.color   = 'rgba(255,255,255,.4)';
  st.textContent   = '주소를 검색하고 있어요...';
  try {
    const res  = await fetch('/api/geocode?query='+encodeURIComponent(addr));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error||'찾을 수 없어요');
    document.getElementById('f-lat').value  = data.lat;
    document.getElementById('f-lng').value  = data.lng;
    document.getElementById('f-addr').value = data.address;
    if (data.district && !document.getElementById('f-dist').value)
      document.getElementById('f-dist').value = data.district;
    st.style.color = '#03C75A';
    st.textContent = '✅ 좌표 입력 완료! 위도 '+data.lat.toFixed(6)+' / 경도 '+data.lng.toFixed(6);
  } catch(err) {
    st.style.color = '#FF4D7D';
    st.textContent = '❌ '+err.message;
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-crosshairs"></i> 좌표찾기';
}

/* ═══════════════════════════════════════════════════════
   모달 열기/닫기
═══════════════════════════════════════════════════════ */
const FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23222'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle'%3E📷%3C/text%3E%3C/svg%3E";

async function openModal(id=null) {
  editId = id;
  thumbDataUrl = '';
  document.getElementById('modalTtl').textContent = id ? '업체 수정' : '업체 추가';

  // 초기화
  ['name','addr','dist','phone','yt','url','tags','desc'].forEach(k =>
    document.getElementById('f-'+k).value = '');
  document.getElementById('f-price').value  = '';
  document.getElementById('f-lat').value    = '';
  document.getElementById('f-lng').value    = '';
  document.getElementById('f-feat').value   = 'false';
  document.getElementById('f-active').value = 'true';
  document.getElementById('f-thumb').value  = '';
  document.getElementById('f-cat').value    = '마사지';
  document.getElementById('thumbPreview').src = FALLBACK_SVG;
  document.getElementById('ytPreview').style.display = 'none';
  document.getElementById('geoStatus').style.display = 'none';
  document.getElementById('thumbFile').value = '';
  setMode('both');

  if (id) {
    const s = await (await fetch('/api/shops/'+id)).json();
    document.getElementById('f-name').value  = s.name||'';
    document.getElementById('f-cat').value   = s.category||'마사지';
    document.getElementById('f-price').value = s.price||'';
    document.getElementById('f-addr').value  = s.address||'';
    document.getElementById('f-dist').value  = s.district||'';
    document.getElementById('f-phone').value = s.phone||'';
    document.getElementById('f-lat').value   = s.lat||'';
    document.getElementById('f-lng').value   = s.lng||'';
    document.getElementById('f-yt').value    = s.youtubeId||'';
    document.getElementById('f-url').value   = s.smartPlaceUrl||'';
    document.getElementById('f-thumb').value = s.thumbnail||'';
    document.getElementById('f-tags').value  = (s.tags||[]).join(', ');
    document.getElementById('f-desc').value  = s.desc||'';
    document.getElementById('f-feat').value  = String(s.featured||false);
    document.getElementById('f-active').value= String(s.active!==false);
    setMode(s.displayMode||'both');
    // 썸네일 미리보기
    const th = s.thumbnail || (s.youtubeId ? 'https://img.youtube.com/vi/'+s.youtubeId+'/maxresdefault.jpg' : FALLBACK_SVG);
    document.getElementById('thumbPreview').src = th;
    if (s.youtubeId) previewYt(s.youtubeId);
  }

  document.getElementById('modalBg').classList.remove('hidden');
  document.getElementById('modal').scrollTop = 0;
}

function closeModal() { document.getElementById('modalBg').classList.add('hidden'); }
function bgClick(e)   { if (e.target===document.getElementById('modalBg')) closeModal(); }

/* ═══════════════════════════════════════════════════════
   저장
═══════════════════════════════════════════════════════ */
async function saveShop() {
  const name = document.getElementById('f-name').value.trim();
  const lat  = document.getElementById('f-lat').value.trim();
  const lng  = document.getElementById('f-lng').value.trim();
  if (!name)      { alert('업체명을 입력하세요'); return; }
  if (!lat||!lng) { alert('주소를 입력하고 [좌표찾기]를 눌러주세요'); return; }

  // 썸네일: 파일 업로드 우선, 없으면 URL
  let thumbnail = thumbDataUrl || document.getElementById('f-thumb').value.trim();

  const body = {
    name,
    category:     document.getElementById('f-cat').value,
    price:        document.getElementById('f-price').value.trim(),
    address:      document.getElementById('f-addr').value.trim(),
    district:     document.getElementById('f-dist').value.trim(),
    phone:        document.getElementById('f-phone').value.trim(),
    lat:          parseFloat(lat),
    lng:          parseFloat(lng),
    youtubeId:    extractYoutubeId(document.getElementById('f-yt').value),
    smartPlaceUrl:document.getElementById('f-url').value.trim(),
    thumbnail,
    tags:         document.getElementById('f-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
    desc:         document.getElementById('f-desc').value.trim(),
    featured:     document.getElementById('f-feat').value==='true',
    active:       document.getElementById('f-active').value==='true',
    displayMode:  document.getElementById('f-mode').value,
  };

  const url    = editId ? '/api/admin/shops/'+editId : '/api/admin/shops';
  const method = editId ? 'PUT' : 'POST';
  const r = await fetch(url, {
    method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  });
  if (r.ok) {
    // 파일 업로드한 경우 별도 API 호출
    if (thumbDataUrl && editId) {
      const saved = await r.json();
      await fetch('/api/admin/upload-thumbnail', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ shopId: saved.id||editId, dataUrl: thumbDataUrl })
      });
    }
    closeModal();
    loadAll();
  } else { alert('저장 실패: '+r.status); }
}

/* ═══════════════════════════════════════════════════════
   삭제
═══════════════════════════════════════════════════════ */
async function delShop(id, name) {
  if (!confirm(\`[\${name}] 업체를 삭제할까요?\`)) return;
  const r = await fetch('/api/admin/shops/'+id, {method:'DELETE'});
  if (r.ok) loadAll();
  else alert('삭제 실패');
}

/* 시작 */
loadAll();
setInterval(loadAll, 30000);
</script>
</body>
</html>`
}


export default app
