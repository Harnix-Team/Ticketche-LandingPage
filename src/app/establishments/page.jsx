import EstablishmentsClient from "./EstablishmentsClient";

export const metadata = {
  title: "Parkings, Garages & Lavages Auto au Bénin | Ticketché",
  description:
    "Trouvez les meilleurs parkings, garages automobiles et centres de lavage auto près de vous au Bénin. Géolocalisation, avis clients et réservation en ligne via Ticketché.",
  keywords: [
    "parking Cotonou",
    "garage automobile Bénin",
    "lavage auto Cotonou",
    "parking Bénin",
    "stationnement Cotonou",
    "centre de lavage Bénin",
    "trouver parking Bénin",
  ],
  alternates: { canonical: "/establishments" },
  openGraph: {
    title: "Parkings, Garages & Lavages Auto au Bénin | Ticketché",
    description:
      "Trouvez les parkings, garages et lavages auto les mieux notés près de vous au Bénin. Réservez et payez via Ticketché.",
    url: "https://ticketche.com/establishments",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Établissements Ticketché" }],
  },
};

export default function EstablishmentsPage() {
  return <EstablishmentsClient />;
}