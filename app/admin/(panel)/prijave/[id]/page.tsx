import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, MessageCircle } from "lucide-react";

import { deleteApplicationAction, setApplicationStatusAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button, Card, Notice, StatusBadge, inputClass, labelClass } from "@/components/admin/ui";
import {
  APPLICATION_STATUSES,
  createSignedUrlForPath,
  getApplicationById,
  hoursLabel,
  type ApplicationRow,
} from "@/lib/applications";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DOCUMENT_FIELDS: { label: string; key: keyof ApplicationRow }[] = [
  { label: "Osobna — prednja strana", key: "id_card_front_path" },
  { label: "Osobna — zadnja strana", key: "id_card_back_path" },
];

async function safeSignedUrl(path: string | null | undefined, download = false) {
  if (!path) return null;
  try {
    return await createSignedUrlForPath(path, download ? { download: true } : undefined);
  } catch {
    return null;
  }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-800 py-2 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-right text-sm font-medium text-neutral-100">{value || "—"}</span>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getApplicationById(id);
  if (!app) notFound();

  const documents = await Promise.all(
    DOCUMENT_FIELDS.map(async (field) => {
      const path = app[field.key] as string | null;
      const [url, downloadUrl] = await Promise.all([
        safeSignedUrl(path),
        safeSignedUrl(path, true),
      ]);
      return { label: field.label, url, downloadUrl };
    }),
  );

  return (
    <div className="space-y-6">
      <Link
        href="/admin/prijave"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Sve prijave
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{app.full_name}</h1>
          <StatusBadge status={app.status} />
        </div>
        <a
          href={whatsappLink(
            app.phone,
            `Pozdrav ${app.full_name}, javljamo se iz FleetHub-a u vezi Vaše prijave.`,
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#20bd5a]"
        >
          <MessageCircle className="h-4 w-4" /> Kontaktiraj na WhatsApp
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Podaci
            </h2>
            <InfoRow
              label="Telefon"
              value={
                <a className="text-emerald-400 hover:underline" href={`tel:${app.phone}`}>
                  {app.phone}
                </a>
              }
            />
            <InfoRow
              label="Email"
              value={
                <a className="text-emerald-400 hover:underline" href={`mailto:${app.email}`}>
                  {app.email}
                </a>
              }
            />
            <InfoRow label="Sati dnevno" value={hoursLabel(app.hours_per_day)} />
            <InfoRow
              label="Zaprimljeno"
              value={new Date(app.created_at).toLocaleString("hr-HR")}
            />
            {app.note ? (
              <div className="mt-3 rounded-lg bg-neutral-800/60 p-3 text-sm text-neutral-300">
                {app.note}
              </div>
            ) : null}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Status
            </h2>
            <form action={setApplicationStatusAction} className="flex items-center gap-3">
              <input type="hidden" name="id" value={app.id} />
              <select name="status" defaultValue={app.status ?? "novo"} className={inputClass}>
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="secondary">
                Spremi
              </Button>
            </form>
          </Card>
        </div>

        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
            Dokumenti
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {documents.map((doc) => (
              <div key={doc.label}>
                <span className={labelClass}>{doc.label}</span>
                {doc.url ? (
                  <div className="mt-1 flex gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-emerald-400 transition hover:border-emerald-500"
                    >
                      <FileText className="h-4 w-4" /> Otvori
                    </a>
                    <a
                      href={doc.downloadUrl ?? doc.url}
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
                      title="Preuzmi"
                    >
                      <Download className="h-4 w-4" /> Preuzmi
                    </a>
                  </div>
                ) : (
                  <div className="mt-1 rounded-lg border border-dashed border-neutral-800 px-3 py-2 text-sm text-neutral-600">
                    nema
                  </div>
                )}
              </div>
            ))}
          </div>
          <Notice tone="info">
            <span className="text-xs">
              Linkovi na dokumente su privremeni (potpisani) i istječu nakon nekog vremena.
            </span>
          </Notice>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3 border-red-500/20">
        <div>
          <h2 className="text-sm font-semibold text-neutral-200">Obriši prijavu</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Trajno briše prijavu i učitane dokumente. Ne može se poništiti.
          </p>
        </div>
        <DeleteButton
          action={deleteApplicationAction}
          id={app.id}
          label="Obriši prijavu"
          confirmText={`Sigurno obrisati prijavu "${app.full_name}"? Ovo se ne može poništiti.`}
        />
      </Card>
    </div>
  );
}
