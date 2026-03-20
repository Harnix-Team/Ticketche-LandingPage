import { Suspense } from "react";
import EventDetailsClient from "@/components/Events/EventDetailsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { eventId } = await searchParams;
  return {
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