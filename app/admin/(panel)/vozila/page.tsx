import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteVehicleAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ButtonLink, Card, Notice, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { getAllVehicles, type Vehicle } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "Sva" },
  { value: "published", label: "Objavljena" },
  { value: "hidden", label: "Skrivena" },
];

export default async function VozilaPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "" } = await searchParams;

  let vehicles: Vehicle[] = [];
  let loadError = false;
  try {
    vehicles = await getAllVehicles();
  } catch {
    loadError = true;
  }

  const filtered = vehicles.filter((v) =>
    filter === "published" ? v.is_published : filter === "hidden" ? !v.is_published : true,
  );
  const publishedCount = vehicles.filter((v) => v.is_published).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vozila za najam"
        subtitle={`${vehicles.length} vozila · ${publishedCount} objavljeno`}
      >
        <ButtonLink href="/admin/vozila/new">
          <Plus className="h-4 w-4" /> Dodaj vozilo
        </ButtonLink>
      </PageHeader>

      {vehicles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/admin/vozila?filter=${f.value}` : "/admin/vozila"}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                filter === f.value
                  ? "border-accent/40 bg-accent/12 text-accent"
                  : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>
      ) : null}

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati vozila. Pokreni migraciju <code>supabase/admin-migration.sql</code> u
          Supabaseu (kreira tablicu <code>vehicles</code>).
        </Notice>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-white/45">
            {vehicles.length === 0 ? "Još nema vozila. Klikni „Dodaj vozilo“." : "Nema vozila u ovom filteru."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vehicle) => (
            <Card key={vehicle.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative aspect-[16/10] bg-white/[0.04]">
                {vehicle.images?.[0] ? (
                  <Image src={vehicle.images[0]} alt={vehicle.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/35">
                    bez slike
                  </div>
                )}
                {vehicle.images && vehicle.images.length > 1 ? (
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                    {vehicle.images.length} slika
                  </span>
                ) : null}
                {!vehicle.is_published ? (
                  <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur">
                    Skriveno
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-white">{vehicle.title}</h2>
                  <span className="whitespace-nowrap text-sm font-semibold text-accent">{vehicle.price}</span>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  {vehicle.transmission} · {vehicle.fuel} · {vehicle.location}
                </p>
                <div className="mt-4 flex items-center gap-2 pt-2">
                  <ButtonLink href={`/admin/vozila/${vehicle.id}`} variant="secondary" className="flex-1">
                    Uredi
                  </ButtonLink>
                  <DeleteButton
                    action={deleteVehicleAction}
                    id={vehicle.id}
                    label="Obriši"
                    confirmText={`Obrisati vozilo "${vehicle.title}"? Ovo se ne može poništiti.`}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
