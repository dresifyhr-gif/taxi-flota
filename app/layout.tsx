import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { Footer, Header, WhatsAppButton } from "@/components/layout";
import { CookieConsent } from "@/components/cookie-consent";
import { NoRightClick } from "@/components/no-right-click";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ThemeNoFlashScript, ThemeProvider } from "@/components/theme";
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
  title: "Vozač na Uber i Bolt u Zagrebu | FleetHub taxi flota",
  description:
    "Vozi na Uber i Bolt kroz FleetHub — taxi flotu iz Zagreba koja prima nove vozače. Provizija 10%, tjedna isplata, najam vozila i podrška od prve prijave.",
  keywords: [
    "vozač Uber",
    "vozač Bolt",
    "posao vozač Zagreb",
    "taxi flota",
    "flota vozača",
    "novi vozači",
    "Uber Zagreb",
    "Bolt Zagreb",
    "najam vozila za taxi",
    "rad preko Uber i Bolt",
    "vozač taxi Zagreb",
    "kako postati Uber vozač",
  ],
  openGraph: {
    title: "Vozač na Uber i Bolt u Zagrebu | FleetHub taxi flota",
    description:
      "Vozi na Uber i Bolt kroz FleetHub — taxi flotu iz Zagreba koja prima nove vozače. Provizija 10%, tjedna isplata, najam vozila i podrška od prve prijave.",
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
    title: "Vozač na Uber i Bolt u Zagrebu | FleetHub taxi flota",
    description:
      "Vozi na Uber i Bolt kroz FleetHub — taxi flotu iz Zagreba koja prima nove vozače. Provizija 10%, tjedna isplata i najam vozila.",
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
  description: "FleetHub je taxi flota iz Zagreba koja prima nove vozače za rad na Uber i Bolt platformama. Provizija 10%, tjedna isplata, najam vozila i podrška od prve prijave.",
  url: siteConfig.url,
  telephone: siteConfig.phone,
  areaServed: [
    { "@type": "City", name: "Zagreb" },
    { "@type": "Country", name: "Hrvatska" },
  ],
  knowsAbout: ["Uber", "Bolt", "taxi", "najam vozila", "vozači"],
  priceRange: "$$",
  openingHours: "Mo-Su 00:00-23:59",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable}`}>
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
        <ThemeNoFlashScript />
      </head>
      <body className="bg-[#070a08] font-[var(--font-body)] text-white">
        <ThemeProvider>
          <HideOnAdmin>
            <NoRightClick />
          </HideOnAdmin>
          <LanguageProvider>
            <div className="min-h-screen bg-[#070a08]">
              <HideOnAdmin>
                <Header />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
