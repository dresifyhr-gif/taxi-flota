import { Download, MessageCircle, Search } from "lucide-react";

import { deleteCallbackAction, setCallbackStatusAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { CopyButton } from "@/components/admin/copy-button";
import { Button, ButtonLink, Card, Notice, PageHeader, inputClass } from "@/components/admin/ui";
import { CALLBACK_STATUSES, listCallbacks, type CallbackRow } from "@/lib/callbacks";
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

  const qLower = q.trim().toLowerCase();
  const filtered = callbacks.filter(
    (c) =>
      !qLower ||
      c.full_name.toLowerCase().includes(qLower) ||
      c.phone.toLowerCase().includes(qLower),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zahtjevi za poziv"
        subtitle="Ljudi koji su ostavili ime i broj — nazovi ih preko WhatsAppa."
      >
        <a
          href="/admin/export/pozivi"
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
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.07] text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ime</th>
                  <th className="px-4 py-3 font-semibold">Broj</th>
                  <th className="px-4 py-3 font-semibold">Zaprimljeno</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right">Akcija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((cb) => (
                  <tr key={cb.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-medium text-white">{cb.full_name}</td>
                    <td className="px-4 py-3 text-white/70">
                      <span className="inline-flex items-center gap-2">
                        <a href={`tel:${cb.phone}`} className="hover:text-white">
                          {cb.phone}
                        </a>
                        <CopyButton value={cb.phone} label="" />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/45">{formatDate(cb.created_at)}</td>
                    <td className="px-4 py-3">
                      <form action={setCallbackStatusAction} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={cb.id} />
                        <select
                          name="status"
                          defaultValue={cb.status ?? "novo"}
                          className={`${inputClass} w-auto py-1.5`}
                        >
                          {CALLBACK_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#0d120f]">
                              {s}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" variant="secondary" className="px-2.5 py-1.5 text-xs">
                          OK
                        </Button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={whatsappLink(
                            cb.phone,
                            `Pozdrav ${cb.full_name}, javljamo se iz FleetHub-a — tražili ste povratni poziv.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-[#20bd5a]"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                        <DeleteButton
                          action={deleteCallbackAction}
                          id={cb.id}
                          compact
                          label="Obriši"
                          confirmText={`Obrisati zahtjev "${cb.full_name}"?`}
                        />
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
