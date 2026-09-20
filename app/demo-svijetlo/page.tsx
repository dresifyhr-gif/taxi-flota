import type { Metadata } from "next";
import Link from "next/link";

import { Footer, Header } from "@/components/layout";
import {
  BenefitsSection,
  BlogPreviewSection,
  CommissionSection,
  ContactSection,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  ReferralBonusSection,
  RentalSection,
  StatsSection,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Demo — svijetla verzija | FleetHub",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Svijetla ("dan") verzija naslovnice — identičan raspored kao tamna,
 * samo obrnute boje (flip preko .theme-light u globals.css) + 3D grad u dan modu.
 * Živa stranica ostaje netaknuta; ovo je zaseban demo link.
 */
export default function DemoLightPage() {
  return (
    <div className="theme-light min-h-screen bg-[#f6f7f6]">
      <div className="bg-emerald-50 px-4 py-2 text-center text-xs font-medium text-emerald-700">
        Demo — svijetla verzija (isti raspored kao tamna).{" "}
        <Link href="/" className="font-semibold underline">
          Usporedi s tamnom →
        </Link>
      </div>

      <Header />
      <main>
        <HeroSection light />
        <CommissionSection />
        <StatsSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ReferralBonusSection />
        <RentalSection />
        <BlogPreviewSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
