import type { Metadata } from "next";
import { CarFront, Gauge, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui";
import { rentalVehicles } from "@/lib/site";

export const metadata: Metadata = {
  title: "Najam vozila | TAXI FLOTA",
  description:
    "Ponuda vozila za najam kroz TAXI FLOTA flotu za vozače koji žele raditi preko Uber i Bolt platformi u Hrvatskoj.",
};

export default function RentalVehiclesPage() {
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
            Nudimo tjedni i dnevni najam vozila u Zagrebu. Svi auti su novije generacije od 2020. do 2025. godine, kasko osigurani i pripremljeni za rad kroz TAXI FLOTA flotu.
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm leading-7 text-black/72 shadow-soft">
            Trenutno raspolažemo s ponudom od 20+ vozila. Ako u tom trenutku nemamo slobodan auto u vlastitoj floti, pokušavamo osigurati vozilo kroz provjerene partnere.
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm leading-7 text-black/72 shadow-soft">
              <p className="font-semibold text-accent">Saltung</p>
              <p className="mt-2">Tjedni najam počinje od 180 EUR.</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm leading-7 text-black/72 shadow-soft">
              <p className="font-semibold text-accent">Automatik</p>
              <p className="mt-2">Tjedni najam počinje od 200 EUR.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {rentalVehicles.map((vehicle) => (
            <article
              key={vehicle.slug}
              className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <Image src={vehicle.image} alt={vehicle.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{vehicle.title}</h2>
                    <p className="mt-2 text-sm text-black/55">{vehicle.description}</p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-black">
                    {vehicle.price}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-black/72">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-accent" />
                    {vehicle.mileage}
                  </div>
                  <div className="flex items-center gap-2">
                    <CarFront className="h-4 w-4 text-accent" />
                    {vehicle.transmission} · {vehicle.fuel}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {vehicle.highlights.map((item) => (
                    <div key={item} className="flex gap-2 rounded-2xl border border-black/10 bg-[#f6f7f6] p-3 text-sm text-black/72">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/#prijava"
                    className="inline-flex items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:bg-accentDark hover:text-white"
                  >
                    Pošalji prijavu za ovo vozilo
                  </Link>
                  <Link
                    href="/#kontakt"
                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold text-black transition hover:border-accent hover:text-accent"
                  >
                    Zatraži više informacija
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
