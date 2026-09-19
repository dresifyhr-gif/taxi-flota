import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { login } from "@/app/admin/actions";
import { Button, Card, Field, Notice, inputClass } from "@/components/admin/ui";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="relative min-h-screen bg-[#070a08] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50rem 40rem at 50% -10%, rgba(52,209,134,0.14), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10">
            <ShieldCheck className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Fleet<span className="text-accent">Hub</span> admin
          </h1>
          <p className="mt-1 text-sm text-white/45">Prijava u administraciju</p>
        </div>

        <Card className="space-y-4">
          {error === "1" ? <Notice tone="error">Pogrešno ime ili lozinka.</Notice> : null}
          {error === "config" ? (
            <Notice tone="error">Admin još nije konfiguriran. Postavi lozinku u Postavkama.</Notice>
          ) : null}

          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={next ?? "/admin"} />
            <Field label="Ime administratora">
              <input name="name" type="text" autoComplete="username" className={inputClass} placeholder="admin" />
            </Field>
            <Field label="Lozinka">
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </Field>
            <Button type="submit" className="w-full">
              Prijava
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Natrag na stranicu
          </Link>
        </div>
      </div>
    </div>
  );
}
