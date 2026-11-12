import Link from "next/link";
import { Download, PhoneCall, Search } from "lucide-react";

import { CallbackCard, type CallbackCardData } from "@/components/admin/callback-card";
import { Button, ButtonLink, EmptyState, Notice, PageHeader, inputClass } from "@/components/admin/ui";
import {
  filterCallbacks,
  groupCallbacks,
  listCallbacks,
  type CallbackGroup,
  type CallbackRow,
  type CallbackStatus,
} from "@/lib/callbacks";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TIME_ZONE = "Europe/Zagreb";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TIME_ZONE,
    });
  } catch {
    return value;
  }
}

function formatAgo(value: string, now: number) {
  const minutes = Math.max(0, Math.round((now - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "upravo sad";
  if (minutes < 60) return `prije ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `prije ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "jučer" : `prije ${days} dana`;
}

type Tab = "svi" | CallbackStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "svi", label: "Svi" },
  { value: "novo", label: "Novi" },
  { value: "kontaktiran", label: "Kontaktirani" },
  { value: "rijeseno", label: "Riješeni" },
];

function tabHref(tab: Tab, q: string) {
  const params = new URLSearchParams();
  if (tab !== "svi") params.set("s", tab);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/admin/pozivi?${query}` : "/admin/pozivi";
}

export default async function PoziviPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; s?: string }>;
}) {
  const { q = "", s = "" } = await searchParams;
  const tab: Tab = TABS.some((t) => t.value === s) ? (s as Tab) : "svi";

  let callbacks: CallbackRow[] = [];
  let loadError = false;
  try {
    callbacks = await listCallbacks();
  } catch {
    loadError = true;
  }

  const groups: CallbackGroup[] = groupCallbacks(filterCallbacks(callbacks, q));
  const counts: Record<Tab, number> = {
    svi: groups.length,
    novo: groups.filter((g) => g.status === "novo").length,
    kontaktiran: groups.filter((g) => g.status === "kontaktiran").length,
    rijeseno: groups.filter((g) => g.status === "rijeseno").length,
  };
  const visible = tab === "svi" ? groups : groups.filter((g) => g.status === tab);
  const merged = callbacks.length - groupCallbacks(callbacks).length;

  const now = Date.now();
  const cards: (CallbackCardData & { key: string })[] = visible.map((g) => ({
    key: g.key,
    ids: g.ids,
    full_name: g.full_name,
    phone: g.phone,
    status: g.status,
    note: g.note,
    requestedLabels: g.requested_at.map(formatDate),
    agoLabel: formatAgo(g.created_at, now),
  }));

  const exportHref = q ? `/admin/export/pozivi?q=${encodeURIComponent(q)}` : "/admin/export/pozivi";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zahtjevi za poziv"
        subtitle={
          counts.novo > 0
            ? `Čeka poziv: ${counts.novo}. Status se sprema sam čim ga klikneš.`
            : "Nitko ne čeka poziv. Status se sprema sam čim ga klikneš."
        }
      >
        <a
          href={exportHref}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-hairline-strong px-4 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          <Download className="h-4 w-4" /> Izvoz CSV
        </a>
      </PageHeader>

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati zahtjeve. Pokreni <code>supabase/schema.sql</code> (kreira tablicu{" "}
          <code>callback_requests</code>) i provjeri da je baza spojena.
        </Notice>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap gap-1 rounded-xl bg-white/[0.04] p-1" aria-label="Filter po statusu">
              {TABS.map((t) => (
                <Link
                  key={t.value}
                  href={tabHref(t.value, q)}
                  aria-current={tab === t.value ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                    tab === t.value ? "bg-white/[0.1] text-white" : "text-white/50 hover:text-white",
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] tabular-nums",
                      t.value === "novo" && counts.novo > 0 ? "bg-sky-400/20 text-sky-200" : "bg-white/[0.07] text-white/55",
                    )}
                  >
                    {counts[t.value]}
                  </span>
                </Link>
              ))}
            </nav>

            <form method="get" className="flex w-full items-center gap-2 sm:w-auto">
              {tab !== "svi" ? <input type="hidden" name="s" value={tab} /> : null}
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input name="q" defaultValue={q} placeholder="Traži ime ili broj…" className={`${inputClass} pl-9`} />
              </div>
              <Button type="submit" variant="secondary">
                Traži
              </Button>
              {q ? (
                <ButtonLink href={tabHref(tab, "")} variant="ghost">
                  Poništi
                </ButtonLink>
              ) : null}
            </form>
          </div>

          {merged > 0 && !q ? (
            <p className="text-xs text-white/40">
              Ponovljeni zahtjevi istog broja spojeni su u jednu karticu ({merged}{" "}
              {merged === 1 ? "duplikat" : "duplikata"}).
            </p>
          ) : null}

          {cards.length === 0 ? (
            <EmptyState
              icon={<PhoneCall className="h-5 w-5" />}
              title={
                callbacks.length === 0
                  ? "Još nema zahtjeva za poziv"
                  : q
                    ? "Nema rezultata za tu pretragu"
                    : "Ovdje trenutno nema nikoga"
              }
              description={callbacks.length === 0 ? "Kad netko ostavi broj na stranici, pojavit će se ovdje." : undefined}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map(({ key, ...data }) => (
                <CallbackCard key={key} data={data} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
