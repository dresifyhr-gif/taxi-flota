import type { Metadata } from "next";
import Link from "next/link";
import { Info, PhoneCall } from "lucide-react";

import { ApplicationForm } from "@/components/application-form";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Prijava za vozača Uber i Bolt u Hrvatskoj | FleetHub",
  description:
    "Postani vozač na Uber i Bolt u Hrvatskoj — pridruži se FleetHub taxi floti. Brza online prijava, treba samo osobna iskaznica. Primamo nove vozače.",
  alternates: { canonical: "/prijava" },
};

export default function ApplicationPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Prijava
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pridruži se FleetHub floti
            </h1>
            <p className="mt-4 text-base leading-7 text-white/60">
              Brza online prijava — ispuni podatke i učitaj osobnu iskaznicu. Javit ćemo ti se u roku
              od 24 sata. Radimo na proviziju od 10%, isplata svaki tjedan četvrtkom.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-left">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold text-amber-200">Tko se može prijaviti</p>
              <p className="mt-1 text-sm leading-6 text-amber-100/70">
                Ne izdajemo radne dozvole. Primamo isključivo <strong>državljane EU s EU dokumentima</strong> te <strong>državljane Ukrajine</strong>.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/[0.08] p-5 text-left">
            <p className="font-semibold text-accent">
              Nemaš taxi diplomu ili karticu vozača? Nema problema.
            </p>
            <p className="mt-1 text-sm leading-6 text-white/60">
              Ako želiš voziti, a ne znaš koje dokumente trebaš ili ih još nemaš — vodimo te kroz
              cijeli proces i pomažemo ti da ih ishodiš. Ostavi kontakt i sve ti objasnimo korak po korak.
            </p>
            <Link
              href="/zatrazi-poziv"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accentDark hover:text-white"
            >
              <PhoneCall className="h-4 w-4" />
              Trebam pomoć oko dokumenata
            </Link>
          </div>

          <div className="mt-8">
            <ApplicationForm />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/45">Nisi siguran ili imaš pitanja?</p>
            <Link
              href="/zatrazi-poziv"
              className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accent"
            >
              <PhoneCall className="h-4 w-4" />
              Zatraži poziv umjesto toga
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
