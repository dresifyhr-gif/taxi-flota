"use client";

import { useRef } from "react";

import { setApplicationStatusListAction } from "@/app/admin/actions";

const STATUS_OPTIONS = ["novo", "kontaktiran", "odobreno", "odbijeno"] as const;

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  kontaktiran: "Kontaktiran",
  odobreno: "Odobreno",
  odbijeno: "Odbijeno",
};

const STATUS_COLOR: Record<string, string> = {
  novo: "text-sky-300",
  kontaktiran: "text-amber-300",
  odobreno: "text-accent",
  odbijeno: "text-red-300",
};

/**
 * Padajući izbornik statusa koji se sam potvrđuje (bez „Spremi“ gumba)
 * i vraća korisnika natrag na listu s očuvanim filterima.
 */
export function InlineStatus({
  id,
  status,
  redirectTo,
}: {
  id: string;
  status: string | null;
  redirectTo: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const current = status ?? "novo";

  return (
    <form ref={formRef} action={setApplicationStatusListAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <select
        name="status"
        defaultValue={current}
        onChange={() => formRef.current?.requestSubmit()}
        className={`cursor-pointer rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-semibold outline-none transition hover:border-white/25 focus:border-accent/60 ${STATUS_COLOR[current] ?? "text-white"}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-[#0d120f] text-white">
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
