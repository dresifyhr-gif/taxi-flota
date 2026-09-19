import type { Metadata } from "next";

import { BenefitsSection, ContactSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Rad kroz flotu | FleetHub",
  description:
    "Prednosti rada kroz FLOTA flotu: podrška pri prijavi, tjedna isplata, jasna komunikacija i onboarding.",
  alternates: { canonical: "/rad-kroz-flotu" },
};

export default function FleetWorkPage() {
  return (
    <>
      <BenefitsSection />
      <ContactSection />
    </>
  );
}
