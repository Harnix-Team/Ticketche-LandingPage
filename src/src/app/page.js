import { CTASection } from "@/components/Home/CTASection";
import { EstablishmentsSection } from "@/components/Home/EstablishmentsSection";
import { HeroV2 } from "@/components/Home/HeroV2";
import TrustedBySection from "@/components/Home/TrustedBySection";
import { EventsCarousel } from "@/components/Home/EventsCarousel";
import TicketcheFonction from "@/components/Home/TicketcheFonction";
import HowItWorks from "@/components/Home/HowItWorks";
import FAQSection from "@/components/Home/FaqSection";
import ActiveUsers from "@/components/Home/Activeusers";
import ReviewsSection from "@/components/Home/ReviewsSection";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroV2 />
      <TrustedBySection />
      <WhyChooseUs />
      <TicketcheFonction />
      <HowItWorks />
      <EstablishmentsSection />
      <EventsCarousel />
      <ReviewsSection />
      <FAQSection />
      <ActiveUsers />
      <CTASection />
    </div>
  );
}
