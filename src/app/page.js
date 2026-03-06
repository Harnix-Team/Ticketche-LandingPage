import { About } from "@/components/Home/AboutSection";
import { CTASection } from "@/components/Home/CTASection";
import { EstablishmentsSection } from "@/components/Home/EstablishmentsSection";
import { Hero } from "@/components/Home/HeroSection";
import TrustedBySection from "@/components/Home/TrustedBySection";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import { EventsCarousel } from "@/components/Home/EventsCarousel";
import { WhyTicketcheSection } from "@/components/Home/WhyTicketcheSection";
import  TicketcheFonction  from "@/components/Home/TicketcheFonction";
import HowItWorks from "@/components/Home/HowItWorks";

export default function Home() {
  return (
    <div>
      <Hero />
      <TrustedBySection />
      <TicketcheFonction />
      <HowItWorks />
      {/* <About />
      <EventsCarousel />
      <EstablishmentsSection />
      <WhyTicketcheSection />
      <TestimonialsSection />
      <CTASection /> */}
    </div>
  );
}
