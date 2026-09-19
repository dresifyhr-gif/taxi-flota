import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, Lock, LockOpen, LogOut } from "lucide-react";

import { isAdminAuthed, logout } from "@/app/admin/actions";
import { NavLink } from "@/components/admin/nav-link";
import { ServiceWorkerRegister } from "@/components/admin/service-worker-register";
import { getAdminSettings } from "@/lib/admin-settings";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }

  const settings = await getAdminSettings();
  const locked = settings?.is_locked ?? false;

  return (
    <div className="min-h-screen">
      <ServiceWorkerRegister />
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/admin" className="mr-2 text-base font-bold">
            FleetHub <span className="text-emerald-400">admin</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink href="/admin">Pregled</NavLink>
            <NavLink href="/admin/prijave">Prijave</NavLink>
            <NavLink href="/admin/pozivi">Pozivi</NavLink>
            <NavLink href="/admin/vozila">Vozila</NavLink>
            <NavLink href="/admin/postavke">Postavke</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                locked
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
              title={locked ? "Admin je zaključan (traži lozinku)" : "Admin je otključan (bez lozinke)"}
            >
              {locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
              {locked ? "Zaključano" : "Otključano"}
            </span>
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1 text-xs text-neutral-400 hover:text-white sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Stranica
            </Link>
            <form action={logout}>
              <button className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white">
                <LogOut className="h-3.5 w-3.5" /> Odjava
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
