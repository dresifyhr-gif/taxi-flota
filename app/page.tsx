import {
  BlogPreviewSection,
  BenefitsSection,
  CommissionSection,
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
      <CommissionSection />
      <StatsSection />
      <HowItWorksSection />
      <BenefitsSection />
      <RentalSection />
      <BlogPreviewSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
