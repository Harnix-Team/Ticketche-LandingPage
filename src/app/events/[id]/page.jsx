import EventDetailsClient from "@/components/Events/EventDetailsClient";
export async function generateStaticParams() {
  try {
    const response = await fetch("https://api.ticketche.com/api/v2/events");
    const data = await response.json();
    if (data.success) {
      return data.data.map((event) => ({ id: event.id }));
    }
  } catch {}
  return [];
}

export default function EventDetailsPage() {
  return <EventDetailsClient />;
}