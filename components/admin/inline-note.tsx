"use client";

import { useRef } from "react";

import { updateCallbackNoteAction } from "@/app/admin/actions";

/** Mala bilješka koja se sprema na blur (kad se tekst promijeni). */
export function InlineNote({ id, note, full = false }: { id: string; note: string | null; full?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initial = note ?? "";

  return (
    <form ref={formRef} action={updateCallbackNoteAction}>
      <input type="hidden" name="id" value={id} />
      <input
        name="note"
        defaultValue={initial}
        placeholder="bilješka…"
        onBlur={(e) => {
          if (e.currentTarget.value.trim() !== initial.trim()) formRef.current?.requestSubmit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className={`${full ? "w-full" : "w-40"} rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-accent/60 focus:bg-white/[0.06]`}
      />
    </form>
  );
}
