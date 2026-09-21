import { Download, MessageCircle, Search } from "lucide-react";

import { deleteCallbackAction, setCallbackStatusAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { CopyButton } from "@/components/admin/copy-button";
import { InlineNote } from "@/components/admin/inline-note";
import { Button, ButtonLink, Card, Notice, PageHeader, StatusBadge, inputClass } from "@/components/admin/ui";
import { CALLBACK_STATUSES, filterCallbacks, listCallbacks, type CallbackRow } from "@/lib/callbacks";
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

export default async function PoziviPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  let callbacks: CallbackRow[] = [];
  let loadError = false;
  try {
    callbacks = await listCallbacks();
  } catch {
    loadError = true;
  }

  const filtered = filterCallbacks(callbacks, q);
  const exportHref = q ? `/admin/export/pozivi?q=${encodeURIComponent(q)}` : "/admin/export/pozivi";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zahtjevi za poziv"
        subtitle="Ljudi koji su ostavili ime i broj — nazovi ih preko WhatsAppa."
      >
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          <Download className="h-4 w-4" /> Izvoz CSV
        </a>
      </PageHeader>

      {callbacks.length > 0 ? (
        <form method="get" className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input name="q" defaultValue={q} placeholder="Traži ime ili broj…" className={`${inputClass} pl-9`} />
          </div>
          <Button type="submit" variant="secondary">
            Traži
          </Button>
          {q ? (
            <ButtonLink href="/admin/pozivi" variant="ghost">
              Poništi
            </ButtonLink>
          ) : null}
        </form>
      ) : null}

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati zahtjeve. Pokreni <code>supabase/schema.sql</code> (kreira tablicu{" "}
          <code>callback_requests</code>) i provjeri da je baza spojena.
        </Notice>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-white/45">
            {callbacks.length === 0 ? "Još nema zahtjeva za poziv." : "Nema rezultata za tu pretragu."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cb) => (
            <Card key={cb.id} className="flex flex-col gap-3.5">
              {/* Ime + status + datum */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-white">{cb.full_name}</p>
                  <p className="mt-0.5 text-xs text-white/45">{formatDate(cb.created_at)}</p>
                </div>
                <StatusBadge status={cb.status} />
              </div>

              {/* Broj + kopiraj */}
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
                <a href={`tel:${cb.phone}`} className="text-sm font-semibold text-white transition hover:text-accent">
                  {cb.phone}
                </a>
                <CopyButton value={cb.phone} label="Kopiraj" />
              </div>

              {/* Bilješka */}
              <div>
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-white/40">
                  Bilješka
                </span>
                <InlineNote id={cb.id} note={cb.note} full />
              </div>

              {/* Status */}
              <form action={setCallbackStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={cb.id} />
                <select name="status" defaultValue={cb.status ?? "novo"} className={`${inputClass} flex-1 py-2`}>
                  {CALLBACK_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#0d120f]">
                      {s}
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="secondary">
                  Spremi
                </Button>
              </form>

              {/* Akcije — WhatsApp veliki + brisanje */}
              <div className="mt-auto flex items-center gap-2 pt-1">
                <a
                  href={whatsappLink(
                    cb.phone,
                    `Pozdrav ${cb.full_name}, javljamo se iz FleetHub-a — tražili ste povratni poziv.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <DeleteButton
                  action={deleteCallbackAction}
                  id={cb.id}
                  label="Obriši"
                  confirmText={`Obrisati zahtjev "${cb.full_name}"?`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
