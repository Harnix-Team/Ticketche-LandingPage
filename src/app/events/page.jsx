import EventsClient from "./EventsClient";

export const metadata = {
  title: "Événements & Billetterie en Ligne au Bénin | Ticketché",
  description:
    "Découvrez tous les événements au Bénin — concerts, festivals, soirées, conférences. Achetez vos billets en ligne en toute sécurité via Ticketché.",
  keywords: [
    "événements Bénin",
    "concert Cotonou",
    "billetterie en ligne Bénin",
    "festival Bénin",
    "soirée Cotonou",
    "acheter billet Bénin",
  ],
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Événements & Billetterie en Ligne au Bénin | Ticketché",
    description:
      "Concerts, festivals, soirées et conférences au Bénin. Achetez vos billets en ligne avec Ticketché.",
    url: "https://www.ticketche.com/events",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Événements Ticketché" }],
  },
};

export default function EventsPage() {
  return <EventsClient />;
}