"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Car,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  Lock,
  LockOpen,
  LogOut,
  Menu,
  PhoneCall,
  Settings,
  X,
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
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  const badgeFor = (href: string) =>
    href === "/admin/prijave" ? counts?.prijave ?? 0 : href === "/admin/pozivi" ? counts?.pozivi ?? 0 : 0;

  const brand = (
    <Link href="/admin" onClick={() => setOpen(false)} className="text-lg font-bold tracking-tight">
      FleetHub <span className="text-emerald-600">admin</span>
    </Link>
  );

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
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
  );

  const footer = (
    <div className="space-y-3">
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
  );

  return (
    <>
      {/* Mobitel: gornja traka */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 lg:hidden">
        {brand}
        <button
          onClick={() => setOpen(true)}
          aria-label="Izbornik"
          className="rounded-lg p-2 text-neutral-700 transition hover:bg-neutral-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-4">
        <div className="mb-6 px-2">{brand}</div>
        {nav}
        <div className="mt-auto pt-6">{footer}</div>
      </aside>

      {/* Mobitel: drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-neutral-200 bg-white p-4">
            <div className="mb-6 flex items-center justify-between">
              {brand}
              <button
                onClick={() => setOpen(false)}
                aria-label="Zatvori"
                className="rounded-lg p-2 text-neutral-700 transition hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            <div className="mt-auto pt-6">{footer}</div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
