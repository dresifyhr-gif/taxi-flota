import type { Metadata } from "next";

import { ContactSection, FaqSection, HowItWorksSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Kako radi | FleetHub",
  description:
    "Detaljan pregled procesa prijave, pregleda dokumentacije i uključivanja vozača u FLOTA flotu.",
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
