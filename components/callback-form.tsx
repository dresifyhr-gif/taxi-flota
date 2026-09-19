"use client";

import { LoaderCircle, PhoneCall } from "lucide-react";
import { useState, useTransition } from "react";

export function CallbackForm() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ status: "idle" | "success" | "error"; message?: string }>({
    status: "idle",
  });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullName.trim().length < 2 || phone.trim().length < 8) {
      setState({ status: "error", message: "Upiši ime i ispravan broj mobitela." });
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/callbacks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phone, website }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setState({ status: "error", message: data?.message || "Pokušaj ponovno." });
          return;
        }
        setState({ status: "success", message: data?.message });
        setFullName("");
        setPhone("");
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

const inputClassName =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent focus:bg-white/[0.08]";
