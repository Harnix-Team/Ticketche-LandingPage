import { Suspense } from "react";
import PlaceDetailsClient from "@/components/place/PlaceDetailsClient";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }) {
  const placeId = searchParams?.placeId ?? "";
  return {
    title: "Détail de l'établissement | Ticketché",
    description:
      "Consultez les détails de cet établissement — parking, garage ou lavage auto — ses horaires, tarifs et avis clients au Bénin.",
    openGraph: {
      title: "Établissement | Ticketché",
      description: "Parking, garage ou lavage auto au Bénin. Réservez via Ticketché.",
      url: `https://www.ticketche.com/places/details?placeId=${placeId}`,
      images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Établissement Ticketché" }],
    },
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://places/details?placeId=${placeId}`,
    },
  };
}

export default function PlaceDetailsPage() {
  return (
    <Suspense fallback={null}>
      <PlaceDetailsClient />
    </Suspense>
  );
}