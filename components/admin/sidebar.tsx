"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
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

const OBRACUN_URL = process.env.NEXT_PUBLIC_OBRACUN_URL;

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Operativa",
    items: [
      { href: "/admin",         label: "Pregled",  icon: LayoutDashboard, exact: true },
      { href: "/admin/prijave", label: "Prijave",  icon: ClipboardList },
      { href: "/admin/pozivi",  label: "Pozivi",   icon: PhoneCall },
    ],
  },
  {
    label: "Flota",
    items: [
      { href: "/admin/vozila",   label: "Vozila",  icon: Car },
    ],
  },
  {
    label: "Sustav",
    items: [
      { href: "/admin/postavke", label: "Postavke", icon: Settings },
    ],
  },
];

const items: NavItem[] = navSections.flatMap((s) => s.items);

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
    <Link href="/admin" className="group flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-[#04120b] shadow-glow transition group-hover:scale-105">
        <Car className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-white">
          Fleet<span className="text-accent">Hub</span>
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
          Admin
        </span>
      </span>
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
      <aside className="hidden w-72 shrink-0 border-r border-hairline bg-surface-deep/85 backdrop-blur-md lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="border-b border-hairline-soft px-5 py-5">{brand}</div>
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                {section.label}
              </div>
              {section.items.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                const badge = badgeFor(href);
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
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent transition-opacity",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge > 0 ? (
                      <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-[#04120b]">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
          {OBRACUN_URL ? (
            <div className="space-y-1 pt-1">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Obračun plaća
              </div>
              <a
                href={OBRACUN_URL}
                className="group flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.08] px-3 py-3 text-sm font-semibold text-accent transition hover:bg-accent/[0.14] hover:shadow-glow"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                  <Calculator className="h-[18px] w-[18px]" />
                </span>
                <span className="flex flex-1 flex-col leading-tight">
                  <span>Obračun</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-accent/70">
                    FleetCalc
                  </span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          ) : null}
        </nav>
        <div className="border-t border-hairline-soft px-4 py-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            {lockBadge}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-white/40 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ExternalLink className="h-3 w-3" /> Stranica
            </Link>
          </div>
          <form action={logout}>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-hairline-soft bg-white/[0.02] py-2 text-xs font-medium text-white/55 transition hover:border-red-500/30 hover:bg-red-500/[0.08] hover:text-red-300">
              <LogOut className="h-3.5 w-3.5" /> Odjava
            </button>
          </form>
        </div>
      </aside>

      {/* Mobitel: gornja traka (brand + status + odjava) */}
      <div className="flex items-center justify-between border-b border-hairline bg-surface-deep/90 px-4 py-3 backdrop-blur-md lg:hidden">
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

      {/* Mobile floating Obracun button */}
      {OBRACUN_URL ? (
        <a
          href={OBRACUN_URL}
          className="fixed right-4 bottom-20 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#04120b] shadow-glow lg:hidden"
        >
          <Calculator className="h-4 w-4" /> Obračun
        </a>
      ) : null}

      {/* Mobitel: donji tab bar (kao aplikacija) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface-deep/95 backdrop-blur-md lg:hidden">
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
