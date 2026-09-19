import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, MessageCircle, Phone } from "lucide-react";

import {
  deleteApplicationAction,
  setApplicationStatusAction,
  updateApplicationNoteAction,
} from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { CopyButton } from "@/components/admin/copy-button";
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
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-2.5 last:border-0">
      <span className="text-sm text-white/45">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value || "—"}</span>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { id } = await params;
  const { ok } = await searchParams;
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
        className="inline-flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Sve prijave
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{app.full_name}</h1>
          <StatusBadge status={app.status} />
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${app.phone}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 px-3.5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            <Phone className="h-4 w-4" /> Nazovi
          </a>
          <a
            href={whatsappLink(
              app.phone,
              `Pozdrav ${app.full_name}, javljamo se iz FleetHub-a u vezi Vaše prijave.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#20bd5a]"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>

      {ok === "note" ? <Notice tone="success">Bilješka je spremljena.</Notice> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/45">
              Podaci
            </h2>
            <InfoRow
              label="Telefon"
              value={
                <span className="inline-flex items-center gap-2">
                  <a className="text-accent hover:underline" href={`tel:${app.phone}`}>
                    {app.phone}
                  </a>
                  <CopyButton value={app.phone} label="" />
                </span>
              }
            />
            <InfoRow
              label="Email"
              value={
                <span className="inline-flex items-center gap-2">
                  <a className="text-accent hover:underline" href={`mailto:${app.email}`}>
                    {app.email}
                  </a>
                  <CopyButton value={app.email} label="" />
                </span>
              }
            />
            <InfoRow label="Sati dnevno" value={hoursLabel(app.hours_per_day)} />
            <InfoRow label="Zaprimljeno" value={new Date(app.created_at).toLocaleString("hr-HR")} />
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/45">
              Status
            </h2>
            <form action={setApplicationStatusAction} className="flex items-center gap-3">
              <input type="hidden" name="id" value={app.id} />
              <select name="status" defaultValue={app.status ?? "novo"} className={inputClass}>
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status} className="bg-[#0d120f]">
                    {status}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="secondary">
                Spremi
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/45">
              Bilješka
            </h2>
            <form action={updateApplicationNoteAction} className="space-y-3">
              <input type="hidden" name="id" value={app.id} />
              <textarea
                name="note"
                rows={4}
                defaultValue={app.note ?? ""}
                placeholder="Interna bilješka o vozaču (vidiš samo ti)…"
                className={inputClass}
              />
              <Button type="submit" variant="secondary">
                Spremi bilješku
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/45">
              Dokumenti
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {documents.map((doc) => (
                <div key={doc.label}>
                  <span className={labelClass}>{doc.label}</span>
                  {doc.url ? (
                    <div className="mt-1.5 flex gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 px-3 py-2 text-sm text-accent transition hover:border-accent/50 hover:bg-white/[0.04]"
                      >
                        <FileText className="h-4 w-4" /> Otvori
                      </a>
                      <a
                        href={doc.downloadUrl ?? doc.url}
                        download
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-[#04120b] transition hover:bg-accentDark"
                        title="Preuzmi"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="mt-1.5 rounded-xl border border-dashed border-white/10 px-3 py-2 text-sm text-white/35">
                      nema
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Notice tone="info">
                <span className="text-xs">
                  Linkovi na dokumente su privremeni (potpisani) i istječu nakon nekog vremena.
                </span>
              </Notice>
            </div>
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-3 border-red-500/20">
            <div>
              <h2 className="text-sm font-semibold text-white/80">Obriši prijavu</h2>
              <p className="mt-1 text-xs text-white/40">
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
      </div>
    </div>
  );
}
