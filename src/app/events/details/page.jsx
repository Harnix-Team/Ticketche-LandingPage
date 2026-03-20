import EventDetailsClient from "@/components/Events/EventDetailsClient";

export async function generateMetadata({ searchParams }) {
  const { eventId } = await searchParams;
  return {
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://events/details?eventId=${eventId}`,
    },
  };
}

export default function EventDetailsPage() {
  return <EventDetailsClient />;
}