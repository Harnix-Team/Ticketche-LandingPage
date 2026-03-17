import EventDetailsClient from "@/components/Events/EventDetailsClient";
import { fetchAllEvents } from "@/app/services/api";

export async function generateStaticParams() {
  try {
    const data = await fetchAllEvents();
    if (data.success) {
      return data.data.map((event) => ({ id: event.id }));
    }
  } catch {}
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    other: {
"apple-itunes-app": `app-id=6758046811, app-argument=ticketche://events/details?eventId=${id}`,    },
  };
}

export default function EventDetailsPage() {
  return <EventDetailsClient />;
}