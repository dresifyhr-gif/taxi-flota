import Image from "next/image";
import { Plus } from "lucide-react";

import { deleteVehicleAction } from "@/app/admin/actions";
import { Button, ButtonLink, Card, Notice } from "@/components/admin/ui";
import { getAllVehicles, type Vehicle } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export default async function VozilaPage() {
  let vehicles: Vehicle[] = [];
  let loadError = false;
  try {
    vehicles = await getAllVehicles();
  } catch {
    loadError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vozila za najam</h1>
          <p className="mt-1 text-sm text-neutral-400">{vehicles.length} vozila</p>
        </div>
        <ButtonLink href="/admin/vozila/new">
          <Plus className="h-4 w-4" /> Dodaj vozilo
        </ButtonLink>
      </div>

      {loadError ? (
        <Notice tone="error">
          Ne mogu učitati vozila. Pokreni migraciju <code>supabase/admin-migration.sql</code> u
          Supabaseu (kreira tablicu <code>vehicles</code>).
        </Notice>
      ) : vehicles.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-400">Još nema vozila. Klikni „Dodaj vozilo“.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative aspect-[16/10] bg-neutral-800">
                {vehicle.images?.[0] ? (
                  <Image src={vehicle.images[0]} alt={vehicle.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                    bez slike
                  </div>
                )}
                {vehicle.images && vehicle.images.length > 1 ? (
                  <span className="absolute right-2 top-2 rounded-full bg-neutral-950/80 px-2 py-0.5 text-xs font-semibold text-white">
                    {vehicle.images.length} slika
                  </span>
                ) : null}
                {!vehicle.is_published ? (
                  <span className="absolute left-2 top-2 rounded-full bg-neutral-950/80 px-2 py-0.5 text-xs font-semibold text-amber-300">
                    Skriveno
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{vehicle.title}</h2>
                  <span className="whitespace-nowrap text-sm text-emerald-400">{vehicle.price}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {vehicle.transmission} · {vehicle.fuel} · {vehicle.location}
                </p>
                <div className="mt-4 flex items-center gap-2 pt-2">
                  <ButtonLink href={`/admin/vozila/${vehicle.id}`} variant="secondary" className="flex-1">
                    Uredi
                  </ButtonLink>
                  <form action={deleteVehicleAction}>
                    <input type="hidden" name="id" value={vehicle.id} />
                    <Button type="submit" variant="danger">
                      Obriši
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
