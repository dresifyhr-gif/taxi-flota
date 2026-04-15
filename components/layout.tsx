"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0a1209]/92 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="text-xl font-bold tracking-tight text-white" onClick={() => setOpen(false)}>
          TAXI <span className="text-accent">FLOTA</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 lg:flex">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href="/prijava" className="px-5 py-2.5">
              Prijavi se
            </ButtonLink>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition hover:bg-white/15 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Otvori izbornik"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>
      {open && (
        <div className="border-t border-white/8 bg-[#0a1209] lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/8 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 px-4">
              <ButtonLink href="/prijava" className="w-full justify-center">
                Prijavi se
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0a1209] py-10 text-white/55">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            TAXI <span className="text-accent">FLOTA</span>
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6">
            Prijave vozača, podrška pri onboardingu i organizacija rada kroz flotu za ride-hailing platforme u Hrvatskoj.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <Link href="/privacy-policy" className="transition hover:text-white">
            Politika privatnosti
          </Link>
          <Link href="/pravne-informacije" className="transition hover:text-white">
            Pravne informacije
          </Link>
        </div>
      </Container>
    </footer>
  );
}

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1209]/95 p-4 backdrop-blur sm:hidden">
      <ButtonLink href="/prijava" className="flex w-full py-3">
        Prijavi se odmah
      </ButtonLink>
    </div>
  );
}
