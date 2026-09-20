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
import { EarningsCalculatorSection } from "@/components/earnings-calculator";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CommissionSection />
      <StatsSection />
      <EarningsCalculatorSection />
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
