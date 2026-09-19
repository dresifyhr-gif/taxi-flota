import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Card, Notice, StatusBadge } from "@/components/admin/ui";
import { hoursLabel, listApplications, type ApplicationRow } from "@/lib/applications";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default async function PrijavePage() {
  let applications: ApplicationRow[] = [];
  let loadError = false;
  try {
    applications = await listApplications();
  } catch {
    loadError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prijave vozača</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {applications.length} {applications.length === 1 ? "prijava" : "prijava"} ukupno
          </p>
        </div>
      </div>

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati prijave. Provjeri da je baza dostupna i da je pokrenuta migracija
          (<code>supabase/admin-migration.sql</code>).
        </Notice>
      ) : applications.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-400">Još nema prijava.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ime</th>
                  <th className="px-4 py-3 font-semibold">Kontakt</th>
                  <th className="px-4 py-3 font-semibold">Sati</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Zaprimljeno</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-800/40">
                    <td className="px-4 py-3 font-medium text-neutral-100">{app.full_name}</td>
                    <td className="px-4 py-3 text-neutral-400">
                      <div>{app.phone}</div>
                      <div className="text-xs">{app.email}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{hoursLabel(app.hours_per_day)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(app.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={whatsappLink(
                            app.phone,
                            `Pozdrav ${app.full_name}, javljamo se iz FleetHub-a u vezi Vaše prijave.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          title="Kontaktiraj na WhatsApp"
                          className="inline-flex items-center gap-1 rounded-md bg-[#25D366]/15 px-2 py-1 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/25"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                        <Link
                          href={`/admin/prijave/${app.id}`}
                          className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          Detalji →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
