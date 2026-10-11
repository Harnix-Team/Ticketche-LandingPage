import { Explore } from "@/components/explore/Explore";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { getCatalog, getRecommendations } from "@/lib/api";
import { toCard } from "@/lib/cards";
import { matches, rankWith, readParams } from "@/lib/params";

const BASE = "/restaurants/";

export const metadata = {
  title: "Restaurants au Bénin : menus et horaires | Ticketché",
  description:
    "Maquis, grills, cuisine béninoise, fruits de mer, pizzerias : consultez le menu complet, les prix et les horaires des restaurants au Bénin.",
  alternates: { canonical: BASE },
  openGraph: { title: "Restaurants au Bénin | Ticketché", url: `https://ticketche.com${BASE}` },
};

export default async function RestaurantsPage({ searchParams }) {
  const params = await readParams(searchParams, ["cuisine", "ville", "ouvert", "q"]);
  const now = new Date();
  const [{ restaurants }, reco] = await Promise.all([getCatalog(), getRecommendations({ section: "FOR_YOU", types: ["RESTAURANT"], limit: 50 })]);

  const cards = restaurants.map((restaurant) => toCard(restaurant, now));
  const optionsFor = (field) =>
    [...new Set(cards.map((restaurant) => restaurant[field]).filter(Boolean))]
      .map((value) => ({ value, label: value, count: cards.filter((restaurant) => restaurant[field] === value).length }))
      .sort((a, b) => b.count - a.count);

  const items = rankWith(
    cards.filter(
      (restaurant) =>
        (!params.cuisine || restaurant.cuisine === params.cuisine) &&
        (!params.ville || restaurant.city === params.ville) &&
        (!params.ouvert || restaurant.isOpen === true) &&
        matches(params.q ?? "", restaurant.name, restaurant.cuisine, restaurant.city)
    ),
    reco
  );

  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Accueil", path: "/" }, { name: "Restaurants", path: BASE }]} />
      <Explore
        title="Restaurants"
        intro="Consultez le menu complet et les prix avant de vous déplacer. Certains restaurants prennent aussi les commandes en ligne."
        basePath={BASE}
        params={params}
        items={items}
        tracking={{ surface: "DISCOVER" }}
        filters={[
          { label: "Cuisine", param: "cuisine", options: optionsFor("cuisine"), allLabel: "Toutes" },
          { label: "Ville", param: "ville", options: optionsFor("city"), allLabel: "Tout le Bénin" },
          { label: "Horaires", param: "ouvert", options: [{ value: "oui", label: "Ouvert maintenant" }], allLabel: "Tous" },
        ]}
      />
    </>
  );
}
