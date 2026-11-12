"use client";

import { Check, LoaderCircle, MessageCircle, Phone, Repeat2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { deleteCallbackAction, saveCallbackNote, saveCallbackStatus } from "@/app/admin/actions";
import { CopyButton } from "@/components/admin/copy-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { cn, whatsappLink } from "@/lib/utils";

type Status = "novo" | "kontaktiran" | "rijeseno";

export type CallbackCardData = {
  ids: string[];
  full_name: string;
  phone: string;
  status: Status;
  note: string | null;
  /** Već formatirana vremena zahtjeva (najnoviji prvi). */
  requestedLabels: string[];
  /** Npr. „prije 2 h". */
  agoLabel: string;
};

const STATUS_OPTIONS: { value: Status; label: string; active: string }[] = [
  { value: "novo", label: "Novo", active: "bg-sky-400/15 text-sky-200 ring-1 ring-inset ring-sky-400/40" },
  { value: "kontaktiran", label: "Kontaktiran", active: "bg-amber-400/15 text-amber-200 ring-1 ring-inset ring-amber-400/40" },
  { value: "rijeseno", label: "Riješeno", active: "bg-accent/15 text-accent ring-1 ring-inset ring-accent/40" },
];

const STRIPE: Record<Status, string> = {
  novo: "bg-sky-400",
  kontaktiran: "bg-amber-400",
  rijeseno: "bg-accent/60",
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function CallbackCard({ data }: { data: CallbackCardData }) {
  const [status, setStatus] = useState<Status>(data.status);
  const [note, setNote] = useState(data.note ?? "");
  const [save, setSave] = useState<SaveState>("idle");
  const [, startTransition] = useTransition();
  const savedNote = useRef(data.note ?? "");
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ako server pošalje svježe podatke (npr. stigao novi zahtjev iste osobe), uskladi karticu.
  useEffect(() => setStatus(data.status), [data.status]);
  useEffect(() => {
    const incoming = data.note ?? "";
    if (incoming !== savedNote.current) {
      savedNote.current = incoming;
      setNote(incoming);
    }
  }, [data.note]);
  useEffect(
    () => () => {
      if (noteTimer.current) clearTimeout(noteTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    [],
  );

  function finish(ok: boolean) {
    setSave(ok ? "saved" : "error");
    if (savedTimer.current) clearTimeout(savedTimer.current);
    if (ok) savedTimer.current = setTimeout(() => setSave("idle"), 1800);
  }

  function changeStatus(next: Status) {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    setSave("saving");
    startTransition(async () => {
      const result = await saveCallbackStatus(data.ids, next).catch(() => ({ ok: false }));
      if (!result.ok) setStatus(previous);
      finish(result.ok);
    });
  }

  function persistNote(value: string) {
    if (noteTimer.current) clearTimeout(noteTimer.current);
    const trimmed = value.trim();
    if (trimmed === savedNote.current.trim()) return;
    setSave("saving");
    startTransition(async () => {
      const result = await saveCallbackNote(data.ids, trimmed).catch(() => ({ ok: false }));
      if (result.ok) savedNote.current = trimmed;
      finish(result.ok);
    });
  }

  function onNoteChange(value: string) {
    setNote(value);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => persistNote(value), 1200);
  }

  // Klik na WhatsApp / poziv = kontaktirao si ga → status se sam prebaci.
  function markContacted() {
    if (status === "novo") changeStatus("kontaktiran");
  }

  const count = data.ids.length;
  const firstName = data.full_name.trim().split(/\s+/)[0] || data.full_name;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-hairline bg-surface-raised/70 p-5 pl-6 shadow-card transition",
        status === "rijeseno" && "opacity-70 hover:opacity-100",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", STRIPE[status])} aria-hidden />

      {/* Ime, vrijeme, oznaka ponovljenog zahtjeva */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold leading-tight text-white">{data.full_name}</p>
          <p className="mt-1 text-xs text-white/45">
            {data.agoLabel} · {data.requestedLabels[0]}
          </p>
        </div>
        <span
          className={cn(
            "flex h-5 shrink-0 items-center gap-1 text-[11px] font-semibold transition-opacity",
            save === "idle" ? "opacity-0" : "opacity-100",
            save === "error" ? "text-red-300" : "text-white/50",
          )}
          aria-live="polite"
        >
          {save === "saving" ? (
            <>
              <LoaderCircle className="h-3 w-3 animate-spin" /> Spremam
            </>
          ) : save === "saved" ? (
            <>
              <Check className="h-3 w-3 text-accent" /> Spremljeno
            </>
          ) : save === "error" ? (
            "Nije spremljeno"
          ) : null}
        </span>
      </div>

      {count > 1 ? (
        <details className="group -mt-1 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] text-amber-200">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-semibold">
            <Repeat2 className="h-3.5 w-3.5" />
            Zatražio poziv {count} puta
            <span className="ml-auto text-[11px] font-medium text-amber-200/60 group-open:hidden">prikaži</span>
            <span className="ml-auto hidden text-[11px] font-medium text-amber-200/60 group-open:inline">sakrij</span>
          </summary>
          <ul className="space-y-1 border-t border-amber-400/15 px-3 py-2 text-xs text-amber-100/75">
            {data.requestedLabels.map((label, i) => (
              <li key={`${label}-${i}`} className="tabular-nums">
                {label}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {/* Broj */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-hairline bg-white/[0.03] px-3.5 py-2.5">
        <a
          href={`tel:${data.phone}`}
          onClick={markContacted}
          className="min-w-0 truncate whitespace-nowrap text-base font-semibold tabular-nums text-white transition hover:text-accent"
        >
          {data.phone}
        </a>
        <CopyButton value={data.phone} label="Kopiraj" />
      </div>

      {/* Kontakt — klik sam označi „Kontaktiran" */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappLink(
            data.phone,
            `Pozdrav ${firstName}, javljamo se iz FleetHub-a — tražili ste povratni poziv.`,
          )}
          target="_blank"
          rel="noreferrer"
          onClick={markContacted}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-black transition hover:bg-[#20bd5a]"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={`tel:${data.phone}`}
          onClick={markContacted}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-white/[0.04] text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.08]"
        >
          <Phone className="h-4 w-4" /> Nazovi
        </a>
      </div>

      {/* Status — sprema se na klik */}
      <div role="group" aria-label="Status" className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.04] p-1">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={status === option.value}
            onClick={() => changeStatus(option.value)}
            className={cn(
              "h-9 rounded-lg text-xs font-semibold transition",
              status === option.value ? option.active : "text-white/50 hover:bg-white/[0.05] hover:text-white",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Bilješka — sprema se sama */}
      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        onBlur={(e) => persistNote(e.target.value)}
        rows={2}
        placeholder="Bilješka (sprema se sama)…"
        className="w-full resize-none rounded-xl border border-hairline bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-accent/60 focus:bg-white/[0.05]"
      />

      <div className="-mt-1 flex justify-end">
        <DeleteButton
          action={deleteCallbackAction}
          id={data.ids.join(",")}
          label="Obriši"
          compact
          confirmText={
            count > 1
              ? `Obrisati svih ${count} zahtjeva osobe "${data.full_name}"?`
              : `Obrisati zahtjev "${data.full_name}"?`
          }
        />
      </div>
    </div>
  );
}
