import { Explore } from "@/components/explore/Explore";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { getCatalog, getRecommendations } from "@/lib/api";
import { byStart, isUpcoming, toCard } from "@/lib/cards";
import { beninNow } from "@/lib/format";
import { eventCategoryIcon } from "@/lib/icons";
import { matches, rankWith, readParams } from "@/lib/params";

const BASE = "/events/";
const DAY = 86_400_000;

export const metadata = {
  title: "Événements au Bénin : concerts, festivals, conférences | Ticketché",
  description:
    "Concerts, festivals, soirées, conférences et rencontres sportives au Bénin. Dates, lieux et prix des billets, à réserver depuis l’application Ticketché.",
  alternates: { canonical: BASE },
  openGraph: { title: "Événements au Bénin | Ticketché", url: `https://ticketche.com${BASE}` },
};

/** Fin du dimanche en cours et debut du vendredi qui le precede, a l'heure du Benin. */
function weekendWindow(now) {
  const { day } = beninNow(now);
  const index = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].indexOf(day);
  const startOfToday = new Date(now.getTime() - (beninNow(now).minute * 60_000));

  return { from: new Date(startOfToday.getTime() + Math.max(0, 4 - index) * DAY), to: new Date(startOfToday.getTime() + (7 - index) * DAY) };
}

const PERIODS = [
  { value: "semaine", label: "Dans les 7 jours" },
  { value: "week-end", label: "Ce week-end" },
  { value: "mois", label: "Dans les 30 jours" },
];

function inPeriod(event, period, now) {
  const start = new Date(event.start);
  const end = new Date(event.end ?? event.start);
  if (period === "semaine") return start <= new Date(now.getTime() + 7 * DAY);
  if (period === "mois") return start <= new Date(now.getTime() + 30 * DAY);
  if (period === "week-end") {
    const { from, to } = weekendWindow(now);

    return start < to && end >= from;
  }

  return true;
}

export default async function EventsPage({ searchParams }) {
  const params = await readParams(searchParams, ["categorie", "quand", "prix", "tri", "q"]);
  const now = new Date();
  const [{ events }, reco] = await Promise.all([
    getCatalog(),
    params.tri === "populaires" ? getRecommendations({ section: "TRENDING", types: ["EVENT"], limit: 50 }) : null,
  ]);

  const cards = events.filter((event) => isUpcoming(event, now)).sort(byStart).map((event) => toCard(event, now));
  const categories = [...new Map(cards.filter((event) => event.category).map((event) => [event.category.id, event.category])).values()];
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.title,
    icon: eventCategoryIcon(category.title),
    count: cards.filter((event) => event.category?.id === category.id).length,
  }));

  let items = cards.filter(
    (event) =>
      (!params.categorie || event.category?.id === params.categorie) &&
      (!params.prix || event.minPrice === 0) &&
      inPeriod(event, params.quand, now) &&
      matches(params.q ?? "", event.name, event.locationName, event.category?.title)
  );
  if (params.tri === "populaires") items = rankWith(items, reco);
  if (params.tri === "prix") items = [...items].sort((a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity));

  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Accueil", path: "/" }, { name: "Événements", path: BASE }]} />
      <Explore
        title="Événements"
        intro="Concerts, festivals, conférences, rencontres sportives. Choisissez ici, prenez votre ticket dans l’application : il arrive en QR code."
        basePath={BASE}
        params={params}
        items={items}
        tracking={{ surface: "DISCOVER" }}
        emptyHint="Aucun événement à venir ne correspond. Élargissez la période ou changez de catégorie."
        filters={[
          { label: "Genre", param: "categorie", options: categoryOptions, allLabel: "Tous" },
          { label: "Quand", param: "quand", options: PERIODS, allLabel: "À venir" },
          { label: "Prix", param: "prix", options: [{ value: "gratuit", label: "Gratuit" }], allLabel: "Tous les prix" },
          {
            label: "Tri",
            param: "tri",
            options: [
              { value: "populaires", label: "Populaires" },
              { value: "prix", label: "Prix croissant" },
            ],
            allLabel: "Par date",
          },
        ]}
      />
    </>
  );
}
