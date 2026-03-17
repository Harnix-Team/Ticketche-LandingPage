import EventDetailsClient from "@/components/Events/EventDetailsClient";
import { fetchAllEvents } from "@/app/services/api";

export async function generateStaticParams() {
  try {
    const data = await fetchAllEvents();
    if (data?.success && data.data?.length > 0) {
      return data.data.map((event) => ({ id: String(event.id) }));
    }
  } catch {}
  // Fallback requis par output: export — la page sera générée mais affichera un état vide
  return [{ id: "0" }];
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