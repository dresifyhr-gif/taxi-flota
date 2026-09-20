import { randomUUID } from "crypto";

import { createSupabaseAdminClient } from "@/lib/supabase";

const TABLE = "vehicles";
const IMAGE_BUCKET = "vehicle-images";

export type Vehicle = {
  id: string;
  slug: string;
  title: string;
  price: string;
  location: string;
  transmission: string;
  fuel: string;
  description: string;
  highlights: string[];
  images: string[];
  is_published: boolean;
  is_rented?: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type VehicleInput = {
  slug: string;
  title: string;
  price: string;
  location: string;
  transmission: string;
  fuel: string;
  description: string;
  highlights: string[];
  images: string[];
  is_published: boolean;
  is_rented: boolean;
  sort_order: number;
};

/** Nedostaje li stupac u bazi (npr. migracija za `is_rented` još nije pokrenuta)? */
function isMissingColumn(error: { code?: string; message?: string } | null, column: string) {
  if (!error) return false;
  return error.code === "42703" || (error.message ?? "").includes(column);
}

function normalizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getPublishedVehicles(): Promise<Vehicle[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Vehicle[];
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Vehicle[];
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Vehicle) ?? null;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Vehicle) ?? null;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const supabase = createSupabaseAdminClient();
  const payload = { ...input, updated_at: new Date().toISOString() };

  let { data, error } = await supabase.from(TABLE).insert(payload).select("*").single();
  // Ako migracija za `is_rented` nije pokrenuta, spremi bez tog stupca.
  if (error && isMissingColumn(error, "is_rented")) {
    const rest = { ...payload } as Record<string, unknown>;
    delete rest.is_rented;
    ({ data, error } = await supabase.from(TABLE).insert(rest).select("*").single());
  }
  if (error) throw error;
  return data as Vehicle;
}

export async function updateVehicle(id: string, input: VehicleInput): Promise<Vehicle> {
  const supabase = createSupabaseAdminClient();
  const payload = { ...input, updated_at: new Date().toISOString() };

  let { data, error } = await supabase.from(TABLE).update(payload).eq("id", id).select("*").single();
  if (error && isMissingColumn(error, "is_rented")) {
    const rest = { ...payload } as Record<string, unknown>;
    delete rest.is_rented;
    ({ data, error } = await supabase.from(TABLE).update(rest).eq("id", id).select("*").single());
  }
  if (error) throw error;
  return data as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** Upload slike auta u javni bucket, vraća javni URL. */
export async function uploadVehicleImage(file: File): Promise<string> {
  const supabase = createSupabaseAdminClient();
  const path = `${randomUUID()}-${normalizeFileName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
