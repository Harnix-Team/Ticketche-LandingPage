import { Suspense } from "react";
import PlaceDetailsClient from "@/components/place/PlaceDetailsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { placeId } = await searchParams;
  return {
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