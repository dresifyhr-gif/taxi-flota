import { createHash, randomUUID } from "crypto";

import { createSupabaseAdminClient } from "@/lib/supabase";
import { getEnv } from "@/lib/env";

export type StoredApplication = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  hasOwnCar: "da" | "ne";
  birthDate: string;
  oib: string;
  note?: string;
};

function normalizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export function buildDeduplicationHash(application: StoredApplication) {
  return createHash("sha256")
    .update(
      `${application.oib.trim()}|${application.phone.trim()}|${application.birthDate}|${application.email.trim().toLowerCase()}`,
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

export async function persistApplication(
  application: StoredApplication & {
    consentAcceptedAt: string;
    deduplicationHash: string;
    idCardPath: string;
    driverLicensePath: string;
    taxiDiplomaPath: string;
    criminalRecordCertificatePath: string;
    selfiePhotoPath: string;
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
      city: application.city,
      has_own_car: application.hasOwnCar === "da",
      birth_date: application.birthDate,
      oib: application.oib,
      note: application.note || null,
      consent_accepted_at: application.consentAcceptedAt,
      deduplication_hash: application.deduplicationHash,
      id_card_path: application.idCardPath,
      driver_license_path: application.driverLicensePath,
      taxi_diploma_path: application.taxiDiplomaPath,
      criminal_record_certificate_path: application.criminalRecordCertificatePath,
      selfie_photo_path: application.selfiePhotoPath,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
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
