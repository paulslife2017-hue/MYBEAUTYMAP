import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()
app.use('/static/*', serveStatic({ root: './public' }))

// ══════════════════════════════════════════════════════════════════════════
// 데이터 타입
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
}

// ══════════════════════════════════════════════════════════════════════════
// 카테고리 목록
// ══════════════════════════════════════════════════════════════════════════
const CATEGORIES = ['피부관리','네일아트','헤어','왁싱','마사지','반영구','병원']

// ══════════════════════════════════════════════════════════════════════════
// 샵 데이터 (런타임 가변 배열)
// ══════════════════════════════════════════════════════════════════════════
const shops: Shop[] = [
  { id:1, name:'글로우 스킨 강남', category:'피부관리',
    tags:['리프팅','보습','트러블케어'], price:'5만원~',
    address:'서울 강남구 논현로 123', district:'강남구',
    lat:37.5172, lng:127.0473, smartPlaceUrl:'https://naver.me/example1',
    youtubeId:'mldig2ZiRwA', featured:true,
    thumbnail:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
  { id:2, name:'뷰티랩 홍대', category:'네일아트',
    tags:['젤네일','네일아트','케어'], price:'3만원~',
    address:'서울 마포구 와우산로 45', district:'마포구',
    lat:37.5563, lng:126.9236, smartPlaceUrl:'https://naver.me/example2',
    youtubeId:'mldig2ZiRwA', featured:true,
    thumbnail:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { id:3, name:'헤어스튜디오 한남', category:'헤어',
    tags:['염색','펌','커트'], price:'6만원~',
    address:'서울 용산구 한남대로 77', district:'용산구',
    lat:37.5340, lng:127.0026, smartPlaceUrl:'https://naver.me/example3',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80' },
  { id:4, name:'라온 왁싱샵', category:'왁싱',
    tags:['전신왁싱','브라질리언','눈썹'], price:'2만원~',
    address:'서울 서초구 방배로 55', district:'서초구',
    lat:37.4836, lng:126.9822, smartPlaceUrl:'https://naver.me/example4',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80' },
  { id:5, name:'릴렉스 마사지 강남', category:'마사지',
    tags:['전신마사지','아로마','스웨디시'], price:'7만원~',
    address:'서울 강남구 역삼로 201', district:'강남구',
    lat:37.5010, lng:127.0370, smartPlaceUrl:'https://naver.me/example5',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { id:6, name:'퍼펙트 눈썹 신촌', category:'반영구',
    tags:['눈썹문신','아이라인','입술'], price:'15만원~',
    address:'서울 서대문구 신촌로 88', district:'서대문구',
    lat:37.5596, lng:126.9368, smartPlaceUrl:'https://naver.me/example6',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80' },
  { id:7, name:'리프트업 에스테틱', category:'피부관리',
    tags:['리프팅','주름개선','탄력'], price:'8만원~',
    address:'서울 강남구 청담로 12', district:'강남구',
    lat:37.5247, lng:127.0392, smartPlaceUrl:'https://naver.me/example7',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80' },
  { id:8, name:'핑크네일 성수', category:'네일아트',
    tags:['젤네일','케어','풋케어'], price:'2.5만원~',
    address:'서울 성동구 성수일로 30', district:'성동구',
    lat:37.5446, lng:127.0557, smartPlaceUrl:'https://naver.me/example8',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { id:9, name:'살롱드 뷰티 이태원', category:'헤어',
    tags:['탈색','매직','커트'], price:'7만원~',
    address:'서울 용산구 이태원로 200', district:'용산구',
    lat:37.5348, lng:126.9947, smartPlaceUrl:'https://naver.me/example9',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80' },
  { id:10, name:'뷰티클리닉 압구정', category:'병원',
    tags:['보톡스','필러','레이저'], price:'10만원~',
    address:'서울 강남구 압구정로 300', district:'강남구',
    lat:37.5270, lng:127.0290, smartPlaceUrl:'https://naver.me/example10',
    youtubeId:'mldig2ZiRwA', featured:false,
    thumbnail:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },
]

let nextId = 11

// ══════════════════════════════════════════════════════════════════════════
// 통계 카운터
// ══════════════════════════════════════════════════════════════════════════
// 조회수
const viewCnt: Record<number,number> = {}
// 예약클릭 총계
const spCnt: Record<number,number> = {}
// 예약클릭 일별: "YYYY-MM-DD" -> count
const spDaily: Record<string,number> = {}
// 예약클릭 일별 + 샵별: "YYYY-MM-DD::shopId" -> count
const spDailyShop: Record<string,number> = {}

function todayStr() {
  return new Date().toISOString().slice(0,10)
}

function calcDist(la1:number,lo1:number,la2:number,lo2:number){
  const R=6371,dL=(la2-la1)*Math.PI/180,dO=(lo2-lo1)*Math.PI/180
  const a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dO/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

// ══════════════════════════════════════════════════════════════════════════
// API 라우트
// ══════════════════════════════════════════════════════════════════════════
app.get('/api/shops', (c) => {
  const cat = c.req.query('category') ?? ''
  const q   = (c.req.query('q') ?? '').toLowerCase()
  const lat = parseFloat(c.req.query('lat') ?? '')
  const lng = parseFloat(c.req.query('lng') ?? '')
  const nearby = c.req.query('nearby') === '1'
  let list = [...shops]
  if (cat && cat !== 'all') list = list.filter(s => s.category === cat)
  if (q) list = list.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.tags.some(t => t.includes(q)) ||
    s.district.includes(q)
  )
  if (nearby && !isNaN(lat) && !isNaN(lng)) {
    list = list
      .map(s => ({ ...s, dist: calcDist(lat,lng,s.lat,s.lng) }))
      .filter((s:any) => s.dist <= 20)
      .sort((a:any,b:any) => a.dist - b.dist)
  } else {
    list = [...list.filter(s=>s.featured), ...list.filter(s=>!s.featured)]
  }
  return c.json(list.map(s => ({ ...s, views: viewCnt[s.id]??0 })))
})

app.get('/api/shops/all', (c) => {
  return c.json(shops.map(s => ({ ...s, views: viewCnt[s.id]??0 })))
})

// 조회 추적
app.post('/api/track/view/:id', (c) => {
  const id = +c.req.param('id')
  viewCnt[id] = (viewCnt[id]??0) + 1
  return c.json({ ok: true })
})

// 예약클릭 추적 (일별+샵별 기록)
app.post('/api/track/sp/:id', (c) => {
  const id = +c.req.param('id')
  const d  = todayStr()
  spCnt[id]            = (spCnt[id]??0) + 1
  spDaily[d]           = (spDaily[d]??0) + 1
  const dk             = `${d}::${id}`
  spDailyShop[dk]      = (spDailyShop[dk]??0) + 1
  return c.json({ ok: true })
})

// 관리자 통계 (일별 7일 + 샵별)
app.get('/api/admin/stats', (c) => {
  const stats = shops.map(s => ({
    id: s.id, name: s.name, category: s.category,
    featured: s.featured,
    views:    viewCnt[s.id]??0,
    spClicks: spCnt[s.id]??0,
  })).sort((a,b) => b.spClicks - a.spClicks)

  // 최근 7일 일별 예약클릭
  const days: { date:string; total:number; byShop:Record<number,number> }[] = []
  for (let i=6; i>=0; i--) {
    const d = new Date(); d.setDate(d.getDate()-i)
    const ds = d.toISOString().slice(0,10)
    const byShop: Record<number,number> = {}
    shops.forEach(s => {
      const v = spDailyShop[`${ds}::${s.id}`]??0
      if (v>0) byShop[s.id] = v
    })
    days.push({ date:ds, total:spDaily[ds]??0, byShop })
  }

  return c.json({
    stats,
    days,
    totalViews:  Object.values(viewCnt).reduce((a,b)=>a+b,0),
    totalSP:     Object.values(spCnt).reduce((a,b)=>a+b,0),
    totalShops:  shops.length,
  })
})

// 샵 추가 (관리자)
app.post('/api/admin/shop', async (c) => {
  const body = await c.req.json() as Partial<Shop>
  const shop: Shop = {
    id:           nextId++,
    name:         body.name        ?? '새 샵',
    category:     body.category    ?? '피부관리',
    tags:         body.tags        ?? [],
    price:        body.price       ?? '',
    address:      body.address     ?? '',
    district:     body.district    ?? '',
    lat:          body.lat         ?? 37.5326,
    lng:          body.lng         ?? 127.0246,
    smartPlaceUrl:body.smartPlaceUrl ?? '#',
    youtubeId:    body.youtubeId   ?? '',
    featured:     body.featured    ?? false,
    thumbnail:    body.thumbnail   ?? 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  }
  shops.push(shop)
  return c.json({ ok:true, shop })
})

// 샵 수정 (관리자)
app.put('/api/admin/shop/:id', async (c) => {
  const id   = +c.req.param('id')
  const body = await c.req.json() as Partial<Shop>
  const idx  = shops.findIndex(s => s.id === id)
  if (idx < 0) return c.json({ ok:false }, 404)
  shops[idx] = { ...shops[idx], ...body, id }
  return c.json({ ok:true, shop: shops[idx] })
})

// 샵 삭제 (관리자)
app.delete('/api/admin/shop/:id', (c) => {
  const id  = +c.req.param('id')
  const idx = shops.findIndex(s => s.id === id)
  if (idx < 0) return c.json({ ok:false }, 404)
  shops.splice(idx, 1)
  return c.json({ ok:true })
})

// favicon
app.get('/favicon.ico', (c) => faviconRes())
app.get('/favicon.svg', (c) => faviconRes())
function faviconRes(){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#FF4D7D"/><text x="16" y="23" font-size="18" text-anchor="middle" font-family="serif">💄</text></svg>`
  return new Response(svg,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'public,max-age=86400'}})
}

app.get('/admin', (c) => c.html(adminPage()))
app.get('/',      (c) => c.html(mainPage()))

// ══════════════════════════════════════════════════════════════════════════
// 메인 페이지
// ══════════════════════════════════════════════════════════════════════════
const NAVER_CLIENT_ID = 'xjjg4490h8'

function catEmoji(cat:string){ return ({
  '피부관리':'✨','네일아트':'💅','헤어':'💇','왁싱':'🌸',
  '마사지':'💆','반영구':'👁','병원':'🏥'
} as any)[cat] ?? '🏠' }

function mainPage(){ return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>마이뷰티맵</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_CLIENT_ID}"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D;--pink2:#FF8FA3;
  --green:#03C75A;--green2:#02a84e;
  --bg:#0a0a0a;
  --hd:50px; --cat:44px; --nav:60px;
  --safe:env(safe-area-inset-bottom,0px);
}
html,body{height:100%;background:var(--bg);color:#fff;font-family:'Pretendard',-apple-system,sans-serif;overflow:hidden}

/* ━━ 헤더 ━━ */
.hd{position:fixed;top:0;left:0;right:0;z-index:300;height:var(--hd);
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:space-between;padding:0 16px}
.logo{font-size:19px;font-weight:800;letter-spacing:-.3px;display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;-webkit-user-select:none}
.logo-icon{width:28px;height:28px;background:var(--pink);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;transition:transform .15s}
.logo-icon.pop{transform:scale(1.25)}
.logo em{color:var(--pink);font-style:normal}
.hd-badge{font-size:10px;font-weight:700;background:rgba(255,77,125,.15);color:var(--pink);padding:3px 8px;border-radius:8px;border:1px solid rgba(255,77,125,.25)}

/* ━━ 비밀번호 오버레이 ━━ */
.pw-overlay{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.85);backdrop-filter:blur(16px);display:none;align-items:center;justify-content:center;flex-direction:column;gap:20px}
.pw-overlay.on{display:flex}
.pw-title{font-size:18px;font-weight:800;color:#fff;margin-bottom:4px}
.pw-sub{font-size:13px;color:rgba(255,255,255,.4)}
.pw-dots{display:flex;gap:12px;margin:16px 0 4px}
.pw-dot{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.3);background:transparent;transition:all .2s}
.pw-dot.fill{background:var(--pink);border-color:var(--pink)}
.pw-keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:240px}
.pw-key{height:58px;border-radius:16px;border:1.5px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);
  font-size:22px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;transition:all .15s}
.pw-key:active{background:rgba(255,77,125,.25);border-color:var(--pink)}
.pw-key.del{font-size:16px;color:rgba(255,255,255,.5)}
.pw-err{font-size:13px;color:var(--pink);height:20px;margin-top:4px}

/* ━━ 카탈로그 탭바 ━━ */
.cat-bar{position:fixed;top:var(--hd);left:0;right:0;z-index:299;height:var(--cat);
  background:rgba(10,10,10,.93);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06);display:none}
.cat-bar.show{display:block}
.cat-scroll{display:flex;align-items:center;gap:6px;overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none}
.cat-scroll::-webkit-scrollbar{display:none}
.cp{flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:20px;
  padding:5px 14px;font-size:12px;font-weight:600;
  background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);
  cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
.cp.active{background:var(--pink);border-color:var(--pink);color:#fff;box-shadow:0 2px 10px rgba(255,77,125,.35)}

/* ━━ 피드 화면 ━━ */
#feedScreen{position:fixed;top:calc(var(--hd)+var(--cat));left:0;right:0;bottom:var(--nav);
  overflow-y:scroll;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;
  scrollbar-width:none;display:none}
#feedScreen.active{display:block}
#feedScreen::-webkit-scrollbar{display:none}

/* ━━ 지도 화면 ━━ */
#mapScreen{position:fixed;top:var(--hd);left:0;right:0;bottom:var(--nav);display:none;flex-direction:column}
#mapScreen.active{display:flex}

/* ━━ 하단 탭바 ━━ */
.tabbar{position:fixed;bottom:0;left:0;right:0;z-index:300;height:var(--nav);
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-top:1px solid rgba(255,255,255,.08);display:flex;padding-bottom:var(--safe)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  cursor:pointer;border:none;background:none;font-family:inherit;transition:color .2s;padding-top:4px}
.tab i{font-size:22px;transition:transform .2s}
.tab.active{color:#fff}
.tab.active i{color:var(--pink);transform:scale(1.1)}

/* ━━ 피드 아이템 ━━ */
.fi{height:calc(100dvh - var(--hd) - var(--cat) - var(--nav));position:relative;
  scroll-snap-align:start;scroll-snap-stop:always;background:#000;display:flex;flex-direction:column;overflow:hidden}
.yt-area{flex:1;position:relative;overflow:hidden;background:#000}
.yt-frame{position:absolute;inset:0;width:100%;height:100%;border:none}
.shop-bar{flex-shrink:0;background:linear-gradient(to bottom,rgba(10,10,10,0) 0%,rgba(10,10,10,1) 100%);
  padding:18px 14px 14px;display:flex;align-items:flex-end;gap:10px;position:relative}
.shop-bar::before{content:'';position:absolute;top:-40px;left:0;right:0;height:40px;
  background:linear-gradient(to bottom,transparent,rgba(10,10,10,.8));pointer-events:none}
.shop-bar-info{flex:1;min-width:0}
.shop-bar-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px;letter-spacing:.3px}
.shop-bar-name{font-size:17px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:4px;text-shadow:0 1px 4px rgba(0,0,0,.5)}
.shop-bar-loc{display:flex;align-items:center;gap:4px;font-size:11px;color:rgba(255,255,255,.55);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.shop-bar-loc i{color:var(--green);font-size:10px;flex-shrink:0}
.btn-book{flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:10px 14px;font-size:12px;font-weight:800;text-decoration:none;font-family:inherit;
  cursor:pointer;white-space:nowrap;box-shadow:0 4px 16px rgba(3,199,90,.4);min-width:64px}
.btn-book i{font-size:16px}
.btn-book span{font-size:10px;font-weight:700}
.btn-book:active{background:var(--green2);transform:scale(.96)}
.feed-spin{height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a}
.spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);border-top-color:var(--pink);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.feed-empty{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:rgba(255,255,255,.25);scroll-snap-align:start;background:#0a0a0a}
.feed-empty i{font-size:48px}

/* ━━ 지도 영역 ━━ */
.map-top{flex-shrink:0;padding:8px 12px;background:rgba(10,10,10,.97);border-bottom:1px solid rgba(255,255,255,.07)}
.map-cats{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.map-cats::-webkit-scrollbar{display:none}
.mc{flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:18px;padding:6px 13px;
  font-size:11px;font-weight:600;background:transparent;color:rgba(255,255,255,.5);
  cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
.mc.active{background:var(--pink);border-color:var(--pink);color:#fff;box-shadow:0 2px 10px rgba(255,77,125,.3)}
.map-area{flex:1;position:relative;overflow:hidden}
#naverMap{width:100%;height:100%}

/* 내 주변 FAB */
.nearby-fab{position:absolute;bottom:16px;right:12px;z-index:50;
  background:rgba(10,10,10,.92);backdrop-filter:blur(8px);
  border:1.5px solid rgba(255,255,255,.18);border-radius:22px;
  padding:9px 15px;display:flex;align-items:center;gap:6px;
  font-size:12px;font-weight:700;color:#fff;cursor:pointer;
  box-shadow:0 2px 14px rgba(0,0,0,.6);font-family:inherit;transition:all .2s}
.nearby-fab i{color:var(--pink);font-size:13px}
.nearby-fab.on{background:var(--pink);border-color:var(--pink)}
.nearby-fab.on i{color:#fff}

/* 하단 샵 패널 */
.shop-panel{flex-shrink:0;background:rgba(10,10,10,.98);border-top:1px solid rgba(255,255,255,.07);
  height:196px;display:flex;align-items:center;gap:10px;
  padding:12px 14px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}
.shop-panel::-webkit-scrollbar{display:none}
.spc{flex-shrink:0;width:148px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);
  border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color .2s,transform .15s;
  height:170px;display:flex;flex-direction:column}
.spc:active{transform:scale(.96)}
.spc.sel{border-color:var(--pink);box-shadow:0 0 0 1px var(--pink)}
.spc-img{width:100%;height:86px;object-fit:cover;display:block;flex-shrink:0}
.spc-body{padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between}
.spc-cat{font-size:9px;font-weight:700;color:var(--pink);margin-bottom:2px;letter-spacing:.4px}
.spc-name{font-size:12px;font-weight:700;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spc-dist{font-size:10px;color:rgba(255,255,255,.35);margin-top:2px;display:flex;align-items:center;gap:3px}
.spc-dist i{font-size:9px;color:var(--green)}
.spc-price{font-size:10px;font-weight:600;color:var(--pink2);margin-top:2px}

/* ━━ 네이버 지도 마커 ━━ */
.nv-marker{display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative}
.nv-pin{background:var(--pink);color:#fff;font-size:11px;font-weight:800;
  font-family:'Pretendard',-apple-system,sans-serif;
  padding:5px 10px;border-radius:20px;white-space:nowrap;
  box-shadow:0 3px 10px rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.4);
  max-width:100px;overflow:hidden;text-overflow:ellipsis;transition:all .2s}
.nv-pin.cat-nail{background:#A855F7}
.nv-pin.cat-hair{background:#F59E0B}
.nv-pin.cat-wax{background:#EC4899}
.nv-pin.cat-massage{background:#06B6D4}
.nv-pin.cat-perm{background:#8B5CF6}
.nv-pin.cat-hospital{background:#EF4444}
.nv-pin.sel{background:#fff!important;color:var(--pink)!important;transform:scale(1.15);box-shadow:0 4px 16px rgba(255,255,255,.4)}
.nv-tail{width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
  border-top:8px solid var(--pink);margin-top:-1px}
.nv-tail.cat-nail{border-top-color:#A855F7}
.nv-tail.cat-hair{border-top-color:#F59E0B}
.nv-tail.cat-wax{border-top-color:#EC4899}
.nv-tail.cat-massage{border-top-color:#06B6D4}
.nv-tail.cat-perm{border-top-color:#8B5CF6}
.nv-tail.cat-hospital{border-top-color:#EF4444}

/* ━━ 바텀시트 ━━ */
.dim{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:400;pointer-events:none;transition:background .3s}
.dim.on{background:rgba(0,0,0,.6);pointer-events:auto}
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:401;background:#141414;border-radius:24px 24px 0 0;
  transform:translateY(100%);transition:transform .38s cubic-bezier(.32,1,.23,1);
  max-height:85vh;display:flex;flex-direction:column;padding-bottom:calc(20px+var(--safe));
  box-shadow:0 -4px 30px rgba(0,0,0,.5)}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:38px;height:4px;background:rgba(255,255,255,.1);border-radius:4px;margin:14px auto 0;flex-shrink:0}
.sheet-img{width:calc(100% - 28px);height:175px;object-fit:cover;border-radius:16px;margin:14px 14px 0;flex-shrink:0;box-shadow:0 4px 20px rgba(0,0,0,.4)}
.sheet-body{padding:16px 18px 0;overflow-y:auto;flex:1}
.s-cat{display:inline-block;font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 8px;border-radius:6px;margin-bottom:6px;letter-spacing:.3px}
.s-name{font-size:22px;font-weight:800;margin-bottom:6px;line-height:1.2}
.s-addr{font-size:12px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:5px;margin-bottom:10px}
.s-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}
.s-tag{font-size:11px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.6);padding:4px 10px;border-radius:9px;font-weight:500}
.s-price{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:18px}
.s-price span{color:var(--pink2);font-size:18px;font-weight:800}
.s-actions{display:flex;gap:10px}
.s-book{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:15px;font-size:15px;font-weight:800;text-decoration:none;font-family:inherit;cursor:pointer;
  box-shadow:0 4px 16px rgba(3,199,90,.35);transition:background .2s}
.s-book:active{background:var(--green2)}
.s-map-btn{flex-shrink:0;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:15px 16px;cursor:pointer;font-size:18px;color:rgba(255,255,255,.6)}
.s-map-btn:active{background:rgba(255,255,255,.12)}

/* ━━ 토스트 ━━ */
.toast{position:fixed;bottom:calc(var(--nav)+12px);left:50%;transform:translateX(-50%) translateY(8px);
  background:rgba(20,20,20,.97);color:#fff;border:1px solid rgba(255,255,255,.1);
  padding:10px 20px;border-radius:22px;font-size:13px;font-weight:600;
  z-index:600;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>

<!-- 헤더 -->
<header class="hd">
  <div class="logo" id="logoBtn">
    <div class="logo-icon" id="logoIcon">💄</div>
    마이<em>뷰티</em>맵
  </div>
  <span class="hd-badge">BETA</span>
</header>

<!-- 비밀번호 오버레이 -->
<div class="pw-overlay" id="pwOverlay">
  <div class="pw-title">🔐 관리자 인증</div>
  <div class="pw-sub">4자리 비밀번호를 입력하세요</div>
  <div class="pw-dots">
    <div class="pw-dot" id="d0"></div>
    <div class="pw-dot" id="d1"></div>
    <div class="pw-dot" id="d2"></div>
    <div class="pw-dot" id="d3"></div>
  </div>
  <div class="pw-err" id="pwErr"></div>
  <div class="pw-keypad">
    ${[1,2,3,4,5,6,7,8,9,'','0','⌫'].map((k,i)=>
      k==='' ? `<div></div>` :
      k==='⌫' ? `<button class="pw-key del" onclick="pwDel()">⌫</button>` :
      `<button class="pw-key" onclick="pwInput('${k}')">${k}</button>`
    ).join('')}
  </div>
  <button onclick="closePw()" style="margin-top:16px;background:none;border:none;color:rgba(255,255,255,.3);font-size:13px;cursor:pointer;font-family:inherit">취소</button>
</div>

<!-- 카탈로그 탭바 -->
<div class="cat-bar show" id="catBar">
  <div class="cat-scroll">
    <button class="cp active" onclick="filterFeed(this,'all')">🏠 전체</button>
    <button class="cp" onclick="filterFeed(this,'피부관리')">✨ 피부관리</button>
    <button class="cp" onclick="filterFeed(this,'네일아트')">💅 네일아트</button>
    <button class="cp" onclick="filterFeed(this,'헤어')">💇 헤어</button>
    <button class="cp" onclick="filterFeed(this,'왁싱')">🌸 왁싱</button>
    <button class="cp" onclick="filterFeed(this,'마사지')">💆 마사지</button>
    <button class="cp" onclick="filterFeed(this,'반영구')">👁 반영구</button>
    <button class="cp" onclick="filterFeed(this,'병원')">🏥 병원</button>
  </div>
</div>

<!-- 피드 화면 -->
<main id="feedScreen" class="active">
  <div class="feed-spin"><div class="spinner"></div></div>
</main>

<!-- 지도 화면 -->
<section id="mapScreen">
  <div class="map-top">
    <div class="map-cats">
      <button class="mc active" onclick="filterMap(this,'all')">🏠 전체</button>
      <button class="mc" onclick="filterMap(this,'피부관리')">✨ 피부관리</button>
      <button class="mc" onclick="filterMap(this,'네일아트')">💅 네일아트</button>
      <button class="mc" onclick="filterMap(this,'헤어')">💇 헤어</button>
      <button class="mc" onclick="filterMap(this,'왁싱')">🌸 왁싱</button>
      <button class="mc" onclick="filterMap(this,'마사지')">💆 마사지</button>
      <button class="mc" onclick="filterMap(this,'반영구')">👁 반영구</button>
      <button class="mc" onclick="filterMap(this,'병원')">🏥 병원</button>
    </div>
  </div>
  <div class="map-area">
    <div id="naverMap"></div>
    <button class="nearby-fab" id="nearbyFab" onclick="toggleNearby()">
      <i class="fas fa-location-arrow"></i> 내 주변
    </button>
  </div>
  <div class="shop-panel" id="shopPanel"></div>
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

<!-- 딤 + 바텀시트 -->
<div class="dim" id="dim" onclick="closeSheet()"></div>
<div class="sheet" id="sheet">
  <div class="sheet-handle"></div>
  <img class="sheet-img" id="sImg" src="" alt=""/>
  <div class="sheet-body">
    <div class="s-cat" id="sCat"></div>
    <div class="s-name" id="sName"></div>
    <div class="s-addr"><i class="fas fa-map-pin" style="color:var(--green)"></i><span id="sAddr"></span></div>
    <div class="s-tags" id="sTags"></div>
    <div class="s-price">시술 <span id="sPrice"></span></div>
    <div class="s-actions">
      <a class="s-book" id="sBook" href="#" target="_blank" rel="noopener" onclick="trackSP()">
        <i class="fas fa-calendar-check"></i> 네이버 예약하기
      </a>
      <button class="s-map-btn" onclick="focusShopOnMap()">
        <i class="fas fa-map-marked-alt"></i>
      </button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>

<script>
// ── 전역 ──────────────────────────────────────────────────────────────────
let allShops=[], mapCat='all', nearbyOn=false;
let userLat=null, userLng=null, curShop=null;
let naverMap=null, mapInited=false;
let nvMarkers={};  // id -> naver Marker
let userMarker=null;

// 카테고리 → 마커 CSS 클래스
const CAT_CLS={'피부관리':'','네일아트':'cat-nail','헤어':'cat-hair',
  '왁싱':'cat-wax','마사지':'cat-massage','반영구':'cat-perm','병원':'cat-hospital'};

// ── 로고 3초내 2번 더블클릭 → 비밀번호 ──────────────────────────────────
let logoClicks=[], PW='0907', pwBuf='';
document.getElementById('logoBtn').addEventListener('click', ()=>{
  const now=Date.now();
  logoClicks=logoClicks.filter(t=>now-t<3000);
  logoClicks.push(now);
  const icon=document.getElementById('logoIcon');
  icon.classList.add('pop'); setTimeout(()=>icon.classList.remove('pop'),200);
  if(logoClicks.length>=2){ logoClicks=[]; openPw(); }
});

function openPw(){
  pwBuf=''; updateDots(); document.getElementById('pwErr').textContent='';
  document.getElementById('pwOverlay').classList.add('on');
}
function closePw(){ document.getElementById('pwOverlay').classList.remove('on'); pwBuf=''; }
function pwInput(k){
  if(pwBuf.length>=4) return;
  pwBuf+=k; updateDots();
  if(pwBuf.length===4){
    if(pwBuf===PW){ closePw(); setTimeout(()=>location.href='/admin',200); }
    else{
      document.getElementById('pwErr').textContent='비밀번호가 틀렸어요';
      setTimeout(()=>{ pwBuf=''; updateDots(); document.getElementById('pwErr').textContent=''; },900);
    }
  }
}
function pwDel(){ if(pwBuf.length>0){ pwBuf=pwBuf.slice(0,-1); updateDots(); } }
function updateDots(){
  for(let i=0;i<4;i++) document.getElementById('d'+i).classList.toggle('fill',i<pwBuf.length);
}

// ── 탭 전환 ───────────────────────────────────────────────────────────────
function switchTab(tab){
  ['feed','map'].forEach(t=>{
    document.getElementById('tab-'+t).classList.toggle('active',t===tab);
    document.getElementById(t+'Screen').classList.toggle('active',t===tab);
  });
  document.getElementById('catBar').classList.toggle('show',tab==='feed');
  if(tab==='map'){
    if(!mapInited){ initNaverMap(); mapInited=true; }
    else setTimeout(()=>{ if(naverMap) naver.maps.Event.trigger(naverMap,'resize'); },150);
  }
}

// ━━ 피드 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function loadFeed(cat='all'){
  const sc=document.getElementById('feedScreen');
  sc.innerHTML='<div class="feed-spin"><div class="spinner"></div></div>';
  const res=await fetch('/api/shops?category='+encodeURIComponent(cat==='all'?'':cat));
  const list=await res.json();
  if(!list.length){ sc.innerHTML='<div class="feed-empty"><i class="fas fa-store-slash"></i><p>등록된 샵이 없어요</p></div>'; return; }
  sc.innerHTML=list.map((s,i)=>\`
    <div class="fi">
      <div class="yt-area">
        <iframe class="yt-frame"
          src="https://www.youtube.com/embed/\${s.youtubeId}?autoplay=\${i===0?1:0}&mute=1&playsinline=1&rel=0&modestbranding=1&controls=1&loop=1&playlist=\${s.youtubeId}"
          allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="shop-bar">
        <div class="shop-bar-info">
          <div class="shop-bar-cat">\${s.category}</div>
          <div class="shop-bar-name">\${s.name}</div>
          <div class="shop-bar-loc"><i class="fas fa-map-marker-alt"></i><span>\${s.district} · \${s.price}</span></div>
        </div>
        <a class="btn-book" href="\${s.smartPlaceUrl}" target="_blank" rel="noopener"
           onclick="fetch('/api/track/sp/\${s.id}',{method:'POST'})">
          <i class="fas fa-calendar-check"></i><span>예약하기</span>
        </a>
      </div>
    </div>\`).join('');
  sc.scrollTo(0,0);
}

function filterFeed(btn,cat){
  document.querySelectorAll('.cp').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  loadFeed(cat);
}

// ━━ 네이버 지도 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function initNaverMap(){
  naverMap=new naver.maps.Map('naverMap',{
    center: new naver.maps.LatLng(37.5326,127.0246),
    zoom: 12,
    mapTypeId: naver.maps.MapTypeId.NORMAL,
    scaleControl: false,
    mapDataControl: false,
  });
  const res=await fetch('/api/shops/all');
  allShops=await res.json();
  renderNaverMarkers(allShops);
  renderPanel(allShops);
  naver.maps.Event.addListener(naverMap,'click',()=>closeSheet());
}

function getCatCls(cat){ return CAT_CLS[cat]||''; }

function makeNaverMarker(shop, sel=false){
  const cc=getCatCls(shop.category);
  const el=document.createElement('div');
  el.innerHTML=\`<div class="nv-marker">
    <div class="nv-pin \${cc}\${sel?' sel':''}"\${shop.featured?' style="box-shadow:0 0 0 2px #fff,0 4px 12px rgba(0,0,0,.5)"':''}>
      \${shop.name}
    </div>
    <div class="nv-tail \${cc}"></div>
  </div>\`;
  return new naver.maps.Marker({
    position: new naver.maps.LatLng(shop.lat, shop.lng),
    map: naverMap,
    icon: { content: el, anchor: new naver.maps.Point(45,40) },
    zIndex: shop.featured ? 10 : 1,
  });
}

function renderNaverMarkers(list){
  Object.values(nvMarkers).forEach(m=>m.setMap(null));
  nvMarkers={};
  list.forEach(shop=>{
    const m=makeNaverMarker(shop,false);
    naver.maps.Event.addListener(m,'click',()=>selectShopOnMap(shop.id));
    nvMarkers[shop.id]=m;
  });
}

function selectShopOnMap(id){
  const shop=allShops.find(s=>s.id===id); if(!shop) return;
  // 마커 강조
  Object.entries(nvMarkers).forEach(([sid,m])=>{
    const s=allShops.find(x=>x.id===+sid); if(!s) return;
    const cc=getCatCls(s.category), sel=+sid===id;
    const el=document.createElement('div');
    el.innerHTML=\`<div class="nv-marker">
      <div class="nv-pin \${cc}\${sel?' sel':''}"\${s.featured?' style="box-shadow:0 0 0 2px #fff,0 4px 12px rgba(0,0,0,.5)"':''}>
        \${s.name}
      </div>
      <div class="nv-tail \${cc}"></div>
    </div>\`;
    m.setIcon({content:el, anchor:new naver.maps.Point(45,40)});
    if(sel) m.setZIndex(999);
  });
  naverMap.panTo(new naver.maps.LatLng(shop.lat,shop.lng));
  // 패널 카드
  document.querySelectorAll('.spc').forEach(c=>c.classList.remove('sel'));
  const el=document.getElementById('spc-'+id);
  if(el){ el.classList.add('sel'); el.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}); }
  openSheet(id);
}

function focusShopOnMap(){
  if(!curShop) return;
  closeSheet(); switchTab('map');
  setTimeout(()=>{ if(naverMap){ naverMap.morph(new naver.maps.LatLng(curShop.lat,curShop.lng),16); selectShopOnMap(curShop.id); } },300);
}

async function loadMapShops(cat='all',nearby=false){
  let url='/api/shops?category='+encodeURIComponent(cat==='all'?'':cat);
  if(nearby&&userLat) url+='&nearby=1&lat='+userLat+'&lng='+userLng;
  const res=await fetch(url);
  allShops=await res.json();
  renderNaverMarkers(allShops);
  renderPanel(allShops);
}

function renderPanel(list){
  const panel=document.getElementById('shopPanel');
  if(!list.length){ panel.innerHTML='<div style="color:rgba(255,255,255,.2);font-size:13px;font-weight:600;padding:16px;white-space:nowrap">주변 샵이 없어요 🥲</div>'; return; }
  panel.innerHTML=list.map(s=>{
    const dist=s.dist!=null?(s.dist<1?Math.round(s.dist*1000)+'m':s.dist.toFixed(1)+'km'):'';
    return \`<div class="spc" id="spc-\${s.id}" onclick="selectShopOnMap(\${s.id})">
      <img class="spc-img" src="\${s.thumbnail}" alt="\${s.name}" loading="lazy"/>
      <div class="spc-body">
        <div><div class="spc-cat">\${s.category}</div><div class="spc-name">\${s.name}</div></div>
        <div>\${dist?'<div class="spc-dist"><i class="fas fa-location-arrow"></i>'+dist+'</div>':''}<div class="spc-price">\${s.price}</div></div>
      </div></div>\`;
  }).join('');
}

function filterMap(btn,cat){
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); mapCat=cat;
  loadMapShops(cat,nearbyOn);
}

// 내 주변
function toggleNearby(){
  const fab=document.getElementById('nearbyFab');
  if(nearbyOn){
    nearbyOn=false; userLat=null; userLng=null;
    fab.classList.remove('on'); fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변';
    if(userMarker){ userMarker.setMap(null); userMarker=null; }
    loadMapShops(mapCat,false); return;
  }
  if(!navigator.geolocation){ showToast('위치 서비스를 지원하지 않아요'); return; }
  showToast('📍 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat=pos.coords.latitude; userLng=pos.coords.longitude; nearbyOn=true;
    fab.classList.add('on'); fab.innerHTML='<i class="fas fa-location-arrow"></i> 내 주변 ON';
    if(userMarker) userMarker.setMap(null);
    userMarker=new naver.maps.Marker({
      position:new naver.maps.LatLng(userLat,userLng), map:naverMap,
      icon:{content:'<div style="width:16px;height:16px;border-radius:50%;background:#FF4D7D;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>',
        anchor:new naver.maps.Point(8,8)}
    });
    naverMap.morph(new naver.maps.LatLng(userLat,userLng),14);
    loadMapShops(mapCat,true); showToast('📍 내 주변 샵을 찾았어요!');
  },()=>showToast('위치 권한이 필요해요'),{timeout:8000,enableHighAccuracy:true});
}

// ── 바텀시트 ─────────────────────────────────────────────────────────────
function openSheet(id){
  const s=allShops.find(x=>x.id===id); if(!s) return;
  curShop=s; fetch('/api/track/view/'+id,{method:'POST'});
  document.getElementById('sImg').src=s.thumbnail;
  document.getElementById('sCat').textContent=s.category;
  document.getElementById('sName').textContent=s.name;
  document.getElementById('sAddr').textContent=s.address;
  document.getElementById('sPrice').textContent=s.price;
  document.getElementById('sTags').innerHTML=s.tags.map(t=>\`<span class="s-tag">\${t}</span>\`).join('');
  document.getElementById('sBook').href=s.smartPlaceUrl;
  document.getElementById('dim').classList.add('on');
  document.getElementById('sheet').classList.add('open');
}
function closeSheet(){
  document.getElementById('dim').classList.remove('on');
  document.getElementById('sheet').classList.remove('open');
  document.querySelectorAll('.spc').forEach(c=>c.classList.remove('sel'));
  // 마커 선택 해제
  Object.entries(nvMarkers).forEach(([sid,m])=>{
    const s=allShops.find(x=>x.id===+sid); if(!s) return;
    const cc=getCatCls(s.category);
    const el=document.createElement('div');
    el.innerHTML=\`<div class="nv-marker"><div class="nv-pin \${cc}">\${s.name}</div><div class="nv-tail \${cc}"></div></div>\`;
    m.setIcon({content:el,anchor:new naver.maps.Point(45,40)}); m.setZIndex(s.featured?10:1);
  });
}
function trackSP(){ if(curShop) fetch('/api/track/sp/'+curShop.id,{method:'POST'}); }
let tsY=0;
const sh=document.getElementById('sheet');
sh.addEventListener('touchstart',e=>{tsY=e.touches[0].clientY},{passive:true});
sh.addEventListener('touchend',e=>{if(e.changedTouches[0].clientY-tsY>70)closeSheet()},{passive:true});

// ── 토스트 ───────────────────────────────────────────────────────────────
let toastTmr;
function showToast(msg){
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTmr); toastTmr=setTimeout(()=>t.classList.remove('show'),2600);
}

// ── 초기 실행 ─────────────────────────────────────────────────────────────
loadFeed('all');
</script>
</body>
</html>`
}

// ══════════════════════════════════════════════════════════════════════════
// 관리자 페이지
// ══════════════════════════════════════════════════════════════════════════
function adminPage(){ return `<!DOCTYPE html>
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

/* ── 상단바 ── */
.top{background:rgba(18,18,18,.98);border-bottom:1px solid rgba(255,255,255,.07);
  padding:0 16px;height:56px;display:flex;align-items:center;gap:12px;
  position:sticky;top:0;z-index:100;backdrop-filter:blur(14px)}
.back{font-size:20px;color:rgba(255,255,255,.6);text-decoration:none;transition:color .2s}
.back:hover{color:#fff}
.ttl{font-size:17px;font-weight:800;flex:1}
.top-tabs{display:flex;gap:4px}
.ttab{padding:6px 14px;border-radius:10px;border:none;background:transparent;
  color:rgba(255,255,255,.4);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s}
.ttab.on{background:rgba(255,77,125,.15);color:var(--pink);border:1px solid rgba(255,77,125,.25)}

/* ── 공통 레이아웃 ── */
.wrap{max-width:600px;margin:0 auto;padding:20px 16px 80px}
.section{display:none}.section.on{display:block}
.sec-title{font-size:11px;font-weight:800;color:rgba(255,255,255,.28);
  text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px}

/* ── 통계 카드 ── */
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}
.stat-card{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:16px;padding:16px;text-align:center}
.stat-num{font-size:26px;font-weight:800;color:#FF8FA3}
.stat-lbl{font-size:10px;color:rgba(255,255,255,.3);margin-top:5px;font-weight:600}

/* ── 일별 그래프 ── */
.chart-wrap{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:16px;padding:16px;margin-bottom:20px}
.chart-title{font-size:13px;font-weight:700;margin-bottom:14px;color:rgba(255,255,255,.8)}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:80px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bar{width:100%;background:var(--pink);border-radius:4px 4px 0 0;min-height:2px;transition:height .4s}
.bar-lbl{font-size:9px;color:rgba(255,255,255,.3);white-space:nowrap}
.bar-val{font-size:10px;font-weight:700;color:rgba(255,255,255,.6)}

/* ── 샵별 통계 ── */
.stat-row{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:14px;padding:14px;margin-bottom:8px}
.stat-rt{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.stat-rn{font-size:14px;font-weight:700;flex:1}
.stat-rc{font-size:10px;background:rgba(255,77,125,.12);color:#FF8FA3;
  padding:2px 8px;border-radius:10px;font-weight:700;border:1px solid rgba(255,77,125,.2)}
.stat-cells{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat-cell{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
  border-radius:12px;padding:12px;text-align:center}
.stat-bn{font-size:22px;font-weight:800}
.stat-bl{font-size:10px;color:rgba(255,255,255,.3);margin-top:3px;font-weight:600}

/* ── 샵/영상 관리 ── */
.add-btn{width:100%;padding:14px;border:2px dashed rgba(255,77,125,.3);border-radius:16px;
  background:rgba(255,77,125,.05);color:var(--pink);font-size:14px;font-weight:700;
  cursor:pointer;font-family:inherit;transition:all .2s;margin-bottom:16px}
.add-btn:hover{border-color:var(--pink);background:rgba(255,77,125,.1)}

.shop-card{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);
  border-radius:16px;overflow:hidden;margin-bottom:10px;display:flex;gap:0}
.shop-card-img{width:80px;height:80px;object-fit:cover;flex-shrink:0}
.shop-card-body{flex:1;padding:10px 12px;min-width:0}
.shop-card-top{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.shop-card-name{font-size:14px;font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.shop-card-cat{font-size:10px;background:rgba(255,77,125,.12);color:#FF8FA3;
  padding:1px 7px;border-radius:8px;font-weight:700;flex-shrink:0}
.shop-card-addr{font-size:11px;color:rgba(255,255,255,.4);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.shop-card-btns{display:flex;gap:6px}
.card-btn{padding:5px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.06);color:rgba(255,255,255,.6);font-size:11px;
  font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}
.card-btn.del{border-color:rgba(239,68,68,.3);color:#EF4444;background:rgba(239,68,68,.06)}
.card-btn:hover{background:rgba(255,255,255,.12)}
.card-btn.del:hover{background:rgba(239,68,68,.15)}
.feat-badge{font-size:9px;background:rgba(255,200,0,.15);color:#FFD700;
  padding:1px 6px;border-radius:6px;font-weight:700;border:1px solid rgba(255,200,0,.25)}

/* ── 모달 ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:none;
  align-items:flex-end;justify-content:center;backdrop-filter:blur(6px)}
.modal-bg.on{display:flex}
.modal{background:#161616;border-radius:24px 24px 0 0;width:100%;max-width:600px;
  max-height:92vh;overflow-y:auto;padding:20px 20px 40px;
  box-shadow:0 -4px 30px rgba(0,0,0,.5)}
.modal-title{font-size:18px;font-weight:800;margin-bottom:20px;display:flex;align-items:center;gap:8px}
.form-group{margin-bottom:14px}
.form-label{font-size:12px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:6px;display:block;letter-spacing:.3px}
.form-input,.form-select,.form-textarea{width:100%;background:rgba(255,255,255,.06);
  border:1.5px solid rgba(255,255,255,.1);border-radius:12px;
  color:#fff;font-family:inherit;font-size:14px;padding:11px 14px;outline:none;
  transition:border-color .2s}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--pink)}
.form-select{cursor:pointer}
.form-select option{background:#1a1a1a}
.form-textarea{resize:vertical;min-height:70px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-check{display:flex;align-items:center;gap:8px;cursor:pointer}
.form-check input{width:18px;height:18px;accent-color:var(--pink);cursor:pointer}
.form-check span{font-size:13px;font-weight:600}
.modal-btns{display:flex;gap:10px;margin-top:20px}
.btn-save{flex:1;padding:14px;background:var(--green);color:#fff;border:none;
  border-radius:14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}
.btn-save:hover{background:#02a84e}
.btn-cancel{padding:14px 20px;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.6);border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}
</style>
</head>
<body>
<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">마이뷰티맵 관리</span>
  <div class="top-tabs">
    <button class="ttab on" onclick="showSec('stats')">통계</button>
    <button class="ttab" onclick="showSec('shops')">업체</button>
  </div>
</div>

<div class="wrap">
  <!-- 통계 섹션 -->
  <div class="section on" id="sec-stats">
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-num" id="tv">-</div><div class="stat-lbl">👁 총 조회</div></div>
      <div class="stat-card"><div class="stat-num" id="ts">-</div><div class="stat-lbl">📅 예약클릭</div></div>
      <div class="stat-card"><div class="stat-num" id="tc">-</div><div class="stat-lbl">💄 등록 샵</div></div>
    </div>

    <!-- 일별 예약클릭 차트 -->
    <div class="chart-wrap">
      <div class="chart-title">📊 최근 7일 예약하기 클릭</div>
      <div class="bar-chart" id="barChart"></div>
    </div>

    <div class="sec-title">샵별 예약하기 클릭 통계</div>
    <div id="statRows"></div>
  </div>

  <!-- 업체 관리 섹션 -->
  <div class="section" id="sec-shops">
    <button class="add-btn" onclick="openModal()">
      <i class="fas fa-plus"></i> 새 업체 추가하기
    </button>
    <div class="sec-title">등록된 업체</div>
    <div id="shopList"></div>
  </div>
</div>

<!-- 업체 추가/수정 모달 -->
<div class="modal-bg" id="modalBg">
  <div class="modal">
    <div class="modal-title"><i class="fas fa-store"></i> <span id="modalTtl">업체 추가</span></div>
    <input type="hidden" id="editId"/>
    <div class="form-group">
      <label class="form-label">업체명 *</label>
      <input class="form-input" id="fName" placeholder="예) 글로우 스킨 강남"/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">카테고리 *</label>
        <select class="form-select" id="fCat">
          ${CATEGORIES.map(c=>`<option value="${c}">${catEmoji(c)} ${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">가격대</label>
        <input class="form-input" id="fPrice" placeholder="예) 5만원~"/>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">주소 *</label>
      <input class="form-input" id="fAddr" placeholder="서울 강남구 논현로 123"/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">구/동</label>
        <input class="form-input" id="fDistrict" placeholder="강남구"/>
      </div>
      <div class="form-group">
        <label class="form-label">태그 (쉼표 구분)</label>
        <input class="form-input" id="fTags" placeholder="리프팅,보습,트러블케어"/>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">위도 (lat)</label>
        <input class="form-input" id="fLat" placeholder="37.5172" type="number" step="0.0001"/>
      </div>
      <div class="form-group">
        <label class="form-label">경도 (lng)</label>
        <input class="form-input" id="fLng" placeholder="127.0473" type="number" step="0.0001"/>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">유튜브 영상 ID</label>
      <input class="form-input" id="fYtId" placeholder="mldig2ZiRwA"/>
    </div>
    <div class="form-group">
      <label class="form-label">네이버 예약 URL</label>
      <input class="form-input" id="fSpUrl" placeholder="https://naver.me/..."/>
    </div>
    <div class="form-group">
      <label class="form-label">썸네일 이미지 URL</label>
      <input class="form-input" id="fThumb" placeholder="https://..."/>
    </div>
    <div class="form-group">
      <label class="form-check">
        <input type="checkbox" id="fFeatured"/>
        <span>⭐ 추천 업체 (상단 노출)</span>
      </label>
    </div>
    <div class="modal-btns">
      <button class="btn-cancel" onclick="closeModal()">취소</button>
      <button class="btn-save" onclick="saveShop()"><i class="fas fa-check"></i> 저장하기</button>
    </div>
  </div>
</div>

<script>
const CATS=['피부관리','네일아트','헤어','왁싱','마사지','반영구','병원'];
let statsData=null, shopData=[];

// ── 섹션 전환 ─────────────────────────────────────────────────────────────
function showSec(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.ttab').forEach(b=>b.classList.remove('on'));
  document.getElementById('sec-'+id).classList.add('on');
  document.querySelectorAll('.ttab')[id==='stats'?0:1].classList.add('on');
  if(id==='stats') loadStats();
  else loadShops();
}

// ── 통계 로드 ─────────────────────────────────────────────────────────────
async function loadStats(){
  const d=await(await fetch('/api/admin/stats')).json();
  statsData=d;
  document.getElementById('tv').textContent=d.totalViews.toLocaleString();
  document.getElementById('ts').textContent=d.totalSP.toLocaleString();
  document.getElementById('tc').textContent=d.totalShops;

  // 일별 차트
  const max=Math.max(...d.days.map(x=>x.total),1);
  document.getElementById('barChart').innerHTML=d.days.map(day=>{
    const h=Math.max(Math.round((day.total/max)*76),day.total>0?4:2);
    const dt=day.date.slice(5); // MM-DD
    return \`<div class="bar-col">
      <div class="bar-val">\${day.total||''}</div>
      <div class="bar" style="height:\${h}px"></div>
      <div class="bar-lbl">\${dt}</div>
    </div>\`;
  }).join('');

  // 샵별 통계 (예약클릭 기준 정렬)
  document.getElementById('statRows').innerHTML=d.stats.map(s=>{
    // 오늘 예약클릭
    const today=d.days[d.days.length-1];
    const todayCnt=today?.byShop?.[s.id]??0;
    return \`<div class="stat-row">
      <div class="stat-rt">
        <div class="stat-rn">\${s.name}</div>
        <span class="stat-rc">\${s.category}</span>
        \${s.featured?'<span style="font-size:10px;color:#FFD700">⭐</span>':''}
      </div>
      <div class="stat-cells">
        <div class="stat-cell">
          <div class="stat-bn">\${s.spClicks.toLocaleString()}</div>
          <div class="stat-bl">📅 예약클릭 (전체)</div>
        </div>
        <div class="stat-cell">
          <div class="stat-bn" style="color:#FF8FA3">\${todayCnt}</div>
          <div class="stat-bl">📅 오늘 예약클릭</div>
        </div>
      </div>
    </div>\`;
  }).join('');
}

// ── 업체 관리 ─────────────────────────────────────────────────────────────
async function loadShops(){
  const res=await fetch('/api/shops/all');
  shopData=await res.json();
  document.getElementById('shopList').innerHTML=shopData.map(s=>\`
    <div class="shop-card">
      <img class="shop-card-img" src="\${s.thumbnail}" alt="\${s.name}" loading="lazy"/>
      <div class="shop-card-body">
        <div class="shop-card-top">
          <div class="shop-card-name">\${s.name}</div>
          <span class="shop-card-cat">\${s.category}</span>
          \${s.featured?'<span class="feat-badge">추천</span>':''}
        </div>
        <div class="shop-card-addr"><i class="fas fa-map-marker-alt" style="color:#03C75A;font-size:10px"></i> \${s.address}</div>
        <div class="shop-card-btns">
          <button class="card-btn" onclick="openModal(\${s.id})"><i class="fas fa-edit"></i> 수정</button>
          <button class="card-btn del" onclick="deleteShop(\${s.id},'\${s.name.replace(/'/g,\\"\\\\'\\")}')"><i class="fas fa-trash"></i> 삭제</button>
        </div>
      </div>
    </div>\`).join('');
}

// ── 모달 열기/닫기 ────────────────────────────────────────────────────────
function openModal(id){
  document.getElementById('editId').value=id||'';
  document.getElementById('modalTtl').textContent=id?'업체 수정':'업체 추가';
  // 초기화
  ['fName','fPrice','fAddr','fDistrict','fTags','fYtId','fSpUrl','fThumb'].forEach(f=>document.getElementById(f).value='');
  document.getElementById('fLat').value='37.5326';
  document.getElementById('fLng').value='127.0246';
  document.getElementById('fCat').value='피부관리';
  document.getElementById('fFeatured').checked=false;

  if(id){
    const s=shopData.find(x=>x.id===id); if(!s) return;
    document.getElementById('fName').value=s.name;
    document.getElementById('fCat').value=s.category;
    document.getElementById('fPrice').value=s.price;
    document.getElementById('fAddr').value=s.address;
    document.getElementById('fDistrict').value=s.district;
    document.getElementById('fTags').value=s.tags.join(',');
    document.getElementById('fLat').value=s.lat;
    document.getElementById('fLng').value=s.lng;
    document.getElementById('fYtId').value=s.youtubeId;
    document.getElementById('fSpUrl').value=s.smartPlaceUrl;
    document.getElementById('fThumb').value=s.thumbnail;
    document.getElementById('fFeatured').checked=s.featured;
  }
  document.getElementById('modalBg').classList.add('on');
}
function closeModal(){ document.getElementById('modalBg').classList.remove('on'); }
document.getElementById('modalBg').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeModal(); });

async function saveShop(){
  const id=document.getElementById('editId').value;
  const body={
    name:    document.getElementById('fName').value.trim(),
    category:document.getElementById('fCat').value,
    price:   document.getElementById('fPrice').value.trim(),
    address: document.getElementById('fAddr').value.trim(),
    district:document.getElementById('fDistrict').value.trim(),
    tags:    document.getElementById('fTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    lat:     parseFloat(document.getElementById('fLat').value)||37.5326,
    lng:     parseFloat(document.getElementById('fLng').value)||127.0246,
    youtubeId:    document.getElementById('fYtId').value.trim(),
    smartPlaceUrl:document.getElementById('fSpUrl').value.trim()||'#',
    thumbnail:    document.getElementById('fThumb').value.trim()||'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    featured: document.getElementById('fFeatured').checked,
  };
  if(!body.name){ alert('업체명을 입력하세요'); return; }
  if(!body.address){ alert('주소를 입력하세요'); return; }
  const url=id?'/api/admin/shop/'+id:'/api/admin/shop';
  const method=id?'PUT':'POST';
  const res=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json();
  if(data.ok){ closeModal(); loadShops(); }
  else alert('저장에 실패했어요');
}

async function deleteShop(id,name){
  if(!confirm(\`"\${name}" 을(를) 삭제할까요?\`)) return;
  const res=await fetch('/api/admin/shop/'+id,{method:'DELETE'});
  const data=await res.json();
  if(data.ok) loadShops();
  else alert('삭제에 실패했어요');
}

// ── 초기 로드 ─────────────────────────────────────────────────────────────
loadStats();
setInterval(()=>{ if(document.getElementById('sec-stats').classList.contains('on')) loadStats(); },30000);
</script>
</body>
</html>`
}

export default app
