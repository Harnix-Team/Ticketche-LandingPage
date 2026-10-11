import { Clock, MapPin, Navigation, Phone, Star } from "@/components/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton, StickyCta, ViewTracker } from "@/components/detail/Actions";
import { Gallery } from "@/components/detail/Gallery";
import { RelatedRail, Reviews, Section, WeekHours } from "@/components/detail/Sections";
import { MapView } from "@/components/map/MapView";
import { GetApp } from "@/components/shell/GetApp";
import { BreadcrumbStructuredData, SITE_URL } from "@/components/StructuredData";
import { Button } from "@/components/ui/Button";
import { LazyMount } from "@/components/ui/LazyMount";
import { getCatalog, getPlace, getRelated } from "@/lib/api";
import { toCard } from "@/lib/cards";
import { distanceKm, formatPrice, openState } from "@/lib/format";
import { placeTypeIcon } from "@/lib/icons";
import { idFromSlug, placePath } from "@/lib/paths";
import { hydrateReco, indexCatalog } from "@/lib/reco";

export const revalidate = 300;

/** Aucune fiche n'est generee au build : chacune l'est a sa premiere visite, puis servie depuis le cache. */
export const generateStaticParams = async () => [];

async function loadPlace(slug) {
  const id = idFromSlug(slug);
  if (!id) return null;

  const place = await getPlace(id);
  if (place === undefined) throw new Error("L’API Ticketché ne répond pas.");

  return place;
}

const summary = (place) =>
  [
    place.types.map((type) => type.label).join(", "),
    place.city ? `à ${place.city}` : null,
    place.minPrice ? `à partir de ${formatPrice(place.minPrice)}` : null,
  ]
    .filter(Boolean)
    .join(" ");

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const place = await loadPlace(slug).catch(() => null);

  if (!place) return { title: "Lieu introuvable | Ticketché", robots: { index: false, follow: true } };

  const title = `${place.name}${place.city ? `, ${place.city}` : ""} | Ticketché`;
  const description = `${summary(place)}. ${place.description}`.slice(0, 300);
  const image = place.images[0] ?? `${SITE_URL}/images/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: place.path },
    openGraph: { type: "website", title, description, url: `${SITE_URL}${place.path}`, images: [{ url: image, alt: place.name }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    other: { "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://places/details?placeId=${place.id}` },
  };
}

const SCHEMA_DAYS = { Lundi: "Monday", Mardi: "Tuesday", Mercredi: "Wednesday", Jeudi: "Thursday", Vendredi: "Friday", Samedi: "Saturday", Dimanche: "Sunday" };

function PlaceStructuredData({ place }) {
  const graph = {
    "@context": "https://schema.org",
    "@type": place.types.some((type) => type.type === "HOTEL") ? "Hotel" : "LocalBusiness",
    name: place.name,
    description: place.description || undefined,
    url: `${SITE_URL}${place.path}`,
    image: place.images.length > 0 ? place.images : undefined,
    address: { "@type": "PostalAddress", addressLocality: place.city ?? undefined, addressCountry: "BJ" },
    geo: place.position ? { "@type": "GeoCoordinates", latitude: place.position.lat, longitude: place.position.lng } : undefined,
    priceRange: place.minPrice ? `À partir de ${place.minPrice} XOF` : undefined,
    aggregateRating: place.rating ? { "@type": "AggregateRating", ratingValue: place.rating, reviewCount: place.reviewCount, bestRating: 5 } : undefined,
    openingHoursSpecification: place.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAYS[slot.day],
      opens: slot.open,
      closes: slot.close,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}

export default async function PlacePage({ params }) {
  const { slug } = await params;
  const place = await loadPlace(slug);
  if (!place) notFound();

  const now = new Date();
  const state = openState(place.hours, now);
  const [catalog, related] = await Promise.all([getCatalog(), getRelated("PLACE", place.id, 10)]);
  const cards = {
    places: catalog.places.map((entry) => toCard(entry, now)),
    events: catalog.events.map((entry) => toCard(entry, now)),
    restaurants: catalog.restaurants.map((entry) => toCard(entry, now)),
  };
  const relatedItems = hydrateReco(related, indexCatalog(cards), 10);
  // Moteur coupe ou sans resultat : les lieux les plus proches, comme le repli « A proximite » de l'app.
  const nearby =
    relatedItems.length === 0 && place.position
      ? cards.places
          .filter((entry) => entry.id !== place.id && entry.position)
          .map((entry) => ({ ...entry, distance: distanceKm(place.position, entry.position) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8)
      : [];

  const mainType = place.types[0];
  const servicesByType = Map.groupBy(place.services, (service) => service.typeLabel ?? "Services");
  const priceLabel = place.minPrice ? formatPrice(place.minPrice) : "Prix sur place";
  const directions = place.position ? `https://www.google.com/maps/dir/?api=1&destination=${place.position.lat},${place.position.lng}` : null;
  const self = { kind: "place", id: place.id, name: place.name };

  return (
    <>
      <PlaceStructuredData place={place} />
      <BreadcrumbStructuredData
        items={[
          { name: "Accueil", path: "/" },
          { name: "Lieux", path: "/establishments/" },
          { name: place.name, path: place.path },
        ]}
      />
      <ViewTracker item={self} surface="PLACE_DETAILS" />

      <div className="tk-shell pt-5 pb-28 lg:pb-8">
        <nav aria-label="Fil d’Ariane" className="tk-label mb-4 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
          <Link href="/establishments/" className="hover:text-brand">Lieux</Link>
          {mainType && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/establishments/?type=${mainType.type}`} className="hover:text-brand">{mainType.label}</Link>
            </>
          )}
        </nav>

        <Gallery item={{ kind: "place", id: place.id, name: place.name, images: place.images, types: place.types }} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-10">
            <header>
              <ul className="mb-3 flex flex-wrap gap-1.5">
                {place.types.map((type) => {
                  const Icon = placeTypeIcon(type.icon);

                  return (
                    <li key={type.type}>
                      <Link
                        href={`/establishments/?type=${type.type}`}
                        className="tk-label flex h-7 items-center gap-1.5 rounded-full border border-clay/40 px-3 text-[0.75rem] text-clay hover:bg-clay-soft"
                      >
                        <Icon className="size-3.5" aria-hidden />
                        {type.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h1 className="tk-display text-[clamp(2.25rem,5vw,4rem)]">{place.name}</h1>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-ink-2">
                {place.rating && (
                  <li className="flex items-center gap-1.5">
                    <Star className="size-4 fill-star text-star" aria-hidden />
                    <a href="#avis" className="tk-label text-ink underline-offset-4 hover:underline">
                      {place.rating.toFixed(1).replace(".", ",")}
                    </a>
                    {place.reviewCount} avis
                  </li>
                )}
                {place.city && (
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-brand" aria-hidden />
                    {place.city}
                  </li>
                )}
                {state && (
                  <li className={`tk-label flex items-center gap-1.5 ${state.open ? "text-ok" : "text-ink-2"}`}>
                    <Clock className="size-4" aria-hidden />
                    {state.open ? `Ouvert jusqu’à ${state.closesAt.replace(":", " h ")}` : "Fermé en ce moment"}
                  </li>
                )}
              </ul>
            </header>

            {place.description && (
              <Section id="a-propos" title="À propos">
                <p className="max-w-[68ch] whitespace-pre-line text-ink-2">{place.description}</p>
              </Section>
            )}

            {place.services.length > 0 && (
              <Section id="services" title="Services et tarifs">
                <div className="flex flex-col gap-6">
                  {[...servicesByType].map(([typeLabel, services]) => (
                    <div key={typeLabel}>
                      {servicesByType.size > 1 && <h3 className="tk-label mb-2 text-[0.875rem] text-ink-3">{typeLabel}</h3>}
                      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
                        {services.map((service) => (
                          <li key={service.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                            <span className="text-ink">{service.name}</span>
                            <span className="tk-label shrink-0 text-ink">{service.price ? formatPrice(service.price) : "Sur place"}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {place.hours.length > 0 && (
              <Section id="horaires" title="Horaires">
                <WeekHours hours={place.hours} now={now} />
              </Section>
            )}

            {place.position && (
              <Section id="acces" title="S’y rendre">
                <LazyMount className="h-72 overflow-hidden rounded-card border border-line">
                  <MapView items={[toCard(place, now)]} selectedId={place.id} embedded className="size-full" />
                </LazyMount>
                {directions && (
                  <Button href={directions} variant="soft" className="mt-3">
                    <Navigation className="size-[1.125rem]" aria-hidden />
                    Itinéraire dans Google Maps
                  </Button>
                )}
              </Section>
            )}

            <Section id="avis" title="Avis">
              <Reviews reviews={place.reviews} rating={place.rating} emptyText="Aucun avis pour le moment. Les avis se déposent depuis l’application, après une visite." />
            </Section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-5 rounded-panel border border-line bg-surface p-6">
              <div>
                <p className="text-[0.8125rem] text-ink-2">{place.minPrice ? "À partir de" : "Tarif"}</p>
                <p className="tk-display mt-1 text-4xl text-ink">{priceLabel}</p>
              </div>
              <GetApp target={{ kind: "place", id: place.id }} size="lg" className="w-full" reason="La réservation et le paiement de ce lieu se font dans l’application.">
                Réserver dans l’application
              </GetApp>
              <div className="flex flex-col gap-2">
                {directions && (
                  <Button href={directions} variant="outline" className="w-full">
                    <Navigation className="size-[1.125rem]" aria-hidden />
                    Itinéraire
                  </Button>
                )}
                {place.contact && (
                  <Button href={`tel:${place.contact.phone}`} variant="outline" className="w-full">
                    <Phone className="size-[1.125rem]" aria-hidden />
                    Appeler
                  </Button>
                )}
                <ShareButton item={self} surface="PLACE_DETAILS" className="w-full" />
              </div>
              <p className="text-[0.8125rem] text-ink-3">Paiement par Mobile Money ou portefeuille Ticketché. Votre ticket arrive en QR code.</p>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
          {directions && (
            <Button href={directions} variant="outline">
              <Navigation className="size-[1.125rem]" aria-hidden />
              Itinéraire
            </Button>
          )}
          {place.contact && (
            <Button href={`tel:${place.contact.phone}`} variant="outline">
              <Phone className="size-[1.125rem]" aria-hidden />
              Appeler
            </Button>
          )}
          <ShareButton item={self} surface="PLACE_DETAILS" />
        </div>
      </div>

      <div className="-mt-8 lg:mt-0">
        <RelatedRail items={relatedItems} seed={self} description="D’après les visiteurs de ce lieu et les offres qui lui ressemblent." />
        <RelatedRail title="À proximité" items={nearby} seed={self} />
      </div>

      <StickyCta label={place.minPrice ? "À partir de" : "Tarif"} price={priceLabel} target={{ kind: "place", id: place.id }} action="Réserver" />
    </>
  );
}
