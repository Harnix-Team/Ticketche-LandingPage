import { About } from "@/components/Home/AboutSection";
import { CTASection } from "@/components/Home/CTASection";
import { EstablishmentsSection } from "@/components/Home/EstablishmentsSection";
import { HeroV2 } from "@/components/Home/HeroV2";
import TrustedBySection from "@/components/Home/TrustedBySection";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import { EventsCarousel } from "@/components/Home/EventsCarousel";
import { WhyTicketcheSection } from "@/components/Home/WhyTicketcheSection";
import TicketcheFonction from "@/components/Home/TicketcheFonction";
import HowItWorks from "@/components/Home/HowItWorks";
import FAQSection from "@/components/Home/FaqSection";
import CTADownload from "@/components/Home/Ctadownload";
import ActiveUsers from "@/components/Home/Activeusers";
import ReviewsSection from "@/components/Home/ReviewsSection";

export default function Home() {
  return (
    <div>
      <HeroV2 />
      <TrustedBySection />
      <TicketcheFonction />
      <HowItWorks />
      <EstablishmentsSection />
      <EventsCarousel />
      <ReviewsSection />
      <FAQSection />
      <ActiveUsers />
      <CTASection />
      {/* <CTADownload /> */}

      {/* <About />
      <EventsCarousel />
      
      <WhyTicketcheSection />
      <TestimonialsSection />
       */}
    </div>
  );
}
