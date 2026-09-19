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
await sleep(200);

// Footer
await send(ws, 'Runtime.evaluate', { expression: `document.querySelector('footer').scrollIntoView({block:'start'})` });
await sleep(400);
const { result: fr } = await send(ws, 'Runtime.evaluate', {
  expression: `(() => { const el = document.querySelector('footer'); const r = el.getBoundingClientRect(); return JSON.stringify({top:r.top,h:el.scrollHeight,scrollY:window.scrollY}); })()`
});
const fi = JSON.parse(fr.value);
const { data: fd } = await send(ws, 'Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true,
  clip: { x: 0, y: Math.round(fi.scrollY + fi.top), width: 1440, height: Math.round(fi.h), scale: 1 }
});
writeFileSync(`${OUT}/main-footer-desktop.png`, Buffer.from(fd, 'base64'));
console.log('✓ Footer:', fi);

// Header scrolled state (simulate scroll to section 04)
await send(ws, 'Runtime.evaluate', { expression: `document.getElementById('ailab-build').scrollIntoView({block:'start'})` });
await sleep(600);
await send(ws, 'Runtime.evaluate', { expression: `document.querySelector('.ailab-header').classList.add('is-scrolled')` });
await sleep(200);
const { result: hr } = await send(ws, 'Runtime.evaluate', {
  expression: `(() => { const el = document.querySelector('.ailab-header'); const r = el.getBoundingClientRect(); return JSON.stringify({top:r.top,h:el.scrollHeight,scrollY:window.scrollY}); })()`
});
const hi = JSON.parse(hr.value);
const { data: hd } = await send(ws, 'Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true,
  clip: { x: 0, y: Math.round(hi.scrollY + hi.top), width: 1440, height: 72, scale: 1 }
});
writeFileSync(`${OUT}/main-header-scrolled.png`, Buffer.from(hd, 'base64'));
console.log('✓ Header scrolled captured');

ws.close();
killChrome();
console.log('Done.');
process.exit(0);
