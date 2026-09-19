"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  Lock,
  LockOpen,
  LogOut,
  PhoneCall,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Pregled", icon: LayoutDashboard, exact: true },
  { href: "/admin/prijave", label: "Prijave", icon: ClipboardList },
  { href: "/admin/pozivi", label: "Pozivi", icon: PhoneCall },
  { href: "/admin/vozila", label: "Vozila", icon: Car },
  { href: "/admin/postavke", label: "Postavke", icon: Settings },
];

export function AdminSidebar({
  locked,
  logout,
  counts,
}: {
  locked: boolean;
  logout: () => Promise<void>;
  counts?: { prijave: number; pozivi: number };
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  const badgeFor = (href: string) =>
    href === "/admin/prijave" ? counts?.prijave ?? 0 : href === "/admin/pozivi" ? counts?.pozivi ?? 0 : 0;

  const brand = (
    <Link href="/admin" className="text-lg font-bold tracking-tight">
      FleetHub <span className="text-emerald-600">admin</span>
    </Link>
  );

  const lockBadge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        locked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700",
      )}
    >
      {locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
      {locked ? "Zaključano" : "Otključano"}
    </span>
  );

  return (
    <>
      {/* Desktop: lijevi sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-4">
        <div className="mb-6 px-2">{brand}</div>
        <nav className="flex flex-col gap-1">
          {items.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive(href, exact)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{label}</span>
              {badgeFor(href) > 0 ? (
                <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white">
                  {badgeFor(href)}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pt-6">
          {lockBadge}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-1 text-xs text-neutral-500 transition hover:text-neutral-900"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Otvori stranicu
          </Link>
          <form action={logout}>
            <button className="flex items-center gap-2 px-1 text-xs text-neutral-500 transition hover:text-neutral-900">
              <LogOut className="h-3.5 w-3.5" /> Odjava
            </button>
          </form>
        </div>
      </aside>

      {/* Mobitel: gornja traka (brand + status + odjava) */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        {brand}
        <div className="flex items-center gap-2">
          {lockBadge}
          <form action={logout}>
            <button
              aria-label="Odjava"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobitel: donji tab bar (kao aplikacija) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            const badge = badgeFor(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px] font-semibold transition",
                  active ? "text-emerald-600" : "text-neutral-400",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge > 0 ? (
                    <span className="absolute -right-2 -top-1.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
                      {badge}
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
