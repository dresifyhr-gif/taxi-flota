import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { AnnouncementTicker, Footer, Header, WhatsAppButton } from "@/components/layout";
import { CookieConsent } from "@/components/cookie-consent";
import { NoRightClick } from "@/components/no-right-click";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LanguageProvider } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: "AmGb4iGdlm_RivlI8Y6pJ3OedakxTE34R-SOKM4kuTc",
  },
  title: "FleetHub | Pokrenite taxi posao u Hrvatskoj",
  description:
    "FleetHub je profesionalna platforma za vozače koji žele pokrenuti vlastiti taxi obrt — otvaranje obrta, licencije, dozvole i spajanje s Uber i Bolt flotama.",
  openGraph: {
    title: "FleetHub | Pokrenite taxi posao u Hrvatskoj",
    description:
      "Otvaranje obrta, ishođenje licencija i dozvola, kartica vozača, prijava na mirovinsko i zdravstveno. Sve na jednom mjestu.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "hr_HR",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FleetHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FleetHub | Pokrenite taxi posao u Hrvatskoj",
    description:
      "Profesionalna platforma za vozače — otvaranje obrta, licencije, dozvole i spajanje s Uber i Bolt flotama.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "FleetHub",
  description: "FleetHub je profesionalna platforma za vozače koji žele pokrenuti vlastiti taxi obrt — otvaranje obrta, licencije, dozvole i spajanje s Uber i Bolt flotama.",
  url: siteConfig.url,
  telephone: siteConfig.phone,
  areaServed: {
    "@type": "Country",
    name: "Hrvatska",
  },
  priceRange: "$$",
  openingHours: "Mo-Su 00:00-23:59",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VQLLDSL4NS" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VQLLDSL4NS');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#f4f5f4] font-[var(--font-body)] text-[#111]">
        <HideOnAdmin>
          <NoRightClick />
        </HideOnAdmin>
        <LanguageProvider>
          <div className="min-h-screen bg-[#f4f5f4]">
            <HideOnAdmin>
              <Header />
              <AnnouncementTicker />
            </HideOnAdmin>
            <main>{children}</main>
            <HideOnAdmin>
              <Footer />
              <MobileBottomNav />
              <WhatsAppButton />
              <CookieConsent />
            </HideOnAdmin>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
