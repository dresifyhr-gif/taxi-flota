import type { Metadata } from "next";

import { ContactSection, FaqSection, HowItWorksSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Kako postati vozač na Uber i Bolt | FleetHub",
  description:
    "Kako postati vozač na Uber i Bolt u Zagrebu kroz FleetHub taxi flotu — proces prijave, dokumentacija i uključivanje novih vozača, korak po korak.",
  alternates: { canonical: "/kako-radi" },
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
