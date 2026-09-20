import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BadgeCheck, Fuel, Gauge, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RouteBackdrop } from "@/components/sections";
import { Container } from "@/components/ui";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { FavoriteHeart } from "@/components/favorite-heart";
import { rentalVehicles } from "@/lib/site";
import { getVehicleBySlug } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

type DetailVehicle = {
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

async function loadVehicle(slug: string): Promise<DetailVehicle | null> {
  try {
    const v = await getVehicleBySlug(slug);
    if (v) return { ...v, is_rented: v.is_rented ?? false };
  } catch {
    // baza nedostupna — probaj ugrađenu ponudu
  }
  const fallback = rentalVehicles.find((v) => v.slug === slug);
  if (fallback) return { ...fallback, images: [fallback.image], is_rented: false };
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await loadVehicle(slug);
  if (!vehicle) return { title: "Vozilo | FleetHub" };
  return {
    title: `${vehicle.title} | Najam — FleetHub`,
    description: vehicle.description?.slice(0, 160) || `Najam vozila ${vehicle.title} kroz FleetHub flotu.`,
    alternates: { canonical: `/najam-vozila/${vehicle.slug}` },
  };
}

function Spec({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5 text-xs text-white/45">
        <Icon className="h-3.5 w-3.5 text-accent" /> {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await loadVehicle(slug);
  if (!vehicle) notFound();

  const rented = vehicle.is_rented;

  return (
    <section className="relative overflow-hidden bg-[#070a08]">
      <RouteBackdrop />
      <Container className="relative py-8 sm:py-12">
        <Link
          href="/najam-vozila"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Natrag na ponudu
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          {/* Galerija */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <VehicleGallery images={vehicle.images} title={vehicle.title} />
            {rented ? (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-black/75 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-300 backdrop-blur">
                Iznajmljeno
              </span>
            ) : null}
            <FavoriteHeart
              slug={vehicle.slug}
              className="absolute right-3 top-3 z-10 bg-black/50 backdrop-blur hover:bg-black/70"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{vehicle.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-2xl font-bold text-accent">{vehicle.price}</p>
              {rented ? (
                <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-0.5 text-xs font-semibold text-orange-300">
                  Trenutno iznajmljeno
                </span>
              ) : (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  Dostupno za najam
                </span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Spec icon={Gauge} label="Mjenjač" value={vehicle.transmission} />
              <Spec icon={Fuel} label="Gorivo" value={vehicle.fuel} />
              <Spec icon={MapPin} label="Lokacija" value={vehicle.location} />
            </div>

            {vehicle.description ? (
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/65">{vehicle.description}</p>
            ) : null}

            {vehicle.highlights?.length ? (
              <ul className="mt-5 grid gap-1.5">
                {vehicle.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-white/75">
                    <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/prijava"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accentDark hover:text-white"
              >
                {rented ? "Prijavi se (javimo kad se oslobodi)" : "Prijavi se za ovaj auto"}
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
        </div>
      </Container>
    </section>
  );
}
