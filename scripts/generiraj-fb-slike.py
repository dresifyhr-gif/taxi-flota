#!/usr/bin/env python3
"""Generira profilnu i naslovnu sliku za Facebook stranicu u public/reklame/.

Pokretanje:  python3 scripts/generiraj-fb-slike.py
"""
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "reklame"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FLEET = ROOT / "scripts" / "video-izvor" / "auto.jpg"

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; }
body { font-family: 'Manrope', system-ui, sans-serif; color: #fff; background: #050806; overflow: hidden; position: relative; }
.sg { font-family: 'Space Grotesk', system-ui, sans-serif; font-weight: 700; letter-spacing: -0.04em; }
.green { color: #34d186; }
.abs { position: absolute; }
"""

PROFILE = """
<div class="abs" style="inset:0;background:radial-gradient(circle at 50% 42%, #0f3a26 0%, #07140d 52%, #050806 100%)"></div>
<div class="abs" style="left:190px;top:150px;width:700px;height:700px;border-radius:50%;background:rgba(52,209,134,.20);filter:blur(140px)"></div>
<div class="abs" style="inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px">
  <div class="sg" style="font-size:188px;line-height:1">Fleet<span class="green">Hub</span></div>
  <div style="width:150px;height:8px;border-radius:8px;background:#34d186"></div>
</div>
"""

COVER = f"""
<div class="abs" style="right:-110px;top:-150px;width:1150px;height:2042px;background:url('file://{FLEET}') 0 0/1150px auto no-repeat;transform:translateY(-560px)"></div>
<div class="abs" style="inset:0;background:linear-gradient(90deg,#050806 0%,#050806 38%,rgba(5,8,6,.9) 50%,rgba(5,8,6,.3) 64%,rgba(5,8,6,0) 78%)"></div>
<div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(5,8,6,.75) 0%,rgba(5,8,6,0) 22%,rgba(5,8,6,0) 78%,rgba(5,8,6,.8) 100%)"></div>
<div class="abs" style="left:120px;top:160px;width:520px;height:420px;border-radius:50%;background:rgba(52,209,134,.16);filter:blur(130px)"></div>
<div class="abs" style="left:230px;top:0;bottom:0;width:760px;display:flex;flex-direction:column;justify-content:center;gap:26px">
  <div class="sg" style="font-size:50px">Fleet<span class="green">Hub</span></div>
  <div class="sg" style="font-size:82px;line-height:1">Vozi Uber i Bolt<br><span class="green">preko naše flote.</span></div>
  <div style="font-size:31px;font-weight:700;color:rgba(255,255,255,.84);line-height:1.45">Provizija 10 % &nbsp;·&nbsp; Isplata svaki četvrtak<br>Auti za najam bez pologa</div>
  <div style="font-size:28px;font-weight:800;color:#34d186;letter-spacing:.02em">flota-hr.com</div>
</div>
"""


def render(name: str, width: int, height: int, body: str) -> None:
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>"
    with tempfile.TemporaryDirectory() as tmp:
        page = pathlib.Path(tmp) / "p.html"
        page.write_text(html, encoding="utf-8")
        target = OUT / name
        subprocess.run(
            [CHROME, "--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1",
             "--allow-file-access-from-files", f"--window-size={width},{height}", "--virtual-time-budget=8000",
             f"--screenshot={target}", page.as_uri()],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        print("OK", target.relative_to(ROOT))


if __name__ == "__main__":
    render("facebook-profilna.png", 1080, 1080, PROFILE)
    render("facebook-naslovna.png", 1640, 720, COVER)
