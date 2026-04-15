import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { Footer, Header, MobileStickyCTA } from "@/components/layout";
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
  title: "TAXI FLOTA | Prijava vozača za rad kroz flotu u Hrvatskoj",
  description:
    "TAXI FLOTA je profesionalna stranica za prijavu vozača, onboarding kroz flotu i informiranje o opciji najma vozila za rad preko ride-hailing platformi u Hrvatskoj.",
  openGraph: {
    title: "TAXI FLOTA | Prijava vozača za rad kroz flotu u Hrvatskoj",
    description:
      "Prijava vozača, pomoć pri obradi dokumentacije i podrška pri uključivanju u flotu. Mogućnost prijave i bez vlastitog vozila.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "hr_HR",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "TAXI FLOTA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TAXI FLOTA | Prijava vozača za rad kroz flotu u Hrvatskoj",
    description:
      "Profesionalna prijava za vozače, onboarding podrška i opcija najma vozila kroz TAXI FLOTA.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="bg-[#0d1a10] font-[var(--font-body)] text-white">
        <div className="min-h-screen bg-[#0d1a10]">
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileStickyCTA />
        </div>
      </body>
    </html>
  );
}
