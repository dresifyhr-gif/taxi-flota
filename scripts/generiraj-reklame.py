#!/usr/bin/env python3
"""Generira slike za Instagram/Facebook objave u public/reklame/.

Pokretanje:  python3 scripts/generiraj-reklame.py
Treba instaliran Google Chrome (koristi se za renderiranje HTML-a u PNG).
"""
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "reklame"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PHOTOS = ROOT / "scripts" / "foto-bez-tablica"  # kopije fotografija sa zamućenim tablicama

FORMATS = {"objava": (1080, 1350), "story": (1080, 1920)}

BASE_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; }
body { font-family: 'Manrope', system-ui, sans-serif; color: #fff; background: #070a08; overflow: hidden; position: relative; }
h1 { font-family: 'Space Grotesk', system-ui, sans-serif; font-weight: 700; letter-spacing: -0.035em; line-height: 0.98; }
.green { color: #34d186; }
.logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 46px; letter-spacing: -0.03em; }
.pad { position: absolute; inset: 0; padding: var(--pad); display: flex; flex-direction: column; }
.top { display: flex; align-items: center; justify-content: space-between; }
.tag { font-size: 22px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #34d186;
       border: 2px solid rgba(52,209,134,.45); background: rgba(4,18,11,.55); border-radius: 999px; padding: 12px 24px; }
.cta { display: inline-flex; align-items: center; gap: 18px; background: #34d186; color: #04120b; font-weight: 800;
       font-size: 38px; border-radius: 28px; padding: 28px 44px; box-shadow: 0 24px 70px rgba(52,209,134,.38); }
.url { font-size: 30px; font-weight: 700; color: rgba(255,255,255,.82); }
.chips { display: flex; flex-wrap: wrap; gap: 16px; }
.chip { font-size: 30px; font-weight: 700; border-radius: 22px; padding: 18px 28px;
        background: rgba(255,255,255,.09); border: 2px solid rgba(255,255,255,.16); backdrop-filter: blur(14px); }
.chip b { color: #34d186; }
.bottom { margin-top: auto; padding-top: 40px; display: flex; flex-direction: column; gap: 34px; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.photo { position: absolute; inset: 0; background-size: cover; }
.shade { position: absolute; inset: 0; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); background: rgba(52,209,134,.34); }
.grid { position: absolute; inset: 0; opacity: .5;
        background-image: linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.035) 2px, transparent 2px);
        background-size: 90px 90px; mask-image: radial-gradient(ellipse at 50% 40%, #000 30%, transparent 78%); }
.small { font-size: 22px; color: rgba(255,255,255,.5); line-height: 1.4; }
"""

PHONE_ICON = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#04120b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'

LOGO = '<div class="logo">Fleet<span class="green">Hub</span></div>'
FOOTER = f'<div class="row"><div class="cta">{PHONE_ICON} Zatraži poziv</div><div class="url">flota-hr.com</div></div>'


def photo_ad(photo: str, frame: tuple[int, int], tag: str, title: str, chips: list[str], story: bool) -> str:
    """frame = (visina slike u px, pomak prema gore u px) — auto se diže iznad teksta."""
    img_height, shift_up = frame
    size = 132 if story else 118
    chips_html = "".join(f'<div class="chip">{c}</div>' for c in chips)
    return f"""
<div class="photo" style="background-image:url('file://{PHOTOS / photo}');background-repeat:no-repeat;background-size:auto {img_height}px;background-position:50% -{shift_up}px"></div>
<div class="shade" style="background:linear-gradient(to bottom, rgba(4,8,6,.82) 0%, rgba(4,8,6,.25) 16%, rgba(4,8,6,0) 30%, rgba(4,8,6,0) 44%, rgba(4,8,6,.78) 56%, #070a08 66%)"></div>
<div class="pad">
  <div class="top">{LOGO}<div class="tag">{tag}</div></div>
  <div class="bottom">
    <h1 style="font-size:{size}px">{title}</h1>
    <div class="chips">{chips_html}</div>
    {FOOTER}
  </div>
</div>"""


def call_ad(story: bool) -> str:
    size = 150 if story else 132
    steps = [
        ("1", "Ostaviš ime i broj", "Traje manje od minute."),
        ("2", "Nazovemo te", "Isti dan, bez obveze."),
        ("3", "Počinješ voziti", "Uber i Bolt, isplata svaki četvrtak."),
    ]
    steps_html = "".join(
        f'<div style="display:flex;gap:28px;align-items:center;border:2px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);border-radius:32px;padding:30px 34px">'
        f'<div style="width:84px;height:84px;flex:none;border-radius:26px;background:rgba(52,209,134,.16);color:#34d186;font:700 46px \'Space Grotesk\',sans-serif;display:flex;align-items:center;justify-content:center">{n}</div>'
        f'<div><div style="font-size:40px;font-weight:800">{t}</div><div style="font-size:28px;color:rgba(255,255,255,.62);margin-top:6px">{d}</div></div></div>'
        for n, t, d in steps
    )
    return f"""
<div class="grid"></div>
<div class="glow" style="width:760px;height:760px;right:-260px;top:-240px"></div>
<div class="glow" style="width:560px;height:560px;left:-240px;bottom:-180px;opacity:.6"></div>
<div class="pad">
  <div class="top">{LOGO}<div class="tag">Primamo vozače</div></div>
  <h1 style="font-size:{size}px;margin-top:{'150px' if story else '84px'}">Ostavi svoj broj.<br><span class="green">Zovemo te<br>isti dan.</span></h1>
  <div class="bottom">
    <div style="display:flex;flex-direction:column;gap:18px">{steps_html}</div>
    {FOOTER}
  </div>
</div>"""


def earnings_ad(story: bool) -> str:
    return f"""
<div class="grid"></div>
<div class="glow" style="width:820px;height:820px;left:50%;top:{'34%' if story else '30%'};transform:translate(-50%,-50%)"></div>
<div class="pad">
  <div class="top">{LOGO}<div class="tag">Uber · Bolt</div></div>
  <h1 style="font-size:{'128px' if story else '112px'};margin-top:{'130px' if story else '70px'}">Koliko možeš<br>zaraditi?</h1>
  <div style="margin-top:{'90px' if story else '54px'};border:2px solid rgba(52,209,134,.32);background:linear-gradient(135deg, rgba(52,209,134,.16), rgba(52,209,134,.02));border-radius:44px;padding:48px 52px">
    <div style="font-size:26px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:rgba(52,209,134,.9)">40 sati vožnje tjedno</div>
    <div style="font:700 150px 'Space Grotesk',sans-serif;letter-spacing:-.04em;line-height:1;margin-top:22px">540–720 <span class="green">€</span></div>
    <div style="font-size:34px;font-weight:700;color:rgba(255,255,255,.72);margin-top:10px">okvirna neto zarada tjedno</div>
    <div style="height:14px;border-radius:99px;background:rgba(255,255,255,.12);margin-top:38px;position:relative">
      <div style="position:absolute;left:0;top:0;bottom:0;width:50%;border-radius:99px;background:#34d186"></div>
      <div style="position:absolute;left:50%;top:50%;width:46px;height:46px;border-radius:50%;background:#fff;border:8px solid #34d186;transform:translate(-50%,-50%)"></div>
    </div>
  </div>
  <div class="bottom">
    <div class="chips"><div class="chip">Provizija <b>10%</b></div><div class="chip">Isplata <b>svaki četvrtak</b></div><div class="chip">Voziš <b>kad hoćeš</b></div></div>
    {FOOTER}
    <div class="small">Okvirna procjena, nije zajamčena zarada. Stvarna zarada ovisi o satima, potražnji, gorivu i načinu rada.</div>
  </div>
</div>"""


ADS = {
    "01-nemas-auto": lambda story: photo_ad(
        "vw-taigo-2023.jpg", (1900, 650) if story else (1450, 560), "Najam vozila",
        'Nemaš auto?<br><span class="green">Nema problema.</span>',
        ["Najam od <b>150 €</b> tjedno", "<b>Bez pologa</b>", "Isplata <b>svaki četvrtak</b>"], story),
    "02-ostavi-broj": call_ad,
    "03-koliko-mozes-zaraditi": earnings_ad,
    "04-vozis-kad-hoces": lambda story: photo_ad(
        "vw-passat-2021.jpg", (1900, 480) if story else (1500, 400), "Primamo vozače",
        'Voziš kad hoćeš.<br><span class="green">Zarađuješ svaki tjedan.</span>',
        ["Provizija <b>10%</b>", "Bez <b>fiksnih smjena</b>", "Najam <b>bez pologa</b>"], story),
}


def render(name: str, fmt: str, body: str) -> None:
    width, height = FORMATS[fmt]
    pad = "84px 72px 250px" if fmt == "story" else "72px"
    top = "padding-top:190px;" if fmt == "story" else ""
    html = f"<!doctype html><html lang='hr'><head><meta charset='utf-8'><style>{BASE_CSS} body{{--pad:{pad}}} .pad{{{top}}}</style></head><body>{body}</body></html>"
    with tempfile.TemporaryDirectory() as tmp:
        page = pathlib.Path(tmp) / "ad.html"
        page.write_text(html, encoding="utf-8")
        target = OUT / f"{name}-{fmt}.png"
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
             "--allow-file-access-from-files", f"--window-size={width},{height}", "--virtual-time-budget=8000",
             f"--screenshot={target}", page.as_uri()],
            check=True, capture_output=True,
        )
        print("OK", target.relative_to(ROOT))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for ad_name, build in ADS.items():
        for fmt_name in FORMATS:
            render(ad_name, fmt_name, build(fmt_name == "story"))
