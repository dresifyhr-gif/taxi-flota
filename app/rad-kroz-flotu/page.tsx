import type { Metadata } from "next";

import { BenefitsSection, ContactSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Rad kroz flotu | TAXI FLOTA",
  description:
    "Prednosti rada kroz TAXI FLOTA flotu: podrška pri prijavi, tjedna isplata, jasna komunikacija i onboarding.",
};

export default function FleetWorkPage() {
  return (
    <>
      <BenefitsSection />
      <ContactSection />
    </>
  );
}
