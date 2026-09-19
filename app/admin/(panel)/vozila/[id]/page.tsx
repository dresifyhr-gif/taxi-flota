import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateVehicleAction } from "@/app/admin/actions";
import { Card } from "@/components/admin/ui";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { getVehicleById } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/vozila"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Sva vozila
      </Link>
      <h1 className="text-2xl font-bold">Uredi: {vehicle.title}</h1>
      <Card>
        <VehicleForm action={updateVehicleAction} vehicle={vehicle} submitLabel="Spremi izmjene" />
      </Card>
    </div>
  );
}
