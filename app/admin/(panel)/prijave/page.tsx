import Link from "next/link";
import { Download, MessageCircle, Search, StickyNote } from "lucide-react";

import { Button, ButtonLink, Card, Notice, PageHeader, inputClass } from "@/components/admin/ui";
import { InlineStatus } from "@/components/admin/inline-status";
import {
  APPLICATION_STATUSES,
  hoursLabel,
  listApplications,
  type ApplicationRow,
} from "@/lib/applications";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HOURS_FILTERS = [
  { value: "", label: "Svi sati" },
  { value: "4", label: "4 sata" },
  { value: "8", label: "8 sati" },
  { value: "dodatan", label: "Dodatan rad" },
  { value: "nisam-siguran", label: "Nije siguran/na" },
];

const RANGE_FILTERS = [
  { value: "", label: "Sve" },
  { value: "7", label: "7 dana" },
  { value: "30", label: "30 dana" },
];

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

function buildQuery(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const s = sp.toString();
  return s ? `/admin/prijave?${s}` : "/admin/prijave";
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

  const qLower = q.trim().toLowerCase();
  const rangeDays = range === "7" ? 7 : range === "30" ? 30 : 0;
  const rangeCutoff = rangeDays ? Date.now() - rangeDays * 24 * 60 * 60 * 1000 : 0;

  const filtered = applications.filter((app) => {
    const matchesQ =
      !qLower ||
      app.full_name.toLowerCase().includes(qLower) ||
      app.phone.toLowerCase().includes(qLower) ||
      app.email.toLowerCase().includes(qLower);
    const matchesStatus = !status || (app.status ?? "novo") === status;
    const matchesHours = !hours || app.hours_per_day === hours;
    const matchesRange = !rangeCutoff || new Date(app.created_at).getTime() >= rangeCutoff;
    return matchesQ && matchesStatus && matchesHours && matchesRange;
  });

  const currentUrl = buildQuery({ q, status, hours, range });
  const hasFilters = Boolean(q || status || hours || range);

  return (
    <div className="space-y-6">
      <PageHeader title="Prijave vozača" subtitle={`${filtered.length} od ${applications.length} prijava`}>
        <a
          href="/admin/export/prijave"
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          <Download className="h-4 w-4" /> Izvoz CSV
        </a>
      </PageHeader>

      {/* Pretraga + filteri */}
      <form method="get" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Traži ime, broj ili email…"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select name="status" defaultValue={status} className={`${inputClass} w-auto`}>
            <option value="" className="bg-[#0d120f]">Svi statusi</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#0d120f]">
                {s}
              </option>
            ))}
          </select>
          <select name="hours" defaultValue={hours} className={`${inputClass} w-auto`}>
            {HOURS_FILTERS.map((h) => (
              <option key={h.value} value={h.value} className="bg-[#0d120f]">
                {h.label}
              </option>
            ))}
          </select>
          <select name="range" defaultValue={range} className={`${inputClass} w-auto`}>
            {RANGE_FILTERS.map((r) => (
              <option key={r.value} value={r.value} className="bg-[#0d120f]">
                {r.label}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Traži
          </Button>
          {hasFilters ? (
            <ButtonLink href="/admin/prijave" variant="ghost">
              Poništi
            </ButtonLink>
          ) : null}
        </div>
      </form>

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
                      <div className="flex items-center gap-2 font-medium text-white">
                        {app.full_name}
                        {app.note ? (
                          <StickyNote className="h-3.5 w-3.5 text-amber-300/70" aria-label="Ima bilješku" />
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
