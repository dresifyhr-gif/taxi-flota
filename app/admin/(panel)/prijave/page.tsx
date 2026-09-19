import Link from "next/link";
import { Download, MessageCircle, StickyNote, Users } from "lucide-react";

import { Card, Notice, PageHeader } from "@/components/admin/ui";
import { InlineStatus } from "@/components/admin/inline-status";
import { PrijaveFilters } from "@/components/admin/prijave-filters";
import {
  APPLICATION_STATUSES,
  filterApplications,
  hoursLabel,
  listApplications,
  type ApplicationRow,
} from "@/lib/applications";
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

/** Normaliziraj broj (samo znamenke, bez vodeće 0 / +385) za detekciju duplikata. */
function normalizePhone(phone: string): string {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("385")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return d;
}

export default async function PrijavePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; hours?: string; range?: string }>;
}) {
  const { q = "", status = "", hours = "", range = "" } = await searchParams;

  let applications: ApplicationRow[] = [];
  let loadError = false;
  try {
    applications = await listApplications();
  } catch {
    loadError = true;
  }

  const filtered = filterApplications(applications, { q, status, hours, range });

  // Ponovljeni prijavitelji — po normaliziranom broju, računato nad SVIM prijavama.
  const phoneCounts = new Map<string, number>();
  for (const app of applications) {
    const key = normalizePhone(app.phone);
    if (key) phoneCounts.set(key, (phoneCounts.get(key) ?? 0) + 1);
  }
  const isRepeat = (phone: string) => (phoneCounts.get(normalizePhone(phone)) ?? 0) > 1;

  const exportQ = new URLSearchParams(
    Object.entries({ q, status, hours, range }).filter(([, v]) => v) as [string, string][],
  ).toString();
  const exportHref = exportQ ? `/admin/export/prijave?${exportQ}` : "/admin/export/prijave";
  const currentUrl = exportQ ? `/admin/prijave?${exportQ}` : "/admin/prijave";

  return (
    <div className="space-y-6">
      <PageHeader title="Prijave vozača" subtitle={`${filtered.length} od ${applications.length} prijava`}>
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          <Download className="h-4 w-4" /> Izvoz CSV
        </a>
      </PageHeader>

      <PrijaveFilters q={q} status={status} hours={hours} range={range} statuses={APPLICATION_STATUSES} />

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati prijave. Provjeri da je baza dostupna i da je pokrenuta migracija
          (<code>supabase/schema.sql</code>).
        </Notice>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-white/45">
            {applications.length === 0 ? "Još nema prijava." : "Nema rezultata za tu pretragu."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.07] text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ime</th>
                  <th className="px-4 py-3 font-semibold">Kontakt</th>
                  <th className="px-4 py-3 font-semibold">Sati</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Zaprimljeno</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((app) => (
                  <tr key={app.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 font-medium text-white">
                        {app.full_name}
                        {app.note ? (
                          <StickyNote className="h-3.5 w-3.5 text-amber-300/70" aria-label="Ima bilješku" />
                        ) : null}
                        {isRepeat(app.phone) ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                            <Users className="h-3 w-3" /> Ponovljena
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      <div>{app.phone}</div>
                      <div className="text-xs">{app.email}</div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{hoursLabel(app.hours_per_day)}</td>
                    <td className="px-4 py-3">
                      <InlineStatus id={app.id} status={app.status} redirectTo={currentUrl} />
                    </td>
                    <td className="px-4 py-3 text-white/45">{formatDate(app.created_at)}</td>
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
                          className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/15 px-2 py-1 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/25"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                        <Link
                          href={`/admin/prijave/${app.id}`}
                          className="text-sm font-semibold text-accent hover:text-accentDark"
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
