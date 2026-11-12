"use client";

import { ChevronDown, LoaderCircle, PhoneCall, X } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";

export function CallbackForm({
  variant = "card",
  secondary,
}: {
  variant?: "card" | "inline";
  /** Samo za "inline": sadržaj pored gumba dok je forma zatvorena. */
  secondary?: ReactNode;
} = {}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ status: "idle" | "success" | "error"; message?: string }>({
    status: "idle",
  });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [needsRental, setNeedsRental] = useState<boolean | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullName.trim().length < 2 || phone.trim().length < 8) {
      setState({ status: "error", message: "Upiši ime i ispravan broj mobitela." });
      return;
    }
    if (needsRental === null) {
      setState({ status: "error", message: "Odaberi trebaš li vozilo za najam." });
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/callbacks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phone, website, needsRental }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setState({ status: "error", message: data?.message || "Pokušaj ponovno." });
          return;
        }
        setState({ status: "success", message: data?.message });
        setFullName("");
        setPhone("");
        setNeedsRental(null);
      } catch {
        setState({ status: "error", message: "Provjeri internet i pokušaj ponovno." });
      }
    });
  }

  if (state.status === "success") {
    return (
      <div className="rounded-[2rem] border border-accent/30 bg-accent/10 p-8 text-center">
        <div className="mb-2 text-3xl">📞</div>
        <p className="text-lg font-semibold text-accent">Zahtjev zaprimljen!</p>
        <p className="mt-2 text-sm leading-6 text-white/60">
          {state.message || "Javit ćemo ti se u najkraćem roku."}
        </p>
      </div>
    );
  }

  // Hero naslovnice: prvo samo gumb, a polja se otvore tek na klik.
  if (variant === "inline") {
    return (
      <div className="mx-auto w-full max-w-xl">
        {!open ? (
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              aria-expanded={false}
              onClick={() => setOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-accent px-7 py-3.5 text-sm font-bold text-[#04120b] shadow-[0_10px_40px_rgba(52,209,134,0.28)] transition hover:bg-accentDark sm:w-auto"
            >
              <PhoneCall className="h-4 w-4" />
              Zatraži poziv
              <ChevronDown className="h-4 w-4" />
            </button>
            {secondary}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="animate-hero-form rounded-[1.6rem] border border-white/15 bg-white/[0.07] p-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-4"
          >
            <input
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <p className="text-sm font-semibold text-white">Ostavi broj — zovemo te isti dan</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Zatvori"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                aria-label="Ime i prezime"
                placeholder="Ime i prezime"
                className={inlineInputClassName}
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                aria-label="Broj mobitela"
                placeholder="Broj mobitela"
                className={inlineInputClassName}
              />
            </div>
            <div className="mt-3 px-1">
              <RentalChoice value={needsRental} onChange={setNeedsRental} compact />
            </div>
            {state.status === "error" ? (
              <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300">
                {state.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isPending}
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-bold text-[#04120b] transition hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <PhoneCall className="h-4 w-4" />}
              Pošalji zahtjev
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8"
    >
      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/90">Ime i prezime</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClassName}
            placeholder="Upiši ime i prezime"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/90">Broj mobitela</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            className={inputClassName}
            placeholder="Upiši broj mobitela"
          />
        </div>
        <RentalChoice value={needsRental} onChange={setNeedsRental} />
        {state.status === "error" ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white transition hover:bg-accentDark hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <PhoneCall className="h-5 w-5" />}
          Zatraži poziv
        </button>
        <p className="text-center text-xs text-white/40">
          Ostavi ime i broj — mi te kontaktiramo, bez obveze.
        </p>
      </div>
    </form>
  );
}

function RentalChoice({
  value,
  onChange,
  compact = false,
}: {
  value: boolean | null;
  onChange: (value: boolean) => void;
  compact?: boolean;
}) {
  const options = [
    { value: true, label: compact ? "Da" : "Da, trebam vozilo" },
    { value: false, label: compact ? "Ne" : "Ne, imam svoje" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Trebaš li vozilo za najam?"
      className={compact ? "flex flex-wrap items-center justify-between gap-x-3 gap-y-2" : ""}
    >
      <span className={compact ? "text-xs font-semibold text-white/80" : "mb-2 block text-sm font-semibold text-white/90"}>
        Trebaš vozilo za najam?
      </span>
      <div className={compact ? "flex gap-1.5" : "grid grid-cols-2 gap-2"}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-xl border font-semibold transition ${compact ? "px-4 py-1.5 text-xs" : "px-4 py-3 text-sm"} ${
                selected
                  ? "border-accent bg-accent text-[#04120b]"
                  : "border-white/15 bg-white/[0.05] text-white/75 hover:border-accent/50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inlineInputClassName =
  "hero-callback-input h-12 w-full min-w-0 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-accent focus:bg-black/35";

const inputClassName =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent focus:bg-white/[0.08]";
