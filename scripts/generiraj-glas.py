#!/usr/bin/env python3
"""Snima naraciju za video reklamu preko ElevenLabsa (glas: Kantix Branimir).

Tekst je u scripts/video-izvor/naracija.txt — jedan red = jedna scena videa (6 redova).
Cijela naracija snima se u jednom dahu da zvuči prirodno, a vremena početka svake
rečenice spremaju se u glas.json pa se scene u videu same poravnaju s govorom.

Pokretanje:  python3 scripts/generiraj-glas.py     (treba ELEVENLABS_API_KEY u .env.local)
"""
import argparse
import base64
import json
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts" / "video-izvor"
VOICE_ID = "WxQSzlR1UORgKEiMk1n4"  # Kantix Branimir

# Varijante glasa. v3 je noviji, izražajniji model; "multilingual" je stariji i stabilniji.
VARIANTS = {
    "v3-prirodno": ("eleven_v3", {"stability": 0.5, "similarity_boost": 0.8, "use_speaker_boost": True}),
    "v3-izrazajno": ("eleven_v3", {"stability": 0.0, "similarity_boost": 0.8, "use_speaker_boost": True}),
    "multilingual": ("eleven_multilingual_v2", {"stability": 0.3, "similarity_boost": 0.8, "style": 0.5, "use_speaker_boost": True, "speed": 1.05}),
}


def api_key() -> str:
    for row in (ROOT / ".env.local").read_text().splitlines():
        if row.startswith("ELEVENLABS_API_KEY="):
            return row.split("=", 1)[1].strip().strip('"')
    raise SystemExit("U .env.local nema ELEVENLABS_API_KEY.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--varijanta", default="v3-prirodno", choices=list(VARIANTS))
    parser.add_argument("--proba", action="store_true", help="spremi kao glas-<varijanta>.mp3 i ne diraj glas.mp3")
    args = parser.parse_args()
    model, settings = VARIANTS[args.varijanta]
    lines = [row.strip() for row in (SRC / "naracija.txt").read_text(encoding="utf-8").splitlines() if row.strip()]
    text = " ".join(lines)
    request = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps?output_format=mp3_44100_192",
        data=json.dumps({"text": text, "model_id": model, "voice_settings": settings}).encode(),
        headers={"xi-api-key": api_key(), "Content-Type": "application/json"},
    )
    try:
        payload = json.loads(urllib.request.urlopen(request, timeout=240).read())
    except urllib.error.HTTPError as error:
        raise SystemExit(f"ElevenLabs greška {error.code}: {error.read()[:400].decode(errors='replace')}")

    name = f"glas-{args.varijanta}" if args.proba else "glas"
    (SRC / f"{name}.mp3").write_bytes(base64.b64decode(payload["audio_base64"]))
    starts_by_char = payload["alignment"]["character_start_times_seconds"]
    ends_by_char = payload["alignment"]["character_end_times_seconds"]
    segments, position = [], 0
    for row in lines:
        segments.append({"text": row, "start": round(starts_by_char[position], 3),
                         "end": round(ends_by_char[position + len(row) - 1], 3)})
        position += len(row) + 1
    (SRC / f"{name}.json").write_text(json.dumps(segments, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{name}.mp3 — {model}")
    for seg in segments:
        print(f"{seg['start']:6.2f}–{seg['end']:6.2f} s  {seg['text']}")


if __name__ == "__main__":
    main()
