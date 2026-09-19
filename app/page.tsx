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
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CommissionSection />
      <StatsSection />
      <HowItWorksSection dark />
      <BenefitsSection dark />
      <ReferralBonusSection />
      <RentalSection />
      <BlogPreviewSection />
      <FaqSection dark />
      <ContactSection />
    </>
  );
}
