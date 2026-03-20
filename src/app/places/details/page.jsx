import PlaceDetailsClient from "@/components/place/PlaceDetailsClient";

export async function generateMetadata({ searchParams }) {
  const { placeId } = await searchParams;
  return {
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://places/details?placeId=${placeId}`,
    },
  };
}

export default function PlaceDetailsPage() {
  return <PlaceDetailsClient />;
}