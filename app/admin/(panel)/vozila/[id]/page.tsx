import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateVehicleAction } from "@/app/admin/actions";
import { Card, Notice } from "@/components/admin/ui";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { getVehicleById } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/vozila"
        className="inline-flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Sva vozila
      </Link>
      <h1 className="text-2xl font-bold text-white">Uredi: {vehicle.title}</h1>
      {error ? <Notice tone="error">Spremanje nije uspjelo: {error}</Notice> : null}
      <Card>
        <VehicleForm action={updateVehicleAction} vehicle={vehicle} submitLabel="Spremi izmjene" />
      </Card>
    </div>
  );
}
