import { Suspense } from "react";
import EventDetailsClient from "@/components/Events/EventDetailsClient";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://events/details`,
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