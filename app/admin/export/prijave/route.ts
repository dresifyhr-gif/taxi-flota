import { NextResponse } from "next/server";

import { isAdminAuthed } from "@/app/admin/actions";
import { filterApplications, hoursLabel, listApplications } from "@/lib/applications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ message: "Neautorizirano." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rows = filterApplications(await listApplications(), {
    q: searchParams.get("q") ?? "",
    status: searchParams.get("status") ?? "",
    hours: searchParams.get("hours") ?? "",
    range: searchParams.get("range") ?? "",
  });
  const header = ["Ime i prezime", "Telefon", "Email", "Sati", "Status", "Zaprimljeno"];
  const lines = [header.map(cell).join(",")];

  for (const r of rows) {
    lines.push(
      [
        cell(r.full_name),
        cell(r.phone),
        cell(r.email),
        cell(hoursLabel(r.hours_per_day)),
        cell(r.status ?? "novo"),
        cell(new Date(r.created_at).toLocaleString("hr-HR")),
      ].join(","),
    );
  }

  const csv = "﻿" + lines.join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prijave-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
