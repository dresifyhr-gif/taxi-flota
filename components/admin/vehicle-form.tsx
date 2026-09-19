import Image from "next/image";

import { Button, ButtonLink, Field, inputClass, labelClass } from "@/components/admin/ui";
import type { Vehicle } from "@/lib/vehicles";

export function VehicleForm({
  action,
  vehicle,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  vehicle?: Vehicle | null;
  submitLabel: string;
}) {
  const images = vehicle?.images ?? [];

  return (
    <form action={action} className="space-y-5">
      {vehicle ? <input type="hidden" name="id" value={vehicle.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Naziv vozila">
          <input name="title" required defaultValue={vehicle?.title} className={inputClass} placeholder="VW Passat 2021" />
        </Field>
        <Field label="Cijena">
          <input name="price" required defaultValue={vehicle?.price} className={inputClass} placeholder="od 200 EUR / tjedno" />
        </Field>
        <Field label="Mjenjač">
          <input name="transmission" required defaultValue={vehicle?.transmission} className={inputClass} placeholder="Automatik" />
        </Field>
        <Field label="Gorivo">
          <input name="fuel" required defaultValue={vehicle?.fuel} className={inputClass} placeholder="Dizel" />
        </Field>
        <Field label="Lokacija">
          <input name="location" defaultValue={vehicle?.location ?? "Zagreb"} className={inputClass} placeholder="Zagreb" />
        </Field>
        <Field label="Redoslijed (manji = prije)">
          <input name="sort_order" type="number" defaultValue={vehicle?.sort_order ?? 0} className={inputClass} />
        </Field>
      </div>

      <Field label="Opis">
        <textarea name="description" rows={3} defaultValue={vehicle?.description} className={inputClass} placeholder="Kratki opis vozila…" />
      </Field>

      <Field label="Prednosti (jedna po retku)" hint="Npr. „Dizel, automatik“ — svaki redak je zasebna stavka.">
        <textarea
          name="highlights"
          rows={3}
          defaultValue={vehicle?.highlights?.join("\n")}
          className={inputClass}
          placeholder={"Dizel, automatik\n200 EUR tjedno, bez pologa\nKasko osiguranje uključeno"}
        />
      </Field>

      {images.length > 0 ? (
        <div>
          <span className={labelClass}>Trenutne slike</span>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img} className="rounded-lg border border-neutral-200 p-2">
                <input type="hidden" name="existingImages" value={img} />
                <div className="relative aspect-[16/10] overflow-hidden rounded bg-neutral-100">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
                <label className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                  <input type="checkbox" name="remove" value={img} className="h-3.5 w-3.5" />
                  Ukloni
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Field label="Dodaj slike" hint="Možeš odabrati više slika odjednom (JPG/PNG). Prva slika je naslovna.">
        <input name="image" type="file" accept="image/*" multiple className={inputClass} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-neutral-800">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={vehicle ? vehicle.is_published : true}
          className="h-4 w-4 rounded border-neutral-600 bg-white"
        />
        Objavljeno (vidljivo na stranici)
      </label>

      <input type="hidden" name="slug" value={vehicle?.slug ?? ""} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit">{submitLabel}</Button>
        <ButtonLink href="/admin/vozila" variant="secondary">
          Odustani
        </ButtonLink>
      </div>
    </form>
  );
}
