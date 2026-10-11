import { CalendarDays, Clock, Compass, MapPin, Sparkles, TrendingUp, UtensilsCrossed } from "@/components/icons";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { AppBand } from "@/components/home/AppBand";
import { Faq } from "@/components/home/Faq";
import { ForYou } from "@/components/home/ForYou";
import { ProBand } from "@/components/home/ProBand";
import { TicketHero } from "@/components/home/TicketHero";
import { TypeGrid } from "@/components/home/TypeGrid";
import { MapExplorer } from "@/components/map/MapExplorer";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LazyMount } from "@/components/ui/LazyMount";
import { Rail } from "@/components/ui/Rail";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCatalog, getRecommendations } from "@/lib/api";
import { byStart, isUpcoming, toCard } from "@/lib/cards";
import { placeTypeIcon } from "@/lib/icons";
import { hydrateReco, indexCatalog } from "@/lib/reco";

export const revalidate = 300;

const ALL_TYPES = ["EVENT", "PLACE", "RESTAURANT"];
const TRACKING = { surface: "HOME" };
const CARD_WIDTH = "w-[min(78vw,19rem)]";

const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count > 1 ? pluralForm : singular}`;

function CardRail({ title, icon, sweep, description, href, hrefLabel, items }) {
  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <SectionHeader title={title} icon={icon} sweep={sweep} description={description} href={href} hrefLabel={hrefLabel} />
      <Rail label={title}>
        {items.map((item) => (
          <CatalogCard key={`${item.kind}-${item.id}`} item={item} tracking={TRACKING} className={CARD_WIDTH} />
        ))}
      </Rail>
    </section>
  );
}

export default async function Home() {
  const now = new Date();
  const [catalog, forYou, trending, openNow, fresh] = await Promise.all([
    getCatalog(),
    getRecommendations({ section: "FOR_YOU", types: ALL_TYPES, limit: 24 }),
    getRecommendations({ section: "TRENDING", types: ALL_TYPES, limit: 12 }),
    getRecommendations({ section: "OPEN_NOW", types: ["PLACE", "RESTAURANT"], limit: 12 }),
    getRecommendations({ section: "NEW", types: ["EVENT", "PLACE"], limit: 12 }),
  ]);

  const places = catalog.places.map((place) => toCard(place, now));
  const events = catalog.events.filter((event) => isUpcoming(event, now)).sort(byStart).map((event) => toCard(event, now));
  // Les fiches les plus completes (ville et cuisine renseignees) passent devant.
  const restaurants = catalog.restaurants
    .map((restaurant) => toCard(restaurant, now))
    .sort((a, b) => Number(Boolean(b.city && b.cuisine)) - Number(Boolean(a.city && a.cuisine)));
  const index = indexCatalog({ places, events, restaurants });

  // Moteur coupe ou injoignable : memes rubriques, classees par des regles simples.
  const byRating = [...places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
  const pool = forYou ? hydrateReco(forYou, index) : [...events.slice(0, 6), ...byRating.slice(0, 18)];
  const featured = pool.filter((item) => item.images.length > 0).slice(0, 5);
  const trendingItems = trending ? hydrateReco(trending, index) : byRating.slice(0, 12);
  const openItems = openNow ? hydrateReco(openNow, index) : places.filter((place) => place.isOpen).slice(0, 12);
  const freshItems = fresh ? hydrateReco(fresh, index) : [];

  const typeCount = (type) => places.filter((place) => place.types.some((entry) => entry.type === type.type)).length;
  const quickTypes = catalog.placeTypes
    .map((type) => ({ ...type, count: typeCount(type) }))
    .filter((type) => type.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const mapItems = [...places, ...events.filter((event) => event.format !== "EN_LIGNE")];

  return (
    <div className="flex flex-col gap-[clamp(3.5rem,7vw,6rem)] pb-8">
      <section className="tk-shell grid items-center gap-8 pt-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pt-12">
        <div className="tk-enter flex flex-col items-start gap-6">
          <h1 className="tk-display tk-stretch text-[clamp(2.75rem,7.2vw,5.5rem)]" style={{ "--i": 0 }}>
            Que faire au Bénin cette semaine ?
          </h1>
          <p className="max-w-[44ch] text-[1.0625rem] text-ink-2" style={{ "--i": 1 }}>
            Concerts, hôtels, plages, musées, maquis. Trouvez où aller ici, puis réservez et payez par Mobile Money
            dans l’application.
          </p>
          <div className="flex flex-wrap gap-2.5" style={{ "--i": 2 }}>
            <Button href="/events/" size="lg">
              <CalendarDays className="size-5" aria-hidden />
              {plural(events.length, "événement")}
            </Button>
            <Button href="/establishments/" variant="outline" size="lg">
              <MapPin className="size-5" aria-hidden />
              {plural(places.length, "lieu", "lieux")}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2" style={{ "--i": 3 }}>
            {quickTypes.map((type) => (
              <Chip key={type.type} href={`/establishments/?type=${type.type}`} icon={placeTypeIcon(type.icon)} scroll>
                {type.label}
              </Chip>
            ))}
          </div>
        </div>
        <TicketHero items={featured} />
      </section>

      <CardRail
        title="Tendances"
        icon={TrendingUp}
        sweep
        description="Ce que les utilisateurs de Ticketché regardent le plus en ce moment."
        items={trendingItems}
      />

      <ForYou pool={pool.slice(0, 12)} />

      <CardRail
        title="Prochains événements"
        icon={CalendarDays}
        href="/events/"
        hrefLabel="Tous les événements"
        items={events.slice(0, 12)}
      />

      <CardRail title="Ouvert maintenant" icon={Clock} description="Des adresses où vous pouvez aller tout de suite." items={openItems} />

      {mapItems.length > 0 && (
        <section aria-label="Autour de vous">
          <SectionHeader
            title="Autour de vous"
            icon={Compass}
            description="Touchez un marqueur ou faites défiler les fiches : la carte suit."
            href="/carte/"
            hrefLabel="Ouvrir la carte"
          />
          <div className="tk-shell">
            <LazyMount className="h-[34rem] overflow-hidden rounded-panel border border-line">
              <MapExplorer items={mapItems} placeTypes={catalog.placeTypes} compact className="size-full" />
            </LazyMount>
          </div>
        </section>
      )}

      <section aria-label="Explorer par type de lieu">
        <SectionHeader
          title="Chaque envie a son adresse"
          description="Les lieux ne s’arrêtent plus aux parkings et aux garages : culture, nature, sorties, sport, shopping."
          href="/establishments/"
          hrefLabel="Tous les lieux"
        />
        <TypeGrid placeTypes={catalog.placeTypes} places={places} />
      </section>

      <CardRail title="Nouveautés" icon={Sparkles} description="Arrivés ces dernières semaines." items={freshItems} />

      <CardRail
        title="Restaurants"
        icon={UtensilsCrossed}
        description="Consultez le menu complet avant de vous déplacer."
        href="/restaurants/"
        hrefLabel="Tous les restaurants"
        items={restaurants.slice(0, 12)}
      />

      <AppBand />
      <ProBand
        images={{
          event: events.find((event) => event.images.length > 0)?.images[0],
          place: byRating.find((place) => place.images.length > 0)?.images[0],
        }}
      />
      <Faq />
    </div>
  );
}
