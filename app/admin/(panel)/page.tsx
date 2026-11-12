import Link from "next/link";
import { ArrowUpRight, Calculator, Car, CheckCircle2, ExternalLink, PhoneCall, Plus, Users } from "lucide-react";

import { Card, KpiTile, Notice, PageHeader } from "@/components/admin/ui";

const OBRACUN_URL = process.env.NEXT_PUBLIC_OBRACUN_URL;
import { CALLBACK_STATUSES, groupCallbacks, listCallbacks, type CallbackRow, type CallbackStatus } from "@/lib/callbacks";
import { getAllVehicles, type Vehicle } from "@/lib/vehicles";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Ključ dana iz lokalnih komponenti (isti TZ kao i labela) — izbjegava UTC pomak. */
function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Broj zahtjeva po danu za zadnjih `days` dana (najstariji → najnoviji). */
function activityByDay(rows: { created_at: string }[], days = 14) {
  const buckets: { label: string; day: string; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    buckets.push({
      label: d.toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit" }),
      day: localDayKey(d),
      count: 0,
    });
  }
  const index = new Map(buckets.map((b, i) => [b.day, i]));
  for (const row of rows) {
    const key = localDayKey(new Date(row.created_at));
    const i = index.get(key);
    if (i !== undefined) buckets[i].count += 1;
  }
  return buckets;
}

const STATUS_META: Record<CallbackStatus, { label: string; dot: string; bar: string }> = {
  novo: { label: "Čeka poziv", dot: "bg-sky-400", bar: "bg-sky-400/70" },
  kontaktiran: { label: "Kontaktiran", dot: "bg-amber-400", bar: "bg-amber-400/70" },
  rijeseno: { label: "Riješeno", dot: "bg-accent", bar: "bg-accent/70" },
};

export default async function DashboardPage() {
  let callbacks: CallbackRow[] = [];
  let vehicles: Vehicle[] = [];
  let loadError = false;

  try {
    [callbacks, vehicles] = await Promise.all([listCallbacks(), getAllVehicles().catch(() => [])]);
  } catch {
    loadError = true;
  }

  const groups = groupCallbacks(callbacks);
  const byStatus: Record<CallbackStatus, number> = { novo: 0, kontaktiran: 0, rijeseno: 0 };
  for (const g of groups) byStatus[g.status] += 1;
  const newCallbacks = byStatus.novo;
  const solved = byStatus.rijeseno;
  const solvedShare = groups.length ? Math.round((solved / groups.length) * 100) : 0;
  const publishedVehicles = vehicles.filter((v) => v.is_published).length;
  const needsRental = groups.filter((g) => (g.note ?? "").includes("Treba najam vozila")).length;
  const ownCar = groups.filter((g) => (g.note ?? "").includes("Ima svoje vozilo")).length;
  const rentalUnknown = groups.length - needsRental - ownCar;
  const rentalRows = [
    { label: "Treba najam", n: needsRental },
    { label: "Ima svoj auto", n: ownCar },
    { label: "Nije navedeno", n: rentalUnknown },
  ];
  const maxRental = Math.max(1, ...rentalRows.map((r) => r.n));
  const recentCallbacks = groups.slice(0, 6);

  const activity = activityByDay(callbacks, 14);
  const maxDay = Math.max(1, ...activity.map((a) => a.count));
  const last7 = activity.slice(7).reduce((s, a) => s + a.count, 0);
  const prev7 = activity.slice(0, 7).reduce((s, a) => s + a.count, 0);
  const weekDelta = last7 - prev7;
  const maxStatus = Math.max(1, ...CALLBACK_STATUSES.map((st) => byStatus[st]));

  const now = new Date();
  const dateLabel = now.toLocaleDateString("hr-HR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={<span className="capitalize">{dateLabel}</span>}
        title="Pregled"
        subtitle="Pozivi i vozila — sve bitno u jednom pogledu."
      >
        {OBRACUN_URL ? (
          <a
            href={OBRACUN_URL}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/[0.08] px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/[0.14]"
          >
            <Calculator className="h-4 w-4" /> Obračun
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        ) : null}
        <Link
          href="/admin/vozila/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#04120b] shadow-glow transition hover:bg-accentDark"
        >
          <Plus className="h-4 w-4" /> Novo vozilo
        </Link>
      </PageHeader>

      {loadError ? (
        <Notice tone="error">
          Baza nije spojena. Pokreni <code>supabase/schema.sql</code> na Supabase projektu i
          upiši env varijable.
        </Notice>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiTile
          label="Čeka poziv"
          value={newCallbacks}
          icon={<PhoneCall className="h-[18px] w-[18px]" />}
          href="/admin/pozivi?s=novo"
          tone={newCallbacks > 0 ? "warn" : "neutral"}
          hint={newCallbacks > 0 ? "nazovi ih danas" : "svi su kontaktirani"}
        />
        <KpiTile
          label="Ukupno ljudi"
          value={groups.length}
          icon={<Users className="h-[18px] w-[18px]" />}
          href="/admin/pozivi"
          hint={<>u zadnjih 7 dana: <span className="text-white/70 tabular-nums">{last7}</span> zahtjeva</>}
        />
        <KpiTile
          label="Riješeno"
          value={solved}
          icon={<CheckCircle2 className="h-[18px] w-[18px]" />}
          href="/admin/pozivi?s=rijeseno"
          tone={solved > 0 ? "accent" : "neutral"}
          hint={<>{solvedShare}% svih zahtjeva</>}
        />
        <KpiTile
          label="Objavljena vozila"
          value={publishedVehicles}
          icon={<Car className="h-[18px] w-[18px]" />}
          href="/admin/vozila"
          hint={<>{vehicles.length - publishedVehicles} u nacrtu</>}
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">
            Zahtjevi za poziv — zadnjih 14 dana
          </h2>
          {weekDelta !== 0 ? (
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                weekDelta > 0 ? "text-accent" : "text-white/40"
              }`}
            >
              <ArrowUpRight className={`h-3.5 w-3.5 ${weekDelta < 0 ? "rotate-90" : ""}`} />
              {weekDelta > 0 ? "+" : ""}
              {weekDelta} vs prošli tjedan
            </span>
          ) : null}
        </div>
        <div className="flex h-36 items-end gap-1.5">
          {activity.map((a) => (
            <div key={a.day} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
              <div className="relative flex w-full items-end justify-center">
                <div
                  className="w-full max-w-[22px] rounded-t-md bg-gradient-to-t from-accent/40 to-accent transition group-hover:from-accent/60"
                  style={{ height: `${Math.max(a.count ? 8 : 2, (a.count / maxDay) * 120)}px` }}
                  title={`${a.count} zahtjeva`}
                />
                {a.count > 0 ? (
                  <span className="absolute -top-5 text-[10px] font-bold text-white/70 opacity-0 transition group-hover:opacity-100">
                    {a.count}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] text-white/50">{a.label.slice(0, 5)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/45">Po statusu</h2>
          <div className="space-y-3">
            {CALLBACK_STATUSES.map((status) => {
              const n = byStatus[status];
              const meta = STATUS_META[status];
              return (
                <Link
                  key={status}
                  href={`/admin/pozivi?s=${status}`}
                  className="flex items-center gap-3 rounded-lg px-1 py-0.5 transition hover:bg-white/[0.04]"
                >
                  <span className="flex w-28 shrink-0 items-center gap-2 text-sm text-white/70">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden />
                    {meta.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${(n / maxStatus) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold tabular-nums text-white">{n}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/45">Najam vozila</h2>
          <div className="space-y-3">
            {rentalRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-1 py-0.5">
                <span className="w-28 shrink-0 text-sm text-white/70">{row.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-white/40" style={{ width: `${(row.n / maxRental) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-sm font-semibold tabular-nums text-white">{row.n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">
              Zadnji zahtjevi za poziv
            </h2>
            <Link href="/admin/pozivi" className="text-xs font-semibold text-accent hover:text-accentDark">
              Svi →
            </Link>
          </div>
          {recentCallbacks.length === 0 ? (
            <p className="px-5 py-6 text-sm text-white/40">Još nema zahtjeva.</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {recentCallbacks.map((c) => (
                <li key={c.key} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-white">{c.full_name}</p>
                    <p className="text-xs text-white/40">
                      {c.phone} · {new Date(c.created_at).toLocaleDateString("hr-HR")}
                      {c.ids.length > 1 ? ` · zatražio ${c.ids.length} puta` : ""}
                    </p>
                  </div>
                  <a
                    href={whatsappLink(c.phone, `Pozdrav ${c.full_name}, javljamo se iz FleetHub-a.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#25D366]/15 px-2.5 py-1 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/25"
                  >
                    WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
