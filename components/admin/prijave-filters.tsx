"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRef } from "react";

import { inputClass } from "@/components/admin/ui";

const HOURS_FILTERS = [
  { value: "", label: "Svi sati" },
  { value: "4", label: "4 sata" },
  { value: "8", label: "8 sati" },
  { value: "dodatan", label: "Dodatan rad" },
  { value: "nisam-siguran", label: "Nije siguran/na" },
];

const RANGE_FILTERS = [
  { value: "", label: "Sve" },
  { value: "danas", label: "Danas" },
  { value: "7", label: "7 dana" },
  { value: "30", label: "30 dana" },
];

export function PrijaveFilters({
  q,
  status,
  hours,
  range,
  statuses,
}: {
  q: string;
  status: string;
  hours: string;
  range: string;
  statuses: readonly string[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = () => formRef.current?.requestSubmit();
  const hasFilters = Boolean(q || status || hours || range);
  const selectCls = `${inputClass} w-auto cursor-pointer`;

  return (
    <form ref={formRef} method="get" className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Traži ime, broj ili email…"
          className={`${inputClass} pl-9`}
        />
      </div>
      <select name="status" defaultValue={status} onChange={submit} className={selectCls}>
        <option value="" className="bg-[#0d120f]">Svi statusi</option>
        {statuses.map((s) => (
          <option key={s} value={s} className="bg-[#0d120f]">
            {s}
          </option>
        ))}
      </select>
      <select name="hours" defaultValue={hours} onChange={submit} className={selectCls}>
        {HOURS_FILTERS.map((h) => (
          <option key={h.value} value={h.value} className="bg-[#0d120f]">
            {h.label}
          </option>
        ))}
      </select>
      <select name="range" defaultValue={range} onChange={submit} className={selectCls}>
        {RANGE_FILTERS.map((r) => (
          <option key={r.value} value={r.value} className="bg-[#0d120f]">
            {r.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
      >
        Traži
      </button>
      {hasFilters ? (
        <Link
          href="/admin/prijave"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
        >
          Poništi
        </Link>
      ) : null}
    </form>
  );
}
