import {
  BlogPreviewSection,
  BenefitsSection,
  CommissionSection,
  ContactSection,
  FaqSection,
  HeroSection,
  HowItWorksSection,
  ReferralBonusSection,
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
      <ReferralBonusSection />
      <RentalSection />
      <BlogPreviewSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
