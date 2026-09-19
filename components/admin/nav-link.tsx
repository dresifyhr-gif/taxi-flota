"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition",
        active ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
