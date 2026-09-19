import { createHash, randomUUID } from "crypto";

import { createSupabaseAdminClient } from "@/lib/supabase";
import { getEnv } from "@/lib/env";

export type StoredApplication = {
  fullName: string;
  phone: string;
  email: string;
};

function normalizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export function buildDeduplicationHash(application: StoredApplication) {
  return createHash("sha256")
    .update(
      `${application.fullName.trim().toLowerCase()}|${application.phone.trim()}|${application.email.trim().toLowerCase()}`,
    )
    .digest("hex");
}

export async function findRecentDuplicate(deduplicationHash: string) {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .select("id")
    .eq("deduplication_hash", deduplicationHash)
    .gte("created_at", yesterday)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadDocument(file: File, folder: string) {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const path = `${folder}/${randomUUID()}-${normalizeFileName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 30);

  if (signedUrlError || !data?.signedUrl) {
    throw signedUrlError ?? new Error("Nije moguće kreirati link za dokument.");
  }

  return {
    path,
    signedUrl: data.signedUrl,
  };
}

export async function createSignedUrlForPath(
  path: string,
  options?: { download?: boolean | string },
) {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 30, options?.download ? { download: options.download } : undefined);

  if (error || !data?.signedUrl) {
    throw error ?? new Error("Nije moguće kreirati link za dokument.");
  }

  return data.signedUrl;
}

export async function persistApplication(
  application: StoredApplication & {
    note?: string;
    consentAcceptedAt: string;
    deduplicationHash: string;
    hoursPerDay: string;
    idCardFrontPath: string;
    idCardBackPath: string;
  },
) {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .insert({
      full_name: application.fullName,
      phone: application.phone,
      email: application.email,
      hours_per_day: application.hoursPerDay,
      note: application.note || null,
      consent_accepted_at: application.consentAcceptedAt,
      deduplication_hash: application.deduplicationHash,
      id_card_front_path: application.idCardFrontPath,
      id_card_back_path: application.idCardBackPath,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// ── Admin: čitanje i status prijava ──────────────────────────────────────────

export const APPLICATION_STATUSES = ["novo", "kontaktiran", "odobreno", "odbijeno"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const HOURS_LABELS: Record<string, string> = {
  "4": "4 sata",
  "8": "8 sati",
  dodatan: "Dodatan rad",
  "nisam-siguran": "Nije siguran/na",
};

export function hoursLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return HOURS_LABELS[value] ?? value;
}

export type ApplicationRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  hours_per_day: string | null;
  note: string | null;
  status: string | null;
  consent_accepted_at: string | null;
  created_at: string;
  id_card_front_path: string | null;
  id_card_back_path: string | null;
};

export type ApplicationFilters = {
  q?: string;
  status?: string;
  hours?: string;
  range?: string; // "" | "danas" | "7" | "30"
};

/** Zajednička logika filtriranja — koristi je i lista i CSV izvoz (da se poklapaju). */
export function filterApplications(
  rows: ApplicationRow[],
  { q = "", status = "", hours = "", range = "" }: ApplicationFilters,
): ApplicationRow[] {
  const qLower = q.trim().toLowerCase();
  let cutoff = 0;
  if (range === "danas") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    cutoff = d.getTime();
  } else if (range === "7" || range === "30") {
    cutoff = Date.now() - Number(range) * 24 * 60 * 60 * 1000;
  }
  return rows.filter((app) => {
    const matchesQ =
      !qLower ||
      app.full_name.toLowerCase().includes(qLower) ||
      app.phone.toLowerCase().includes(qLower) ||
      app.email.toLowerCase().includes(qLower);
    const matchesStatus = !status || (app.status ?? "novo") === status;
    const matchesHours = !hours || app.hours_per_day === hours;
    const matchesRange = !cutoff || new Date(app.created_at).getTime() >= cutoff;
    return matchesQ && matchesStatus && matchesHours && matchesRange;
  });
}

export async function listApplications(): Promise<ApplicationRow[]> {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ApplicationRow[];
}

export async function getApplicationById(id: string): Promise<ApplicationRow | null> {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ApplicationRow) ?? null;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function updateApplicationNote(id: string, note: string): Promise<void> {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .update({ note: note || null })
    .eq("id", id);
  if (error) throw error;
}

export async function countNewApplications(): Promise<number> {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();
  const { count } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .select("id", { count: "exact", head: true })
    .eq("status", "novo");
  return count ?? 0;
}

export async function deleteApplication(id: string): Promise<void> {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .select("id_card_front_path, id_card_back_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from(env.SUPABASE_APPLICATIONS_TABLE).delete().eq("id", id);
  if (error) throw error;

  const paths = [data?.id_card_front_path, data?.id_card_back_path].filter(Boolean) as string[];
  if (paths.length) {
    try {
      await deleteUploadedDocuments(paths);
    } catch {
      // dokumenti nisu kritični za brisanje reda
    }
  }
}

export async function deleteApplicationByDeduplicationHash(deduplicationHash: string) {
  const env = getEnv();
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from(env.SUPABASE_APPLICATIONS_TABLE)
    .delete()
    .eq("deduplication_hash", deduplicationHash);

  if (error) {
    throw error;
  }
}

export async function deleteUploadedDocuments(paths: string[]) {
  if (paths.length === 0) {
    return;
  }

  const env = getEnv();
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).remove(paths);

  if (error) {
    throw error;
  }
}
