import { NextResponse } from "next/server";

import { isAdminAuthed } from "@/app/admin/actions";
import { sendTestNotification } from "@/lib/push";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ message: "Neautorizirano." }, { status: 401 });
  }
  try {
    const { sent } = await sendTestNotification();
    if (!sent) {
      return NextResponse.json(
        { message: "Nema nijednog pretplaćenog uređaja." },
        { status: 200 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push test failed", error);
    return NextResponse.json({ message: "Slanje probne obavijesti nije uspjelo." }, { status: 500 });
  }
}
