import { About } from "@/components/Home/AboutSection";
import { CTASection } from "@/components/Home/CTASection";
import { EstablishmentsSection } from "@/components/Home/EstablishmentsSection";
import { Hero } from "@/components/Home/HeroSection";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import { EventsCarousel } from "@/components/Home/EventsCarousel";
import { WhyTicketcheSection } from "@/components/Home/WhyTicketcheSection";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* <About />
      <EventsCarousel />
      <EstablishmentsSection />
      <WhyTicketcheSection />
      <TestimonialsSection />
      <CTASection /> */}
    </div>
  );
}
