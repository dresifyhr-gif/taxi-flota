import type { Metadata } from "next";

import { CallbackForm } from "@/components/callback-form";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Zatraži poziv | FleetHub",
  description:
    "Nisi siguran? Ostavi ime i broj mobitela — mi te kontaktiramo i odgovorimo na sva pitanja, bez obveze.",
  alternates: { canonical: "/zatrazi-poziv" },
};

export default function CallbackPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-black/10 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Bez obveze
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">
              Nisi siguran? Zatraži poziv
            </h1>
            <p className="mt-4 text-base leading-7 text-black/55">
              Imaš pitanja ili se ne želiš odmah prijavljivati? Ostavi ime i broj mobitela — mi ćemo
              se javiti tebi i objasniti sve što te zanima.
            </p>
          </div>

          <div className="mt-10">
            <CallbackForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
