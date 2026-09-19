import { execSync, spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const WebSocket = require('C:/Users/saler/AppData/Local/Temp/node_modules/ws/index.js');
const http = require('http');

const FILE = 'file:///C:/Users/saler/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/work/ai%20laboratory/prototype/academy/index.html';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
try { execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' }); } catch {}
await sleep(600);

spawn(CHROME, ['--headless=new','--remote-debugging-port=9222','--no-sandbox','--disable-gpu','--no-first-run'], { stdio: 'ignore', detached: true });
await sleep(3500);

const tabs = await new Promise((res, rej) => {
  http.get('http://localhost:9222/json', (r) => {
    let d = ''; r.on('data', c => d += c);
    r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej);
});

const ws = await new Promise((res, rej) => {
  const w = new WebSocket(tabs[0].webSocketDebuggerUrl);
  w.once('open', () => res(w)); w.once('error', rej);
});

let _id = 1;
function send(method, params={}) {
  const id = _id++;
  return new Promise((resolve, reject) => {
    const h = (data) => {
      const msg = JSON.parse(data);
      if (msg.id !== id) return;
      ws.off('message', h);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    };
    ws.on('message', h);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Page.enable');
await send('Page.navigate', { url: FILE });
await sleep(3000);

// Check what IDs exist
const r1 = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    title: document.title,
    url: location.href,
    ids: [...document.querySelectorAll('[id]')].map(e=>e.id).slice(0,20),
    acCases: !!document.getElementById('ac-cases'),
    allSections: document.querySelectorAll('section').length
  })`,
});
console.log('DOM info:', JSON.parse(r1.result.value));

ws.close();
try { execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' }); } catch {}
process.exit(0);
