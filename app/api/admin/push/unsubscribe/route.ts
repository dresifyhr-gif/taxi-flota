import { NextResponse } from "next/server";

import { isAdminAuthed } from "@/app/admin/actions";
import { deleteSubscription } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ message: "Neautorizirano." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { endpoint?: string };
    if (!body?.endpoint) {
      return NextResponse.json({ message: "Nedostaje endpoint." }, { status: 400 });
    }
    await deleteSubscription(body.endpoint);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push unsubscribe failed", error);
    return NextResponse.json({ message: "Odjava pretplate nije uspjela." }, { status: 500 });
  }
}
