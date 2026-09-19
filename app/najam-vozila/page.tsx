import type { Metadata } from "next";
import { CarFront, MapPin } from "lucide-react";
import Link from "next/link";

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

export default async function RentalVehiclesPage() {
  const vehicles = await loadVehicles();

  return (
    <section className="min-h-screen bg-[#f3f5f3] py-16 text-black sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accentDark">
            Oglasnik vozila
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Najam vozila za rad preko Uber i Bolt platformi
          </h1>
          <p className="mt-5 text-lg leading-8 text-black/68">
            Vozila dajemo u najam <strong>isključivo vozačima koji rade kroz našu flotu</strong> na Uber i Bolt platformama. Imamo razne aute i cijene — tjedni najam <strong>od 160 do 250 EUR</strong>, ovisno o modelu. Svi auti su novije generacije, kasko osigurani i spremni za rad.
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm leading-7 text-black/72 shadow-soft">
            Najam nije javna usluga — auto dobivaš kao naš vozač, uz jasne uvjete i podršku. Prijavi se za rad i javit ćemo ti koje je vozilo trenutno slobodno.
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm leading-7 text-black/72 shadow-soft">
              <p className="font-semibold text-accent">Od 160 EUR / tjedno</p>
              <p className="mt-2">Kompaktni i ekonomični modeli s ručnim mjenjačem.</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm leading-7 text-black/72 shadow-soft">
              <p className="font-semibold text-accent">Do 250 EUR / tjedno</p>
              <p className="mt-2">Prostraniji i premium automatik modeli.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6">
          {vehicles.map((vehicle) => (
            <article
              key={vehicle.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-soft sm:rounded-[2rem]"
            >
              <VehicleGallery images={vehicle.images} title={vehicle.title} />
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                  <h2 className="text-sm font-semibold leading-tight sm:text-lg">{vehicle.title}</h2>
                  <span className="whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-black">
                    {vehicle.price}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-black/55">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {vehicle.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CarFront className="h-3.5 w-3.5 text-accent" />
                    {vehicle.transmission} · {vehicle.fuel}
                  </span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-black/50">{vehicle.description}</p>

                <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
                  <Link
                    href="/prijava"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-black transition hover:bg-accentDark hover:text-white"
                  >
                    Prijavi se
                  </Link>
                  <Link
                    href="/zatrazi-poziv"
                    className="flex-1 inline-flex items-center justify-center rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold text-black transition hover:border-accent hover:text-accent"
                  >
                    Zatraži poziv
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
