import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { getEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function normalizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      filename?: string;
      contentType?: string;
      size?: number;
      folder?: string;
    };

    const { filename, contentType, size, folder } = body;

    if (!filename || !contentType || typeof size !== "number" || !folder) {
      return NextResponse.json({ message: "Nedostaju podaci za upload." }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { message: "Dozvoljeni formati: JPG, PNG, PDF." },
        { status: 400 },
      );
    }

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Datoteka smije biti do 10 MB." },
        { status: 400 },
      );
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(folder)) {
      return NextResponse.json({ message: "Neispravan folder." }, { status: 400 });
    }

    const env = getEnv();
    const supabase = createSupabaseAdminClient();

    const path = `${folder}/${randomUUID()}-${normalizeFileName(filename)}`;

    const { data, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Signed upload URL failed", error);
      return NextResponse.json(
        { message: "Nije moguće pripremiti upload. Pokušaj ponovno." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
    });
  } catch (error) {
    console.error("Upload URL endpoint error", error);
    return NextResponse.json(
      { message: "Dogodila se pogreška. Pokušaj ponovno." },
      { status: 500 },
    );
  }
}
