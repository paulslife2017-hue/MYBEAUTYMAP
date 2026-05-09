import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(3000);

const info = await page.evaluate(() => {
  const sc = document.getElementById('feedScreen');
  const sl = document.getElementById('feedSlider');
  const fi = document.getElementById('fi-10');
  const yta = document.getElementById('yta-10');
  const ytt = document.getElementById('ytt-10');
  const cs = s => s ? {
    display: getComputedStyle(s).display,
    w: s.offsetWidth, h: s.offsetHeight,
    styleH: s.style.height,
    top: s.style.top,
    rect: JSON.stringify(s.getBoundingClientRect())
  } : null;
  return {
    feedScreen: cs(sc),
    feedSlider: cs(sl),
    fi10: cs(fi),
    yta10: cs(yta),
    ytt10: ytt ? { src: ytt.src.slice(-30), w: ytt.naturalWidth, op: getComputedStyle(ytt).opacity } : null,
    windowH: window.innerHeight,
    feedSliderH: window.feedSliderH,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: '/home/user/webapp/feed_screenshot.png' });
await browser.close();
