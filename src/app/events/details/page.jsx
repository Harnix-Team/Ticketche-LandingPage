import { Suspense } from "react";
import EventDetailsClient from "@/components/Events/EventDetailsClient";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }) {
  const eventId = searchParams?.eventId ?? "";
  return {
    title: "Détail de l'événement | Ticketché",
    description:
      "Consultez les détails de cet événement — lieu, date, tarif — et achetez votre billet en ligne via Ticketché au Bénin.",
    openGraph: {
      title: "Événement | Ticketché",
      description: "Achetez votre billet pour cet événement au Bénin via Ticketché.",
      url: `https://www.ticketche.com/events/details?eventId=${eventId}`,
      images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Événement Ticketché" }],
    },
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://events/details?eventId=${eventId}`,
    },
  };
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={null}>
      <EventDetailsClient />
    </Suspense>
  );
}