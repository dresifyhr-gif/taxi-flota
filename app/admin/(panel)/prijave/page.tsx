import Link from "next/link";
import { Download, MessageCircle, Search } from "lucide-react";

import { Button, ButtonLink, Card, Notice, StatusBadge, inputClass } from "@/components/admin/ui";
import {
  APPLICATION_STATUSES,
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

export default async function PrijavePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;

  let applications: ApplicationRow[] = [];
  let loadError = false;
  try {
    applications = await listApplications();
  } catch {
    loadError = true;
  }

  const qLower = q.trim().toLowerCase();
  const filtered = applications.filter((app) => {
    const matchesQ =
      !qLower ||
      app.full_name.toLowerCase().includes(qLower) ||
      app.phone.toLowerCase().includes(qLower) ||
      app.email.toLowerCase().includes(qLower);
    const matchesStatus = !status || (app.status ?? "novo") === status;
    return matchesQ && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Prijave vozača</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {filtered.length} od {applications.length} prijava
          </p>
        </div>
        <a
          href="/admin/export/prijave"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500"
        >
          <Download className="h-4 w-4" /> Izvoz CSV
        </a>
      </div>

      {/* Pretraga + filter */}
      <form method="get" className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Traži ime, broj ili email…"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select name="status" defaultValue={status} className={`${inputClass} w-auto`}>
          <option value="">Svi statusi</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          Traži
        </Button>
        {q || status ? (
          <ButtonLink href="/admin/prijave" variant="secondary">
            Poništi
          </ButtonLink>
        ) : null}
      </form>

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati prijave. Provjeri da je baza dostupna i da je pokrenuta migracija
          (<code>supabase/schema.sql</code>).
        </Notice>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-400">
            {applications.length === 0 ? "Još nema prijava." : "Nema rezultata za tu pretragu."}
          </p>
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
                {filtered.map((app) => (
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
