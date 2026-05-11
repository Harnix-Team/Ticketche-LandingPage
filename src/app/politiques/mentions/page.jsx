import MentionsClient from "./MentionsClient";

export const metadata = {
  title: "Mentions Légales | Ticketché",
  description:
    "Mentions légales de Ticketché — informations sur l'éditeur, l'hébergeur et les conditions d'utilisation de la plateforme.",
  alternates: { canonical: "/politiques/mentions" },
  robots: { index: true, follow: false },
};

export default function MentionsLegalesPage() {
  return <MentionsClient />;
}