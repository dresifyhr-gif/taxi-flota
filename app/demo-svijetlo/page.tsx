import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Gauge, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui";
import { FavoriteHeart } from "@/components/favorite-heart";
import { cn } from "@/lib/utils";
import { rentalVehicles } from "@/lib/site";
import { getPublishedVehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Demo — svijetla verzija | FleetHub",
  robots: { index: false, follow: false },
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
    // baza nedostupna — ugrađena ponuda
  }
  return rentalVehicles.map((v) => ({ ...v, images: [v.image], is_rented: false }));
}

/** Svijetli suptilni backdrop — isti "efekt" kao tamni, samo kontra boje. */
function LightBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45rem 32rem at 12% -10%, rgba(52,209,134,0.18), transparent 60%), radial-gradient(40rem 30rem at 100% 0%, rgba(52,209,134,0.12), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,21,18,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,21,18,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          animation: "grid-move 8s linear infinite",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />
    </div>
  );
}

function AdRow({ vehicle, featured }: { vehicle: CardVehicle; featured: boolean }) {
  const img = vehicle.images?.[0];
  const rented = vehicle.is_rented;
  const meta = [vehicle.transmission, vehicle.fuel].filter(Boolean).join(" · ");
  const extra = vehicle.highlights?.[0];

  return (
    <div className={cn("relative", featured && "bg-emerald-50/70")}>
      <Link
        href="/demo-svijetlo"
        className={cn("group flex gap-3 p-3 transition hover:bg-neutral-50 sm:gap-4 sm:p-4", rented && "opacity-70")}
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-44">
          {img ? (
            <Image
              src={img}
              alt={vehicle.title}
              fill
              sizes="(max-width: 640px) 40vw, 180px"
              className={cn("object-cover transition duration-300 group-hover:scale-[1.03]", rented && "grayscale")}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">bez slike</div>
          )}
          {vehicle.images.length > 1 ? (
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {vehicle.images.length} 📷
            </span>
          ) : null}
          {rented ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-600">
                Iznajmljeno
              </span>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 pr-9">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#0d1512] sm:text-base">
            {vehicle.title}
          </h3>
          {meta ? <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{meta}</p> : null}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
            <MapPin className="h-3 w-3" /> {vehicle.location}
          </p>
          <p className="mt-2 text-lg font-bold text-[#0d1512] sm:text-xl">{vehicle.price}</p>
          {extra ? <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">{extra}</p> : null}
          <p className="mt-1 text-xs font-semibold">
            {rented ? (
              <span className="text-orange-600">Trenutno iznajmljeno</span>
            ) : featured ? (
              <span className="text-emerald-600">★ Istaknuto</span>
            ) : (
              <span className="text-emerald-600/90">Dostupno za najam</span>
            )}
          </p>
        </div>
      </Link>
      <FavoriteHeart slug={vehicle.slug} tone="light" className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3" />
    </div>
  );
}

export default async function DemoLightPage() {
  const all = await loadVehicles();
  const vehicles = [...all.filter((v) => !v.is_rented), ...all.filter((v) => v.is_rented)];
  const availableCount = all.filter((v) => !v.is_rented).length;

  const trust = [
    { icon: BadgeCheck, label: "Bez pologa" },
    { icon: ShieldCheck, label: "Kasko uključen" },
    { icon: Gauge, label: "Novije generacije" },
    { icon: MapPin, label: "Zagreb" },
  ];

  return (
    <main className="min-h-screen bg-[#f6f7f6] text-[#0d1512]">
      {/* Svijetli header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between sm:h-18">
          <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Fleet<span className="text-emerald-500">Hub</span>
          </span>
          <div className="hidden items-center gap-5 text-sm font-semibold text-neutral-600 lg:flex">
            <span className="cursor-default">Početna</span>
            <span className="cursor-default">Kako radi</span>
            <span className="cursor-default">Naše usluge</span>
            <span className="text-[#0d1512]">Najam vozila</span>
          </div>
          <Link
            href="/prijava"
            className="rounded-2xl bg-accent px-5 py-2 text-sm font-black tracking-widest text-white transition hover:bg-accentDark"
          >
            PRIJAVI SE
          </Link>
        </Container>
      </header>

      {/* Demo traka */}
      <div className="bg-emerald-50 px-4 py-2 text-center text-xs font-medium text-emerald-700">
        Demo — svijetla verzija.{" "}
        <Link href="/najam-vozila" className="font-semibold underline">
          Usporedi s tamnom →
        </Link>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <LightBackdrop />
        <Container className="relative">
          <div className="max-w-3xl py-14 sm:py-18">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Oglasnik vozila
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl" style={{ lineHeight: 1.05 }}>
              Auto ti dajemo mi — <span className="text-emerald-500">voziš odmah.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Vozila dajemo u najam <strong className="text-[#0d1512]">isključivo vozačima koji rade kroz našu flotu</strong> na
              Uber i Bolt platformama. Svi auti su novije generacije, kasko osigurani i spremni za rad.
            </p>

            <div className="mt-7 inline-flex items-baseline gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
              <span className="text-sm font-medium text-neutral-500">Tjedni najam</span>
              <span className="text-2xl font-bold text-[#0d1512]">160–250 €</span>
              <span className="text-sm font-medium text-neutral-400">/ tjedno</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {trust.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-500" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* OGLASI */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Ponuda vozila</p>
              <h2 className="mt-1.5 text-xl font-bold sm:text-2xl">Sva dostupna vozila</h2>
            </div>
            <span className="shrink-0 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-600">
              {availableCount} dostupno
            </span>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              Trenutno nema objavljenih vozila.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {vehicles.map((vehicle, i) => (
                <AdRow key={vehicle.slug} vehicle={vehicle} featured={i < 2 && !vehicle.is_rented} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Ne znaš koji auto ti odgovara?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
              Najam nije javna usluga — auto dobivaš kao naš vozač, uz jasne uvjete i podršku.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/prijava"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accentDark"
              >
                Prijavi se i dogovori najam
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/zatrazi-poziv"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#0d1512] transition hover:border-emerald-400 hover:text-emerald-600"
              >
                <PhoneCall className="h-4 w-4" />
                Zatraži poziv
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
