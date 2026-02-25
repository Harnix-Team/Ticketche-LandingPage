import PlaceDetailsClient from "@/components/Place/PlaceDetailsClient";import { fetchAllPlaces } from "@/app/services/api";

export async function generateStaticParams() {
  try {
    const response = await fetchAllPlaces();
    if (response.success) {
      return response.data.map((place) => ({ id: place.id }));
    }
  } catch {}
  return [];
}

export default function PlaceDetailsPage() {
  return <PlaceDetailsClient />;
}