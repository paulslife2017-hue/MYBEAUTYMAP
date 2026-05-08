import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()
app.use('/static/*', serveStatic({ root: './public' }))

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

const shops: Shop[] = [
  {
    id: 1, name: '글로우 스킨 강남', category: '피부관리',
    tags: ['리프팅', '보습', '트러블케어'], price: '5만원~',
    address: '서울 강남구 논현로 123', district: '강남구',
    lat: 37.5172, lng: 127.0473,
    smartPlaceUrl: 'https://naver.me/example1',
    youtubeId: 'mldig2ZiRwA', featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  },
  {
    id: 2, name: '뷰티랩 홍대', category: '네일아트',
    tags: ['젤네일', '네일아트', '케어'], price: '3만원~',
    address: '서울 마포구 와우산로 45', district: '마포구',
    lat: 37.5563, lng: 126.9236,
    smartPlaceUrl: 'https://naver.me/example2',
    youtubeId: 'mldig2ZiRwA', featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  },
  {
    id: 3, name: '헤어스튜디오 한남', category: '헤어',
    tags: ['염색', '펌', '커트'], price: '6만원~',
    address: '서울 용산구 한남대로 77', district: '용산구',
    lat: 37.5340, lng: 127.0026,
    smartPlaceUrl: 'https://naver.me/example3',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
  },
  {
    id: 4, name: '라온 왁싱샵', category: '왁싱',
    tags: ['전신왁싱', '브라질리언', '눈썹'], price: '2만원~',
    address: '서울 서초구 방배로 55', district: '서초구',
    lat: 37.4836, lng: 126.9822,
    smartPlaceUrl: 'https://naver.me/example4',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80',
  },
  {
    id: 5, name: '퍼펙트 눈썹 신촌', category: '반영구',
    tags: ['눈썹문신', '아이라인', '입술'], price: '15만원~',
    address: '서울 서대문구 신촌로 88', district: '서대문구',
    lat: 37.5596, lng: 126.9368,
    smartPlaceUrl: 'https://naver.me/example5',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  },
  {
    id: 6, name: '리프트업 에스테틱', category: '피부관리',
    tags: ['리프팅', '주름개선', '탄력'], price: '8만원~',
    address: '서울 강남구 청담로 12', district: '강남구',
    lat: 37.5247, lng: 127.0392,
    smartPlaceUrl: 'https://naver.me/example6',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80',
  },
  {
    id: 7, name: '핑크네일 성수', category: '네일아트',
    tags: ['젤네일', '케어', '풋케어'], price: '2.5만원~',
    address: '서울 성동구 성수일로 30', district: '성동구',
    lat: 37.5446, lng: 127.0557,
    smartPlaceUrl: 'https://naver.me/example7',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  },
  {
    id: 8, name: '살롱드 뷰티 이태원', category: '헤어',
    tags: ['탈색', '매직', '커트'], price: '7만원~',
    address: '서울 용산구 이태원로 200', district: '용산구',
    lat: 37.5348, lng: 126.9947,
    smartPlaceUrl: 'https://naver.me/example8',
    youtubeId: 'mldig2ZiRwA', featured: false,
    thumbnail: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80',
  },
]

const viewCnt: Record<number,number> = {}
const spCnt:   Record<number,number> = {}

function calcDist(la1:number,lo1:number,la2:number,lo2:number){
  const R=6371,dL=(la2-la1)*Math.PI/180,dO=(lo2-lo1)*Math.PI/180
  const a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dO/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

app.get('/api/shops',(c)=>{
  const cat=c.req.query('category')??''
  const q=(c.req.query('q')??'').toLowerCase()
  const lat=parseFloat(c.req.query('lat')??(''as string))
  const lng=parseFloat(c.req.query('lng')??(''as string))
  const nearby=c.req.query('nearby')==='1'
  let list=[...shops]
  if(cat&&cat!=='all') list=list.filter(s=>s.category===cat)
  if(q) list=list.filter(s=>s.name.toLowerCase().includes(q)||s.tags.some(t=>t.includes(q))||s.district.includes(q))
  if(nearby&&!isNaN(lat)&&!isNaN(lng)){
    list=list.map(s=>({...s,dist:calcDist(lat,lng,s.lat,s.lng)})).filter((s:any)=>s.dist<=20).sort((a:any,b:any)=>a.dist-b.dist)
  } else {
    list=[...list.filter(s=>s.featured),...list.filter(s=>!s.featured)]
  }
  return c.json(list.map(s=>({...s,views:viewCnt[s.id]??0})))
})

app.post('/api/track/view/:id',(c)=>{const id=+c.req.param('id');viewCnt[id]=(viewCnt[id]??0)+1;return c.json({ok:true})})
app.post('/api/track/sp/:id',  (c)=>{const id=+c.req.param('id');spCnt[id]  =(spCnt[id]  ??0)+1;return c.json({ok:true})})
app.get('/api/admin/stats',(c)=>{
  const stats=shops.map(s=>({id:s.id,name:s.name,category:s.category,featured:s.featured,views:viewCnt[s.id]??0,spClicks:spCnt[s.id]??0})).sort((a,b)=>b.views-a.views)
  return c.json({stats,totalViews:Object.values(viewCnt).reduce((a,b)=>a+b,0),totalSP:Object.values(spCnt).reduce((a,b)=>a+b,0)})
})

// shops JSON for client-side map
app.get('/api/shops/all', (c) => {
  return c.json(shops.map(s=>({...s, views: viewCnt[s.id]??0})))
})

app.get('/favicon.ico', (c)=> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="#FF4D7D"/>
  <text x="16" y="23" font-size="18" text-anchor="middle" font-family="serif">💄</text>
</svg>`
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400' } })
})
app.get('/favicon.svg', (c)=> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="#FF4D7D"/>
  <text x="16" y="23" font-size="18" text-anchor="middle" font-family="serif">💄</text>
</svg>`
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public,max-age=86400' } })
})
app.get('/admin',(c)=>c.html(adminPage()))
app.get('/',    (c)=>c.html(mainPage()))

// ══════════════════════════════════════════════════════════════════════════
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
<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF4D7D;--pink2:#FF8FA3;
  --green:#03C75A;--green2:#02a84e;
  --bg:#0a0a0a;
  --hd:50px;
  --cat:44px;
  --nav:60px;
  --safe:env(safe-area-inset-bottom,0px);
}
html,body{height:100%;background:var(--bg);color:#fff;font-family:'Pretendard',-apple-system,sans-serif;overflow:hidden}

/* ━━ 헤더 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.hd{
  position:fixed;top:0;left:0;right:0;z-index:300;height:var(--hd);
  background:rgba(10,10,10,.97);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 16px;
}
.logo{font-size:19px;font-weight:800;letter-spacing:-.3px;display:flex;align-items:center;gap:6px}
.logo-icon{width:28px;height:28px;background:var(--pink);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px}
.logo em{color:var(--pink);font-style:normal}
.hd-right{display:flex;align-items:center;gap:8px}
.hd-badge{font-size:10px;font-weight:700;background:rgba(255,77,125,.15);color:var(--pink);padding:3px 8px;border-radius:8px;border:1px solid rgba(255,77,125,.25)}

/* ━━ 카탈로그 탭바 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.cat-bar{
  position:fixed;top:var(--hd);left:0;right:0;z-index:299;
  height:var(--cat);
  background:rgba(10,10,10,.93);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06);
  display:none;
}
.cat-bar.show{display:block}
.cat-scroll{
  display:flex;align-items:center;gap:6px;
  overflow-x:auto;padding:6px 12px;height:100%;scrollbar-width:none;
}
.cat-scroll::-webkit-scrollbar{display:none}
.cp{
  flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:20px;
  padding:5px 14px;font-size:12px;font-weight:600;
  background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);
  cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap;
}
.cp.active{background:var(--pink);border-color:var(--pink);color:#fff;box-shadow:0 2px 10px rgba(255,77,125,.35)}

/* ━━ 피드 화면 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
#feedScreen{
  position:fixed;
  top:calc(var(--hd) + var(--cat));
  left:0;right:0;
  bottom:var(--nav);
  overflow-y:scroll;scroll-snap-type:y mandatory;
  -webkit-overflow-scrolling:touch;scrollbar-width:none;
  display:none;
}
#feedScreen.active{display:block}
#feedScreen::-webkit-scrollbar{display:none}

/* ━━ 지도 화면 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
#mapScreen{
  position:fixed;
  top:var(--hd);left:0;right:0;bottom:var(--nav);
  display:none;flex-direction:column;
}
#mapScreen.active{display:flex}

/* ━━ 하단 탭바 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.tabbar{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  height:var(--nav);
  background:rgba(10,10,10,.98);backdrop-filter:blur(20px);
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;
  padding-bottom:var(--safe);
}
.tab{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;font-size:10px;font-weight:700;color:rgba(255,255,255,.28);
  cursor:pointer;border:none;background:none;font-family:inherit;
  transition:color .2s;padding-top:4px;
}
.tab i{font-size:22px;transition:transform .2s}
.tab.active{color:#fff}
.tab.active i{color:var(--pink);transform:scale(1.1)}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   피드 아이템
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.fi{
  height:calc(100dvh - var(--hd) - var(--cat) - var(--nav));
  position:relative;
  scroll-snap-align:start;scroll-snap-stop:always;
  background:#000;
  display:flex;flex-direction:column;
  overflow:hidden;
}
.yt-area{flex:1;position:relative;overflow:hidden;background:#000}
.yt-frame{position:absolute;inset:0;width:100%;height:100%;border:none}

/* 업체 정보 바 */
.shop-bar{
  flex-shrink:0;
  background:linear-gradient(to bottom, rgba(10,10,10,.0) 0%, rgba(10,10,10,1) 100%);
  padding:18px 14px 14px;
  display:flex;align-items:flex-end;gap:10px;
  position:relative;
}
.shop-bar::before{
  content:'';position:absolute;top:-40px;left:0;right:0;height:40px;
  background:linear-gradient(to bottom, transparent, rgba(10,10,10,.8));
  pointer-events:none;
}
.shop-bar-info{flex:1;min-width:0}
.shop-bar-cat{
  display:inline-block;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 7px;border-radius:6px;margin-bottom:5px;letter-spacing:.3px;
}
.shop-bar-name{
  font-size:17px;font-weight:800;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:4px;text-shadow:0 1px 4px rgba(0,0,0,.5);
}
.shop-bar-loc{
  display:flex;align-items:center;gap:4px;
  font-size:11px;color:rgba(255,255,255,.55);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.shop-bar-loc i{color:var(--green);font-size:10px;flex-shrink:0}
.shop-bar-price{
  font-size:12px;font-weight:700;color:var(--pink2);margin-top:4px;
}
.btn-book{
  flex-shrink:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:10px 14px;font-size:12px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  white-space:nowrap;box-shadow:0 4px 16px rgba(3,199,90,.4);
  min-width:64px;
}
.btn-book i{font-size:16px}
.btn-book span{font-size:10px;font-weight:700}
.btn-book:active{background:var(--green2);transform:scale(.96)}

/* 로딩 / 빈상태 */
.feed-spin{height:100%;display:flex;align-items:center;justify-content:center;background:#0a0a0a}
.spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);border-top-color:var(--pink);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.feed-empty{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:rgba(255,255,255,.25);scroll-snap-align:start;background:#0a0a0a}
.feed-empty i{font-size:48px}
.feed-empty p{font-size:14px;font-weight:600}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   지도 화면
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.map-top{
  flex-shrink:0;padding:8px 12px 8px;
  background:rgba(10,10,10,.97);
  border-bottom:1px solid rgba(255,255,255,.07);
}
.map-cats{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.map-cats::-webkit-scrollbar{display:none}
.mc{flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);border-radius:18px;padding:6px 13px;font-size:11px;font-weight:600;background:transparent;color:rgba(255,255,255,.5);cursor:pointer;font-family:inherit;transition:all .2s;white-space:nowrap}
.mc.active{background:var(--pink);border-color:var(--pink);color:#fff;box-shadow:0 2px 10px rgba(255,77,125,.3)}

/* Leaflet 지도 */
.map-area{flex:1;position:relative;overflow:hidden}
#leafletMap{width:100%;height:100%}

/* 지도 다크 오버레이 필터 */
.map-area .leaflet-tile{filter:brightness(.9) saturate(.8) hue-rotate(200deg) invert(1) grayscale(.2) contrast(1.1)}

/* 내 주변 FAB */
.nearby-fab{
  position:absolute;bottom:16px;right:12px;z-index:500;
  background:rgba(10,10,10,.92);backdrop-filter:blur(8px);
  border:1.5px solid rgba(255,255,255,.18);border-radius:22px;
  padding:9px 15px;display:flex;align-items:center;gap:6px;
  font-size:12px;font-weight:700;color:#fff;cursor:pointer;
  box-shadow:0 2px 14px rgba(0,0,0,.6);font-family:inherit;
  transition:all .2s;
}
.nearby-fab i{color:var(--pink);font-size:13px;transition:color .2s}
.nearby-fab.on{background:var(--pink);border-color:var(--pink);box-shadow:0 4px 16px rgba(255,77,125,.4)}
.nearby-fab.on i{color:#fff}

/* 하단 샵 패널 */
.shop-panel{
  flex-shrink:0;
  background:rgba(10,10,10,.98);
  border-top:1px solid rgba(255,255,255,.07);
  height:200px;
  display:flex;align-items:center;gap:10px;
  padding:12px 14px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;
}
.shop-panel::-webkit-scrollbar{display:none}

/* 샵 카드 */
.spc{
  flex-shrink:0;width:148px;
  background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);
  border-radius:16px;overflow:hidden;cursor:pointer;
  transition:border-color .2s,transform .15s,box-shadow .2s;
  height:172px;display:flex;flex-direction:column;
}
.spc:active{transform:scale(.96)}
.spc.sel{border-color:var(--pink);box-shadow:0 0 0 1px var(--pink)}
.spc-img{width:100%;height:88px;object-fit:cover;display:block;flex-shrink:0}
.spc-body{padding:8px 10px;flex:1;display:flex;flex-direction:column;justify-content:space-between}
.spc-cat{font-size:9px;font-weight:700;color:var(--pink);text-transform:uppercase;margin-bottom:2px;letter-spacing:.4px}
.spc-name{font-size:12px;font-weight:700;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spc-dist{font-size:10px;color:rgba(255,255,255,.35);margin-top:3px;display:flex;align-items:center;gap:3px}
.spc-dist i{font-size:9px;color:var(--green)}
.spc-price{font-size:10px;font-weight:600;color:var(--pink2);margin-top:2px}

/* ━━ Leaflet 마커 커스텀 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.custom-marker{
  display:flex;flex-direction:column;align-items:center;
  cursor:pointer;
}
.marker-pin{
  background:var(--pink);color:#fff;
  font-size:10px;font-weight:800;font-family:'Pretendard',-apple-system,sans-serif;
  padding:4px 8px;border-radius:20px;
  white-space:nowrap;
  box-shadow:0 2px 8px rgba(255,77,125,.5);
  border:1.5px solid rgba(255,255,255,.3);
  transition:all .2s;
  max-width:90px;overflow:hidden;text-overflow:ellipsis;
}
.marker-pin.cat-nail{background:#A855F7}
.marker-pin.cat-hair{background:#F59E0B}
.marker-pin.cat-wax{background:#EC4899}
.marker-pin.cat-perm{background:#06B6D4}
.marker-pin.sel{background:#fff;color:var(--pink);box-shadow:0 2px 12px rgba(255,255,255,.4);transform:scale(1.15)}
.marker-tail{
  width:0;height:0;
  border-left:5px solid transparent;border-right:5px solid transparent;
  border-top:7px solid var(--pink);
  margin-top:-1px;
}
.marker-tail.cat-nail{border-top-color:#A855F7}
.marker-tail.cat-hair{border-top-color:#F59E0B}
.marker-tail.cat-wax{border-top-color:#EC4899}
.marker-tail.cat-perm{border-top-color:#06B6D4}

/* Leaflet 팝업 숨김 */
.leaflet-popup{display:none!important}
.leaflet-control-attribution{display:none!important}
.leaflet-control-zoom{border:none!important;margin:10px 10px 0 0!important}
.leaflet-control-zoom a{
  background:rgba(10,10,10,.9)!important;backdrop-filter:blur(8px)!important;
  color:#fff!important;border:1px solid rgba(255,255,255,.15)!important;
  width:32px!important;height:32px!important;line-height:32px!important;
  font-size:18px!important;
}
.leaflet-control-zoom a:hover{background:rgba(40,40,40,.95)!important}

/* ━━ 바텀시트 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.dim{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:400;pointer-events:none;transition:background .3s}
.dim.on{background:rgba(0,0,0,.6);pointer-events:auto}
.sheet{
  position:fixed;bottom:0;left:0;right:0;z-index:401;
  background:#141414;border-radius:24px 24px 0 0;
  transform:translateY(100%);transition:transform .38s cubic-bezier(.32,1,.23,1);
  max-height:85vh;display:flex;flex-direction:column;
  padding-bottom:calc(20px + var(--safe));
  box-shadow:0 -4px 30px rgba(0,0,0,.5);
}
.sheet.open{transform:translateY(0)}
.sheet-handle{width:38px;height:4px;background:rgba(255,255,255,.1);border-radius:4px;margin:14px auto 0;flex-shrink:0}
.sheet-img{
  width:calc(100% - 28px);height:180px;object-fit:cover;
  border-radius:16px;margin:14px 14px 0;flex-shrink:0;
  box-shadow:0 4px 20px rgba(0,0,0,.4);
}
.sheet-body{padding:16px 18px 0;overflow-y:auto;flex:1}
.s-cat{
  display:inline-block;
  font-size:10px;font-weight:700;color:var(--pink);
  background:rgba(255,77,125,.12);border:1px solid rgba(255,77,125,.25);
  padding:2px 8px;border-radius:6px;margin-bottom:6px;letter-spacing:.3px;
}
.s-name{font-size:22px;font-weight:800;margin-bottom:6px;line-height:1.2}
.s-addr{font-size:12px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:5px;margin-bottom:10px}
.s-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}
.s-tag{font-size:11px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.6);padding:4px 10px;border-radius:9px;font-weight:500}
.s-price{font-size:13px;color:rgba(255,255,255,.6);margin-bottom:18px}
.s-price span{color:var(--pink2);font-size:18px;font-weight:800}
.s-actions{display:flex;gap:10px}
.s-book{
  flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
  background:var(--green);color:#fff;border:none;border-radius:14px;
  padding:15px;font-size:15px;font-weight:800;
  text-decoration:none;font-family:inherit;cursor:pointer;
  box-shadow:0 4px 16px rgba(3,199,90,.35);transition:background .2s;
}
.s-book:active{background:var(--green2)}
.s-map-btn{
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.12);
  border-radius:14px;padding:15px 16px;cursor:pointer;
  font-size:18px;color:rgba(255,255,255,.6);transition:all .2s;
}
.s-map-btn:active{background:rgba(255,255,255,.12)}

/* ━━ 토스트 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.toast{
  position:fixed;bottom:calc(var(--nav) + 12px);left:50%;transform:translateX(-50%) translateY(8px);
  background:rgba(20,20,20,.97);color:#fff;border:1px solid rgba(255,255,255,.1);
  padding:10px 20px;border-radius:22px;font-size:13px;font-weight:600;
  z-index:600;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;white-space:nowrap;
  box-shadow:0 4px 20px rgba(0,0,0,.4);
}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>

<!-- 헤더 -->
<header class="hd">
  <div class="logo">
    <div class="logo-icon">💄</div>
    마이<em>뷰티</em>맵
  </div>
  <div class="hd-right">
    <span class="hd-badge">BETA</span>
  </div>
</header>

<!-- 카탈로그 탭바 (피드 전용) -->
<div class="cat-bar show" id="catBar">
  <div class="cat-scroll">
    <button class="cp active" onclick="filterFeed(this,'all')">🏠 전체</button>
    <button class="cp" onclick="filterFeed(this,'피부관리')">✨ 피부관리</button>
    <button class="cp" onclick="filterFeed(this,'네일아트')">💅 네일아트</button>
    <button class="cp" onclick="filterFeed(this,'헤어')">💇 헤어</button>
    <button class="cp" onclick="filterFeed(this,'왁싱')">🌸 왁싱</button>
    <button class="cp" onclick="filterFeed(this,'반영구')">👁 반영구</button>
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
      <button class="mc" onclick="filterMap(this,'반영구')">👁 반영구</button>
    </div>
  </div>
  <div class="map-area">
    <div id="leafletMap"></div>
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

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
// ── 전역 상태 ─────────────────────────────────────────────────────────────
let allShops   = [];
let feedCat    = 'all';
let mapCat     = 'all';
let nearbyOn   = false;
let userLat    = null;
let userLng    = null;
let curShop    = null;
let leafletMap = null;
let mapInited  = false;
let markers    = {};   // id -> leaflet marker
let userMarker = null;

// 카테고리별 마커 색상 클래스
const catClass = {
  '피부관리': '',
  '네일아트': 'cat-nail',
  '헤어':    'cat-hair',
  '왁싱':    'cat-wax',
  '반영구':  'cat-perm',
};

// ── 탭 전환 ───────────────────────────────────────────────────────────────
function switchTab(tab) {
  ['feed','map'].forEach(t => {
    document.getElementById('tab-'+t).classList.toggle('active', t===tab);
    document.getElementById(t+'Screen').classList.toggle('active', t===tab);
  });
  document.getElementById('catBar').classList.toggle('show', tab==='feed');

  if (tab==='map') {
    if (!mapInited) {
      initLeafletMap();
      mapInited = true;
    } else {
      // 지도 크기 갱신 (display:none 상태에서 초기화된 경우)
      setTimeout(()=>{ if(leafletMap) leafletMap.invalidateSize(); }, 100);
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 피드 (유튜브 영상 + 업체 정보 바)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function loadFeed(cat='all') {
  const screen = document.getElementById('feedScreen');
  screen.innerHTML = '<div class="feed-spin"><div class="spinner"></div></div>';

  const res = await fetch('/api/shops?category='+encodeURIComponent(cat==='all'?'':cat));
  const shops = await res.json();

  if (!shops.length) {
    screen.innerHTML = '<div class="feed-empty"><i class="fas fa-store-slash"></i><p>등록된 샵이 없어요</p></div>';
    return;
  }

  screen.innerHTML = shops.map((s,i) => \`
    <div class="fi">
      <div class="yt-area">
        <iframe class="yt-frame"
          src="https://www.youtube.com/embed/\${s.youtubeId}?autoplay=\${i===0?1:0}&mute=1&playsinline=1&rel=0&modestbranding=1&controls=1&loop=1&playlist=\${s.youtubeId}"
          allow="autoplay;encrypted-media;picture-in-picture"
          allowfullscreen loading="lazy">
        </iframe>
      </div>
      <div class="shop-bar">
        <div class="shop-bar-info">
          <div class="shop-bar-cat">\${s.category}</div>
          <div class="shop-bar-name">\${s.name}</div>
          <div class="shop-bar-loc">
            <i class="fas fa-map-marker-alt"></i>
            <span>\${s.district} · \${s.price}</span>
          </div>
        </div>
        <a class="btn-book" href="\${s.smartPlaceUrl}" target="_blank" rel="noopener"
           onclick="fetch('/api/track/sp/\${s.id}',{method:'POST'})">
          <i class="fas fa-calendar-check"></i>
          <span>예약하기</span>
        </a>
      </div>
    </div>
  \`).join('');

  screen.scrollTo(0,0);
}

function filterFeed(btn, cat) {
  document.querySelectorAll('.cp').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  feedCat = cat;
  loadFeed(cat);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Leaflet 지도 + 커스텀 마커
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function initLeafletMap() {
  // 서울 중심 초기화
  leafletMap = L.map('leafletMap', {
    center: [37.5326, 127.0246],
    zoom: 12,
    zoomControl: true,
    attributionControl: false,
  });

  // 다크 타일 레이어 (Carto Dark)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(leafletMap);

  // 줌 컨트롤 우측 상단
  leafletMap.zoomControl.setPosition('topright');

  // 전체 샵 데이터 로드 후 마커 생성
  const res = await fetch('/api/shops/all');
  allShops = await res.json();
  renderMapMarkers(allShops);
  renderPanel(allShops);

  // 지도 클릭으로 시트 닫기
  leafletMap.on('click', ()=>{ closeSheet(); });

  // 지도 준비 후 크기 갱신
  setTimeout(()=>leafletMap.invalidateSize(), 200);
}

function getCatClass(cat) {
  return catClass[cat] || '';
}

function createMarkerIcon(shop, selected=false) {
  const cc = getCatClass(shop.category);
  const selCls = selected ? ' sel' : '';
  const html = \`
    <div class="custom-marker">
      <div class="marker-pin \${cc}\${selCls}">\${shop.name}</div>
      <div class="marker-tail \${cc}"></div>
    </div>
  \`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [90, 38],
    iconAnchor: [45, 38],
  });
}

function renderMapMarkers(shops) {
  // 기존 마커 제거
  Object.values(markers).forEach(m => m.remove());
  markers = {};

  shops.forEach(shop => {
    const marker = L.marker([shop.lat, shop.lng], {
      icon: createMarkerIcon(shop, false),
      zIndexOffset: shop.featured ? 100 : 0,
    }).addTo(leafletMap);

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      selectShopOnMap(shop.id);
    });

    markers[shop.id] = marker;
  });
}

function selectShopOnMap(id) {
  const shop = allShops.find(s => s.id === id);
  if (!shop) return;

  // 마커 상태 업데이트
  Object.entries(markers).forEach(([sid, m]) => {
    const s = allShops.find(x => x.id === +sid);
    if (s) m.setIcon(createMarkerIcon(s, +sid === id));
  });

  // 지도 중심 이동
  leafletMap.panTo([shop.lat, shop.lng], { animate: true, duration: 0.5 });

  // 패널 카드 하이라이트
  document.querySelectorAll('.spc').forEach(c => c.classList.remove('sel'));
  const el = document.getElementById('spc-'+id);
  if (el) {
    el.classList.add('sel');
    el.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }

  openSheet(id);
}

function focusShopOnMap() {
  if (!curShop) return;
  closeSheet();
  switchTab('map');
  setTimeout(() => {
    if (leafletMap) {
      leafletMap.flyTo([curShop.lat, curShop.lng], 15, { duration: 1 });
      selectShopOnMap(curShop.id);
    }
  }, 300);
}

async function loadMapShops(cat='all', nearby=false) {
  let url = '/api/shops?category='+encodeURIComponent(cat==='all'?'':cat);
  if (nearby && userLat) url += '&nearby=1&lat='+userLat+'&lng='+userLng;
  const res = await fetch(url);
  allShops = await res.json();
  renderMapMarkers(allShops);
  renderPanel(allShops);
}

function renderPanel(shops) {
  const panel = document.getElementById('shopPanel');
  if (!shops.length) {
    panel.innerHTML = '<div style="color:rgba(255,255,255,.2);font-size:13px;font-weight:600;padding:16px;white-space:nowrap">주변 샵이 없어요 🥲</div>';
    return;
  }
  panel.innerHTML = shops.map(s => {
    const dist = s.dist != null
      ? (s.dist < 1 ? Math.round(s.dist*1000)+'m' : s.dist.toFixed(1)+'km')
      : '';
    return \`<div class="spc" id="spc-\${s.id}" onclick="selectShopOnMap(\${s.id})">
      <img class="spc-img" src="\${s.thumbnail}" alt="\${s.name}" loading="lazy"/>
      <div class="spc-body">
        <div>
          <div class="spc-cat">\${s.category}</div>
          <div class="spc-name">\${s.name}</div>
        </div>
        <div>
          \${dist ? '<div class="spc-dist"><i class="fas fa-location-arrow"></i>'+dist+'</div>' : ''}
          <div class="spc-price">\${s.price}</div>
        </div>
      </div>
    </div>\`;
  }).join('');
}

// 카테고리 필터 (지도)
function filterMap(btn, cat) {
  document.querySelectorAll('.mc').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  mapCat = cat;
  loadMapShops(cat, nearbyOn);
}

// 내 주변
function toggleNearby() {
  const fab = document.getElementById('nearbyFab');
  if (nearbyOn) {
    nearbyOn = false;
    userLat = null; userLng = null;
    fab.classList.remove('on');
    fab.innerHTML = '<i class="fas fa-location-arrow"></i> 내 주변';
    if (userMarker) { userMarker.remove(); userMarker = null; }
    loadMapShops(mapCat, false);
    return;
  }
  if (!navigator.geolocation) {
    showToast('위치 서비스를 지원하지 않는 브라우저예요');
    return;
  }
  showToast('📍 위치 확인 중...');
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      nearbyOn = true;
      fab.classList.add('on');
      fab.innerHTML = '<i class="fas fa-location-arrow"></i> 내 주변 ON';
      // 현재 위치 마커
      if (userMarker) userMarker.remove();
      userMarker = L.circleMarker([userLat, userLng], {
        radius: 9, fillColor:'#FF4D7D', fillOpacity:1,
        color:'#fff', weight:2.5, opacity:1
      }).addTo(leafletMap);
      leafletMap.flyTo([userLat, userLng], 14, { duration: 1 });
      loadMapShops(mapCat, true);
      showToast('📍 내 주변 샵을 찾았어요!');
    },
    () => {
      showToast('위치 권한이 필요해요. 브라우저 설정에서 허용해주세요');
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

// ── 바텀시트 ─────────────────────────────────────────────────────────────
function openSheet(id) {
  const s = allShops.find(x => x.id === id);
  if (!s) return;
  curShop = s;
  fetch('/api/track/view/'+id, { method:'POST' });

  document.getElementById('sImg').src  = s.thumbnail;
  document.getElementById('sCat').textContent   = s.category;
  document.getElementById('sName').textContent  = s.name;
  document.getElementById('sAddr').textContent  = s.address;
  document.getElementById('sPrice').textContent = s.price;
  document.getElementById('sTags').innerHTML    = s.tags.map(t=>\`<span class="s-tag">\${t}</span>\`).join('');
  document.getElementById('sBook').href         = s.smartPlaceUrl;

  document.getElementById('dim').classList.add('on');
  document.getElementById('sheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('dim').classList.remove('on');
  document.getElementById('sheet').classList.remove('open');
  // 마커 선택 해제
  Object.entries(markers).forEach(([sid, m]) => {
    const s = allShops.find(x => x.id === +sid);
    if (s) m.setIcon(createMarkerIcon(s, false));
  });
  document.querySelectorAll('.spc').forEach(c => c.classList.remove('sel'));
}

function trackSP() {
  if (curShop) fetch('/api/track/sp/'+curShop.id, { method:'POST' });
}

// 스와이프 다운으로 시트 닫기
let tsY = 0;
const sh = document.getElementById('sheet');
sh.addEventListener('touchstart', e => { tsY = e.touches[0].clientY; }, { passive:true });
sh.addEventListener('touchend',   e => { if (e.changedTouches[0].clientY - tsY > 70) closeSheet(); }, { passive:true });

// ── 토스트 ───────────────────────────────────────────────────────────────
let toastTmr;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTmr);
  toastTmr = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── 초기 실행 ────────────────────────────────────────────────────────────
loadFeed('all');
</script>
</body>
</html>`
}

// ── 관리자 ────────────────────────────────────────────────────────────────
function adminPage(){ return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>관리자 – 마이뷰티맵</title>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',sans-serif;background:#0a0a0a;color:#fff}
.top{background:rgba(20,20,20,.97);border-bottom:1px solid rgba(255,255,255,.07);padding:0 16px;height:56px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:10}
.back{font-size:20px;color:rgba(255,255,255,.7);text-decoration:none;transition:color .2s}
.back:hover{color:#fff}
.ttl{font-size:17px;font-weight:800;flex:1}
.ref{background:none;border:none;color:var(--pink,#FF4D7D);font-size:18px;cursor:pointer;padding:6px;border-radius:8px;transition:background .2s}
.ref:hover{background:rgba(255,77,125,.1)}
.wrap{max-width:480px;margin:0 auto;padding:20px 16px 80px}
.sg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:24px}
.sc{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);border-radius:16px;padding:16px;text-align:center}
.sn{font-size:28px;font-weight:800;color:#FF8FA3}
.sl{font-size:11px;color:rgba(255,255,255,.35);margin-top:5px;font-weight:600}
.sec{font-size:11px;font-weight:800;color:rgba(255,255,255,.3);margin-bottom:10px;text-transform:uppercase;letter-spacing:.8px}
.row{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);border-radius:16px;padding:14px;margin-bottom:8px}
.rt{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.rn{font-size:14px;font-weight:700;flex:1}
.rc{font-size:10px;background:rgba(255,77,125,.12);color:#FF8FA3;padding:2px 8px;border-radius:10px;font-weight:700;border:1px solid rgba(255,77,125,.2)}
.sr{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sb{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:12px;text-align:center}
.bn{font-size:22px;font-weight:800;color:#fff}
.bl{font-size:10px;color:rgba(255,255,255,.3);margin-top:3px;font-weight:600}
</style>
</head>
<body>
<div class="top">
  <a class="back" href="/"><i class="fas fa-arrow-left"></i></a>
  <span class="ttl">관리자 대시보드</span>
  <button class="ref" onclick="load()" title="새로고침"><i class="fas fa-sync-alt"></i></button>
</div>
<div class="wrap">
  <div class="sg">
    <div class="sc"><div class="sn" id="tv">-</div><div class="sl">👁 총 조회</div></div>
    <div class="sc"><div class="sn" id="ts">-</div><div class="sl">📍 예약클릭</div></div>
    <div class="sc"><div class="sn" id="tc">-</div><div class="sl">💄 등록 샵</div></div>
  </div>
  <div class="sec">업체별 통계</div>
  <div id="rows"></div>
</div>
<script>
async function load(){
  const d=await(await fetch('/api/admin/stats')).json();
  document.getElementById('tv').textContent=d.totalViews.toLocaleString();
  document.getElementById('ts').textContent=d.totalSP.toLocaleString();
  document.getElementById('tc').textContent=d.stats.length;
  document.getElementById('rows').innerHTML=d.stats.map(s=>\`
    <div class="row">
      <div class="rt"><div class="rn">\${s.name}</div><span class="rc">\${s.category}</span></div>
      <div class="sr">
        <div class="sb"><div class="bn">\${s.views.toLocaleString()}</div><div class="bl">👁 조회수</div></div>
        <div class="sb"><div class="bn">\${s.spClicks.toLocaleString()}</div><div class="bl">📍 예약클릭</div></div>
      </div>
    </div>
  \`).join('');
}
load();
setInterval(load, 30000);
</script>
</body>
</html>`
}

export default app
