// Snima naslovnicu stranice (bez trake s kolačićima) za prikaz u mobitelu i laptopu u videu.
// Uporaba: node scripts/video/snimi-stranicu.mjs <url> <izlaz.png> <širina> <visina> [mobitel]
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const [, , url, out, w, h, mobile] = process.argv;
const PORT = 9900 + Math.floor(Math.random() * 90);
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(path.join(tmpdir(), "snimka-"))}`,
  "--hide-scrollbars", "--no-first-run", `--window-size=${w},${h}`, "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch {}
    if (!target) await sleep(250);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  await send("Emulation.setDeviceMetricsOverride", { width: Number(w), height: Number(h), deviceScaleFactor: 2, mobile: Boolean(mobile) });
  if (mobile) await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
  await send("Page.enable");
  await send("Page.navigate", { url });
  await sleep(7000);
  // Odbij kolačiće da traka ne bude na snimci.
  await send("Runtime.evaluate", { expression: "[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Odbijam')?.click()" });
  await sleep(1500);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  ws.close();
  console.log("OK", out);
} finally {
  chrome.kill();
}
