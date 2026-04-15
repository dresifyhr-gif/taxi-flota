import type { Metadata } from "next";

import { ContactSection, FaqSection, HowItWorksSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Kako radi | TAXI FLOTA",
  description:
    "Detaljan pregled procesa prijave, pregleda dokumentacije i uključivanja vozača u TAXI FLOTA flotu.",
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
