import AProposClient from "./AProposClient";

export const metadata = {
  title: "À propos de Ticketché | La plateforme de mobilité urbaine au Bénin",
  description:
    "Découvrez Ticketché, la solution digitale béninoise qui simplifie la gestion des parkings, garages, lavages auto et la billetterie événementielle. Notre mission, notre équipe, notre histoire.",
  keywords: [
    "Ticketché à propos",
    "startup Bénin",
    "mobilité urbaine Cotonou",
    "application parking Bénin",
    "billetterie Bénin",
    "Harnix-Team",
  ],
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "À propos de Ticketché | La plateforme de mobilité urbaine au Bénin",
    description:
      "Ticketché simplifie la gestion des parkings, garages, lavages auto et la billetterie événementielle au Bénin.",
    url: "https://www.ticketche.com/a-propos",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "À propos de Ticketché" }],
  },
};

export default function AProposPage() {
  return <AProposClient />;
}