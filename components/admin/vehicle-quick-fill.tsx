"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { parseVehicleText } from "@/lib/parse-vehicle";

function setField(form: HTMLFormElement, name: string, value: string, onlyIfEmpty = false) {
  const el = form.elements.namedItem(name) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
  if (!el) return;
  if (!value) return;
  if (onlyIfEmpty && el.value.trim()) return;
  el.value = value;
}

/**
 * Zalijepi cijeli opis oglasa → automatski popuni polja (naziv, cijena, mjenjač,
 * gorivo, lokacija, opis, prednosti). Sve se može ručno doraditi nakon toga.
 */
export function VehicleQuickFill() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  function fill(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest("form");
    if (!form || !text.trim()) return;
    const p = parseVehicleText(text);

    setField(form, "title", p.title, true);
    setField(form, "price", p.price, true);
    setField(form, "transmission", p.transmission, true);
    setField(form, "fuel", p.fuel, true);
    setField(form, "location", p.location, true);
    setField(form, "description", p.description);
    if (p.highlights.length) setField(form, "highlights", p.highlights.join("\n"));

    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/[0.05] p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-white">Brzo popunjavanje iz teksta</span>
      </div>
      <p className="mt-1 text-xs text-white/45">
        Zalijepi cijeli opis oglasa i klikni „Popuni“ — sam izvuče naziv, cijenu, mjenjač, gorivo,
        lokaciju i prednosti. Sve možeš doraditi ispod.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={"Npr.\nVW Passat 2.0 TDI, 2019., automatik\nZagreb, prijeđeno 79.800 km\n- Kasko uključeno\n- Bez pologa\n200 € / tjedno"}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-accent/70 focus:bg-white/[0.06]"
      />
      <button
        type="button"
        onClick={fill}
        disabled={!text.trim()}
        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#04120b] transition hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Sparkles className="h-4 w-4" />
        {done ? "Popunjeno ✓" : "Popuni polja"}
      </button>
    </div>
  );
}
