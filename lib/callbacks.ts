import { createSupabaseAdminClient } from "@/lib/supabase";

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

export async function createCallback(input: { fullName: string; phone: string }): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(TABLE)
    .insert({ full_name: input.fullName, phone: input.phone });
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

export async function updateCallbackStatus(id: string, status: CallbackStatus): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateCallbackNote(id: string, note: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).update({ note: note || null }).eq("id", id);
  if (error) throw error;
}

export async function countNewCallbacks(): Promise<number> {
  const supabase = createSupabaseAdminClient();
  const { count } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("status", "novo");
  return count ?? 0;
}

export async function deleteCallback(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
