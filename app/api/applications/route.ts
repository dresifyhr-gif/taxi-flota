import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteUploadedDocuments, persistApplication } from "@/lib/applications";
import { notifyAdminsNewApplication } from "@/lib/push";

export const runtime = "nodejs";
export const maxDuration = 60;

const metadataSchema = z.object({
  fullName: z.string().trim().min(2, "Unesite ime i prezime."),
  phone: z
    .string()
    .trim()
    .min(8, "Unesite ispravan broj mobitela.")
    .max(30, "Broj mobitela je predugačak."),
  email: z.string().trim().email("Unesite ispravnu email adresu."),
  hoursPerDay: z.enum(["4", "8", "dodatan", "nisam-siguran"]),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Potrebna je privola za obradu podataka." }),
  }),
  website: z.string().max(0).optional(),
  idCardFrontPath: z.string().min(1, "Nedostaje upload prednje strane osobne iskaznice."),
  idCardBackPath: z.string().min(1, "Nedostaje upload zadnje strane osobne iskaznice."),
});

export async function POST(request: Request) {
  let uploadedPaths: string[] = [];
  let persistedHash: string | null = null;

  try {
    const body = await request.json();
    const parsed = metadataSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstIssue?.message || "Provjeri unesene podatke i pokušaj ponovno." },
        { status: 400 },
      );
    }

    const application = parsed.data;

    if (application.website) {
      return NextResponse.json({ message: "Prijava je zaprimljena." });
    }

    uploadedPaths = [application.idCardFrontPath, application.idCardBackPath];

    const deduplicationHash = crypto.randomUUID();

    // ── 1. Spremi u bazu ───────────────────────────────────────────────────────
    await persistApplication({
      fullName: application.fullName,
      phone: application.phone,
      email: application.email,
      hoursPerDay: application.hoursPerDay,
      consentAcceptedAt: new Date().toISOString(),
      deduplicationHash,
      idCardFrontPath: application.idCardFrontPath,
      idCardBackPath: application.idCardBackPath,
    });
    persistedHash = deduplicationHash;

    // ── 2. Push obavijest adminu (non-fatal) ───────────────────────────────────
    try {
      await notifyAdminsNewApplication({ fullName: application.fullName });
    } catch (pushError) {
      console.error("Push notification failed (non-fatal):", pushError);
    }

    return NextResponse.json({
      message: "Prijava je uspješno poslana. Javit ćemo ti se nakon pregleda podataka.",
    });
  } catch (error) {
    console.error("Application submission failed", error);

    // Rollback uploada samo ako još nismo spremili u bazu.
    if (!persistedHash && uploadedPaths.length > 0) {
      try {
        await deleteUploadedDocuments(uploadedPaths);
      } catch (storageRollbackError) {
        console.error("Upload rollback failed", storageRollbackError);
      }
    }

    return NextResponse.json(
      { message: "Trenutno nismo uspjeli poslati prijavu. Pokušaj ponovno za nekoliko minuta." },
      { status: 500 },
    );
  }
}
