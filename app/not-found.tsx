import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { RouteBackdrop } from "@/components/sections";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f0b]">
      <RouteBackdrop />
      <Container className="relative">
        <div className="mx-auto flex max-w-xl flex-col items-center py-28 text-center sm:py-36">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Greška 404</p>
          <h1 className="mt-3 text-7xl font-bold tracking-tight sm:text-8xl">
            <span className="hero-gradient-dark">404</span>
          </h1>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Stranica nije pronađena</h2>
          <p className="mt-3 text-base leading-7 text-white/60">
            Stranica koju tražiš ne postoji ili je premještena. Vrati se na početnu i nastavi.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accentDark hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Natrag na početnu
            </Link>
            <Link
              href="/prijava"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accent"
            >
              Prijavi se za vozača
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
