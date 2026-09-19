"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Car, ClipboardList, Home } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Početna", icon: Home },
  { href: "/prijava", label: "Prijava", icon: ClipboardList },
  { href: "/rad-kroz-flotu", label: "Usluge", icon: Briefcase },
  { href: "/najam-vozila", label: "Najam", icon: Car },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0f0b]/90 backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition",
                active ? "text-accent" : "text-white/50",
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "text-accent" : "text-white/40")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
