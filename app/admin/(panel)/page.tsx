import Link from "next/link";
import {
  ArrowUpRight,
  Car,
  CheckCircle2,
  ClipboardList,
  Inbox,
  PhoneCall,
  Plus,
} from "lucide-react";

import { Card, Notice, PageHeader, StatusBadge } from "@/components/admin/ui";
import {
  APPLICATION_STATUSES,
  hoursLabel,
  listApplications,
  type ApplicationRow,
} from "@/lib/applications";
import { listCallbacks, type CallbackRow } from "@/lib/callbacks";
import { getAllVehicles, type Vehicle } from "@/lib/vehicles";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HOURS_KEYS = ["4", "8", "dodatan", "nisam-siguran"] as const;

function countBy<T>(rows: T[], key: (row: T) => string | null | undefined) {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const k = key(row) ?? "—";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

/** Broj prijava po danu za zadnjih `days` dana (najstariji → najnoviji). */
function activityByDay(rows: { created_at: string }[], days = 14) {
  const buckets: { label: string; day: string; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    buckets.push({
      label: d.toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit" }),
      day: d.toISOString().slice(0, 10),
      count: 0,
    });
  }
  const index = new Map(buckets.map((b, i) => [b.day, i]));
  for (const row of rows) {
    const key = new Date(row.created_at).toISOString().slice(0, 10);
    const i = index.get(key);
    if (i !== undefined) buckets[i].count += 1;
  }
  return buckets;
}

function Stat({
  label,
  value,
  icon,
  href,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className="group">
      <Card
        className={
          highlight && value > 0
            ? "border-accent/30 bg-accent/[0.06] transition group-hover:border-accent/50"
            : "transition group-hover:border-white/20"
        }
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/45">{label}</span>
          <span
            className={
              highlight && value > 0
                ? "flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent"
                : "flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/50"
            }
          >
            {icon}
          </span>
        </div>
        <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  let applications: ApplicationRow[] = [];
  let callbacks: CallbackRow[] = [];
  let vehicles: Vehicle[] = [];
  let loadError = false;

  try {
    [applications, callbacks, vehicles] = await Promise.all([
      listApplications(),
      listCallbacks().catch(() => []),
      getAllVehicles().catch(() => []),
    ]);
  } catch {
    loadError = true;
  }

  const byStatus = countBy(applications, (a) => a.status ?? "novo");
  const byHours = countBy(applications, (a) => a.hours_per_day);
  const newApplications = byStatus["novo"] ?? 0;
  const newCallbacks = callbacks.filter((c) => (c.status ?? "novo") === "novo").length;
  const publishedVehicles = vehicles.filter((v) => v.is_published).length;
  const approved = byStatus["odobreno"] ?? 0;
  const conversion = applications.length ? Math.round((approved / applications.length) * 100) : 0;
  const recent = applications.slice(0, 5);
  const recentCallbacks = callbacks.slice(0, 4);

  const activity = activityByDay(applications, 14);
  const maxDay = Math.max(1, ...activity.map((a) => a.count));
  const last7 = activity.slice(7).reduce((s, a) => s + a.count, 0);
  const prev7 = activity.slice(0, 7).reduce((s, a) => s + a.count, 0);
  const weekDelta = last7 - prev7;
  const maxStatus = Math.max(1, ...APPLICATION_STATUSES.map((s) => byStatus[s] ?? 0));

  return (
    <div className="space-y-6">
      <PageHeader title="Pregled" subtitle="Prijave, pozivi i vozila na jednom mjestu.">
        <Link
          href="/admin/vozila/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#04120b] transition hover:bg-accentDark"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Ukupno prijava" value={applications.length} icon={<ClipboardList className="h-5 w-5" />} href="/admin/prijave" />
        <Stat label="Nove prijave" value={newApplications} icon={<Inbox className="h-5 w-5" />} href="/admin/prijave?status=novo" highlight />
        <Stat label="Novi pozivi" value={newCallbacks} icon={<PhoneCall className="h-5 w-5" />} href="/admin/pozivi" highlight />
        <Stat label="Objavljena vozila" value={publishedVehicles} icon={<Car className="h-5 w-5" />} href="/admin/vozila" />
      </div>

      {/* Aktivnost + konverzija */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">
              Prijave — zadnjih 14 dana
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
                    title={`${a.count} prijava`}
                  />
                  {a.count > 0 ? (
                    <span className="absolute -top-5 text-[10px] font-bold text-white/70 opacity-0 transition group-hover:opacity-100">
                      {a.count}
                    </span>
                  ) : null}
                </div>
                <span className="text-[9px] text-white/30">{a.label.slice(0, 5)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-center">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/45">
            Konverzija
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#34d186"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${conversion} 100`}
                />
              </svg>
              <span className="absolute text-lg font-bold text-white">{conversion}%</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="h-4 w-4" /> {approved} odobreno
              </p>
              <p className="text-white/45">od {applications.length} prijava</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/45">
            Prijave po statusu
          </h2>
          <div className="space-y-3">
            {APPLICATION_STATUSES.map((status) => {
              const n = byStatus[status] ?? 0;
              return (
                <Link
                  key={status}
                  href={`/admin/prijave?status=${status}`}
                  className="flex items-center gap-3 rounded-lg px-1 py-0.5 transition hover:bg-white/[0.04]"
                >
                  <div className="w-28 shrink-0">
                    <StatusBadge status={status} />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-accent/70"
                      style={{ width: `${(n / maxStatus) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-white">{n}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/45">
            Prijave po satima rada
          </h2>
          <div className="space-y-3">
            {HOURS_KEYS.map((h) => {
              const n = byHours[h] ?? 0;
              const maxH = Math.max(1, ...HOURS_KEYS.map((k) => byHours[k] ?? 0));
              return (
                <div key={h} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm text-white/70">{hoursLabel(h)}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-sky-400/60" style={{ width: `${(n / maxH) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-white">{n}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45">
              Zadnje prijave
            </h2>
            <Link href="/admin/prijave" className="text-xs font-semibold text-accent hover:text-accentDark">
              Sve →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-6 text-sm text-white/40">Još nema prijava.</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {recent.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/admin/prijave/${a.id}`}
                    className="flex items-center justify-between px-5 py-3 transition hover:bg-white/[0.03]"
                  >
                    <div>
                      <p className="font-medium text-white">{a.full_name}</p>
                      <p className="text-xs text-white/40">
                        {hoursLabel(a.hours_per_day)} · {new Date(a.created_at).toLocaleDateString("hr-HR")}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

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
                <li key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-white">{c.full_name}</p>
                    <p className="text-xs text-white/40">
                      {c.phone} · {new Date(c.created_at).toLocaleDateString("hr-HR")}
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
