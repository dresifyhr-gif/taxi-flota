"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, PhoneCall, X } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import { ButtonLink, Container } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";

export function Wordmark({
  size = "md",
  fleetClass = "text-white",
  hubClass = "text-accent",
}: {
  size?: "sm" | "md" | "lg";
  fleetClass?: string;
  hubClass?: string;
}) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <span
      className={`${textSize} font-extrabold tracking-tight`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      <span className={fleetClass}>Fleet</span>
      <span className={hubClass}>Hub</span>
    </span>
  );
}

export function AnnouncementTicker() {
  const { t } = useLanguage();
  const items = [...t.ticker, ...t.ticker];
  return (
    <div className="overflow-hidden border-b border-black/5 bg-transparent py-2.5">
      <div className="animate-marquee flex w-max gap-12">
        {items.map((item, i) => (
          <span key={i} className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-black/55">
            <span className="mr-12 text-black/20">·</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, locale, setLocale } = useLanguage();
  const navHrefs = siteConfig.navigation.map((item) => item.href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || open
          ? "border-white/10 bg-[#070a08]/70 backdrop-blur-xl"
          : "border-white/5 bg-[#070a08]/40 backdrop-blur-lg"
      }`}
    >
      <Container className="relative flex h-16 items-center sm:h-20">
        {/* Lijevo: hamburger (mobitel) + logo (desktop) */}
        <div className="relative z-10 flex flex-1 items-center lg:w-1/4 lg:flex-none">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Otvori izbornik"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" onClick={() => setOpen(false)} className="hidden shrink-0 items-center lg:flex" aria-label="FleetHub">
            <Wordmark size="lg" fleetClass="text-white" hubClass="text-accent" />
          </Link>
        </div>

        {/* Logo centar na mobilnoj — apsolutno pozicioniran */}
        <div className="absolute left-0 right-0 z-20 flex justify-center lg:hidden pointer-events-none">
          <Link href="/" onClick={() => setOpen(false)} className="pointer-events-auto" aria-label="FleetHub">
            <Wordmark size="md" fleetClass="text-white" hubClass="text-accent" />
          </Link>
        </div>

        {/* Nav — tocno sredina */}
        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-semibold lg:flex">
          {t.nav.map((label, i) => (
            <Link
              key={navHrefs[i]}
              href={navHrefs[i]}
              className="text-white/70 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desno: CTA + lang switcher + hamburger */}
        <div className="relative z-10 flex w-auto items-center justify-end gap-3 lg:w-1/4">
          {/* Mobitel: samo prekidač teme */}
          <ThemeToggle className="lg:hidden" />
          {/* Desktop */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            {/* Language switcher */}
            <div className="flex items-center rounded-2xl bg-white/10 p-1 text-xs font-black">
              <button
                onClick={() => setLocale("hr")}
                className={`rounded-xl px-3 py-1.5 transition ${locale === "hr" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                HR
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`rounded-xl px-3 py-1.5 transition ${locale === "en" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                EN
              </button>
            </div>
            <ButtonLink href="/prijava" className="rounded-2xl bg-accent px-5 py-2 text-sm font-black tracking-widest text-white shadow-none hover:bg-accentDark hover:text-white">
              {t.apply}
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#070a08]/95 backdrop-blur-md lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {t.nav.map((label, i) => (
              <Link
                key={navHrefs[i]}
                href={navHrefs[i]}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            {/* Mobile lang switcher */}
            <div className="mt-2 flex gap-2 px-4">
              <button
                onClick={() => setLocale("hr")}
                className={`flex-1 rounded-xl py-2 text-sm font-black transition ${locale === "hr" ? "bg-white text-black" : "bg-white/10 text-white/60"}`}
              >
                HR
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`flex-1 rounded-xl py-2 text-sm font-black transition ${locale === "en" ? "bg-white text-black" : "bg-white/10 text-white/60"}`}
              >
                EN
              </button>
            </div>
            <div className="mt-2 px-4">
              <ButtonLink href="/prijava" className="w-full justify-center">
                {t.apply}
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-white/5 bg-[#070a08] pt-14 pb-24 text-white/50 sm:pb-8">
      <Container>
        {/* Gornji dio — 3 kolone */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Logo + opis */}
          <div className="lg:col-span-1">
            <Wordmark size="lg" fleetClass="text-white" hubClass="text-accent" />
            <p className="mt-4 text-sm leading-6">{t.footer_desc}</p>
          </div>

          {/* Navigacija */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Stranice</p>
            <ul className="space-y-2.5 text-sm">
              {t.nav.map((label, i) => (
                <li key={label}>
                  <Link href={siteConfig.navigation[i]?.href ?? "/"} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Kontakt</p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/prijava" className="transition hover:text-white">
                  Online prijava za vozača
                </Link>
              </li>
              <li>
                <Link href="/zatrazi-poziv" className="transition hover:text-white">
                  Zatraži povratni poziv
                </Link>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <Link href="/privacy-policy" className="transition hover:text-white">
                {t.footer_privacy}
              </Link>
              <Link href="/pravne-informacije" className="transition hover:text-white">
                {t.footer_legal}
              </Link>
            </div>
          </div>
        </div>

        {/* Donja crta */}
        <div className="mt-12 border-t border-white/8 pt-6 text-center text-xs text-white/25">
          © {new Date().getFullYear()} FleetHub. Sva prava pridržana.
        </div>
      </Container>
    </footer>
  );
}

export function MobileStickyCTA() {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-4 backdrop-blur sm:hidden">
      <ButtonLink href="/prijava" className="flex w-full py-3">
        {t.mobile_cta}
      </ButtonLink>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <Link
      href="/zatrazi-poziv"
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(52,209,134,0.4)] transition-all duration-300 hover:scale-105 hover:bg-accentDark hover:text-white sm:bottom-8"
      aria-label="Zatraži poziv"
    >
      <PhoneCall className="h-5 w-5" />
      <span className="hidden sm:inline">Zatraži poziv</span>
    </Link>
  );
}
