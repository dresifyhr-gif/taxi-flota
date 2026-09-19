// Edge-safe admin auth helpers (Web Crypto only — usable in middleware + route handlers).
// Login je jednostavan: jedna lozinka iz ADMIN_PASSWORD. Sesija je potpisani
// (HMAC-SHA256) token spremljen u httpOnly cookie, tako da se ne može krivotvoriti.

export const ADMIN_COOKIE = "fh_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dana
export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload = base64urlEncode(
    encoder.encode(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS })),
  );
  const sig = base64urlEncode(await hmac(secret, payload));
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = await hmac(secret, payload);
  if (!timingSafeEqual(base64urlDecode(sig), expected)) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload))) as {
      exp?: number;
    };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyPassword(input: string, expected: string): boolean {
  return timingSafeEqual(encoder.encode(input), encoder.encode(expected));
}
