import PlaceDetailsClient from "@/components/place/PlaceDetailsClient";
import { fetchAllPlaces } from "@/app/services/api";

export async function generateStaticParams() {
  try {
    const response = await fetchAllPlaces();
    if (response.success) {
      return response.data.map((place) => ({ id: place.id }));
    }
  } catch {}
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    other: {
"apple-itunes-app": `app-id=6758046811, app-argument=ticketche://places/details?placeId=${id}`,    },
  };
}

export default function PlaceDetailsPage() {
  return <PlaceDetailsClient />;
}