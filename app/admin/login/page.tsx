import Link from "next/link";

import { login } from "@/app/admin/actions";
import { Button, Card, Field, Notice, inputClass } from "@/components/admin/ui";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">FleetHub admin</h1>
        <p className="mt-1 text-sm text-neutral-500">Prijava u administraciju</p>
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
        <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-700">
          ← Natrag na stranicu
        </Link>
      </div>
    </div>
  );
}
