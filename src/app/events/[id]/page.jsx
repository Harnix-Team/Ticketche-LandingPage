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

export default function EventDetailsPage() {
  return <EventDetailsClient />;
}
