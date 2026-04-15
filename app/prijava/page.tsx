import type { Metadata } from "next";

import { ApplicationSection, ContactSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Prijava za vozača | TAXI FLOTA",
  description:
    "Zasebna stranica za prijavu vozača kroz TAXI FLOTA flotu za rad preko Uber i Bolt platformi u Hrvatskoj.",
};

export default function ApplicationPage() {
  return (
    <>
      <ApplicationSection />
      <ContactSection />
    </>
  );
}
