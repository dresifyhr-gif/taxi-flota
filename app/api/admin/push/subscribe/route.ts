import { NextResponse } from "next/server";

import { saveSubscription } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };

    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      return NextResponse.json({ message: "Neispravna pretplata." }, { status: 400 });
    }

    await saveSubscription({
      endpoint: body.endpoint,
      keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push subscribe failed", error);
    return NextResponse.json({ message: "Spremanje pretplate nije uspjelo." }, { status: 500 });
  }
}
