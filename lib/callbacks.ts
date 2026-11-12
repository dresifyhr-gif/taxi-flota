import { createSupabaseAdminClient } from "@/lib/supabase";
import { toWhatsappNumber } from "@/lib/utils";

const TABLE = "callback_requests";

export const CALLBACK_STATUSES = ["novo", "kontaktiran", "rijeseno"] as const;
export type CallbackStatus = (typeof CALLBACK_STATUSES)[number];

export type CallbackRow = {
  id: string;
  full_name: string;
  phone: string;
  status: string | null;
  note: string | null;
  created_at: string;
};

/**
 * Jedna osoba = jedan broj mobitela. Ako je netko više puta zatražio poziv,
 * svi njegovi zahtjevi spajaju se u jednu grupu (jedna kartica u adminu).
 */
export type CallbackGroup = {
  /** Normalizirani broj — ključ grupe. */
  key: string;
  /** ID-evi svih zahtjeva te osobe (najnoviji prvi). */
  ids: string[];
  full_name: string;
  phone: string;
  /** Status najnovijeg zahtjeva — novi zahtjev vraća osobu u „novo". */
  status: CallbackStatus;
  note: string | null;
  /** Vrijeme najnovijeg zahtjeva. */
  created_at: string;
  /** Sva vremena zahtjeva (najnoviji prvi). */
  requested_at: string[];
};

function toStatus(value: string | null): CallbackStatus {
  return (CALLBACK_STATUSES as readonly string[]).includes(value ?? "") ? (value as CallbackStatus) : "novo";
}

/** Spaja zahtjeve s istim brojem mobitela. Redoslijed: najnoviji zahtjev prvi. */
export function groupCallbacks(rows: CallbackRow[]): CallbackGroup[] {
  const sorted = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const groups = new Map<string, CallbackGroup>();
  for (const row of sorted) {
    const key = toWhatsappNumber(row.phone) || row.id;
    const note = row.note?.trim() || null;
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, {
        key,
        ids: [row.id],
        full_name: row.full_name,
        phone: row.phone,
        status: toStatus(row.status),
        note,
        created_at: row.created_at,
        requested_at: [row.created_at],
      });
      continue;
    }
    existing.ids.push(row.id);
    existing.requested_at.push(row.created_at);
    // Sačuvaj bilješke sa starijih zahtjeva (bez dupliranja istog teksta).
    if (note && !(existing.note ?? "").includes(note)) {
      existing.note = existing.note ? `${existing.note} · ${note}` : note;
    }
  }
  return [...groups.values()];
}

export async function createCallback(input: {
  fullName: string;
  phone: string;
  note?: string | null;
}): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .insert({ full_name: input.fullName, phone: input.phone, note: input.note || null });
  if (error) throw error;
}

export async function listCallbacks(): Promise<CallbackRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CallbackRow[];
}

export function filterCallbacks(rows: CallbackRow[], q = ""): CallbackRow[] {
  const qLower = q.trim().toLowerCase();
  if (!qLower) return rows;
  return rows.filter(
    (c) => c.full_name.toLowerCase().includes(qLower) || c.phone.toLowerCase().includes(qLower),
  );
}

export async function updateCallbacksStatus(ids: string[], status: CallbackStatus): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).update({ status }).in("id", ids);
  if (error) throw error;
}

export async function updateCallbacksNote(ids: string[], note: string): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).update({ note: note || null }).in("id", ids);
  if (error) throw error;
}

/** Broj OSOBA (ne zahtjeva) koje čekaju poziv. */
export async function countNewCallbacks(): Promise<number> {
  const rows = await listCallbacks();
  return groupCallbacks(rows).filter((g) => g.status === "novo").length;
}

export async function deleteCallbacks(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).delete().in("id", ids);
  if (error) throw error;
}
