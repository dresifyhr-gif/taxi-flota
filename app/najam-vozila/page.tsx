import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BadgeCheck, Fuel, Gauge, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { RouteBackdrop } from "@/components/sections";
import { Container } from "@/components/ui";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { rentalVehicles } from "@/lib/site";
import { getPublishedVehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Najam vozila | FleetHub",
  description:
    "Ponuda vozila za najam kroz našu flotu za vozače koji žele raditi preko Uber i Bolt platformi u Hrvatskoj. Tjedni najam od 160 do 250 EUR.",
  alternates: { canonical: "/najam-vozila" },
};

export const dynamic = "force-dynamic";

type CardVehicle = {
  slug: string;
  title: string;
  price: string;
  location: string;
  transmission: string;
  fuel: string;
  description: string;
  highlights: string[];
  images: string[];
};

async function loadVehicles(): Promise<CardVehicle[]> {
  try {
    const vehicles = await getPublishedVehicles();
    if (vehicles.length > 0) return vehicles;
  } catch {
    // baza nije dostupna — koristi ugrađenu ponudu
  }
  return rentalVehicles.map((v) => ({ ...v, images: [v.image] }));
}

function SpecPill({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/70">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {children}
    </span>
  );
}

function VehicleCard({ vehicle }: { vehicle: CardVehicle }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 sm:rounded-[1.75rem]">
      <div className="relative">
        <VehicleGallery images={vehicle.images} title={vehicle.title} />
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-[#070a08]/80 px-2.5 py-1 text-xs font-bold text-accent shadow-lg backdrop-blur">
          {vehicle.price}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-tight text-white sm:text-lg">{vehicle.title}</h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <SpecPill icon={MapPin}>{vehicle.location}</SpecPill>
          <SpecPill icon={Gauge}>{vehicle.transmission}</SpecPill>
          <SpecPill icon={Fuel}>{vehicle.fuel}</SpecPill>
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/50">{vehicle.description}</p>
        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
          <Link
            href="/prijava"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:bg-accentDark hover:text-white"
          >
            Prijavi se
          </Link>
          <Link
            href="/zatrazi-poziv"
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:border-accent/50 hover:text-accent"
          >
            Zatraži poziv
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function RentalVehiclesPage() {
  const vehicles = await loadVehicles();
  const featured = vehicles[0];
  const rest = vehicles.slice(1);

  const trust = [
    { icon: BadgeCheck, label: "Bez pologa" },
    { icon: ShieldCheck, label: "Kasko uključen" },
    { icon: Gauge, label: "Novije generacije" },
    { icon: MapPin, label: "Zagreb" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#070a08]">
        <RouteBackdrop />
        <Container className="relative">
          <div className="max-w-3xl py-20 sm:py-24">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Oglasnik vozila
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ lineHeight: 1.05 }}>
              Auto ti dajemo mi — <span className="hero-gradient-dark">voziš odmah.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Vozila dajemo u najam <strong className="text-white/90">isključivo vozačima koji rade kroz našu flotu</strong> na
              Uber i Bolt platformama. Svi auti su novije generacije, kasko osigurani i spremni za rad.
            </p>

            <div className="mt-7 inline-flex items-baseline gap-2 rounded-2xl border border-accent/25 bg-accent/[0.08] px-5 py-3">
              <span className="text-sm font-medium text-white/60">Tjedni najam</span>
              <span className="text-2xl font-bold text-white">160–250 €</span>
              <span className="text-sm font-medium text-white/50">/ tjedno</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {trust.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70"
                >
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* IZDVOJENO VOZILO */}
      {featured ? (
        <section className="bg-[#070a08] pb-4">
          <Container>
            <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] lg:grid-cols-[1.05fr_1fr]">
              <div className="relative">
                <VehicleGallery images={featured.images} title={featured.title} />
                <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-[#070a08]">
                  <BadgeCheck className="h-3.5 w-3.5" /> Izdvojeno vozilo
                </span>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-9">
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">{featured.title}</h2>
                  <p className="mt-1 text-xl font-bold text-accent">{featured.price}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SpecPill icon={MapPin}>{featured.location}</SpecPill>
                  <SpecPill icon={Gauge}>{featured.transmission}</SpecPill>
                  <SpecPill icon={Fuel}>{featured.fuel}</SpecPill>
                </div>
                <p className="text-sm leading-7 text-white/60">{featured.description}</p>
                {featured.highlights?.length ? (
                  <ul className="grid gap-1.5">
                    {featured.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-white/70">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/prijava"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accentDark hover:text-white"
                  >
                    Prijavi se za ovaj auto
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/zatrazi-poziv"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accent"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Zatraži poziv
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* SVA VOZILA */}
      {rest.length > 0 ? (
        <section className="bg-[#070a08] py-10 sm:py-14">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Cijela ponuda</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Sva dostupna vozila</h2>
              </div>
              <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white/60 sm:inline-flex">
                {vehicles.length} vozila
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {rest.map((vehicle) => (
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-[#070a08] pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-gradient-to-br from-accent/15 to-transparent p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ne znaš koji auto ti odgovara?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Najam nije javna usluga — auto dobivaš kao naš vozač, uz jasne uvjete i podršku. Javi se i
              predložimo vozilo prema tvom načinu rada.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/prijava"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accentDark hover:text-white"
              >
                Prijavi se i dogovori najam
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/zatrazi-poziv"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accent"
              >
                <PhoneCall className="h-4 w-4" />
                Zatraži poziv
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
