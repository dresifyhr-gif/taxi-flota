"use client";

import { ArrowRight, Calculator, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui";
import { AuroraGlow } from "@/components/decor";

/* ------------------------------------------------------------------ *
 * Pretpostavke — UREDI po stvarnim brojevima svoje flote.
 * RATE = prosječna BRUTO zarada vozača po satu (nakon Uber/Bolt naknade,
 * prije FleetHub provizije). Raspon daje poštenu procjenu "od–do".
 * ------------------------------------------------------------------ */
const RATE_MIN = 10; // €/h (donja procjena)
const RATE_MAX = 14; // €/h (gornja procjena)
const COMMISSION = 0.1; // FleetHub provizija 10%
const RENT_PER_WEEK = 190; // prosječni tjedni najam vozila
const WEEKS_PER_MONTH = 4.33;

function round10(n: number) {
  return Math.max(0, Math.round(n / 10) * 10);
}

function eur(n: number) {
  return n.toLocaleString("hr-HR");
}

export function EarningsCalculatorSection() {
  const [hours, setHours] = useState(40);
  const [rental, setRental] = useState(false);

  const grossMin = hours * RATE_MIN;
  const grossMax = hours * RATE_MAX;
  const rent = rental ? RENT_PER_WEEK : 0;

  const weekMin = round10(grossMin * (1 - COMMISSION) - rent);
  const weekMax = round10(grossMax * (1 - COMMISSION) - rent);
  const monthMin = round10(weekMin * WEEKS_PER_MONTH);
  const monthMax = round10(weekMax * WEEKS_PER_MONTH);

  return (
    <section className="relative overflow-hidden bg-[#070a08] py-16 sm:py-20">
      <AuroraGlow />
      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <Calculator className="h-3.5 w-3.5" /> Kalkulator zarade
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Koliko možeš zaraditi?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            Povuci klizač i vidi okvirnu neto zaradu za rad na Uber i Bolt platformama kroz našu flotu.
          </p>
        </div>

        <div className="mx-auto mt-9 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Kontrole */}
            <div>
              <div className="flex items-end justify-between">
                <label htmlFor="hours" className="text-sm font-semibold text-white">
                  Sati vožnje tjedno
                </label>
                <span className="text-2xl font-bold text-accent">{hours}h</span>
              </div>
              <input
                id="hours"
                type="range"
                min={10}
                max={70}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="mt-3 w-full accent-accent"
              />
              <div className="mt-1 flex justify-between text-[11px] text-white/40">
                <span>10h</span>
                <span>honorarno</span>
                <span>puno radno</span>
                <span>70h</span>
              </div>

              <button
                type="button"
                onClick={() => setRental((v) => !v)}
                className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/20"
              >
                <span>
                  <span className="block text-sm font-semibold text-white">Najam vozila</span>
                  <span className="block text-xs text-white/50">Nemaš svoj auto? Oduzmi ~{RENT_PER_WEEK} € / tjedno.</span>
                </span>
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    rental ? "bg-accent" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      rental ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>

            {/* Rezultat */}
            <div className="rounded-[1.5rem] border border-accent/20 bg-gradient-to-br from-accent/[0.12] to-transparent p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                Procjena neto zarade
              </p>
              <p className="mt-3 text-xs text-white/50">Tjedno</p>
              <p className="text-3xl font-bold text-white sm:text-4xl">
                {eur(weekMin)}–{eur(weekMax)} €
              </p>
              <p className="mt-4 text-xs text-white/50">Mjesečno</p>
              <p className="text-2xl font-bold text-accent sm:text-3xl">
                {eur(monthMin)}–{eur(monthMax)} €
              </p>
              <Link
                href="/prijava"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-[#04120b] transition hover:bg-accentDark"
              >
                Prijavi se i počni zarađivati
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="mt-6 flex items-start gap-2 border-t border-white/8 pt-4 text-xs leading-5 text-white/40">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Okvirna procjena, nije zajamčena zarada. Računato s ~{RATE_MIN}–{RATE_MAX} € bruto zarade po
            satu i uključenom FleetHub provizijom od 10%. Stvarna zarada ovisi o satima, potražnji,
            gorivu i načinu rada.
          </p>
        </div>
      </Container>
    </section>
  );
}
