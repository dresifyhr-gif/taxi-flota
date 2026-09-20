import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Gauge, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { RouteBackdrop } from "@/components/sections";
import { Container } from "@/components/ui";
import { FavoriteHeart } from "@/components/favorite-heart";
import { cn } from "@/lib/utils";
import { rentalVehicles } from "@/lib/site";
import { getPublishedVehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Najam vozila za Uber i Bolt u Zagrebu | FleetHub",
  description:
    "Najam vozila za rad na Uber i Bolt platformama u Zagrebu — tjedni najam od 160 do 250 EUR, kasko osiguranje, bez pologa. Auti za vozače FleetHub taxi flote.",
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
  is_rented: boolean;
};

async function loadVehicles(): Promise<CardVehicle[]> {
  try {
    const vehicles = await getPublishedVehicles();
    if (vehicles.length > 0) return vehicles.map((v) => ({ ...v, is_rented: v.is_rented ?? false }));
  } catch {
    // baza nije dostupna — koristi ugrađenu ponudu
  }
  return rentalVehicles.map((v) => ({ ...v, images: [v.image], is_rented: false }));
}

function AdRow({ vehicle, featured }: { vehicle: CardVehicle; featured: boolean }) {
  const img = vehicle.images?.[0];
  const rented = vehicle.is_rented;
  const meta = [vehicle.transmission, vehicle.fuel].filter(Boolean).join(" · ");
  const extra = vehicle.highlights?.[0];

  return (
    <div className={cn("relative", featured && "bg-accent/[0.04]")}>
      <Link
        href={`/najam-vozila/${vehicle.slug}`}
        className={cn(
          "group flex gap-3 p-3 transition hover:bg-white/[0.03] sm:gap-4 sm:p-4",
          rented && "opacity-70",
        )}
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-white/5 sm:h-28 sm:w-44">
          {img ? (
            <Image
              src={img}
              alt={vehicle.title}
              fill
              sizes="(max-width: 640px) 40vw, 180px"
              className={cn("object-cover transition duration-300 group-hover:scale-[1.03]", rented && "grayscale")}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/35">bez slike</div>
          )}
          {vehicle.images.length > 1 ? (
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
              {vehicle.images.length} 📷
            </span>
          ) : null}
          {rented ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-md bg-black/75 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-300">
                Iznajmljeno
              </span>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 pr-9">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-base">
            {vehicle.title}
          </h3>
          {meta ? <p className="mt-1 text-xs text-white/45 sm:text-sm">{meta}</p> : null}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/40">
            <MapPin className="h-3 w-3" /> {vehicle.location}
          </p>
          <p className="mt-2 text-lg font-bold text-white sm:text-xl">{vehicle.price}</p>
          {extra ? <p className="mt-0.5 line-clamp-1 text-xs text-white/45">{extra}</p> : null}
          <p className="mt-1 text-xs font-semibold">
            {rented ? (
              <span className="text-orange-300/90">Trenutno iznajmljeno</span>
            ) : featured ? (
              <span className="text-accent">★ Istaknuto</span>
            ) : (
              <span className="text-accent/80">Dostupno za najam</span>
            )}
          </p>
        </div>
      </Link>
      <FavoriteHeart slug={vehicle.slug} className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3" />
    </div>
  );
}

export default async function RentalVehiclesPage() {
  const all = await loadVehicles();
  // Dostupni prvo, iznajmljeni na dno.
  const vehicles = [...all.filter((v) => !v.is_rented), ...all.filter((v) => v.is_rented)];
  const availableCount = all.filter((v) => !v.is_rented).length;

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
          <div className="max-w-3xl py-16 sm:py-20">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Oglasnik vozila
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl" style={{ lineHeight: 1.05 }}>
              Auto ti dajemo mi — <span className="hero-gradient-dark">voziš odmah.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
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

      {/* OGLASI — Njuškalo stil */}
      <section className="bg-[#070a08] pb-10 sm:pb-14">
        <Container>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Ponuda vozila</p>
              <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">Sva dostupna vozila</h2>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm font-medium text-white/60">
              {availableCount} dostupno
            </span>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/50">
              Trenutno nema objavljenih vozila. Javi se i predložimo ti auto.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              {vehicles.map((vehicle, i) => (
                <AdRow key={vehicle.slug} vehicle={vehicle} featured={i < 2 && !vehicle.is_rented} />
              ))}
            </div>
          )}
        </Container>
      </section>

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
