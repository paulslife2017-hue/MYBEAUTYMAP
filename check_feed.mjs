import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();

const errors = [];
const logs = [];
page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(4000);

const info = await page.evaluate(() => {
  const slider  = document.getElementById('feedSlider');
  const track   = document.getElementById('feedTrack');
  const cards   = [...document.querySelectorAll('.fi')];
  const thumbs  = [...document.querySelectorAll('.yt-thumb')];
  const areas   = [...document.querySelectorAll('.yt-area')];

  return {
    sliderH:        slider ? slider.clientHeight : 'NO_SLIDER',
    trackH:         track  ? track.style.height  : 'NO_TRACK',
    trackTransform: track  ? track.style.transform : 'NO_TRACK',
    cardCount:      cards.length,
    cards: cards.map(c => ({
      id:     c.id,
      height: c.style.height,
      top:    c.style.top,
    })),
    thumbs: thumbs.map(t => ({
      src:      t.src.slice(0,80),
      opacity:  getComputedStyle(t).opacity,
      naturalW: t.naturalWidth,
      complete: t.complete,
    })),
    areas: areas.map(a => ({
      id:    a.id,
      ytid:  a.dataset.ytid,
      sid:   a.dataset.sid,
    })),
    feedShopsLen: window.feedShops ? window.feedShops.length : 'undefined',
    feedSliderH:  window.feedSliderH,
  };
});

console.log(JSON.stringify(info, null, 2));
console.log('\n=== JS 오류 ===');
errors.forEach(e => console.log('ERR:', e));
console.log('\n=== 콘솔 (필터) ===');
logs.filter(l => !l.includes('NAVER') && !l.includes('401') && !l.includes('WebGL')).forEach(l => console.log(l));

await browser.close();
