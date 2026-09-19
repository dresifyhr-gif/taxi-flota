import { createSupabaseAdminClient } from "@/lib/supabase";

const TABLE = "admin_settings";
const enc = new TextEncoder();
const PBKDF2_ITERATIONS = 100_000;

export type AdminSettings = {
  admin_name: string;
  is_locked: boolean;
  has_password: boolean;
  password_hash: string | null;
};

function b64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fromB64(str: string): Uint8Array<ArrayBuffer> {
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}

export async function verifyPasswordHash(plain: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = fromB64(parts[2]);
  const expected = fromB64(parts[3]);
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(plain), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      keyMaterial,
      expected.length * 8,
    ),
  );
  if (derived.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < derived.length; i++) out |= derived[i] ^ expected[i];
  return out === 0;
}

/** Vraća postavke, ili null ako tablica još ne postoji (migracija nije pokrenuta). */
export async function getAdminSettings(): Promise<AdminSettings | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from(TABLE).select("*").limit(1).maybeSingle();
  if (error || !data) return null;
  return {
    admin_name: data.admin_name ?? "admin",
    is_locked: Boolean(data.is_locked),
    has_password: Boolean(data.password_hash),
    password_hash: data.password_hash ?? null,
  };
}

export async function updateAdminName(name: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ admin_name: name, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw error;
}

export async function setAdminPassword(plain: string): Promise<void> {
  const password_hash = await hashPassword(plain);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ password_hash, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw error;
}

export async function setAdminLocked(locked: boolean): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ is_locked: locked, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw error;
}
