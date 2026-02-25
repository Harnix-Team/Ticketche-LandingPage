import { About } from "@/components/Home/AboutSection";
import { ContactSection } from "@/components/Home/ContactSection";
import { CTASection } from "@/components/Home/CTASection";
import { EstablishmentsSection } from "@/components/Home/EstablishmentsSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { Hero } from "@/components/Home/HeroSection";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import { EventsSection } from "@/components/Home/EventsSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <EstablishmentsSection />
      <TestimonialsSection />
      <EventsSection /> 
      <CTASection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
