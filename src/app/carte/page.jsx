import { MapExplorer } from "@/components/map/MapExplorer";
import { getCatalog } from "@/lib/api";
import { byStart, isUpcoming, toCard } from "@/lib/cards";
import { readParams } from "@/lib/params";

export const metadata = {
  title: "Carte des lieux et événements au Bénin | Ticketché",
  description:
    "Explorez sur la carte les hôtels, lieux culturels, sorties, parkings et événements au Bénin. Filtrez par type et triez par distance.",
  alternates: { canonical: "/carte/" },
};

export default async function MapPage({ searchParams }) {
  const { type } = await readParams(searchParams, ["type"]);
  const now = new Date();
  const { places, events, placeTypes } = await getCatalog();
  const items = [
    ...places.map((place) => toCard(place, now)),
    ...events.filter((event) => isUpcoming(event, now) && event.format !== "EN_LIGNE").sort(byStart).map((event) => toCard(event, now)),
  ];

  return (
    <>
      <h1 className="sr-only">Carte des lieux et événements au Bénin</h1>
      <MapExplorer
        items={items}
        placeTypes={placeTypes}
        initialType={placeTypes.some((entry) => entry.type === type) ? type : null}
        className="h-[calc(100dvh-4rem)] min-h-[32rem]"
      />
    </>
  );
}
