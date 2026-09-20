/**
 * Heuristički izvlači podatke o vozilu iz zalijepljenog teksta oglasa.
 * Nije savršeno — admin uvijek može doraditi polja nakon popunjavanja.
 */

export type ParsedVehicle = {
  title: string;
  price: string;
  transmission: string;
  fuel: string;
  location: string;
  description: string;
  highlights: string[];
};

const CITIES = [
  "Zagreb",
  "Split",
  "Rijeka",
  "Osijek",
  "Zadar",
  "Velika Gorica",
  "Samobor",
  "Sesvete",
  "Karlovac",
  "Varaždin",
  "Dubrovnik",
  "Pula",
  "Slavonski Brod",
  "Sisak",
  "Vinkovci",
];

const BULLET = /^[\s]*[-–—•*▪✓→»·]+\s*/;

// Telefonski brojevi (+385…, 09x…) — ne želimo ih na javnoj stranici.
const PHONE = /(?:\+?\s*385|\b0)\s*\d[\d\s/().-]{6,}\d/g;
// Pozivi na kontakt iz tuđeg oglasa — izbaci ih iz opisa.
const CTA = /(javite?\s*se|javi\s*se|za\s+vi[šs]e\s+informacij|nazovite?|kontaktirajte|\bkontakt\b|whats?app|pi[šs]ite)/i;

function cleanLine(s: string): string {
  return s.replace(BULLET, "").replace(/\s+/g, " ").trim();
}

function cleanDescription(lines: string[]): string {
  return lines
    .map((l) => l.replace(PHONE, "").replace(/\s{2,}/g, " ").trim())
    .filter((l) => l && !CTA.test(l))
    .join("\n");
}

function detectTransmission(text: string): string {
  if (/\bautomat/i.test(text) || /\bdsg\b|\bs-?tronic\b|\btiptronic\b/i.test(text)) return "Automatik";
  if (/\bruč?n|\bmanual|\bmjenjač\s*ruč|brzina\b/i.test(text)) return "Ručni";
  return "";
}

function detectFuel(text: string): string {
  if (/\bhibrid|hybrid\b/i.test(text)) return "Hibrid";
  if (/\belektr|electric|\bev\b/i.test(text)) return "Električni";
  if (
    /\bdizel|diesel|\btdi\b|\bhdi\b|\bcdti\b|\bdci\b|\bcrdi\b|\btdci\b|\bjtd\b|\bd4d\b|\bdtci\b|multijet|bluehdi|blue\s?hdi/i.test(
      text,
    )
  )
    return "Dizel";
  if (/\bplin\b|\blpg\b|\btng\b/i.test(text)) return /\bbenzin/i.test(text) ? "Benzin + plin" : "Plin";
  if (/\bbenzin|petrol|\btsi\b|\btfsi\b|\bvti\b|\bmpi\b|\bfsi\b|\b16v\b/i.test(text)) return "Benzin";
  return "";
}

function detectLocation(text: string): string {
  for (const city of CITIES) {
    if (new RegExp(`\\b${city}\\b`, "i").test(text)) return city;
  }
  return "";
}

function detectPrice(text: string): string {
  // Nađi prvi iznos uz €/EUR, npr. "1.200 €", "200€", "od 160 eur / tjedno"
  const m = text.match(/(?:od\s*)?(\d{1,3}(?:[.\s]\d{3})*|\d+)(?:,\d+)?\s*(?:€|eur\b|eura\b)/i);
  if (!m) return "";
  const amount = m[1].replace(/[.\s]/g, "");
  const around = text.slice(Math.max(0, m.index! - 20), m.index! + m[0].length + 20).toLowerCase();
  const suffix = /tjed/.test(around)
    ? " / tjedno"
    : /mjesec|mjes\.?/.test(around)
      ? " / mjesečno"
      : "";
  const prefix = /\bod\b/i.test(m[0]) ? "od " : "";
  return `${prefix}${amount} €${suffix}`.trim();
}

function detectYear(text: string): string | null {
  const m = text.match(/\b(19\d{2}|20\d{2})\b/);
  return m ? m[1] : null;
}

function detectKm(text: string): string | null {
  const m = text.match(/(\d{1,3}(?:[.\s]\d{3})+|\d{4,6})\s*km\b/i);
  if (!m) return null;
  const n = m[1].replace(/[.\s]/g, "");
  return Number(n).toLocaleString("hr-HR");
}

export function parseVehicleText(raw: string): ParsedVehicle {
  const text = raw.replace(/\r/g, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Naziv = prva linija, odrezana na "Naziv – reklamni dodatak".
  const title = lines.length
    ? cleanLine(lines[0]).split(/\s[–—-]\s/)[0].trim().slice(0, 70)
    : "";

  // Prednosti: linije koje počinju s bulletom, ili kratke "feature" linije (bez prve/naslova).
  const highlights: string[] = [];
  for (const line of lines.slice(1)) {
    const isBullet = BULLET.test(line);
    const clean = cleanLine(line);
    if (!clean) continue;
    if (isBullet && clean.length <= 60) highlights.push(clean);
  }

  const year = detectYear(text);
  const km = detectKm(text);
  if (year && !highlights.some((h) => h.includes(year))) highlights.unshift(`Godina: ${year}`);
  if (km && !highlights.some((h) => /km/i.test(h))) highlights.push(`Prijeđeno: ${km} km`);

  return {
    title,
    price: detectPrice(text),
    transmission: detectTransmission(text),
    fuel: detectFuel(text),
    location: detectLocation(text),
    description: cleanDescription(lines),
    highlights: highlights.slice(0, 8),
  };
}
