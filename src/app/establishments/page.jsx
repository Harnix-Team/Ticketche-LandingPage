import { Explore } from "@/components/explore/Explore";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { getCatalog, getRecommendations } from "@/lib/api";
import { toCard } from "@/lib/cards";
import { placeTypeIcon } from "@/lib/icons";
import { matches, rankWith, readParams } from "@/lib/params";

const BASE = "/establishments/";

const SORTS = [
  { value: "note", label: "Mieux notés" },
  { value: "prix", label: "Prix croissant" },
  { value: "recents", label: "Récents" },
];

export async function generateMetadata({ searchParams }) {
  const { type, ville } = await readParams(searchParams, ["type", "ville"]);
  const { placeTypes } = await getCatalog();
  const label = placeTypes.find((entry) => entry.type === type)?.label;
  const subject = label ?? "Lieux à découvrir";
  const where = ville ? `à ${ville}` : "au Bénin";

  return {
    title: `${subject} ${where} | Ticketché`,
    description: `${subject} ${where} : hôtels, culture, nature, sorties, parkings et garages, avec horaires, tarifs et avis. Réservez depuis l’application Ticketché.`,
    alternates: { canonical: BASE },
    openGraph: { title: `${subject} ${where} | Ticketché`, url: `https://ticketche.com${BASE}` },
  };
}

export default async function PlacesPage({ searchParams }) {
  const params = await readParams(searchParams, ["type", "ville", "tri", "q"]);
  const now = new Date();
  const [{ places, placeTypes }, reco] = await Promise.all([
    getCatalog(),
    // Ordre par defaut : celui du moteur de recommandation, restreint au type choisi.
    params.tri ? null : getRecommendations({ section: "FOR_YOU", types: ["PLACE"], placeTypes: params.type ? [params.type] : undefined, limit: 50 }),
  ]);

  const cards = places.map((place) => toCard(place, now));
  const count = (predicate) => cards.filter(predicate).length;
  const typeOptions = placeTypes
    .map(({ type, label, icon }) => ({ value: type, label, icon: placeTypeIcon(icon), count: count((place) => place.types.some((entry) => entry.type === type)) }))
    .filter((option) => option.count > 0);
  const cityOptions = [...new Set(cards.map((place) => place.city).filter(Boolean))]
    .map((city) => ({ value: city, label: city, count: count((place) => place.city === city) }))
    .sort((a, b) => b.count - a.count);

  let items = cards.filter(
    (place) =>
      (!params.type || place.types.some((entry) => entry.type === params.type)) &&
      (!params.ville || place.city === params.ville) &&
      matches(params.q ?? "", place.name, place.city, ...place.types.map((entry) => entry.label))
  );

  if (params.tri === "prix") items = [...items].sort((a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity));
  else if (params.tri === "recents") items = [...items].reverse();
  else items = rankWith([...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)), params.tri ? null : reco);

  const typeLabel = typeOptions.find((option) => option.value === params.type)?.label;

  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Accueil", path: "/" }, { name: "Lieux", path: BASE }]} />
      <Explore
        title={typeLabel ?? "Lieux"}
        intro="Hôtels, lieux culturels, parcs, plages, sorties du soir, salles de sport, marchés, parkings et garages : chaque fiche donne les horaires, les tarifs et les avis."
        basePath={BASE}
        params={params}
        items={items}
        tracking={{ surface: "DISCOVER" }}
        mapHref={params.type ? `/carte/?type=${params.type}` : "/carte/"}
        filters={[
          { label: "Type", param: "type", options: typeOptions, allLabel: "Tous" },
          { label: "Ville", param: "ville", options: cityOptions, allLabel: "Tout le Bénin" },
          { label: "Tri", param: "tri", options: SORTS, allLabel: "Recommandés" },
        ]}
      />
    </>
  );
}
