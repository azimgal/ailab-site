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
      if (msg.error) { console.error(`[${method}] ERROR:`, msg.error); reject(new Error(msg.error.message)); }
      else resolve(msg.result);
    };
    ws.on('message', h);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function getPageTab() {
  const tabs = await getJson('/json');
  const tab = tabs.find(t => t.type === 'page');
  if (!tab) throw new Error('No page tab. Tabs: ' + JSON.stringify(tabs.map(t => ({ type: t.type, url: t.url }))));
  return tab;
}

async function capture({ width, height, mobile, outFile, label, sectionId }) {
  killChrome();
  await sleep(700);
  spawn(CHROME, ['--headless=new','--remote-debugging-port=9222','--no-sandbox','--disable-gpu','--no-first-run'],
    { stdio: 'ignore', detached: true });
  await sleep(3500);

  const tab = await getPageTab();
  const ws  = await connect(tab.webSocketDebuggerUrl);

  await send(ws, 'Page.enable');
  await send(ws, 'Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile,
  });
  await send(ws, 'Page.navigate', { url: FILE });
  await sleep(3000);

  // Force all animated elements visible
  await send(ws, 'Runtime.evaluate', {
    expression: `document.querySelectorAll('.ailab-animate').forEach(el => el.classList.add('is-visible'))`,
  });
  await sleep(200);

  let clipY = 0;
  let clipH = height;

  if (sectionId) {
    await send(ws, 'Runtime.evaluate', {
      expression: `document.getElementById('${sectionId}')?.scrollIntoView({ block: 'start' })`,
    });
    await sleep(400);

    const { result } = await send(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('${sectionId}');
        if (!el) return JSON.stringify({ err: 'no el' });
        const r = el.getBoundingClientRect();
        return JSON.stringify({ top: r.top, h: el.scrollHeight, scrollY: window.scrollY });
      })()`,
    });
    const info = JSON.parse(result.value);
    console.log(`  Section #${sectionId}:`, info);
    if (info.err) throw new Error(info.err);
    clipY = Math.round(info.scrollY + info.top);
    clipH = Math.round(info.h);
  }

  const { data } = await send(ws, 'Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: clipY, width, height: clipH, scale: 1 },
  });

  writeFileSync(`${OUT}/${outFile}`, Buffer.from(data, 'base64'));
  console.log(`✓ ${label}  →  ${outFile}  (${width}×${clipH}px)`);
  ws.close();
}

// Hero section
await capture({ width: 1440, height: 900, mobile: false, outFile: 'main-hero-desktop.png',  label: 'Hero Desktop',  sectionId: 'ailab-hero' });
await capture({ width: 390,  height: 844, mobile: true,  outFile: 'main-hero-mobile.png',   label: 'Hero Mobile',   sectionId: 'ailab-hero' });

// Cases section
await capture({ width: 1440, height: 900, mobile: false, outFile: 'main-cases-desktop.png', label: 'Cases Desktop', sectionId: 'ailab-cases' });
await capture({ width: 390,  height: 844, mobile: true,  outFile: 'main-cases-mobile.png',  label: 'Cases Mobile',  sectionId: 'ailab-cases' });

// Academy promo
await capture({ width: 1440, height: 900, mobile: false, outFile: 'main-academy-desktop.png', label: 'Academy Desktop', sectionId: 'ailab-academy' });

killChrome();
console.log('\nDone.');
process.exit(0);
