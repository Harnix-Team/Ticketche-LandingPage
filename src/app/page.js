import { CTASection } from "@/app/Home/CTASection";
import { EstablishmentsSection } from "@/app/Home/EstablishmentsSection";
import { HeroV2 } from "@/app/Home/HeroV2";
import TrustedBySection from "@/app/Home/TrustedBySection";
import { EventsCarousel } from "@/app/Home/EventsCarousel";
import TicketcheFonction from "@/app/Home/TicketcheFonction";
import HowItWorks from "@/app/Home/HowItWorks";
import FAQSection from "@/app/Home/FaqSection";
import ActiveUsers from "@/app/Home/Activeusers";
import ReviewsSection from "@/app/Home/ReviewsSection";
import WhyChooseUs from "@/app/Home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroV2 />
      <EstablishmentsSection />
      <EventsCarousel />
      <TrustedBySection />
      <WhyChooseUs />
      <TicketcheFonction />
      <HowItWorks />
      <ReviewsSection />
      <FAQSection />
      <ActiveUsers />
      <CTASection />
    </div>
  );
}
