import { Clock, ExternalLink, MapPin, Navigation, UtensilsCrossed } from "@/components/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton, ViewTracker } from "@/components/detail/Actions";
import { RelatedRail, Section, WeekHours } from "@/components/detail/Sections";
import { GetApp } from "@/components/shell/GetApp";
import { BreadcrumbStructuredData, SITE_URL } from "@/components/StructuredData";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { ResthoraBadge } from "@/components/ui/ResthoraBadge";
import { getCatalog, getMenu, getRelated } from "@/lib/api";
import { toCard } from "@/lib/cards";
import { formatPrice } from "@/lib/format";
import { idFromSlug } from "@/lib/paths";
import { hydrateReco, indexCatalog } from "@/lib/reco";

export const revalidate = 600;

/** Aucune fiche n'est generee au build : chacune l'est a sa premiere visite, puis servie depuis le cache. */
export const generateStaticParams = async () => [];

async function loadRestaurant(slug) {
  const id = idFromSlug(slug);
  if (!id) return null;

  const { restaurants, reachable } = await getCatalog();
  const restaurant = restaurants.find((entry) => entry.id === id) ?? null;
  if (!restaurant && !reachable) throw new Error("L’API Ticketché ne répond pas.");

  return restaurant;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const restaurant = await loadRestaurant(slug).catch(() => null);

  if (!restaurant) return { title: "Restaurant introuvable | Ticketché", robots: { index: false, follow: true } };

  const title = `${restaurant.name}${restaurant.city ? `, ${restaurant.city}` : ""} : menu et horaires | Ticketché`;
  const description = [restaurant.cuisine ? `Cuisine ${restaurant.cuisine.toLowerCase()}` : "Restaurant", restaurant.city ? `à ${restaurant.city}` : null, restaurant.description]
    .filter(Boolean)
    .join(". ")
    .slice(0, 300);

  return {
    title,
    description,
    alternates: { canonical: restaurant.path },
    openGraph: { type: "website", title, description, url: `${SITE_URL}${restaurant.path}`, images: restaurant.images.slice(0, 1) },
  };
}

export default async function RestaurantPage({ params }) {
  const { slug } = await params;
  const restaurant = await loadRestaurant(slug);
  if (!restaurant) notFound();

  const now = new Date();
  const [catalog, menu, related] = await Promise.all([getCatalog(), getMenu(restaurant.menuKey), getRelated("RESTAURANT", restaurant.id, 10)]);
  const relatedItems = hydrateReco(
    related,
    indexCatalog({
      places: catalog.places.map((entry) => toCard(entry, now)),
      events: catalog.events.map((entry) => toCard(entry, now)),
      restaurants: catalog.restaurants.map((entry) => toCard(entry, now)),
    }),
    10
  );
  const categories = menu ?? [];
  const directions = restaurant.position ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.position.lat},${restaurant.position.lng}` : null;
  const self = { kind: "restaurant", id: restaurant.id, name: restaurant.name };

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Accueil", path: "/" },
          { name: "Restaurants", path: "/restaurants/" },
          { name: restaurant.name, path: restaurant.path },
        ]}
      />
      <ViewTracker item={self} surface="RESTAURANT_DETAILS" />

      <div className="tk-shell pt-5 pb-8">
        <nav aria-label="Fil d’Ariane" className="tk-label mb-6 flex items-center gap-2 text-[0.8125rem] text-ink-3">
          <Link href="/restaurants/" className="hover:text-brand">Restaurants</Link>
          {restaurant.cuisine && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/restaurants/?cuisine=${encodeURIComponent(restaurant.cuisine)}`} className="hover:text-brand">{restaurant.cuisine}</Link>
            </>
          )}
        </nav>

        <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-panel border border-line bg-sunken sm:size-36">
            <Media src={restaurant.images[0]} alt={`Logo de ${restaurant.name}`} sizes="144px" priority kind="restaurant" className="size-full" />
          </div>
          <div className="min-w-0">
            <h1 className="tk-display text-[clamp(2.25rem,5vw,4rem)]">{restaurant.name}</h1>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-ink-2">
              {restaurant.cuisine && (
                <li className="flex items-center gap-1.5">
                  <UtensilsCrossed className="size-4 text-brand" aria-hidden />
                  {restaurant.cuisine}
                </li>
              )}
              {(restaurant.address || restaurant.city) && (
                <li className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-brand" aria-hidden />
                  {[restaurant.address, restaurant.city].filter(Boolean).join(", ")}
                </li>
              )}
              {restaurant.resthora && (
                <li className="flex items-center">
                  <ResthoraBadge className="border border-line" />
                </li>
              )}
              {restaurant.isOpen !== null && (
                <li className={`tk-label flex items-center gap-1.5 ${restaurant.isOpen ? "text-ok" : "text-ink-2"}`}>
                  <Clock className="size-4" aria-hidden />
                  {restaurant.isOpen ? "Ouvert maintenant" : "Fermé en ce moment"}
                </li>
              )}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {restaurant.canOrder ? (
                <GetApp reason="La commande et la livraison passent par l’application.">Commander dans l’application</GetApp>
              ) : (
                restaurant.orderUrl && (
                  <Button href={restaurant.orderUrl} variant="gold">
                    Commander sur le site du restaurant
                    <ExternalLink className="size-4" aria-hidden />
                  </Button>
                )
              )}
              {directions && (
                <Button href={directions} variant="outline">
                  <Navigation className="size-[1.125rem]" aria-hidden />
                  Itinéraire
                </Button>
              )}
              <ShareButton item={self} surface="RESTAURANT_DETAILS" />
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-10">
            {restaurant.description && (
              <Section id="a-propos" title="À propos">
                <p className="max-w-[68ch] text-ink-2">{restaurant.description}</p>
              </Section>
            )}

            <Section id="menu" title="Menu">
              {categories.length === 0 ? (
                <p className="text-ink-2">Le menu de ce restaurant n’est pas disponible pour le moment.</p>
              ) : (
                <div className="flex flex-col gap-8">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <h3 className="tk-title mb-3 text-lg text-brand">{category.name}</h3>
                      <ul className="grid gap-2.5 md:grid-cols-2">
                        {category.items.map((item) => (
                          <li key={item.id} className={`flex gap-3 rounded-card border border-line bg-surface p-2 ${item.available ? "" : "opacity-55"}`}>
                            <div className="relative size-20 shrink-0 overflow-hidden rounded-media bg-sunken">
                              <Media src={item.image} alt="" sizes="80px" kind="restaurant" className="size-full" />
                            </div>
                            <div className="flex min-w-0 grow flex-col py-0.5 pr-1.5">
                              <h4 className="tk-label text-[0.9375rem] text-ink">{item.name}</h4>
                              {item.description && <p className="line-clamp-2 text-[0.8125rem] text-ink-2">{item.description}</p>}
                              <p className="tk-label mt-auto pt-1 text-[0.875rem] text-ink">
                                {item.available ? (item.price ? formatPrice(item.price) : "") : "Indisponible"}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {restaurant.hours.length > 0 && (
            <aside>
              <div className="rounded-panel border border-line bg-surface p-6 lg:sticky lg:top-24">
                <h2 className="tk-title mb-4 text-xl">Horaires</h2>
                <div className="[&>ul]:grid-cols-1">
                  <WeekHours hours={restaurant.hours} now={now} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <RelatedRail items={relatedItems} seed={self} description="D’après les clients de ce restaurant et les adresses qui lui ressemblent." />
    </>
  );
}
