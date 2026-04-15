"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send, ShieldCheck, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { cities } from "@/lib/site";
import { applicationSchema } from "@/lib/validation";

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  hasOwnCar: "da" | "ne";
  birthDate: string;
  oib: string;
  note: string;
  consent: boolean;
  idCard: FileList;
  driverLicense: FileList;
  taxiDiploma: FileList;
  criminalRecordCertificate: FileList;
  selfiePhoto: FileList;
  website?: string;
};

type SubmitState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export function ApplicationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      applicationSchema.omit({
        idCard: true,
        driverLicense: true,
        taxiDiploma: true,
        criminalRecordCertificate: true,
        selfiePhoto: true,
      }),
    ),
    defaultValues: {
      hasOwnCar: "da",
      consent: false,
      note: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    formData.append("city", values.city);
    formData.append("hasOwnCar", values.hasOwnCar);
    formData.append("birthDate", values.birthDate);
    formData.append("oib", values.oib);
    formData.append("note", values.note ?? "");
    formData.append("consent", String(values.consent));
    formData.append("website", values.website ?? "");

    const idCard = values.idCard?.[0];
    const driverLicense = values.driverLicense?.[0];
    const taxiDiploma = values.taxiDiploma?.[0];
    const criminalRecordCertificate = values.criminalRecordCertificate?.[0];
    const selfiePhoto = values.selfiePhoto?.[0];

    if (!idCard || !driverLicense || !taxiDiploma || !criminalRecordCertificate || !selfiePhoto) {
      setSubmitState({
        status: "error",
        message: "Učitaj sve tražene dokumente prije slanja prijave.",
      });
      return;
    }

    formData.append("idCard", idCard);
    formData.append("driverLicense", driverLicense);
    formData.append("taxiDiploma", taxiDiploma);
    formData.append("criminalRecordCertificate", criminalRecordCertificate);
    formData.append("selfiePhoto", selfiePhoto);

    startTransition(async () => {
      setSubmitState({ status: "idle" });

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setSubmitState({
          status: "error",
          message: result.message || "Dogodila se pogreška. Pokušaj ponovno.",
        });
        return;
      }

      reset();
      setSubmitState({
        status: "success",
        message: result.message || "Prijava je uspješno poslana.",
      });
    });
  });

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accentDark">Online prijava</p>
          <h3 className="mt-3 text-2xl font-semibold">Prijavi se za vozača</h3>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Prijava za rad preko naše flote na Uber i Bolt platformama.
          </p>
        </div>
        <div className="hidden rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white sm:flex sm:items-center sm:gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" />
          Sigurna obrada
        </div>
      </div>
      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ime i prezime" error={errors.fullName?.message}>
            <input {...register("fullName")} className={inputClassName} placeholder="Upiši ime i prezime" />
          </Field>
          <Field label="Broj mobitela" error={errors.phone?.message}>
            <input {...register("phone")} className={inputClassName} placeholder="Upiši broj mobitela" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className={inputClassName} placeholder="ime@primjer.hr" />
          </Field>
          <Field label="Grad" error={errors.city?.message}>
            <select {...register("city")} className={inputClassName} defaultValue="">
              <option value="" disabled>
                Odaberi grad
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Imaš li vlastiti auto?" error={errors.hasOwnCar?.message}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "da", label: "Da" },
                { value: "ne", label: "Ne" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-center rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3 text-sm font-semibold transition has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accentDark"
                >
                  <input type="radio" value={option.value} className="sr-only" {...register("hasOwnCar")} />
                  {option.label}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Datum rođenja" error={errors.birthDate?.message}>
            <input {...register("birthDate")} type="date" className={inputClassName} />
          </Field>
          <Field label="OIB" error={errors.oib?.message}>
            <input {...register("oib")} inputMode="numeric" className={inputClassName} placeholder="Upiši 11 znamenki" />
          </Field>
          <Field label="Napomena" error={errors.note?.message}>
            <textarea
              {...register("note")}
              className={`${inputClassName} min-h-32 resize-y`}
              placeholder="Dodaj napomenu ako nemaš vozilo ili tek planiraš početi."
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Upload osobne iskaznice" error={errors.idCard?.message as string | undefined}>
            <label className={fileInputClassName}>
              <Upload className="h-4 w-4 text-accentDark" />
              <span>Odaberi datoteku</span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...register("idCard", { required: "Osobna iskaznica je obavezna." })}
              />
            </label>
          </Field>
          <Field label="Upload vozačke dozvole" error={errors.driverLicense?.message as string | undefined}>
            <label className={fileInputClassName}>
              <Upload className="h-4 w-4 text-accentDark" />
              <span>Odaberi datoteku</span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...register("driverLicense", { required: "Vozačka dozvola je obavezna." })}
              />
            </label>
          </Field>
          <Field label="Upload taxi diplome" error={errors.taxiDiploma?.message as string | undefined}>
            <label className={fileInputClassName}>
              <Upload className="h-4 w-4 text-accentDark" />
              <span>Odaberi datoteku</span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...register("taxiDiploma", { required: "Taxi diploma je obavezna." })}
              />
            </label>
          </Field>
          <Field
            label="Upload uvjerenja o nekažnjavanju"
            error={errors.criminalRecordCertificate?.message as string | undefined}
          >
            <label className={fileInputClassName}>
              <Upload className="h-4 w-4 text-accentDark" />
              <span>Odaberi datoteku</span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...register("criminalRecordCertificate", {
                  required: "Uvjerenje o nekažnjavanju je obavezno.",
                })}
              />
            </label>
          </Field>
          <Field label="Upload selfie fotografije" error={errors.selfiePhoto?.message as string | undefined}>
            <label className={fileInputClassName}>
              <Upload className="h-4 w-4 text-accentDark" />
              <span>Odaberi datoteku</span>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...register("selfiePhoto", { required: "Selfie fotografija je obavezna." })}
              />
            </label>
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-[#f7f7f7] p-4 text-sm leading-6 text-black/70">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-black/20 text-accent focus:ring-accent" {...register("consent")} />
          <span>
            Slažem se s obradom osobnih podataka u svrhu pregleda i obrade prijave za vozača, u skladu s
            politikom privatnosti.
          </span>
        </label>
        {errors.consent?.message ? <p className="text-sm font-medium text-red-600">{errors.consent.message}</p> : null}
        {submitState.status !== "idle" ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              submitState.status === "success"
                ? "bg-accent/10 text-accentDark"
                : "bg-red-50 text-red-700"
            }`}
          >
            {submitState.message}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-black transition hover:bg-accentDark hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Pošalji prijavu
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-accent focus:bg-white";

const fileInputClassName =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-black/15 bg-[#f7f7f7] px-4 py-4 text-sm font-medium text-black/70 transition hover:border-accent hover:bg-accent/5";
