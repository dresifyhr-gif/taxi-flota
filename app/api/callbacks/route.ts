import { NextResponse } from "next/server";
import { z } from "zod";

import { createCallback } from "@/lib/callbacks";
import { notifyAdminsNewCallback } from "@/lib/push";

export const runtime = "nodejs";

const schema = z.object({
  fullName: z.string().trim().min(2, "Unesite ime i prezime."),
  phone: z
    .string()
    .trim()
    .min(8, "Unesite ispravan broj mobitela.")
    .max(30, "Broj mobitela je predugačak."),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { message: firstIssue?.message || "Provjeri unesene podatke." },
        { status: 400 },
      );
    }

    // Honeypot
    if (parsed.data.website) {
      return NextResponse.json({ message: "Zahtjev je zaprimljen." });
    }

    await createCallback({ fullName: parsed.data.fullName, phone: parsed.data.phone });

    try {
      await notifyAdminsNewCallback({ fullName: parsed.data.fullName });
    } catch (pushError) {
      console.error("Push (callback) failed (non-fatal):", pushError);
    }

    return NextResponse.json({
      message: "Zahtjev je zaprimljen. Javit ćemo ti se u najkraćem roku.",
    });
  } catch (error) {
    console.error("Callback request failed", error);
    return NextResponse.json(
      { message: "Trenutno nismo uspjeli zaprimiti zahtjev. Pokušaj ponovno." },
      { status: 500 },
    );
  }
}
