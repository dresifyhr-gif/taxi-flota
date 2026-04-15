import {
  BlogPreviewSection,
  BenefitsSection,
  ContactSection,
  HeroSection,
  HomeNavigationSection,
  HowItWorksSection,
  RentalSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeNavigationSection />
      <HowItWorksSection />
      <BenefitsSection />
      <RentalSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
