// Snima film.html kadar po kadar preko Chrome DevTools protokola (bez dodatnih paketa).
// Uporaba: node scripts/video/snimi.mjs <film.html> <mapa-za-kadrove> <trajanje-s> [fps] [od-s] [do-s]
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const [, , htmlPath, outDir, durationArg, fpsArg = "30", fromArg = "0", toArg] = process.argv;
const duration = Number(durationArg);
const fps = Number(fpsArg);
const from = Number(fromArg);
const to = toArg ? Number(toArg) : duration;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 500);
const W = 1080;
const H = 1920;

mkdirSync(outDir, { recursive: true });
const profile = path.join(outDir, ".chrome-profil");
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--allow-file-access-from-files",
    "--no-first-run",
    `--window-size=${W},${H}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findPage() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome se nije pokrenuo.");
}

try {
  const ws = new WebSocket(await findPage());
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const callId = ++id;
      pending.set(callId, resolve);
      ws.send(JSON.stringify({ id: callId, method, params }));
    });

  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send("Page.enable");
  await send("Page.navigate", { url: pathToFileURL(path.resolve(htmlPath)).href });
  // Pričekaj fontove i slike.
  for (let i = 0; i < 80; i++) {
    const ready = await send("Runtime.evaluate", {
      expression: "document.readyState === 'complete' && window.__ready === true",
      returnByValue: true,
    });
    if (ready.result?.result?.value) break;
    await sleep(250);
  }

  const first = Math.round(from * fps);
  const last = Math.round(to * fps);
  for (let frame = first; frame < last; frame++) {
    await send("Runtime.evaluate", { expression: `window.seek(${frame / fps})`, awaitPromise: true });
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 93 });
    writeFileSync(path.join(outDir, `k${String(frame).padStart(5, "0")}.jpg`), Buffer.from(shot.result.data, "base64"));
    if (frame % 90 === 0) console.log(`kadar ${frame}/${last}`);
  }
  ws.close();
  console.log(`OK ${last - first} kadrova`);
} finally {
  chrome.kill();
}
