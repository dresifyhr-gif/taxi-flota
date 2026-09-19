"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LoaderCircle, Send, ShieldCheck, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { applicationSchema } from "@/lib/validation";

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  hoursPerDay: "4" | "8" | "dodatan" | "nisam-siguran";
  consent: boolean;
  idCardFront: FileList;
  idCardBack: FileList;
  website?: string;
};

type SubmitState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type FileKey = "idCardFront" | "idCardBack";

export function ApplicationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<Partial<Record<FileKey, File>>>({});

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      applicationSchema.omit({
        idCardFront: true,
        idCardBack: true,
      }),
    ),
    defaultValues: {
      hoursPerDay: "8",
      consent: false,
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    // Zod .omit() strips file fields from `values`, so read them directly
    const allValues = getValues();
    const idCardFront = allValues.idCardFront?.[0];
    const idCardBack = allValues.idCardBack?.[0];

    if (!idCardFront || !idCardBack) {
      setSubmitState({
        status: "error",
        message: "Učitaj prednju i zadnju stranu osobne iskaznice.",
      });
      return;
    }

    startTransition(async () => {
      setSubmitState({ status: "idle" });

      try {
        const folder = values.fullName
          .toLowerCase()
          .replace(/[čć]/g, "c")
          .replace(/[š]/g, "s")
          .replace(/[đ]/g, "d")
          .replace(/[ž]/g, "z")
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9._-]/g, "")
          .concat(`-${Date.now()}`);

        const uploads: { key: string; file: File }[] = [
          { key: "idCardFront", file: idCardFront },
          { key: "idCardBack", file: idCardBack },
        ];

        const paths: Record<string, string> = {};

        for (const { key, file } of uploads) {
          const res = await fetch("/api/applications/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              size: file.size,
              folder,
            }),
          });

          const data = (await safeJson(res)) as
            | { message?: string; path?: string; signedUrl?: string; token?: string }
            | null;

          if (!res.ok || !data?.signedUrl || !data.path) {
            setSubmitState({
              status: "error",
              message: data?.message || "Nije moguće pripremiti upload. Pokušaj ponovno.",
            });
            return;
          }

          const uploadRes = await fetch(data.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!uploadRes.ok) {
            setSubmitState({
              status: "error",
              message: "Upload datoteke nije uspio. Pokušaj ponovno.",
            });
            return;
          }

          paths[`${key}Path`] = data.path;
        }

        const response = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: values.fullName,
            phone: values.phone,
            email: values.email,
            hoursPerDay: values.hoursPerDay,
            consent: values.consent,
            website: values.website ?? "",
            ...paths,
          }),
        });

        const result = await safeJson(response);

        if (!response.ok) {
          setSubmitState({
            status: "error",
            message: result?.message || "Dogodila se pogreška. Pokušaj ponovno.",
          });
          return;
        }

        reset();
        setSelectedFiles({});
        setSubmitState({
          status: "success",
          message: result?.message || "Prijava je uspješno poslana.",
        });
      } catch (err) {
        console.error("Submit failed", err);
        setSubmitState({
          status: "error",
          message: "Dogodila se pogreška. Provjeri internet i pokušaj ponovno.",
        });
      }
    });
  });

  const fileRegistration = (key: FileKey, requiredMsg: string) => {
    const reg = register(key, { required: requiredMsg });
    return {
      ...reg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] }));
        return reg.onChange(e);
      },
    };
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Online prijava</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Prijava za vozača</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Brza prijava — treba nam samo osobna iskaznica i par osnovnih podataka.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white sm:flex sm:items-center sm:gap-2">
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
          <Field label="Koliko sati želiš raditi?" error={errors.hoursPerDay?.message}>
            <select {...register("hoursPerDay")} className={inputClassName}>
              <option value="4">4 sata</option>
              <option value="8">8 sati</option>
              <option value="dodatan">Dodatan rad</option>
              <option value="nisam-siguran">Možda / nisam siguran</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Osobna iskaznica — prednja strana" error={errors.idCardFront?.message as string | undefined}>
            <FileLabel file={selectedFiles.idCardFront}>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...fileRegistration("idCardFront", "Prednja strana osobne iskaznice je obavezna.")}
              />
            </FileLabel>
          </Field>
          <Field label="Osobna iskaznica — zadnja strana" error={errors.idCardBack?.message as string | undefined}>
            <FileLabel file={selectedFiles.idCardBack}>
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                className="sr-only"
                {...fileRegistration("idCardBack", "Zadnja strana osobne iskaznice je obavezna.")}
              />
            </FileLabel>
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/70">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-accent focus:ring-accent" {...register("consent")} />
          <span>
            Slažem se s obradom osobnih podataka u svrhu pregleda i obrade prijave za vozača, u skladu s
            politikom privatnosti.
          </span>
        </label>
        {errors.consent?.message ? <p className="text-sm font-medium text-red-400">{errors.consent.message}</p> : null}
        {submitState.status === "error" ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {submitState.message}
          </div>
        ) : null}
        {submitState.status === "success" ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center">
            <div className="mb-2 text-2xl">🎉</div>
            <p className="text-base font-semibold text-accent">Hvala na prijavi!</p>
            <p className="mt-1 text-sm leading-6 text-white/60">
              Zaprimili smo tvoju prijavu i javit ćemo ti se u roku od 24 sata s povratnom informacijom i sljedećim koracima.
            </p>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white transition hover:bg-accentDark hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            Pošalji prijavu
          </button>
        )}
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
      <label className="mb-2 block text-sm font-semibold text-white/90">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm font-medium text-red-400">{error}</p> : null}
    </div>
  );
}

function FileLabel({ file, children }: { file?: File; children: ReactNode }) {
  const fileSizeMb = file ? (file.size / 1024 / 1024).toFixed(2) : null;
  return (
    <label
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-medium transition ${
        file
          ? "border-accent bg-accent/10 text-accent"
          : "border-dashed border-white/20 bg-white/[0.04] text-white/70 hover:border-accent hover:bg-accent/5"
      }`}
    >
      {file ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
      ) : (
        <Upload className="h-4 w-4 shrink-0 text-accent" />
      )}
      <span className="truncate">
        {file ? `${file.name} (${fileSizeMb} MB)` : "Odaberi datoteku"}
      </span>
      {children}
    </label>
  );
}

async function safeJson(res: Response): Promise<{ message?: string; [key: string]: unknown } | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

const inputClassName =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent focus:bg-white/[0.08]";
