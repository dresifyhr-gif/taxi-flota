import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createVehicleAction } from "@/app/admin/actions";
import { Card } from "@/components/admin/ui";
import { VehicleForm } from "@/components/admin/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/vozila"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Sva vozila
      </Link>
      <h1 className="text-2xl font-bold">Novo vozilo</h1>
      <Card>
        <VehicleForm action={createVehicleAction} submitLabel="Spremi vozilo" />
      </Card>
    </div>
  );
}
