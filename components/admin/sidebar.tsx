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
    <Link href="/admin" className="text-lg font-extrabold tracking-tight text-white">
      Fleet<span className="text-accent">Hub</span>
      <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">admin</span>
    </Link>
  );

  const lockBadge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        locked
          ? "border-accent/25 bg-accent/10 text-accent"
          : "border-amber-400/25 bg-amber-400/10 text-amber-300",
      )}
    >
      {locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
      {locked ? "Zaključano" : "Otključano"}
    </span>
  );

  return (
    <>
      {/* Desktop: lijevi sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#080c0a]/80 backdrop-blur-md lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-4">
        <div className="mb-8 px-2 pt-2">{brand}</div>
        <nav className="flex flex-col gap-1">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-accent/[0.12] text-accent"
                    : "text-white/55 hover:bg-white/[0.05] hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{label}</span>
                {badgeFor(href) > 0 ? (
                  <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-[#04120b]">
                    {badgeFor(href)}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 pt-6">
          {lockBadge}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-1 text-xs text-white/40 transition hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Otvori stranicu
          </Link>
          <form action={logout}>
            <button className="flex items-center gap-2 px-1 text-xs text-white/40 transition hover:text-red-300">
              <LogOut className="h-3.5 w-3.5" /> Odjava
            </button>
          </form>
        </div>
      </aside>

      {/* Mobitel: gornja traka (brand + status + odjava) */}
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#080c0a]/85 px-4 py-3 backdrop-blur-md lg:hidden">
        {brand}
        <div className="flex items-center gap-2">
          {lockBadge}
          <form action={logout}>
            <button
              aria-label="Odjava"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobitel: donji tab bar (kao aplikacija) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-[#080c0a]/90 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            const badge = badgeFor(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition",
                  active ? "text-accent" : "text-white/40",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {badge > 0 ? (
                    <span className="absolute -right-2 -top-1.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-[#04120b]">
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
