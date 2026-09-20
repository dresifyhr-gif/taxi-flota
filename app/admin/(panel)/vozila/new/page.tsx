import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createVehicleAction } from "@/app/admin/actions";
import { Card, Notice } from "@/components/admin/ui";
import { VehicleForm } from "@/components/admin/vehicle-form";

export default async function NewVehiclePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/vozila"
        className="inline-flex items-center gap-1.5 text-sm text-white/45 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Sva vozila
      </Link>
      <h1 className="text-2xl font-bold text-white">Novo vozilo</h1>
      {error ? <Notice tone="error">Spremanje nije uspjelo: {error}</Notice> : null}
      <Card>
        <VehicleForm action={createVehicleAction} submitLabel="Spremi vozilo" />
      </Card>
    </div>
  );
}
