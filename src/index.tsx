import { Hono } from 'hono'

const app = new Hono()

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
  smartPlaceUrl: string   // 예약하기 URL (업체마다 다름)
  youtubeId: string       // 유튜브 영상 ID (업체마다 다름)
  featured: boolean
  thumbnail: string
  phone: string
  desc: string
  active: boolean
}

// 런타임 샵 스토어 (메모리)
let shopStore: Shop[] = [
  {
    id: 1, name: '글로우 스킨 강남', category: '피부관리',
    tags: ['리프팅', '보습', '트러블케어'], price: '5만원~',
    address: '서울 강남구 논현로 123', district: '강남구',
    lat: 37.5172, lng: 127.0473,
    smartPlaceUrl: 'https://naver.me/example1',
    youtubeId: 'mldig2ZiRwA', featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    phone: '02-1234-5678', desc: '강남 최고의 피부관리 전문샵', active: true,
  },
  {
    id: 2, name: '헤드힐링 홍대', category: '헤드스파',
    tags: ['두피케어', '헤드마사지', '탈모케어'], price: '4만원~',
    address: '서울 마포구 와우산로 45', district: '마포구',
    lat: 37.5563, lng: 126.9236,
    smartPlaceUrl: 'https://naver.me/example2',
    youtubeId: 'mldig2ZiRwA', featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80',
    phone: '02-2345-6789', desc: '홍대 감성 두피·헤드스파 전문', active: true,
  },
  {
    id: 3, name: '헤어스튜디오 한남', category: '헤어',
    tags: ['염색', '펌', '커트'], price: '6만원~',
    address: '서울 용산구 한남대로 77', district: '용산구',
    lat: 37.5340, lng: 127.0026,
    smartPlaceUrl: 'https://naver.me/example3',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
    phone: '02-3456-7890', desc: '한남동 프리미엄 헤어살롱', active: true,
  },
  {
    id: 4, name: '라온 왁싱샵', category: '왁싱',
    tags: ['전신왁싱', '브라질리언', '눈썹'], price: '2만원~',
    address: '서울 서초구 방배로 55', district: '서초구',
    lat: 37.4836, lng: 126.9822,
    smartPlaceUrl: 'https://naver.me/example4',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80',
    phone: '02-4567-8901', desc: '깔끔하고 위생적인 왁싱 전문샵', active: true,
  },
  {
    id: 5, name: '퍼펙트 눈썹 신촌', category: '반영구',
    tags: ['눈썹문신', '아이라인', '입술'], price: '15만원~',
    address: '서울 서대문구 신촌로 88', district: '서대문구',
    lat: 37.5596, lng: 126.9368,
    smartPlaceUrl: 'https://naver.me/example5',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    phone: '02-5678-9012', desc: '자연스러운 반영구 메이크업', active: true,
  },
  {
    id: 6, name: '힐링 마사지 이태원', category: '마사지',
    tags: ['전신마사지', '아로마', '스웨디시'], price: '7만원~',
    address: '서울 용산구 이태원로 150', district: '용산구',
    lat: 37.5348, lng: 126.9947,
    smartPlaceUrl: 'https://naver.me/example6',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    phone: '02-6789-0123', desc: '전문 테라피스트의 힐링 마사지', active: true,
  },
  {
    id: 7, name: '스칼프클리닉 성수', category: '헤드스파',
    tags: ['두피스케일링', '헤드스파', '아로마'], price: '5만원~',
    address: '서울 성동구 성수일로 30', district: '성동구',
    lat: 37.5446, lng: 127.0557,
    smartPlaceUrl: 'https://naver.me/example7',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    phone: '02-7890-1234', desc: '성수 프리미엄 두피 & 헤드스파', active: true,
  },
  {
    id: 8, name: '리프트업 에스테틱', category: '피부관리',
    tags: ['리프팅', '주름개선', '탄력'], price: '8만원~',
    address: '서울 강남구 청담로 12', district: '강남구',
    lat: 37.5247, lng: 127.0392,
    smartPlaceUrl: 'https://naver.me/example8',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
    phone: '02-8901-2345', desc: '청담동 프리미엄 에스테틱', active: true,
  },
  {
    id: 9, name: '뷰티메디컬 강남', category: '병원',
    tags: ['보톡스', '필러', '피부레이저'], price: '10만원~',
    address: '서울 강남구 역삼로 222', district: '강남구',
    lat: 37.5006, lng: 127.0368,
    smartPlaceUrl: 'https://naver.me/example9',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80',
    phone: '02-9012-3456', desc: '강남 피부과 전문의 직접 시술', active: true,
  },
]

let nextId = 10
const viewCnt: Record<number, number> = {}
const spCnt:   Record<number, number> = {}

function calcDist(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371, dL = (la2 - la1) * Math.PI / 180, dO = (lo2 - lo1) * Math.PI / 180
  const a = Math.sin(dL / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dO / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ══════════════════════════════════════════════════════════════════════════
// API 라우트
// ══════════════════════════════════════════════════════════════════════════

// 샵 목록
app.get('/api/shops', (c) => {
  const cat    = c.req.query('category') ?? ''
  const q      = (c.req.query('q') ?? '').toLowerCase()
  const lat    = parseFloat(c.req.query('lat') ?? '')
  const lng    = parseFloat(c.req.query('lng') ?? '')
  const nearby = c.req.query('nearby') === '1'
  let list = shopStore.filter(s => s.active)
  if (cat && cat !== 'all') list = list.filter(s => s.category === cat)
  if (q) list = list.filter(s =>
    s.name.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)) || s.district.includes(q)
  )
  if (nearby && !isNaN(lat) && !isNaN(lng)) {
    list = list
      .map(s => ({ ...s, dist: calcDist(lat, lng, s.lat, s.lng) }))
      .filter((s: any) => s.dist <= 20)
      .sort((a: any, b: any) => a.dist - b.dist)
  } else {
    list = [...list.filter(s => s.featured), ...list.filter(s => !s.featured)]
  }
  return c.json(list.map(s => ({ ...s, views: viewCnt[s.id] ?? 0 })))
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
    // 구/지역 자동 추출
    const district = addr.addressElements?.find((e: any) =>
      e.types?.includes('LEGAL_CODE') || e.types?.includes('DISTRICT')
    )?.longName || addr.roadAddress?.split(' ')[2] || ''
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
app.get('/api/shops/all', (c) => {
  return c.json(shopStore.filter(s => s.active).map(s => ({ ...s, views: viewCnt[s.id] ?? 0 })))
})

// 샵 단건
app.get('/api/shops/:id', (c) => {
  const id = +c.req.param('id')
  const s = shopStore.find(x => x.id === id)
  if (!s) return c.json({ error: 'not found' }, 404)
  return c.json({ ...s, views: viewCnt[s.id] ?? 0 })
})

// 샵 추가
app.post('/api/admin/shops', async (c) => {
  const body = await c.req.json()
  const shop: Shop = {
    id: nextId++,
    name:         body.name        ?? '새 업체',
    category:     body.category    ?? '피부관리',
    tags:         body.tags        ?? [],
    price:        body.price       ?? '',
    address:      body.address     ?? '',
    district:     body.district    ?? '',
    lat:          parseFloat(body.lat)  || 37.5326,
    lng:          parseFloat(body.lng)  || 127.0246,
    smartPlaceUrl: body.smartPlaceUrl ?? '',
    youtubeId:    body.youtubeId   ?? '',
    featured:     body.featured    ?? false,
    thumbnail:    body.thumbnail   ?? 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    phone:        body.phone       ?? '',
    desc:         body.desc        ?? '',
    active:       true,
  }
  shopStore.push(shop)
  return c.json(shop)
})

// 샵 수정
app.put('/api/admin/shops/:id', async (c) => {
  const id   = +c.req.param('id')
  const body = await c.req.json()
  const idx  = shopStore.findIndex(s => s.id === id)
  if (idx === -1) return c.json({ error: 'not found' }, 404)
  shopStore[idx] = {
    ...shopStore[idx],
    ...body,
    id,
    lat: parseFloat(body.lat) || shopStore[idx].lat,
    lng: parseFloat(body.lng) || shopStore[idx].lng,
    tags: Array.isArray(body.tags)
      ? body.tags
      : (body.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
  }
  return c.json(shopStore[idx])
})

// 샵 삭제
app.delete('/api/admin/shops/:id', (c) => {
  const id  = +c.req.param('id')
  const idx = shopStore.findIndex(s => s.id === id)
  if (idx === -1) return c.json({ error: 'not found' }, 404)
  shopStore.splice(idx, 1)
  return c.json({ ok: true })
})

// 추적
app.post('/api/track/view/:id', (c) => {
  const id = +c.req.param('id'); viewCnt[id] = (viewCnt[id] ?? 0) + 1; return c.json({ ok: true })
})
app.post('/api/track/sp/:id', (c) => {
  const id = +c.req.param('id'); spCnt[id] = (spCnt[id] ?? 0) + 1; return c.json({ ok: true })
})

// 어드민 통계
app.get('/api/admin/stats', (c) => {
  const stats = shopStore.map(s => ({
    id: s.id, name: s.name, category: s.category,
    featured: s.featured, active: s.active,
    views: viewCnt[s.id] ?? 0, spClicks: spCnt[s.id] ?? 0,
  })).sort((a, b) => b.views - a.views)
  return c.json({
    stats,
    totalViews: Object.values(viewCnt).reduce((a, b) => a + b, 0),
    totalSP:    Object.values(spCnt).reduce((a, b) => a + b, 0),
    totalShops: shopStore.filter(s => s.active).length,
  })
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

app.get('/admin', (c) => c.html(adminPage()))
app.get('/map', (c) => c.html(mapPage()))
app.get('/', (c) => c.html(mainPage()))

// ══════════════════════════════════════════════════════════════════════════
// 메인 페이지
// ══════════════════════════════════════════════════════════════════════════
const NAVER_CLIENT_ID = 'xjjg4490h8'
const CATEGORIES = ['전체', '마사지', '헤드스파', '피부관리', '헤어', '왁싱', '반영구', '병원']
const CAT_EMOJI:  Record<string, string> = {
  '전체': '🏠', '마사지': '💆', '헤드스파': '🧖', '피부관리': '✨', '헤어': '💇', '왁싱': '🌸', '반영구': '👁', '병원': '🏥',
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

/* 화면 */
#feedScreen{position:fixed;top:calc(var(--hd)+var(--cat)+var(--sb,0px));left:0;right:0;
  bottom:var(--nav);overflow-y:scroll;scroll-snap-type:y mandatory;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;
  transition:top .3s cubic-bezier(.32,1,.23,1);
  display:none;}
#feedScreen.active{display:block;}
#feedScreen::-webkit-scrollbar{display:none}
#mapScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:var(--nav);
  display:none;}
#mapScreen.active{display:block;}

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

/* 피드 아이템 */
.fi{height:calc(100dvh - var(--hd) - var(--cat) - var(--nav) - var(--sb,0px));
  scroll-snap-align:start;scroll-snap-stop:always;
  background:#000;display:flex;flex-direction:column;overflow:hidden}
.yt-area{flex:1;position:relative;overflow:hidden;background:#000;cursor:pointer}
.yt-thumb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transition:opacity .3s}
.yt-play-btn{position:absolute;inset:0;display:flex;align-items:center;
  justify-content:center;pointer-events:none}
.yt-play-btn::after{content:'';width:64px;height:64px;border-radius:50%;
  background:rgba(0,0,0,.55);border:3px solid rgba(255,255,255,.9);
  box-shadow:0 4px 24px rgba(0,0,0,.5)}
.yt-play-btn::before{content:'▶';position:absolute;font-size:22px;
  color:#fff;margin-left:4px;z-index:1}
.yt-frame{position:absolute;inset:0;width:100%;height:100%;border:none;
  opacity:0;transition:opacity .4s}
.yt-frame.loaded{opacity:1}
.yt-area.playing .yt-thumb{opacity:0;pointer-events:none}
.yt-area.playing .yt-play-btn{display:none}
.yt-area.playing .yt-frame{opacity:1}

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

<!-- 하단 탭바 -->
<nav class="tabbar">
  <button class="tab active" id="tab-feed" onclick="switchTab('feed')">
    <i class="fas fa-play-circle"></i>영상
  </button>
  <button class="tab" id="tab-map" onclick="switchTab('map')">
    <i class="fas fa-map-marker-alt"></i>지도
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
  '피부관리':'cat-skin', '헤어':'cat-hair',
  '왁싱':'cat-wax', '반영구':'cat-perm', '병원':'cat-hospital',
};

// ── 탭 전환 ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  ['feed','map'].forEach(t => {
    document.getElementById('tab-'+t).classList.toggle('active', t===tab);
    document.getElementById(t+'Screen').classList.toggle('active', t===tab);
  });
  document.getElementById('catBar').classList.toggle('show', tab==='feed');
  if (tab==='map') {
    closeMapPopup();
    initMap();
  }
  if (tab==='feed') closeMapPopup();
}

// ── 로고 더블클릭 → 관리자 ───────────────────────────────────────────────
let logoCnt=0, logoTmr;
document.getElementById('logoBtn').addEventListener('click', ()=>{
  logoCnt++;
  clearTimeout(logoTmr);
  logoTmr = setTimeout(()=>{logoCnt=0;}, 600);
  if (logoCnt >= 3) {
    logoCnt = 0;
    const pw = prompt('관리자 비밀번호를 입력하세요');
    if (pw === '0907') location.href = '/admin';
    else if (pw !== null) showToast('비밀번호가 틀렸어요');
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 피드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let feedCat = 'all';
let searchQ = '';
let searchTimer = null;

async function loadFeed(cat='all', q='') {
  feedCat = cat;
  const screen = document.getElementById('feedScreen');
  screen.innerHTML = '<div class="feed-spin"><div class="spinner"></div></div>';
  let url = '/api/shops?category='+encodeURIComponent(cat==='all'?'':cat);
  if (q) url += '&q='+encodeURIComponent(q);
  const res   = await fetch(url);
  const shops = await res.json();
  if (!shops.length) {
    screen.innerHTML = \`<div class="feed-empty"><i class="fas fa-search"></i><p>\${searchQ ? '"'+searchQ+'" 검색 결과가 없어요' : '등록된 샵이 없어요'}</p></div>\`;
    return;
  }
  screen.innerHTML = shops.map((s) => {
    const thumb = s.youtubeId
      ? \`https://img.youtube.com/vi/\${s.youtubeId}/hqdefault.jpg\`
      : s.thumbnail;
    const ytArea = s.youtubeId
      ? \`<div class="yt-area" id="yta-\${s.id}" data-ytid="\${s.youtubeId}" onclick="playYt(this)">
           <img class="yt-thumb" src="\${thumb}" alt="\${s.name}" loading="lazy"/>
           <div class="yt-play-btn"></div>
           <iframe class="yt-frame" id="ytf-\${s.id}" src="" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>
         </div>\`
      : \`<div class="yt-area"><img class="yt-thumb" src="\${thumb}" alt="\${s.name}" loading="lazy" style="pointer-events:none"/></div>\`;
    return \`
    <div class="fi">
      \${ytArea}
      <div class="shop-bar">
        <div class="shop-bar-info">
          <div class="shop-bar-cat">\${s.category}</div>
          <div class="shop-bar-name">\${s.name}</div>
          <div class="shop-bar-loc">
            <i class="fas fa-map-marker-alt"></i>
            <span>\${s.district} · \${s.price}</span>
          </div>
        </div>
        \${s.smartPlaceUrl
          ? \`<button class="btn-book"
               onclick="curShop=\${JSON.stringify({id:s.id,name:s.name,smartPlaceUrl:s.smartPlaceUrl}).replace(/'/g,'\\'')};openInapp()">
              <i class="fas fa-calendar-check"></i>
              <span>예약하기</span>
             </button>\`
          : \`<div style="flex-shrink:0;width:64px;text-align:center;font-size:10px;color:rgba(255,255,255,.3)">예약링크<br>없음</div>\`
        }
      </div>
    </div>\`;
  }).join('');
  screen.scrollTo(0, 0);

  // 스크롤 멈추면 현재 화면 영상 자동재생
  let scrollTmr;
  screen.onscroll = () => {
    clearTimeout(scrollTmr);
    scrollTmr = setTimeout(() => {
      const itemH = screen.querySelector('.fi')?.offsetHeight || screen.clientHeight;
      const idx   = Math.round(screen.scrollTop / itemH);
      const fi    = screen.querySelectorAll('.fi')[idx];
      if (!fi) return;
      const area = fi.querySelector('.yt-area[data-ytid]');
      if (!area || area.classList.contains('playing')) return;
      playYt(area);
    }, 350);
  };
}

function playYt(area) {
  const ytId = area.dataset.ytid;
  if (!ytId) return;
  if (area.classList.contains('playing')) return;
  // 다른 재생 중인 영상 중지
  document.querySelectorAll('.yt-area.playing').forEach(a => {
    a.classList.remove('playing');
    const f = a.querySelector('.yt-frame');
    if (f) f.src = '';
  });
  // iframe에 src 세팅
  const frame = area.querySelector('.yt-frame');
  if (!frame) return;
  frame.src = \`https://www.youtube.com/embed/\${ytId}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1&controls=1\`;
  frame.onload = () => frame.classList.add('loaded');
  area.classList.add('playing');
  area.onclick = null;
}

function filterFeed(btn, cat) {
  document.querySelectorAll('.cp').forEach(b=>b.classList.remove('active'));
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
      center: new naver.maps.LatLng(37.5326, 127.0246),
      zoom: 12,
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
  '피부관리':'#FF4D7D', '헤어':'#F59E0B',
  '왁싱':'#EC4899', '반영구':'#06B6D4', '병원':'#3B82F6',
};
function pinColor(cat) { return CAT_COLOR[cat] || '#FF4D7D'; }

// DOM 엘리먼트 방식으로 마커 생성 (인라인 스타일 → CSS 클래스 의존 없음)
function buildMarkerEl(shop, selected) {
  const bg  = selected ? '#ffffff' : pinColor(shop.category);
  const txt = selected ? pinColor(shop.category) : '#ffffff';
  const scale = selected ? 'scale(1.18)' : 'scale(1)';
  const shadow = selected
    ? '0 4px 18px rgba(255,255,255,.35)'
    : '0 3px 10px rgba(0,0,0,.45)';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:pointer;transform:'+scale+';transition:transform .2s';

  const pin = document.createElement('div');
  pin.style.cssText = \`
    background:\${bg};color:\${txt};
    font-size:11px;font-weight:800;
    padding:5px 11px;border-radius:20px;
    white-space:nowrap;max-width:110px;
    overflow:hidden;text-overflow:ellipsis;
    box-shadow:\${shadow};
    border:2px solid rgba(255,255,255,\${selected?'.9':'.35'});
    font-family:-apple-system,sans-serif;
    letter-spacing:-.2px;
  \`;
  pin.textContent = shop.name;

  const tail = document.createElement('div');
  tail.style.cssText = \`
    width:0;height:0;
    border-left:6px solid transparent;
    border-right:6px solid transparent;
    border-top:8px solid \${bg};
    margin-top:-1px;
  \`;

  wrap.appendChild(pin);
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
    anchor: new naver.maps.Point(el.offsetWidth/2||50, 38),
    zIndex: selected ? 200 : (shop.featured ? 100 : 10),
    map: naverMap,
  });
  return overlay;
}

function renderNaverMarkers(shops) {
  Object.values(nvMarkers).forEach(o => o.setMap(null));
  nvMarkers = {};
  shops.forEach(shop => {
    nvMarkers[shop.id] = createNaverMarker(shop, false);
  });
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
    ytEl.innerHTML = \`
      <div class="mp-yt-thumb-wrap" style="position:relative;width:100%;padding-top:52%;background:#000;overflow:hidden">
        <img src="https://img.youtube.com/vi/\${shop.youtubeId}/hqdefault.jpg"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;cursor:pointer"
          onclick="loadYtInPopup('\${shop.youtubeId}')" alt=""/>
        <div onclick="loadYtInPopup('\${shop.youtubeId}')"
          style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                 background:rgba(0,0,0,.25);cursor:pointer">
          <div style="width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,.93);
                      display:flex;align-items:center;justify-content:center;
                      box-shadow:0 4px 20px rgba(0,0,0,.4)">
            <i class="fas fa-play" style="color:#111;font-size:20px;margin-left:4px"></i>
          </div>
        </div>
      </div>
    \`;
  } else {
    ytEl.innerHTML = \`<img src="\${shop.thumbnail}"
      style="width:100%;height:160px;object-fit:cover;display:block" alt=""/>\`;
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
function trackSP() { if(curShop) fetch('/api/track/sp/'+curShop.id,{method:'POST'}); }

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
html,body{width:100%;height:100%;overflow:hidden;background:#111}
#naverMap{width:100%;height:100%;}
/* 마커 */
.nv-pin{display:flex;flex-direction:column;align-items:center;cursor:pointer}
.nv-pin-label{font-size:11px;font-weight:800;padding:5px 11px;border-radius:20px;
  white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.45);
  border:2px solid rgba(255,255,255,.35);font-family:-apple-system,sans-serif;
  color:#fff;max-width:110px;overflow:hidden;text-overflow:ellipsis}
.nv-pin-tail{width:0;height:0;border-left:6px solid transparent;
  border-right:6px solid transparent;margin-top:-1px}
/* 팝업 */
#popup{position:fixed;bottom:16px;left:12px;right:12px;z-index:200;
  background:#111;border-radius:20px;overflow:hidden;
  box-shadow:0 8px 32px rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.1);
  transform:translateY(30px);opacity:0;pointer-events:none;
  transition:transform .3s ease,opacity .25s;display:none}
#popup.show{transform:translateY(0);opacity:1;pointer-events:auto;display:block}
.pp-info{padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.pp-left{flex:1;min-width:0}
.pp-badge{font-size:10px;font-weight:700;color:#FF4D7D;margin-bottom:4px}
.pp-name{font-size:16px;font-weight:800;color:#fff;margin-bottom:4px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pp-meta{font-size:12px;color:rgba(255,255,255,.5)}
.pp-close{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.1);
  border:none;color:#fff;font-size:16px;cursor:pointer;flex-shrink:0;
  display:flex;align-items:center;justify-content:center}
</style>
</head>
<body>
<div id="naverMap"></div>
<div id="popup">
  <div class="pp-info">
    <div class="pp-left">
      <div class="pp-badge" id="ppBadge"></div>
      <div class="pp-name"  id="ppName"></div>
      <div class="pp-meta"  id="ppMeta"></div>
    </div>
    <button class="pp-close" onclick="closePopup()">✕</button>
  </div>
</div>

<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=xjjg4490h8"></script>
<script>
const CAT_COLOR = {
  '마사지':'#10B981','헤드스파':'#6366F1','피부관리':'#FF4D7D',
  '헤어':'#F59E0B','왁싱':'#EC4899','반영구':'#06B6D4','병원':'#3B82F6'
};

let map = null;
let markers = [];
let curCat = 'all';

// 부모에서 카테고리 변경 메시지 수신
window.addEventListener('message', e => {
  if (e.data?.type === 'filterCat') {
    curCat = e.data.cat;
    renderMarkers();
  }
});

// 팝업 닫기
function closePopup() {
  document.getElementById('popup').classList.remove('show');
}

// 마커 생성
function makeMarker(shop) {
  const color = CAT_COLOR[shop.category] || '#FF4D7D';
  const wrap  = document.createElement('div');
  wrap.className = 'nv-pin';
  wrap.innerHTML = \`
    <div class="nv-pin-label" style="background:\${color}">\${shop.name}</div>
    <div class="nv-pin-tail"  style="border-top:8px solid \${color}"></div>
  \`;
  wrap.onclick = () => {
    // 팝업 표시
    document.getElementById('ppBadge').textContent = shop.category;
    document.getElementById('ppName').textContent  = shop.name;
    document.getElementById('ppMeta').textContent  = shop.district + ' · ' + shop.price;
    document.getElementById('popup').classList.add('show');
    map.panTo(new naver.maps.LatLng(shop.lat, shop.lng));
    // 부모에게 샵 선택 알림
    window.parent.postMessage({ type:'shopSelected', id: shop.id }, '*');
  };
  return new naver.maps.CustomOverlay({
    position: new naver.maps.LatLng(shop.lat, shop.lng),
    content: wrap,
    anchor: new naver.maps.Point(50, 38),
    map: map,
    zIndex: shop.featured ? 100 : 10,
  });
}

// 마커 렌더링
let allShops = [];
function renderMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
  const list = curCat === 'all' ? allShops : allShops.filter(s => s.category === curCat);
  list.forEach(s => markers.push(makeMarker(s)));
}

// 지도 초기화
window.onload = async () => {
  map = new naver.maps.Map('naverMap', {
    center: new naver.maps.LatLng(37.5326, 127.0246),
    zoom: 12,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  });
  map.addListener('click', closePopup);

  // ── 테스트용 강남역 더미 핀 ──
  new naver.maps.Marker({
    position: new naver.maps.LatLng(37.4979, 127.0276),
    map: map,
    title: '강남역 테스트',
    icon: {
      content: '<div style="background:#FF4D7D;color:#fff;padding:6px 10px;border-radius:8px;font-size:13px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.4)">📍 강남역 테스트</div>',
      anchor: new naver.maps.Point(60, 20),
    }
  });

  // 샵 데이터 로드
  const res = await fetch('/api/shops/all');
  allShops = await res.json();
  renderMarkers();
};
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
:root{--pink:#FF4D7D;--green:#03C75A;--bg:#0a0a0a}
body{font-family:'Pretendard',sans-serif;background:var(--bg);color:#fff;min-height:100vh}

/* 상단바 */
.top{background:rgba(16,16,16,.98);border-bottom:1px solid rgba(255,255,255,.07);
  padding:0 16px;height:56px;display:flex;align-items:center;gap:12px;
  position:sticky;top:0;z-index:50;backdrop-filter:blur(10px)}
.back{font-size:20px;color:rgba(255,255,255,.6);text-decoration:none}
.back:hover{color:#fff}
.ttl{font-size:17px;font-weight:800;flex:1}
.add-btn{background:var(--pink);color:#fff;border:none;border-radius:10px;
  padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;gap:6px;font-family:inherit}

/* 통계 */
.wrap{max-width:600px;margin:0 auto;padding:16px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px}
.sc{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:14px;padding:14px;text-align:center}
.sn{font-size:26px;font-weight:800;color:#FF8FA3}
.sl{font-size:11px;color:rgba(255,255,255,.3);margin-top:4px;font-weight:600}

/* 탭 */
.tabs{display:flex;gap:0;margin-bottom:16px;border:1.5px solid rgba(255,255,255,.1);
  border-radius:12px;overflow:hidden}
.atab{flex:1;padding:10px;text-align:center;font-size:13px;font-weight:700;
  cursor:pointer;background:transparent;color:rgba(255,255,255,.4);
  border:none;font-family:inherit;transition:all .2s}
.atab.active{background:var(--pink);color:#fff}

/* 샵 카드 */
.shop-card{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:16px;padding:14px;margin-bottom:10px;position:relative}
.sc-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.sc-thumb{width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0}
.sc-info{flex:1;min-width:0}
.sc-name{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-cat{font-size:11px;color:var(--pink);font-weight:600;margin-top:2px}
.sc-addr{font-size:11px;color:rgba(255,255,255,.35);margin-top:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-btns{display:flex;gap:6px}
.btn-edit{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  color:#fff;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit}
.btn-del{background:rgba(255,77,125,.1);border:1px solid rgba(255,77,125,.2);
  color:var(--pink);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit}
.sc-detail{border-top:1px solid rgba(255,255,255,.06);margin-top:10px;padding-top:10px;
  display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sc-field{font-size:11px;color:rgba(255,255,255,.35)}
.sc-field strong{display:block;color:rgba(255,255,255,.7);font-size:12px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge-feat{background:rgba(255,77,125,.15);color:var(--pink);
  font-size:10px;font-weight:700;padding:2px 6px;border-radius:5px;margin-left:6px}
.badge-hide{background:rgba(255,255,255,.07);color:rgba(255,255,255,.3);
  font-size:10px;font-weight:700;padding:2px 6px;border-radius:5px;margin-left:6px}

/* 통계 탭 */
.stat-row{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:14px;padding:12px;margin-bottom:8px}
.sr-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.sr-name{font-size:14px;font-weight:700;flex:1}
.sr-cat{font-size:10px;background:rgba(255,77,125,.12);color:#FF8FA3;
  padding:2px 7px;border-radius:8px;font-weight:700}
.sr-nums{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sr-num{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
  border-radius:10px;padding:10px;text-align:center}
.sr-n{font-size:20px;font-weight:800}
.sr-l{font-size:10px;color:rgba(255,255,255,.3);margin-top:2px;font-weight:600}

/* 모달 */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;
  display:flex;align-items:flex-end;justify-content:center}
.modal-bg.hidden{display:none}
.modal{background:#1a1a1a;border-radius:22px 22px 0 0;width:100%;max-width:600px;
  max-height:90vh;overflow-y:auto;padding:20px 18px 40px}
.modal-handle{width:36px;height:4px;background:rgba(255,255,255,.1);
  border-radius:4px;margin:0 auto 16px}
.modal-ttl{font-size:18px;font-weight:800;margin-bottom:16px}
.field{margin-bottom:12px}
.field label{display:block;font-size:11px;font-weight:700;
  color:rgba(255,255,255,.4);margin-bottom:5px;text-transform:uppercase}
.field input,.field select,.field textarea{
  width:100%;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);
  border-radius:10px;padding:10px 12px;color:#fff;font-size:14px;font-family:inherit;outline:none}
.field input:focus,.field select,.field textarea:focus{border-color:var(--pink)}
.field textarea{resize:vertical;min-height:70px}
.field select option{background:#1a1a1a}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.modal-actions{display:flex;gap:10px;margin-top:18px}
.btn-save{flex:1;background:var(--pink);color:#fff;border:none;border-radius:12px;
  padding:14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}
.btn-cancel{background:rgba(255,255,255,.07);color:rgba(255,255,255,.6);
  border:1.5px solid rgba(255,255,255,.1);border-radius:12px;
  padding:14px 18px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}
.yt-preview{margin-top:6px;border-radius:8px;overflow:hidden;
  background:#000;aspect-ratio:16/9;display:none}
.yt-preview iframe{width:100%;height:100%;border:none}
.url-preview{margin-top:6px;font-size:11px;color:var(--green);word-break:break-all}
</style>
</head>
<body>

<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">관리자 대시보드</span>
  <button class="add-btn" onclick="openModal()">
    <i class="fas fa-plus"></i> 업체 추가
  </button>
</div>

<div class="wrap">
  <!-- 통계 요약 -->
  <div class="stats">
    <div class="sc"><div class="sn" id="tv">-</div><div class="sl">👁 총 조회</div></div>
    <div class="sc"><div class="sn" id="ts">-</div><div class="sl">📍 예약클릭</div></div>
    <div class="sc"><div class="sn" id="tc">-</div><div class="sl">💄 등록 샵</div></div>
  </div>

  <!-- 탭 -->
  <div class="tabs">
    <button class="atab active" id="tab-shops" onclick="showTab('shops')">
      <i class="fas fa-store"></i> 업체 관리
    </button>
    <button class="atab" id="tab-stats" onclick="showTab('stats')">
      <i class="fas fa-chart-bar"></i> 통계
    </button>
  </div>

  <!-- 업체 목록 -->
  <div id="panel-shops"></div>
  <!-- 통계 목록 -->
  <div id="panel-stats" style="display:none"></div>
</div>

<!-- 추가/수정 모달 -->
<div class="modal-bg hidden" id="modalBg" onclick="closeModal(event)">
  <div class="modal" id="modal">
    <div class="modal-handle"></div>
    <div class="modal-ttl" id="modalTtl">업체 추가</div>

    <div class="field">
      <label>업체명 *</label>
      <input id="f-name" type="text" placeholder="예: 글로우 스킨 강남"/>
    </div>
    <div class="row2">
      <div class="field">
        <label>카테고리 *</label>
        <select id="f-cat">
          <option>마사지</option><option>헤드스파</option><option>피부관리</option>
          <option>헤어</option><option>왁싱</option><option>반영구</option><option>병원</option>
        </select>
      </div>
      <div class="field">
        <label>가격대</label>
        <input id="f-price" type="text" placeholder="예: 5만원~"/>
      </div>
    </div>
    <div class="field">
      <label>주소 *</label>
      <div style="display:flex;gap:8px">
        <input id="f-addr" type="text" placeholder="예: 서울 강남구 논현로 123" style="flex:1"
          onkeydown="if(event.key==='Enter'){event.preventDefault();geocodeAddr()}"/>
        <button type="button" onclick="geocodeAddr()" id="geocodeBtn"
          style="flex-shrink:0;background:var(--pink);color:#fff;border:none;border-radius:10px;
                 padding:0 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;
                 white-space:nowrap;display:flex;align-items:center;gap:5px;height:42px">
          <i class="fas fa-map-marker-alt"></i> 좌표찾기
        </button>
      </div>
      <div id="geocodeStatus" style="margin-top:6px;font-size:11px;display:none"></div>
    </div>
    <div class="row2">
      <div class="field">
        <label>구/지역 <span style="color:rgba(255,255,255,.3);font-weight:400">(자동입력)</span></label>
        <input id="f-dist" type="text" placeholder="강남구"/>
      </div>
      <div class="field">
        <label>전화번호</label>
        <input id="f-phone" type="text" placeholder="02-1234-5678"/>
      </div>
    </div>
    <div class="row2">
      <div class="field">
        <label>위도 (lat) <span style="color:rgba(255,255,255,.3);font-weight:400">(자동입력)</span></label>
        <input id="f-lat" type="number" step="0.000001" placeholder="자동입력"
          style="color:rgba(255,255,255,.5)"/>
      </div>
      <div class="field">
        <label>경도 (lng) <span style="color:rgba(255,255,255,.3);font-weight:400">(자동입력)</span></label>
        <input id="f-lng" type="number" step="0.000001" placeholder="자동입력"
          style="color:rgba(255,255,255,.5)"/>
      </div>
    </div>
    <div class="field">
      <label>🎬 유튜브 영상 ID</label>
      <input id="f-yt" type="text" placeholder="예: mldig2ZiRwA (URL 마지막 부분)"
        oninput="previewYt(this.value)"/>
      <div class="yt-preview" id="ytPreview">
        <iframe id="ytFrame" src="" allow="autoplay;encrypted-media" allowfullscreen></iframe>
      </div>
    </div>
    <div class="field">
      <label>📅 네이버 예약 URL</label>
      <input id="f-url" type="text" placeholder="https://naver.me/xxxxx"
        oninput="previewUrl(this.value)"/>
      <div class="url-preview" id="urlPreview"></div>
    </div>
    <div class="field">
      <label>썸네일 이미지 URL</label>
      <input id="f-thumb" type="text" placeholder="https://..."/>
    </div>
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
        <label>상단 노출 (추천)</label>
        <select id="f-feat"><option value="false">일반</option><option value="true">상단 추천</option></select>
      </div>
      <div class="field">
        <label>공개 여부</label>
        <select id="f-active"><option value="true">공개</option><option value="false">비공개</option></select>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">취소</button>
      <button class="btn-save" onclick="saveShop()">저장하기</button>
    </div>
  </div>
</div>

<script>
let editId  = null;
let curTab  = 'shops';
let shopList = [];

async function loadAll() {
  const d = await (await fetch('/api/admin/stats')).json();
  document.getElementById('tv').textContent = d.totalViews.toLocaleString();
  document.getElementById('ts').textContent = d.totalSP.toLocaleString();
  document.getElementById('tc').textContent = d.totalShops;
  shopList = d.stats;
  renderShops(d.stats);
  renderStats(d.stats);
}

function showTab(t) {
  curTab = t;
  ['shops','stats'].forEach(x=>{
    document.getElementById('tab-'+x).classList.toggle('active', x===t);
    document.getElementById('panel-'+x).style.display = x===t?'block':'none';
  });
}

function renderShops(stats) {
  const panel = document.getElementById('panel-shops');
  if (!stats.length) { panel.innerHTML='<div style="text-align:center;color:rgba(255,255,255,.2);padding:40px">등록된 업체가 없어요</div>'; return; }
  panel.innerHTML = stats.map(s=>\`
    <div class="shop-card" id="card-\${s.id}">
      <div class="sc-top">
        <img class="sc-thumb" src="\${s.thumbnail||'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&q=60'}" onerror="this.src='https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&q=60'"/>
        <div class="sc-info">
          <div class="sc-name">
            \${s.name}
            \${s.featured?'<span class="badge-feat">추천</span>':''}
            \${!s.active?'<span class="badge-hide">비공개</span>':''}
          </div>
          <div class="sc-cat">\${s.category}</div>
          <div class="sc-addr">\${s.address||''}</div>
        </div>
      </div>
      <div class="sc-detail">
        <div class="sc-field">🎬 유튜브<strong>\${s.youtubeId||'미등록'}</strong></div>
        <div class="sc-field">📅 예약URL<strong>\${s.smartPlaceUrl?'등록됨':'미등록'}</strong></div>
        <div class="sc-field">📍 위도<strong>\${s.lat}</strong></div>
        <div class="sc-field">📍 경도<strong>\${s.lng}</strong></div>
      </div>
      <div class="sc-btns" style="margin-top:10px">
        <button class="btn-edit" onclick="openModal(\${s.id})"><i class="fas fa-edit"></i> 수정</button>
        <button class="btn-del" onclick="delShop(\${s.id},'\${s.name.replace(/'/g,'\\\\'+'\\'')}')"><i class="fas fa-trash"></i> 삭제</button>
      </div>
    </div>
  \`).join('');
}

function renderStats(stats) {
  document.getElementById('panel-stats').innerHTML = stats.map(s=>\`
    <div class="stat-row">
      <div class="sr-top">
        <div class="sr-name">\${s.name}</div>
        <span class="sr-cat">\${s.category}</span>
      </div>
      <div class="sr-nums">
        <div class="sr-num"><div class="sr-n">\${s.views.toLocaleString()}</div><div class="sr-l">👁 조회수</div></div>
        <div class="sr-num"><div class="sr-n">\${s.spClicks.toLocaleString()}</div><div class="sr-l">📅 예약클릭</div></div>
      </div>
    </div>
  \`).join('');
}

// ── 모달 열기/닫기 ────────────────────────────────────────────────────────
async function openModal(id=null) {
  editId = id;
  document.getElementById('modalTtl').textContent = id ? '업체 수정' : '업체 추가';
  // 필드 초기화
  ['name','addr','dist','phone','yt','url','thumb','tags','desc'].forEach(k=>
    document.getElementById('f-'+k).value='');
  document.getElementById('f-price').value='';
  document.getElementById('f-lat').value='';
  document.getElementById('f-lng').value='';
  document.getElementById('f-feat').value='false';
  document.getElementById('f-active').value='true';
  document.getElementById('f-cat').value='피부관리';
  document.getElementById('ytPreview').style.display='none';
  document.getElementById('urlPreview').textContent='';

  if (id) {
    const s = await (await fetch('/api/shops/'+id)).json();
    document.getElementById('f-name').value  = s.name||'';
    document.getElementById('f-cat').value   = s.category||'피부관리';
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
    document.getElementById('f-feat').value  = String(s.featured);
    document.getElementById('f-active').value= String(s.active);
    if (s.youtubeId) previewYt(s.youtubeId);
    if (s.smartPlaceUrl) previewUrl(s.smartPlaceUrl);
  }
  document.getElementById('modalBg').classList.remove('hidden');
  document.getElementById('modal').scrollTop=0;
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalBg')) return;
  document.getElementById('modalBg').classList.add('hidden');
}

// ── 주소 → 좌표 자동변환 ──────────────────────────────────────────────────
async function geocodeAddr() {
  const addr = document.getElementById('f-addr').value.trim();
  if (!addr) { alert('주소를 먼저 입력하세요'); return; }
  const btn    = document.getElementById('geocodeBtn');
  const status = document.getElementById('geocodeStatus');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 검색중...';
  status.style.display = 'block';
  status.style.color   = 'rgba(255,255,255,.4)';
  status.textContent   = '주소를 검색하고 있어요...';
  try {
    const res  = await fetch('/api/geocode?query='+encodeURIComponent(addr));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '찾을 수 없어요');
    document.getElementById('f-lat').value  = data.lat;
    document.getElementById('f-lng').value  = data.lng;
    document.getElementById('f-addr').value = data.address;
    if (data.district && !document.getElementById('f-dist').value)
      document.getElementById('f-dist').value = data.district;
    status.style.color = '#03C75A';
    status.textContent = '✅ 좌표 자동입력 완료! 위도 '+data.lat.toFixed(6)+' / 경도 '+data.lng.toFixed(6);
  } catch(e) {
    status.style.color = '#FF4D7D';
    status.textContent = '❌ '+e.message+' — 주소를 더 정확히 입력하거나 위도/경도를 직접 입력해주세요';
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> 좌표찾기';
}

// 유튜브 미리보기
function previewYt(id) {
  const clean = id.trim();
  const box   = document.getElementById('ytPreview');
  if (!clean) { box.style.display='none'; return; }
  box.style.display='block';
  document.getElementById('ytFrame').src =
    'https://www.youtube.com/embed/'+clean+'?mute=1&controls=1';
}

// URL 미리보기
function previewUrl(url) {
  const el = document.getElementById('urlPreview');
  el.textContent = url.trim() ? '✅ '+url.trim() : '';
}

// ── 저장 ─────────────────────────────────────────────────────────────────
async function saveShop() {
  const name = document.getElementById('f-name').value.trim();
  const lat  = document.getElementById('f-lat').value.trim();
  const lng  = document.getElementById('f-lng').value.trim();
  if (!name) { alert('업체명을 입력하세요'); return; }
  if (!lat || !lng) { alert('주소를 입력하고 [좌표찾기] 버튼을 눌러주세요'); return; }

  const body = {
    name,
    category:     document.getElementById('f-cat').value,
    price:        document.getElementById('f-price').value.trim(),
    address:      document.getElementById('f-addr').value.trim(),
    district:     document.getElementById('f-dist').value.trim(),
    phone:        document.getElementById('f-phone').value.trim(),
    lat:          parseFloat(lat),
    lng:          parseFloat(lng),
    youtubeId:    document.getElementById('f-yt').value.trim(),
    smartPlaceUrl:document.getElementById('f-url').value.trim(),
    thumbnail:    document.getElementById('f-thumb').value.trim(),
    tags:         document.getElementById('f-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
    desc:         document.getElementById('f-desc').value.trim(),
    featured:     document.getElementById('f-feat').value === 'true',
    active:       document.getElementById('f-active').value === 'true',
  };

  const url    = editId ? '/api/admin/shops/'+editId : '/api/admin/shops';
  const method = editId ? 'PUT' : 'POST';
  const r = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
  if (r.ok) {
    document.getElementById('modalBg').classList.add('hidden');
    loadAll();
  } else { alert('저장 실패: '+r.status); }
}

// ── 삭제 ─────────────────────────────────────────────────────────────────
async function delShop(id, name) {
  if (!confirm(\`[삔\${name}]\\ 업체를 삭제할까요?\`)) return;
  const r = await fetch('/api/admin/shops/'+id, {method:'DELETE'});
  if (r.ok) loadAll();
  else alert('삭제 실패');
}

loadAll();
setInterval(loadAll, 30000);
</script>
</body>
</html>`
}

export default app
