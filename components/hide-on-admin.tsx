"use client";

import { usePathname } from "next/navigation";

/** Sakriva marketing okvir (header/footer/itd.) na /admin i demo rutama. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/demo-")) return null;
  return <>{children}</>;
}
