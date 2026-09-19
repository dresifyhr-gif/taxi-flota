import Link from "next/link";
import { ClipboardList, PhoneCall, Car, Inbox } from "lucide-react";

import { Card, Notice, StatusBadge } from "@/components/admin/ui";
import {
  APPLICATION_STATUSES,
  hoursLabel,
  listApplications,
  type ApplicationRow,
} from "@/lib/applications";
import { listCallbacks, type CallbackRow } from "@/lib/callbacks";
import { getAllVehicles, type Vehicle } from "@/lib/vehicles";

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

function Stat({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition hover:border-neutral-600">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">{label}</span>
          <span className="text-neutral-500">{icon}</span>
        </div>
        <p className="mt-2 text-3xl font-bold">{value}</p>
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
  const recent = applications.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pregled</h1>
        <p className="mt-1 text-sm text-neutral-500">Evidencija prijava, poziva i vozila.</p>
      </div>

      {loadError ? (
        <Notice tone="error">
          Baza nije spojena. Pokreni <code>supabase/schema.sql</code> na novom Supabase projektu i
          upiši env varijable.
        </Notice>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ukupno prijava" value={applications.length} icon={<ClipboardList className="h-5 w-5" />} href="/admin/prijave" />
        <Stat label="Nove prijave" value={newApplications} icon={<Inbox className="h-5 w-5" />} href="/admin/prijave" />
        <Stat label="Zahtjevi za poziv" value={newCallbacks} icon={<PhoneCall className="h-5 w-5" />} href="/admin/pozivi" />
        <Stat label="Objavljena vozila" value={publishedVehicles} icon={<Car className="h-5 w-5" />} href="/admin/vozila" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Prijave po statusu
          </h2>
          <div className="space-y-2">
            {APPLICATION_STATUSES.map((status) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="text-lg font-semibold">{byStatus[status] ?? 0}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Prijave po satima
          </h2>
          <div className="space-y-2">
            {HOURS_KEYS.map((h) => (
              <div key={h} className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">{hoursLabel(h)}</span>
                <span className="text-lg font-semibold">{byHours[h] ?? 0}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Zadnje prijave
          </h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">Još nema prijava.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/prijave/${a.id}`}
                  className="flex items-center justify-between px-5 py-3 transition hover:bg-neutral-50"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{a.full_name}</p>
                    <p className="text-xs text-neutral-500">
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
    </div>
  );
}
