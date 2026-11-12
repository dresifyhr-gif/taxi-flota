#!/usr/bin/env python3
"""Generira video reklamu (9:16, Reels/Story) u public/reklame/video-reklama.mp4.

Pokretanje:  python3 scripts/generiraj-video.py            (cijeli video)
             python3 scripts/generiraj-video.py --proba    (samo par kadrova za pregled)

Video je animacija u HTML-u (scripts/video/build/film.html) koju Chrome snima kadar po kadar,
a ffmpeg spaja s glasom i glazbom.

Ulazne datoteke u scripts/video-izvor/ (sve neobavezne):
  glas.mp3 + glas.json        naracija i vremena rečenica (radi ih scripts/generiraj-glas.py)
  glazba.mp3                  glazbena podloga
  uber.png, bolt.png          logotipi (inače se ime ispiše tekstom)
  auti/*.png                  auti izrezani iz pozadine
  naslovnica.png              snimka naslovnice stranice za kadar s mobitelom

Treba: Google Chrome, ffmpeg, node.
"""
from __future__ import annotations

import pathlib
import random
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "video-izvor"
BUILD = ROOT / "scripts" / "video" / "build"
OUT = ROOT / "public" / "reklame" / "video-reklama.mp4"
FPS = 30

# Tekst naracije po scenama (za ElevenLabs) i najmanje trajanje scene u sekundama.
NARRATION = [  # (sažetak scene, osnovno trajanje u sekundama) — tekst govora je u video-izvor/naracija.txt
    ("pitanje: tražiš taxi flotu?", 5.0),
    ("tu smo mi, vodimo te kroz registraciju", 5.5),
    ("uvjeti: 10 %, obavezna prijava, isplata četvrtkom", 5.2),
    ("najam vozila bez pologa od 150 €", 5.6),
    ("ostavi broj, zovemo isti dan", 5.0),
]
VOICE_LEAD = 0.5   # glas kreće malo nakon početka scene
VOICE_TAIL = 0.6   # tišina nakon glasa


def media_duration(path: pathlib.Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return float(out)


def scene_times() -> list[tuple[float, float]]:
    """Vraća (početak, kraj) svake scene, poravnato s naracijom ako postoji glas.json."""
    timing = SRC / "glas.json"
    if timing.exists() and (SRC / "glas.mp3").exists():
        import json
        segments = json.loads(timing.read_text(encoding="utf-8"))
        starts = [0.0] + [VOICE_LEAD + seg["start"] - 0.2 for seg in segments[1:len(NARRATION)]]
        end = VOICE_LEAD + segments[-1]["end"] + 1.8
        return [(round(a, 3), round(b, 3)) for a, b in zip(starts, starts[1:] + [end])]
    times, t = [], 0.0
    for _, minimum in NARRATION:
        times.append((round(t, 3), round(t + minimum, 3)))
        t += minimum
    return times


K = 1.0  # faktor kojim se kašnjenja unutar scene rastežu kad je scena dulja od osnovne


def a(name: str, dur: float, delay: float, ease: str = "cubic-bezier(.2,.8,.2,1)", fill: str = "both") -> str:
    """CSS animacija s kašnjenjem relativnim na početak scene (--s)."""
    return f"animation:{name} {dur}s calc(var(--s) + {delay * K:.3f}s) {fill} {ease};"


def line(text: str, delay: float, cls: str = "", size: int = 120) -> str:
    return (f'<span class="line"><span class="{cls}" style="font-size:{size}px;{a("up", 0.8, delay)}">{text}</span></span>')


def brand(name: str, style: str) -> str:
    file = SRC / f"{name.lower()}.png"
    inner = f'<img src="{file.as_uri()}">' if file.exists() else name
    return f'<span class="brand" style="{style}">{inner}</span>'


def skyline(seed: int, count: int, min_h: int, max_h: int, color: str, lit: str) -> str:
    rng = random.Random(seed)
    parts, x = [], -40
    while x < 1120:
        w = rng.randint(70, 170)
        h = rng.randint(min_h, max_h)
        parts.append(
            f'<i style="left:{x}px;width:{w}px;height:{h}px;background-color:{color};'
            f'background-image:radial-gradient({lit} 1.6px, transparent 2px);background-size:{rng.choice([18, 22, 26])}px {rng.choice([24, 30, 36])}px;'
            f'background-position:{rng.randint(0, 20)}px {rng.randint(0, 20)}px"></i>')
        x += w + rng.randint(-6, 22)
    return "".join(parts)


def car_svg(uid: str, light: str, dark: str, glass: str) -> str:
    """Generički auto (pogled sprijeda), nacrtan u FleetHub stilu. Nije stvarni model."""
    return f"""<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="body{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{light}"/><stop offset="1" stop-color="{dark}"/></linearGradient>
    <linearGradient id="glass{uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{glass}"/><stop offset=".55" stop-color="#0b1512"/><stop offset="1" stop-color="#1c3a2e"/></linearGradient>
    <linearGradient id="lamp{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#bfe4ff"/></linearGradient>
    <filter id="soft{uid}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <!-- kotači -->
  <rect x="118" y="408" width="104" height="92" rx="22" fill="#060908"/><rect x="678" y="408" width="104" height="92" rx="22" fill="#060908"/>
  <!-- kabina -->
  <path d="M236 262 L304 120 Q316 96 348 92 L552 92 Q584 96 596 120 L664 262 Z" fill="url(#body{uid})"/>
  <path d="M276 250 L330 136 Q338 122 356 120 L544 120 Q562 122 570 136 L624 250 Z" fill="url(#glass{uid})"/>
  <path d="M360 120 L420 120 L340 250 L290 250 Z" fill="#ffffff" opacity=".1"/>
  <!-- retrovizori -->
  <path d="M236 232 Q196 222 176 238 Q170 256 196 262 L240 260 Z" fill="url(#body{uid})"/>
  <path d="M664 232 Q704 222 724 238 Q730 256 704 262 L660 260 Z" fill="url(#body{uid})"/>
  <!-- karoserija -->
  <path d="M84 318 Q88 262 176 250 L724 250 Q812 262 816 318 L832 410 Q836 452 792 460 L108 460 Q64 452 68 410 Z" fill="url(#body{uid})"/>
  <path d="M176 250 L724 250 Q770 256 794 276 L106 276 Q130 256 176 250 Z" fill="#ffffff" opacity=".22"/>
  <path d="M360 252 Q450 268 540 252" stroke="#000" stroke-opacity=".12" stroke-width="3" fill="none"/>
  <!-- svjetla -->
  <path d="M112 306 L262 296 L276 334 L128 346 Z" fill="url(#lamp{uid})"/>
  <path d="M788 306 L638 296 L624 334 L772 346 Z" fill="url(#lamp{uid})"/>
  <path d="M112 306 L262 296" stroke="#34d186" stroke-width="5" stroke-linecap="round"/>
  <path d="M788 306 L638 296" stroke="#34d186" stroke-width="5" stroke-linecap="round"/>
  <!-- maska -->
  <rect x="304" y="298" width="292" height="70" rx="20" fill="#080d0b"/>
  <g stroke="#1d2a24" stroke-width="4"><path d="M322 316 H578"/><path d="M322 333 H578"/><path d="M322 350 H578"/></g>
  <circle cx="450" cy="333" r="24" fill="#34d186"/><text x="450" y="342" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="24" fill="#04120b">FH</text>
  <!-- branik -->
  <rect x="236" y="392" width="428" height="46" rx="16" fill="#080d0b"/>
  <rect x="378" y="398" width="144" height="34" rx="6" fill="#f2f5f3"/><text x="450" y="423" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="22" letter-spacing="2" fill="#0b120f">FLEETHUB</text>
  <rect x="120" y="394" width="84" height="16" rx="8" fill="#34d186" opacity=".9"/><rect x="696" y="394" width="84" height="16" rx="8" fill="#34d186" opacity=".9"/>
  <!-- krovna oznaka -->
  <rect x="392" y="50" width="116" height="46" rx="12" fill="#34d186" filter="url(#soft{uid})" opacity=".8"/>
  <rect x="392" y="50" width="116" height="46" rx="12" fill="#34d186"/><text x="450" y="83" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="28" letter-spacing="2" fill="#04120b">TAXI</text>
</svg>"""


def car(uid: str, colors: tuple[str, str, str], width: int, enter: float, leave: float | None) -> str:
    """Auto na cesti: dolazi iz daljine prema kameri, po potrebi izlazi ulijevo."""
    glow = "".join(
        f'<b class="flare" style="left:{x}%;top:62%;{a("flare", 1.6, enter + 1.0, "ease-out")}"></b>' for x in (21, 79))
    anim = f"carIn 1.7s calc(var(--s) + {enter}s) both cubic-bezier(.16,.84,.3,1)"
    if leave is not None:
        anim += f", carOut .8s calc(var(--s) + {leave}s) forwards cubic-bezier(.6,0,.9,.4)"
    return (f'<div class="car" style="width:{width}px;animation:{anim};">'
            f'<div class="shadow"></div><div class="under"></div>{car_svg(uid, *colors)}{glow}'
            f'<div class="beam"></div></div>')


def build_html(times: list[tuple[float, float]]) -> str:
    s = [t[0] for t in times]
    e = [t[1] for t in times]
    total = e[-1]
    site = (SRC / "naslovnica.png").as_uri()
    global K
    k = [(e[i] - s[i]) / NARRATION[i][1] for i in range(len(NARRATION))]

    def scene(i: int, body: str, cls: str = "", start: float | None = None, end: float | None = None) -> str:
        st = s[i] if start is None else start
        en = e[i] if end is None else end
        last = " last" if en >= total else ""
        return f'<section class="scene {cls}{last}" style="--s:{st}s;--e:{en - 0.35}s">{body}</section>'

    # 1 + 2 — svijet (noćna cesta ili AI fotografija auta): pitanje, pa odgovor
    K = 1.0
    w0, w1 = s[0], e[1]
    swap = s[1] - s[0]
    k0, k1 = max(1.0, k[0]), max(1.0, k[1])
    photo = SRC / "auto.jpg"
    # Prve dvije scene: noćna neonska cesta. Fotografija flote ide samo u scenu o najmu.
    backdrop = (f'<div class="sky"></div><div class="moon"></div>'
                f'<div class="skyline far" style="{a("drift", w1 - w0, 0, "linear")}">{skyline(7, 12, 300, 640, "#0c1a14", "rgba(52,209,134,.6)")}</div>'
                f'<div class="skyline near" style="{a("drift2", w1 - w0, 0, "linear")}">{skyline(21, 9, 150, 400, "#060c09", "rgba(255,220,150,.65)")}</div>'
                f'<div class="haze"></div><canvas id="road" width="1080" height="1920"></canvas>')
    badge = SRC / "uber-bolt.jpg"
    if badge.exists():
        brands_html = f'<img class="badge" src="{badge.as_uri()}" style="{a("pop", 0.8, swap + 2.6 * k1, "cubic-bezier(.2,1.3,.4,1)")}">'
    else:
        brands_html = (f'<div class="brands" style="top:740px;{a("pop", 0.7, swap + 2.6 * k1, "cubic-bezier(.2,1.4,.4,1)")}">'
                       f'{brand("Uber", "background:#fff;color:#000")}<span class="amp">i</span>{brand("Bolt", "background:#34d186;color:#04120b")}</div>')
    world = scene(0, f"""
      {backdrop}
      <div class="topfade"></div>
      <div class="copy" style="{a('copyOut', 0.4, swap - 0.3, 'ease-in', 'forwards')}">
        <h1 style="top:330px">{line('Tražiš', 0.2, '', 150)}{line('taxi flotu?', 0.45, 'green', 150)}</h1>
        <div class="abs" style="top:700px;{a('rise', 0.7, 1.7 * k0)}"><span class="chip">Ne znaš <b>kome se obratiti</b>?</span></div>
        <div class="abs" style="top:830px;{a('rise', 0.7, 2.9 * k0)}"><span class="chip">Ni <b>što ti sve treba</b>?</span></div>
      </div>
      <div class="copy">
        <h1 style="top:330px">{line('Tu smo mi.', swap + 0.3, '', 150)}</h1>
        <div class="abs sub2" style="top:520px;{a('rise', 0.7, swap + 1.0 * k1)}">Vodimo te kroz cijelu registraciju — do prve vožnje.</div>
        {brands_html}
      </div>
    """, "world", w0, w1)

    # 3 — uvjeti
    K = max(1.0, k[2])
    rows = [("%", "Provizija 10%", "Bez skrivenih troškova.", 0.9),
            ("✓", "Obavezna prijava", "Voziš uredno i legalno.", 2.0),
            ("€", "Isplata svaki četvrtak", "Zarada ti sjeda redovito.", 3.1)]
    rows_html = "".join(
        f'<div class="persp abs" style="top:{790 + n * 250}px"><div class="row" style="{a("flip", 0.8, d)}">'
        f'<div class="ic" style="{a("pop", 0.6, d + 0.25, "cubic-bezier(.2,1.6,.4,1)")}">{ic}</div>'
        f'<div><div class="t">{t}</div><div class="d">{sub}</div></div></div></div>'
        for n, (ic, t, sub, d) in enumerate(rows))
    terms = scene(2, f"""
      <div class="gridbg"></div><div class="blob" style="left:50%;top:420px;margin-left:-550px"></div>
      <h1 style="top:400px">{line('Uvjeti su jasni.', 0.1, '', 116)}{line('Bez sitnih slova.', 0.3, 'green', 116)}</h1>
      {rows_html}
    """)

    # 4 — najam
    K = max(1.0, k[3])
    rental_bg = (f'<div class="plate" style="background-image:url({photo.as_uri()});transform-origin:50% 75%;{a("plateZoom2", e[3] - s[3], 0, "linear")}"></div><div class="topfade"></div>'
                 if photo.exists() else '<div class="gridbg"></div><div class="blob" style="left:50%;top:1250px;margin-left:-550px"></div>')
    rental = scene(3, f"""
      {rental_bg}
      <h1 style="top:330px">{line('Nemaš auto?', 0.15, '', 150)}{line('Imamo ga mi.', 0.6, 'green', 132)}</h1>
      <div class="abs" style="top:700px;{a('rise', 0.7, 1.5)}"><span class="chip big">Auti <b>za najam</b></span></div>
      <div class="abs" style="top:840px;{a('rise', 0.7, 2.7)}"><span class="chip big"><b>Bez pologa</b></span></div>
      <div class="abs" style="top:980px;{a('rise', 0.7, 3.5)}"><span class="chip big">Od <b>150 €</b> tjedno</span></div>
    """)

    # 5 — poziv na akciju: prava naslovnica u mobitelu
    K = 1.0
    site_wide = (SRC / "naslovnica-laptop.png").as_uri()
    cta = scene(4, f"""
      <div class="gridbg"></div><div class="blob" style="left:50%;top:1250px;margin-left:-550px;{a('pulse', 3.0, 0.0, 'ease-in-out')}"></div>
      <h1 style="top:400px">{line('Ostavi svoj broj.', 0.15, '', 118)}{line('Zovemo te isti dan.', 0.75, 'green', 100)}</h1>
      <div class="stage">
        <div class="laptop" style="{a('laptopIn', 1.5, 0.15, 'cubic-bezier(.16,.84,.3,1)')}">
          <div class="lid"><i class="cam"></i><div class="lscreen"><img src="{site_wide}"><div class="glare" style="{a('glare', 2.0, 1.1, 'ease-in-out')}"></div></div></div>
          <div class="base"></div><div class="lshadow"></div>
        </div>
        <div class="phone2" style="{a('phone2In', 1.4, 0.7, 'cubic-bezier(.16,.84,.3,1)')}">
          <i class="btn-l"></i><i class="btn-r"></i>
          <div class="pscreen"><i class="island"></i><img src="{site}"><div class="glare" style="{a('glare', 1.8, 1.7, 'ease-in-out')}"></div></div>
        </div>
      </div>
      <div class="center" style="top:1640px;{a('pop', 0.7, 2.0, 'cubic-bezier(.2,1.5,.4,1)')}"><span class="btn">flota-hr.com<i class="ring" style="{a('ring', 1.6, 2.6, 'ease-out')}"></i></span></div>
    """)

    K = 1.0
    logo = f'<div class="logo" style="--s:{s[0]}s;{a("fade", 0.5, 0.1)}">Fleet<span class="green">Hub</span></div>'

    return f"""<!doctype html><html lang="hr"><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@500;600;700;800&display=swap');
@property --num {{ syntax: '<integer>'; initial-value: 0; inherits: true; }}
*,*::before,*::after {{ box-sizing: border-box; margin: 0; padding: 0; animation-play-state: paused !important; }}
html, body {{ width: 1080px; height: 1920px; overflow: hidden; background: #050806; }}
body {{ font-family: 'Manrope', system-ui, sans-serif; color: #fff; position: relative; }}
.scene {{ position: absolute; inset: 0; overflow: hidden; opacity: 0; animation: sin .4s var(--s) both ease-out, sout .35s var(--e) forwards ease-in; }}
.scene.last {{ animation: sin .4s var(--s) both ease-out; }}
@keyframes sin {{ from {{ opacity: 0 }} to {{ opacity: 1 }} }}
@keyframes sout {{ to {{ opacity: 0 }} }}
@keyframes fade {{ from {{ opacity: 0 }} to {{ opacity: 1 }} }}
@keyframes up {{ from {{ transform: translateY(115%) }} to {{ transform: none }} }}
@keyframes rise {{ from {{ opacity: 0; transform: translateY(50px) }} to {{ opacity: 1; transform: none }} }}
@keyframes pop {{ from {{ opacity: 0; transform: scale(.6) }} to {{ opacity: 1; transform: none }} }}
@keyframes pulse {{ 0%,100% {{ transform: scale(1); opacity: .85 }} 50% {{ transform: scale(1.18); opacity: 1 }} }}
@keyframes count640 {{ from {{ --num: 0 }} to {{ --num: 640 }} }}
@keyframes count540 {{ from {{ --num: 0 }} to {{ --num: 540 }} }}
@keyframes count720 {{ from {{ --num: 0 }} to {{ --num: 720 }} }}
h1 {{ position: absolute; left: 72px; right: 72px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.035em; line-height: 1.04; }}
h1.center, .center {{ position: absolute; left: 0; right: 0; text-align: center; }}
.abs {{ position: absolute; left: 72px; right: 72px; }}
.line {{ display: block; overflow: hidden; padding-bottom: .12em; margin-bottom: -.12em; white-space: nowrap; }}
.line > span {{ display: inline-block; }}
.green {{ color: #34d186; }}
.fine {{ font-size: 27px; line-height: 1.45; color: rgba(255,255,255,.5); }}
.logo {{ position: absolute; left: 72px; top: 190px; font: 700 54px 'Space Grotesk', sans-serif; letter-spacing: -0.03em; z-index: 20; }}
.vignette {{ position: absolute; inset: 0; z-index: 30; pointer-events: none; background: radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.55) 100%); }}
.chip {{ display: inline-block; font-size: 40px; font-weight: 800; border-radius: 28px; padding: 24px 36px; background: rgba(8,14,11,.82); border: 2px solid rgba(255,255,255,.18); backdrop-filter: blur(10px); }}
.chip.big {{ font-size: 50px; padding: 28px 42px; }}
.chip b {{ color: #34d186; }}
.count::after {{ counter-reset: n var(--num); content: counter(n); }}
.blob {{ position: absolute; width: 1100px; height: 1100px; border-radius: 50%; filter: blur(170px); background: rgba(52,209,134,.36); }}
.gridbg {{ position: absolute; inset: 0; opacity: .55; background-image: linear-gradient(rgba(255,255,255,.04) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.04) 2px, transparent 2px); background-size: 108px 108px; }}
.persp {{ perspective: 1500px; }}

/* 1 — udica */
.lock {{ position: absolute; left: 0; right: 0; top: 330px; text-align: center; }}
@keyframes lockIn {{ from {{ opacity: 0; transform: scale(1.12); filter: blur(14px) }} to {{ opacity: 1; transform: none; filter: none }} }}
.day {{ font-size: 46px; font-weight: 700; color: rgba(255,255,255,.7); }}
.clock {{ font: 600 270px 'Space Grotesk', sans-serif; letter-spacing: -0.04em; line-height: 1; }}
.persp:has(.notif) {{ position: absolute; left: 72px; right: 72px; top: 830px; }}
.notif {{ display: flex; gap: 32px; align-items: center; border-radius: 54px; padding: 46px; background: rgba(26,34,30,.94); border: 2px solid rgba(255,255,255,.14); box-shadow: 0 50px 140px rgba(0,0,0,.65), 0 0 90px rgba(52,209,134,.18); transform-origin: 50% 0; }}
@keyframes notifIn {{ from {{ opacity: 0; transform: translateY(-190px) rotateX(-38deg) scale(.86) }} to {{ opacity: 1; transform: none }} }}
.app {{ width: 124px; height: 124px; flex: none; border-radius: 36px; background: #34d186; color: #04120b; font: 700 62px 'Space Grotesk', sans-serif; display: flex; align-items: center; justify-content: center; }}
.meta {{ font-size: 34px; font-weight: 700; color: rgba(255,255,255,.6); }}
.title {{ font-size: 50px; font-weight: 800; margin-top: 6px; }}
.amount {{ font: 700 96px 'Space Grotesk', sans-serif; letter-spacing: -0.03em; color: #34d186; margin-top: 4px; font-variant-numeric: tabular-nums; }}

/* 2 + 3 — svijet */
.sky {{ position: absolute; inset: 0; background: linear-gradient(to bottom, #03050a 0%, #071511 38%, #0f3a29 52.6%, #050806 52.7%); }}
.moon {{ position: absolute; left: 840px; top: 170px; width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle at 40% 40%, #f3fff8, #9fd9bd 60%, rgba(159,217,189,0) 72%); filter: blur(2px); box-shadow: 0 0 120px rgba(160,230,200,.45); opacity: .85; }}
.skyline {{ position: absolute; left: 0; right: 0; top: 0; height: 1010px; transform-origin: 50% 100%; }}
.skyline i {{ position: absolute; bottom: 0; display: block; }}
.skyline.far {{ opacity: .9; }}
@keyframes drift {{ from {{ transform: scale(1) }} to {{ transform: scale(1.1) }} }}
@keyframes drift2 {{ from {{ transform: scale(1) }} to {{ transform: scale(1.2) }} }}
.haze {{ position: absolute; left: 140px; right: 140px; top: 800px; height: 420px; background: radial-gradient(ellipse at 50% 50%, rgba(52,209,134,.55), rgba(52,209,134,0) 62%); filter: blur(40px); }}
#road {{ position: absolute; inset: 0; }}
.topfade {{ position: absolute; left: 0; right: 0; top: 0; height: 1000px; background: linear-gradient(to bottom, rgba(3,5,8,.9) 0%, rgba(3,5,8,.5) 45%, rgba(3,5,8,.15) 80%, rgba(3,5,8,0) 100%); }}
.copy {{ position: absolute; inset: 0; }}
.badge {{ position: absolute; left: 40px; top: 690px; width: 1000px; mix-blend-mode: screen; -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 78%, transparent 100%); mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 78%, transparent 100%); }}
.sub2 {{ font-size: 54px; font-weight: 700; line-height: 1.25; color: rgba(255,255,255,.88); max-width: 860px; }}
.plate {{ position: absolute; inset: 0; background-color: #010604; background-repeat: no-repeat; background-size: 100% auto; background-position: 50% 250px; transform-origin: 50% 75%; }}
@keyframes plateZoom {{ from {{ transform: scale(1) }} to {{ transform: scale(1.1) }} }}
@keyframes plateZoom2 {{ from {{ transform: scale(1.12) }} to {{ transform: scale(1.02) }} }}
.sweep {{ position: absolute; top: 0; bottom: 0; width: 55%; left: -70%; background: linear-gradient(100deg, rgba(255,255,255,0), rgba(190,255,225,.13), rgba(255,255,255,0)); mix-blend-mode: screen; }}
@keyframes sweep {{ from {{ left: -70% }} to {{ left: 130% }} }}
@keyframes copyOut {{ to {{ opacity: 0; transform: translateY(-40px) }} }}
.brands {{ position: absolute; left: 72px; display: flex; align-items: center; gap: 28px; transform-origin: 0 50%; }}
.brand {{ display: inline-flex; align-items: center; justify-content: center; height: 150px; padding: 0 56px; border-radius: 40px; font: 700 96px 'Space Grotesk', sans-serif; letter-spacing: -0.04em; }}
.brand img {{ height: 84px; }}
.amp {{ font: 700 80px 'Space Grotesk', sans-serif; }}
.car {{ position: absolute; left: 50%; bottom: 400px; transform-origin: 50% 100%; opacity: 0; }}
.car svg {{ position: relative; display: block; width: 100%; filter: drop-shadow(0 0 30px rgba(52,209,134,.25)); }}
.car .beam {{ position: absolute; left: -12%; right: -12%; top: 78%; height: 520px; background: radial-gradient(ellipse at 50% 0%, rgba(220,240,255,.28), rgba(220,240,255,0) 62%); mix-blend-mode: screen; }}
.car .shadow {{ position: absolute; left: 4%; right: 4%; bottom: -44px; height: 120px; border-radius: 50%; background: radial-gradient(ellipse, rgba(0,0,0,.92), rgba(0,0,0,0) 68%); }}
.car .under {{ position: absolute; left: 10%; right: 10%; bottom: -60px; height: 150px; border-radius: 50%; background: radial-gradient(ellipse, rgba(52,209,134,.5), rgba(52,209,134,0) 70%); filter: blur(18px); }}
.flare {{ position: absolute; display: block; width: 300px; height: 300px; margin: -150px 0 0 -150px; border-radius: 50%; mix-blend-mode: screen; background: radial-gradient(circle, rgba(225,245,255,.95) 0%, rgba(150,205,255,.5) 22%, rgba(120,190,255,0) 62%); }}
@keyframes flare {{ 0% {{ opacity: 0; transform: scale(.3) }} 35% {{ opacity: 1; transform: scale(1.25) }} 100% {{ opacity: .75; transform: scale(1) }} }}
@keyframes carIn {{ 0% {{ opacity: 0; transform: translate(-50%, -545px) scale(.06); filter: blur(5px) }} 18% {{ opacity: 1 }} 100% {{ opacity: 1; transform: translate(-50%, 0) scale(1); filter: none }} }}
@keyframes carOut {{ to {{ opacity: 0; transform: translate(-175%, 150px) scale(1.5); filter: blur(8px) }} }}

/* 4 — zarada */
.card {{ position: absolute; left: 72px; right: 72px; border: 2px solid rgba(52,209,134,.35); background: linear-gradient(135deg, rgba(52,209,134,.22), rgba(52,209,134,.03)); border-radius: 52px; padding: 60px 56px; backdrop-filter: blur(6px); }}
@keyframes cardIn {{ from {{ opacity: 0; transform: translateY(90px) scale(.94) }} to {{ opacity: 1; transform: none }} }}
.eyebrow {{ font-size: 32px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: #34d186; }}
.big {{ font: 700 150px 'Space Grotesk', sans-serif; letter-spacing: -0.04em; line-height: 1; margin-top: 26px; white-space: nowrap; font-variant-numeric: tabular-nums; }}
.sub {{ font-size: 42px; font-weight: 700; color: rgba(255,255,255,.75); margin-top: 16px; }}
.track {{ position: relative; height: 18px; border-radius: 99px; background: rgba(255,255,255,.12); margin-top: 48px; }}
.fill {{ position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: #34d186; box-shadow: 0 0 30px rgba(52,209,134,.7); }}
@keyframes fill {{ from {{ width: 4% }} to {{ width: 50% }} }}
.knob {{ position: absolute; top: 50%; width: 56px; height: 56px; margin: -28px 0 0 -28px; border-radius: 50%; background: #fff; border: 10px solid #34d186; }}
@keyframes knob {{ from {{ left: 4% }} to {{ left: 50% }} }}

/* 5 — uvjeti */
.row {{ display: flex; align-items: center; gap: 30px; border: 2px solid rgba(255,255,255,.13); background: rgba(255,255,255,.06); border-radius: 40px; padding: 40px 44px; transform-origin: 50% 0; backdrop-filter: blur(8px); }}
@keyframes flip {{ from {{ opacity: 0; transform: rotateX(-72deg) translateY(-30px) }} to {{ opacity: 1; transform: none }} }}
.ic {{ width: 110px; height: 110px; flex: none; border-radius: 32px; background: rgba(52,209,134,.16); color: #34d186; font: 700 40px 'Space Grotesk', sans-serif; display: flex; align-items: center; justify-content: center; }}
.t {{ font-size: 58px; font-weight: 800; line-height: 1.1; }}
.d {{ font-size: 34px; color: rgba(255,255,255,.62); margin-top: 8px; }}

/* 6 — poziv na akciju */
.stage {{ position: absolute; left: 0; right: 0; top: 0; bottom: 0; perspective: 2200px; }}
.laptop {{ position: absolute; left: 70px; top: 900px; width: 820px; transform-origin: 50% 100%; }}
@keyframes laptopIn {{ from {{ opacity: 0; transform: translateY(260px) rotateX(28deg) scale(.9) }} to {{ opacity: 1; transform: rotateX(4deg) rotateY(5deg) }} }}
.lid {{ position: relative; padding: 16px 16px 20px; border-radius: 26px 26px 4px 4px; background: linear-gradient(#17191a, #0a0b0c); border: 2px solid #33383a; box-shadow: inset 0 0 0 2px #050606, 0 0 110px rgba(52,209,134,.22); }}
.cam {{ position: absolute; top: 6px; left: 50%; width: 7px; height: 7px; margin-left: -3px; border-radius: 50%; background: #23282a; box-shadow: inset 0 0 2px #4a5357; }}
.lscreen {{ position: relative; overflow: hidden; border-radius: 6px; aspect-ratio: 16 / 10; background: #000; }}
.lscreen img {{ width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; display: block; }}
.base {{ position: relative; height: 24px; margin: 0 -58px; border-radius: 3px 3px 22px 22px; background: linear-gradient(to bottom, #e3e7e8 0%, #b4babc 28%, #7d8588 70%, #4d5457 100%); box-shadow: 0 2px 0 rgba(255,255,255,.35) inset; }}
.base::before {{ content: ""; position: absolute; left: 50%; top: 0; width: 150px; height: 9px; margin-left: -75px; border-radius: 0 0 10px 10px; background: linear-gradient(#6c7477, #9aa1a4); }}
.lshadow {{ height: 70px; margin: -6px -40px 0; background: radial-gradient(ellipse at 50% 0, rgba(0,0,0,.85), rgba(0,0,0,0) 70%); }}
.phone2 {{ position: absolute; right: 64px; top: 1010px; width: 286px; height: 590px; padding: 9px; border-radius: 58px; background: linear-gradient(135deg, #5a6266, #1b1e20 30%, #0d0f10 70%, #454c50); box-shadow: 0 0 0 2px #0a0b0c inset, 0 40px 110px rgba(0,0,0,.8), 0 0 90px rgba(52,209,134,.28); transform-origin: 50% 100%; }}
@keyframes phone2In {{ from {{ opacity: 0; transform: translate(220px, 160px) rotateY(-38deg) rotateZ(6deg) scale(.86) }} to {{ opacity: 1; transform: rotateY(-12deg) rotateZ(2deg) }} }}
.pscreen {{ position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 50px; background: #000; box-shadow: 0 0 0 3px #000; }}
.pscreen img {{ width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; display: block; }}
.island {{ position: absolute; z-index: 2; top: 13px; left: 50%; width: 84px; height: 24px; margin-left: -42px; border-radius: 14px; background: #000; box-shadow: 0 0 0 1px rgba(255,255,255,.04); }}
.btn-l, .btn-r {{ position: absolute; width: 4px; border-radius: 3px; background: #3c4347; }}
.btn-l {{ left: -4px; top: 150px; height: 46px; box-shadow: 0 64px 0 #3c4347; }}
.btn-r {{ right: -4px; top: 190px; height: 82px; }}
.glare {{ position: absolute; top: -20%; bottom: -20%; width: 46%; left: -60%; background: linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.16), rgba(255,255,255,0)); }}
@keyframes glare {{ from {{ left: -60% }} to {{ left: 130% }} }}
.btn {{ position: relative; display: inline-flex; align-items: center; background: #34d186; color: #04120b; font-weight: 800; font-size: 58px; border-radius: 38px; padding: 36px 64px; box-shadow: 0 30px 90px rgba(52,209,134,.5); }}
.ring {{ position: absolute; inset: 0; border-radius: 38px; border: 4px solid #34d186; opacity: 0; }}
@keyframes ring {{ from {{ opacity: .9; transform: scale(1) }} to {{ opacity: 0; transform: scale(1.35, 1.9) }} }}
</style></head><body>
{world}{terms}{rental}{cta}{logo}
<div class="vignette"></div>
<script>
const WORLD = [{w0}, {w1}];
const canvas = document.getElementById('road');
const ctx = canvas ? canvas.getContext('2d') : null;
const HORIZON = 1010, CX = 540;
function drawRoad(t) {{
  if (!ctx) return;
  ctx.clearRect(0, 0, 1080, 1920);
  if (t < WORLD[0] - 0.5 || t > WORLD[1] + 0.5) return;
  const travel = (t - WORLD[0]) * 2.4;            // koliko je cesta "odmakla"
  for (let y = HORIZON; y < 1920; y++) {{
    const dy = y - HORIZON + 0.5;
    const half = 26 + dy * 0.62;                   // poluširina ceste na toj liniji
    const depth = 300 / dy;                        // dubina (veće = dalje)
    const fog = Math.min(1, dy / 240);
    // tlo izvan ceste
    ctx.fillStyle = `rgb(${{5 + 2 * fog}},${{9 + 4 * fog}},${{7 + 3 * fog}})`;
    ctx.fillRect(0, y, 1080, 1);
    // asfalt (lagane pruge daju osjećaj brzine)
    const band = Math.floor((depth + travel) * 2.5) % 2 === 0 ? 0 : 3;
    ctx.fillStyle = `rgb(${{17 + band + 9 * fog}},${{24 + band + 11 * fog}},${{21 + band + 10 * fog}})`;
    ctx.fillRect(CX - half, y, half * 2, 1);
    // rubne zelene neonske linije sa sjajem
    const edge = Math.max(1.5, dy * 0.016);
    ctx.fillStyle = `rgba(52,209,134,${{0.1 + 0.12 * fog}})`;
    ctx.fillRect(CX - half - edge * 3, y, edge * 7, 1);
    ctx.fillRect(CX + half - edge * 4, y, edge * 7, 1);
    ctx.fillStyle = `rgba(90,235,165,${{0.5 + 0.5 * fog}})`;
    ctx.fillRect(CX - half, y, edge, 1);
    ctx.fillRect(CX + half - edge, y, edge, 1);
    // središnja dvostruka zelena linija
    const mid = Math.max(1, dy * 0.009);
    ctx.fillStyle = `rgba(52,209,134,${{0.45 + 0.55 * fog}})`;
    ctx.fillRect(CX - dy * 0.022 - mid, y, mid, 1);
    ctx.fillRect(CX + dy * 0.022, y, mid, 1);
    // isprekidane bijele trake
    const phase = (((depth + travel) % 1) + 1) % 1;
    if (phase < 0.45) {{
      const dash = Math.max(1, dy * 0.014);
      ctx.fillStyle = `rgba(255,255,255,${{0.2 + 0.65 * fog}})`;
      ctx.fillRect(CX - half * 0.52 - dash / 2, y, dash, 1);
      ctx.fillRect(CX + half * 0.52 - dash / 2, y, dash, 1);
    }}
  }}
  // izmaglica na horizontu
  const glow = ctx.createLinearGradient(0, HORIZON, 0, HORIZON + 260);
  glow.addColorStop(0, 'rgba(15,58,41,.95)'); glow.addColorStop(1, 'rgba(15,58,41,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, HORIZON, 1080, 260);
}}
window.seek = async (t) => {{
  for (const anim of document.getAnimations()) anim.currentTime = t * 1000;
  drawRoad(t);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}};
Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {{}}))]).then(async () => {{ await window.seek(0); window.__ready = true; }});
</script></body></html>"""


def run(cmd: list[str]) -> None:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(f"Naredba nije uspjela: {' '.join(cmd[:3])}…\n{(result.stderr or result.stdout)[-2500:]}")
    if result.stdout.strip():
        print(result.stdout.strip().splitlines()[-1])


def main() -> None:
    for tool in ("ffmpeg", "ffprobe", "node"):
        if not shutil.which(tool):
            raise SystemExit(f"Nedostaje {tool}.")
    times = scene_times()
    total = times[-1][1]
    if BUILD.exists():
        shutil.rmtree(BUILD)
    frames = BUILD / "kadrovi"
    frames.mkdir(parents=True)
    film = BUILD / "film.html"
    film.write_text(build_html(times), encoding="utf-8")
    snimi = str(ROOT / "scripts" / "video" / "snimi.mjs")

    if "--proba" in sys.argv:
        # Po dva kadra iz svake scene, za brzi pregled izgleda.
        for start, end in times:
            for point in (start + (end - start) * 0.45, end - 0.6):
                run(["node", snimi, str(film), str(frames), str(total), str(FPS), f"{point:.3f}", f"{point + 1 / FPS + 0.001:.3f}"])
        print(f"Probni kadrovi: {frames}")
        return

    run(["node", snimi, str(film), str(frames), str(total), str(FPS)])

    # Zvuk: glas po scenama + glazba (ako postoje), inače tišina.
    inputs, filters, mix = [], [], []
    voice = SRC / "glas.mp3"
    if voice.exists():
        inputs += ["-i", str(voice)]
        filters.append(f"[1:a]aresample=44100,adelay={int(VOICE_LEAD * 1000)}:all=1[v1]")
        mix.append("[v1]")
    music = SRC / "glazba.mp3"
    if music.exists():
        n = len(inputs) // 2 + 1
        inputs += ["-stream_loop", "-1", "-i", str(music)]
        level = 0.16 if mix else 0.5  # tiše ispod glasa
        filters.append(f"[{n}:a]aresample=44100,volume={level},afade=t=in:d=0.8,afade=t=out:st={total - 1.5:.2f}:d=1.5,atrim=0:{total:.3f}[m]")
        mix.append("[m]")
    if mix:
        filters.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,atrim=0:{total:.3f}[a]")
        audio = ["-filter_complex", ";".join(filters), "-map", "0:v", "-map", "[a]"]
    else:
        inputs += ["-f", "lavfi", "-t", f"{total:.3f}", "-i", "anullsrc=r=44100:cl=stereo"]
        audio = ["-map", "0:v", "-map", "1:a"]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-framerate", str(FPS), "-i", str(frames / "k%05d.jpg"), *inputs, *audio,
         "-t", f"{total:.3f}", "-shortest", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(OUT)])
    print(f"OK {OUT.relative_to(ROOT)} — {media_duration(OUT):.1f} s, {OUT.stat().st_size / 1e6:.1f} MB"
          f"{'' if mix else ' (bez zvuka — nema glasa ni glazbe u scripts/video-izvor/)'}")


if __name__ == "__main__":
    main()
