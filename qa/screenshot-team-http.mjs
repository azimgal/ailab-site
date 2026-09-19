import { execSync, spawn } from 'child_process';
import { createRequire } from 'module';
import { writeFileSync } from 'fs';

const require = createRequire(import.meta.url);
const WebSocket = require('C:/Users/saler/AppData/Local/Temp/node_modules/ws/index.js');
const http = require('http');

const FILE   = 'http://localhost:8080/index.html';
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

await send(ws, 'Runtime.evaluate', { expression: `document.querySelector('#ailab-team')?.scrollIntoView({block:'start'})` });
await sleep(500);

const { result } = await send(ws, 'Runtime.evaluate', {
  expression: `(() => { const el = document.querySelector('#ailab-team'); const r = el.getBoundingClientRect(); return JSON.stringify({top:r.top,h:el.scrollHeight,scrollY:window.scrollY}); })()`
});
const info = JSON.parse(result.value);
const { data } = await send(ws, 'Page.captureScreenshot', {
  format: 'png', captureBeyondViewport: true,
  clip: { x: 0, y: Math.round(info.scrollY + info.top), width: 1440, height: Math.round(info.h), scale: 1 }
});
writeFileSync(`${OUT}/team-http.png`, Buffer.from(data, 'base64'));
console.log('✓ Team section via HTTP');

ws.close();
killChrome();
process.exit(0);
