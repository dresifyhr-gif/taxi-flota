import { Download, MessageCircle } from "lucide-react";

import { deleteCallbackAction, setCallbackStatusAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button, Card, Notice, inputClass } from "@/components/admin/ui";
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

export default async function PoziviPage() {
  let callbacks: CallbackRow[] = [];
  let loadError = false;
  try {
    callbacks = await listCallbacks();
  } catch {
    loadError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Zahtjevi za poziv</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Ljudi koji su ostavili ime i broj — nazovi ih preko WhatsAppa.
          </p>
        </div>
        <a
          href="/admin/export/pozivi"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500"
        >
          <Download className="h-4 w-4" /> Izvoz CSV
        </a>
      </div>

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati zahtjeve. Pokreni <code>supabase/schema.sql</code> (kreira tablicu
          <code> callback_requests</code>) i provjeri da je baza spojena.
        </Notice>
      ) : callbacks.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-400">Još nema zahtjeva za poziv.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ime</th>
                  <th className="px-4 py-3 font-semibold">Broj</th>
                  <th className="px-4 py-3 font-semibold">Zaprimljeno</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right">Akcija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {callbacks.map((cb) => (
                  <tr key={cb.id} className="hover:bg-neutral-800/40">
                    <td className="px-4 py-3 font-medium text-neutral-100">{cb.full_name}</td>
                    <td className="px-4 py-3 text-neutral-300">{cb.phone}</td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(cb.created_at)}</td>
                    <td className="px-4 py-3">
                      <form action={setCallbackStatusAction} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={cb.id} />
                        <select
                          name="status"
                          defaultValue={cb.status ?? "novo"}
                          className={`${inputClass} py-1`}
                        >
                          {CALLBACK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" variant="secondary" className="px-2 py-1 text-xs">
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
