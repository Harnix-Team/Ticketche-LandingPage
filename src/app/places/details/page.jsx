import { Suspense } from "react";
import PlaceDetailsClient from "@/components/place/PlaceDetailsClient";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://places/details`,
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