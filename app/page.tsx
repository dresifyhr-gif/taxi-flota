import {
  BlogPreviewSection,
  BenefitsSection,
  ContactSection,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  RentalSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TestimonialsSection />
      <RentalSection />
      <BlogPreviewSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
