/**
 * Gotove reklame za Instagram i Facebook. Slike su u public/reklame/ i
 * generiraju se skriptom scripts/generiraj-reklame.py.
 */
export type AdCreative = {
  slug: string;
  title: string;
  /** Kome je reklama namijenjena. */
  audience: string;
  /** Tekst objave (caption) — spreman za kopiranje. */
  caption: string;
};

const HASHTAGS = "#uber #bolt #vozač #taxi #zagreb #posao #najamvozila #fleethub";

export const adCreatives: AdCreative[] = [
  {
    slug: "01-nemas-auto",
    title: "Nemaš auto? Nema problema.",
    audience: "Ljudi koji bi vozili, ali nemaju vlastito vozilo.",
    caption: `Želiš voziti Uber i Bolt, a nemaš auto? 🚗

Kod nas dobiješ vozilo u najam od 150 € tjedno, bez pologa — kasko osigurano i spremno za rad. Ti voziš, isplata stiže svaki četvrtak.

📞 Ostavi broj na flota-hr.com i zovemo te isti dan.

${HASHTAGS}`,
  },
  {
    slug: "02-ostavi-broj",
    title: "Ostavi svoj broj. Zovemo te isti dan.",
    audience: "Svi koji razmišljaju o vožnji — najjednostavnija poruka.",
    caption: `Bez dugih obrazaca i papirologije. 📞

1️⃣ Ostaviš ime i broj
2️⃣ Nazovemo te isti dan
3️⃣ Počinješ voziti Uber i Bolt

Primamo nove vozače — s vlastitim autom ili bez njega.

👉 flota-hr.com

${HASHTAGS}`,
  },
  {
    slug: "03-koliko-mozes-zaraditi",
    title: "Koliko možeš zaraditi?",
    audience: "Ljudi koje zanima zarada — privlači najviše klikova.",
    caption: `Koliko možeš zaraditi vozeći Uber i Bolt? 💶

Uz 40 sati vožnje tjedno okvirna neto zarada je 540–720 € tjedno. Provizija je 10%, isplata svaki četvrtak, a voziš kad tebi odgovara.

Izračunaj svoju procjenu na flota-hr.com i zatraži poziv.

* Okvirna procjena, nije zajamčena zarada. Stvarna zarada ovisi o satima, potražnji, gorivu i načinu rada.

${HASHTAGS}`,
  },
  {
    slug: "04-vozis-kad-hoces",
    title: "Voziš kad hoćeš. Zarađuješ svaki tjedan.",
    audience: "Ljudi koji traže fleksibilan ili dodatan posao.",
    caption: `Sam biraš kad voziš — puno radno vrijeme ili par sati uz drugi posao. ⏱️

✅ Provizija 10%
✅ Isplata svaki četvrtak
✅ Bez fiksnih smjena
✅ S vlastitim autom ili našim u najmu (od 150 € tjedno, bez pologa)

📞 Zatraži poziv na flota-hr.com — zovemo te isti dan.

${HASHTAGS}`,
  },
];

export const videoAd = {
  src: "/reklame/video-reklama.mp4",
  title: "Video reklama — Tražiš taxi flotu?",
  audience: "Reels, Story i video oglas (9:16, oko 32 sekunde, s glasom i glazbom).",
  caption: `Tražiš taxi flotu, a ne znaš odakle krenuti? 🚕

Prolazimo s tobom cijelu registraciju, korak po korak — sve do prve vožnje na Uberu i Boltu.

✅ Provizija 10%
✅ Isplata svaki četvrtak
✅ Auti za najam bez pologa, od 150 € tjedno

📞 Ostavi broj na flota-hr.com — zovemo te isti dan.

${HASHTAGS}`,
};

/** Slike za samu Facebook stranicu (profilna i naslovna). */
export const pageImages = [
  { src: "/reklame/facebook-profilna.png", label: "Profilna slika", hint: "1080 × 1080 — Facebook i Instagram profil" },
  { src: "/reklame/facebook-naslovna.png", label: "Naslovna slika", hint: "1640 × 720 — naslovnica Facebook stranice" },
];

export const adFormats = [
  { key: "objava", label: "Objava 4:5", hint: "1080 × 1350 — feed na Instagramu i Facebooku" },
  { key: "story", label: "Story 9:16", hint: "1080 × 1920 — Story i Reels naslovnica" },
] as const;

export function adImagePath(slug: string, format: (typeof adFormats)[number]["key"]): string {
  return `/reklame/${slug}-${format}.png`;
}
