import PlaceDetailsClient from "@/components/place/PlaceDetailsClient";
import { fetchAllPlaces } from "@/app/services/api";

export async function generateStaticParams() {
  try {
    const response = await fetchAllPlaces();
    if (response?.success && response.data?.length > 0) {
      return response.data.map((place) => ({ id: String(place.id) }));
    }
  } catch {}
  // Fallback requis par output: export — la page sera générée mais affichera un état vide
  return [{ id: "0" }];
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