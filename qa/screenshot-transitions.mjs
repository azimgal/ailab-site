import { execSync, spawn } from 'child_process';
import { createRequire } from 'module';
import { writeFileSync } from 'fs';

const require = createRequire(import.meta.url);
const WebSocket = require('C:/Users/saler/AppData/Local/Temp/node_modules/ws/index.js');
const http = require('http');

const FILE   = 'file:///C:/Users/saler/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/work/ai%20laboratory/prototype/index.html';
const OUT    = 'C:/Users/saler/OneDrive/Рабочий стол/work/ai laboratory/prototype/qa';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function killChrome() { try { execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' }); } catch {} }

function getJson(path) {
  return new Promise((res, rej) => {
    http.get(`http://localhost:9222${path}`, (r) => {
      let d = ''; r.on('data', c => d += c);
      r.on('end', () => { try { res(JSON.parse(d)); } catch(e) { rej(e); } });
    }).on('error', rej);
  });
}

function connect(wsUrl) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(wsUrl);
    ws.once('open', () => res(ws));
    ws.once('error', rej);
  });
}

let _id = 1;
function send(ws, method, params = {}) {
  const id = _id++;
  return new Promise((resolve, reject) => {
    const h = (data) => {
      const msg = JSON.parse(data);
      if (msg.id !== id) return;
      ws.off('message', h);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    };
    ws.on('message', h);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

killChrome();
await sleep(700);
spawn(CHROME, ['--headless=new','--remote-debugging-port=9222','--no-sandbox','--disable-gpu','--no-first-run'],
  { stdio: 'ignore', detached: true });
await sleep(3500);

const tab = (await getJson('/json')).find(t => t.type === 'page');
const ws  = await connect(tab.webSocketDebuggerUrl);

await send(ws, 'Page.enable');
await send(ws, 'Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send(ws, 'Page.navigate', { url: FILE });
await sleep(3000);
await send(ws, 'Runtime.evaluate', { expression: `document.querySelectorAll('.ailab-animate').forEach(el=>el.classList.add('is-visible'))` });
await sleep(300);

// Capture each transition boundary: 300px window centered on the fade div
const transitions = [
  { label: 'eco→build',   selector: '.sec-fade--eco-build',  out: 'trans-eco-build.png' },
  { label: 'biz→cases',   selector: '.sec-fade--biz-cases',  out: 'trans-biz-cases.png' },
  { label: 'cases→how',   selector: '.sec-fade--cases-how',  out: 'trans-cases-how.png' },
  { label: 'why→tech',    selector: '.sec-fade--why-tech',   out: 'trans-why-tech.png' },
  { label: 'tech→team',   selector: '.sec-fade--tech-team',  out: 'trans-tech-team.png' },
  { label: 'team→acad',   selector: '.sec-fade--team-acad',  out: 'trans-team-acad.png' },
];

for (const t of transitions) {
  await send(ws, 'Runtime.evaluate', { expression: `document.querySelector('${t.selector}')?.scrollIntoView({block:'center'})` });
  await sleep(400);
  const { result } = await send(ws, 'Runtime.evaluate', {
    expression: `(() => { const el = document.querySelector('${t.selector}'); const r = el.getBoundingClientRect(); return JSON.stringify({top:r.top, scrollY:window.scrollY}); })()`
  });
  const info = JSON.parse(result.value);
  const centerY = Math.round(info.scrollY + info.top + 36); // center of the 72px fade
  const clipY = Math.max(0, centerY - 150);
  const { data } = await send(ws, 'Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
    clip: { x: 0, y: clipY, width: 1440, height: 300, scale: 1 }
  });
  writeFileSync(`${OUT}/${t.out}`, Buffer.from(data, 'base64'));
  console.log(`✓ ${t.label} → ${t.out}`);
}

ws.close();
killChrome();
console.log('Done.');
process.exit(0);
