import { Bell, Lock, LockOpen } from "lucide-react";

import { setLockAction, updateAdminNameAction, updateAdminPasswordAction } from "@/app/admin/actions";
import { PushToggle } from "@/components/admin/push-toggle";
import { Button, Card, Field, Notice, inputClass } from "@/components/admin/ui";
import { getAdminSettings } from "@/lib/admin-settings";
import { getVapidPublicKey } from "@/lib/push";

export const dynamic = "force-dynamic";

const messages: Record<string, { tone: "success" | "error"; text: string }> = {
  "ok:name": { tone: "success", text: "Ime administratora spremljeno." },
  "ok:password": { tone: "success", text: "Lozinka je promijenjena." },
  "ok:locked": { tone: "success", text: "Admin je sada zaključan — traži lozinku." },
  "ok:unlocked": { tone: "success", text: "Admin je otključan." },
  "error:name": { tone: "error", text: "Ime mora imati barem 2 znaka." },
  "error:password": { tone: "error", text: "Lozinke se ne podudaraju ili su kraće od 6 znakova." },
  "error:nopassword": { tone: "error", text: "Prvo postavi lozinku, pa onda zaključaj admin." },
};

export default async function PostavkePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const settings = await getAdminSettings();
  const flash = ok ? messages[`ok:${ok}`] : error ? messages[`error:${error}`] : null;

  if (!settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Postavke</h1>
        <Notice tone="error">
          Tablica postavki ne postoji. Pokreni <code>supabase/admin-migration.sql</code> u Supabaseu.
        </Notice>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Postavke</h1>

      {flash ? <Notice tone={flash.tone}>{flash.text}</Notice> : null}

      {/* Push obavijesti */}
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 text-emerald-400" />
          <div>
            <h2 className="font-semibold">Obavijesti na mobitel</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Uključi push obavijesti da dobiješ poruku čim stigne nova prijava. Za iPhone prvo
              dodaj stranicu na početni zaslon, pa uključi obavijesti unutar te aplikacije.
            </p>
          </div>
        </div>
        <PushToggle vapidPublicKey={getVapidPublicKey()} />
      </Card>

      {/* Zaključavanje */}
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          {settings.is_locked ? (
            <Lock className="mt-0.5 h-5 w-5 text-emerald-400" />
          ) : (
            <LockOpen className="mt-0.5 h-5 w-5 text-amber-400" />
          )}
          <div>
            <h2 className="font-semibold">
              Admin je {settings.is_locked ? "zaključan" : "otključan"}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {settings.is_locked
                ? "Pristup adminu traži ime i lozinku."
                : "Trenutno svatko s linkom može otvoriti admin. Postavi lozinku pa zaključaj kad budeš spreman."}
            </p>
          </div>
        </div>

        {!settings.has_password ? (
          <Notice tone="info">Postavi lozinku (dolje) prije zaključavanja.</Notice>
        ) : null}

        <form action={setLockAction}>
          <input type="hidden" name="lock" value={settings.is_locked ? "0" : "1"} />
          <Button type="submit" variant={settings.is_locked ? "secondary" : "primary"} disabled={!settings.is_locked && !settings.has_password}>
            {settings.is_locked ? "Otključaj admin" : "Zaključaj admin"}
          </Button>
        </form>
      </Card>

      {/* Ime administratora */}
      <Card className="space-y-4">
        <h2 className="font-semibold">Ime administratora</h2>
        <form action={updateAdminNameAction} className="flex items-end gap-3">
          <div className="flex-1">
            <Field label="Ime">
              <input name="admin_name" defaultValue={settings.admin_name} className={inputClass} required />
            </Field>
          </div>
          <Button type="submit" variant="secondary">
            Spremi
          </Button>
        </form>
      </Card>

      {/* Lozinka */}
      <Card className="space-y-4">
        <h2 className="font-semibold">
          {settings.has_password ? "Promjena lozinke" : "Postavi lozinku"}
        </h2>
        <form action={updateAdminPasswordAction} className="space-y-4">
          <Field label="Nova lozinka" hint="Najmanje 6 znakova.">
            <input name="password" type="password" autoComplete="new-password" required className={inputClass} />
          </Field>
          <Field label="Ponovi lozinku">
            <input name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
          </Field>
          <Button type="submit" variant="secondary">
            {settings.has_password ? "Promijeni lozinku" : "Postavi lozinku"}
          </Button>
        </form>
        {settings.has_password ? (
          <p className="text-xs text-neutral-500">
            Napomena: promjena lozinke odjavljuje sve postojeće sesije.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
