import RecrutementClient from "./RecrutementClient";

export const metadata = {
  title: "Carrières & Recrutement | Rejoignez l'équipe Ticketché",
  description:
    "Vous cherchez un emploi dans la tech au Bénin ? Découvrez les offres d'emploi de Ticketché — développeurs, designers, commerciaux et plus. Postulez en ligne dès maintenant.",
  keywords: [
    "emploi tech Bénin",
    "recrutement Ticketché",
    "offres d'emploi Cotonou",
    "carrières startup Bénin",
    "développeur Bénin",
    "stage Cotonou",
  ],
  alternates: { canonical: "/recrutement" },
  openGraph: {
    title: "Carrières & Recrutement | Rejoignez l'équipe Ticketché",
    description:
      "Découvrez les offres d'emploi de Ticketché. Développeurs, designers, commerciaux — postulez en ligne.",
    url: "https://ticketche.com/recrutement",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Recrutement Ticketché" }],
  },
};

export default function RecrutementPage() {
  return <RecrutementClient />;
}