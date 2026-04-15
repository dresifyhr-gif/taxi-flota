import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { ButtonLink, Container } from "@/components/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/88 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-black sm:text-2xl">
          TAXI <span className="text-accent">FLOTA</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-black/65 lg:flex">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block">
          <ButtonLink href="/prijava" className="px-5 py-2.5">
            Prijavi se
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white py-10 text-black/65">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-black">
            TAXI <span className="text-accent">FLOTA</span>
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6">
            Prijave vozača, podrška pri onboardingu i organizacija rada kroz flotu za ride-hailing platforme u Hrvatskoj.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <Link href="/privacy-policy" className="transition hover:text-black">
            Politika privatnosti
          </Link>
          <Link href="/pravne-informacije" className="transition hover:text-black">
            Pravne informacije
          </Link>
        </div>
      </Container>
    </footer>
  );
}

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-4 backdrop-blur sm:hidden">
      <ButtonLink href="/prijava" className="flex w-full py-3">
        Prijavi se odmah
      </ButtonLink>
    </div>
  );
}
