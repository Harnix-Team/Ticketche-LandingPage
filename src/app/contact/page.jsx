import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contactez Ticketché | Support & Assistance au Bénin",
  description:
    "Une question, un partenariat ou besoin d'assistance ? Contactez l'équipe Ticketché. Nous répondons dans les plus brefs délais. Disponible pour particuliers et professionnels.",
  keywords: [
    "contact Ticketché",
    "support Ticketché",
    "assistance Bénin",
    "partenariat Ticketché",
    "service client Cotonou",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contactez Ticketché | Support & Assistance",
    description:
      "Une question ou un partenariat ? Contactez l'équipe Ticketché — nous répondons dans les plus brefs délais.",
    url: "https://www.ticketche.com/contact",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Contact Ticketché" }],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}