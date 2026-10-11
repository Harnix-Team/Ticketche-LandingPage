import { CalendarDays, Clock, Globe, MapPin, Navigation, Star, Users } from "@/components/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton, StickyCta, ViewTracker } from "@/components/detail/Actions";
import { Gallery } from "@/components/detail/Gallery";
import { RelatedRail, Reviews, Section } from "@/components/detail/Sections";
import { MapView } from "@/components/map/MapView";
import { GetApp } from "@/components/shell/GetApp";
import { BreadcrumbStructuredData, SITE_URL } from "@/components/StructuredData";
import { Button } from "@/components/ui/Button";
import { LazyMount } from "@/components/ui/LazyMount";
import { getCatalog, getEvent, getRelated } from "@/lib/api";
import { toCard } from "@/lib/cards";
import { eventIdFromSlug } from "@/lib/event-slug";
import { dateBadge, formatLongDate, formatPrice, formatShortDateTime, formatTime } from "@/lib/format";
import { eventCategoryIcon } from "@/lib/icons";
import { hydrateReco, indexCatalog } from "@/lib/reco";

/** Revalidation toutes les 5 minutes : les billets disponibles et les prix restent a jour. */
export const revalidate = 300;

/** Aucune fiche n'est generee au build : chacune l'est a sa premiere visite, puis servie depuis le cache. */
export const generateStaticParams = async () => [];

async function loadEvent(slug) {
  const id = eventIdFromSlug(slug);
  if (!id) return null;

  const event = await getEvent(id);
  if (event === undefined) throw new Error("L’API Ticketché ne répond pas.");

  return event;
}

const FORMATS = {
  EN_LIGNE: "En ligne",
  MIXTE: "Sur place et en ligne",
};

const priceLabel = (event) => (event.minPrice === null ? "Tarif à venir" : event.minPrice > 0 ? formatPrice(event.minPrice) : "Gratuit");

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await loadEvent(slug).catch(() => null);

  if (!event) return { title: "Événement introuvable | Ticketché", robots: { index: false, follow: true } };

  const description = [
    formatLongDate(event.start),
    event.locationName ? `à ${event.locationName}` : null,
    event.minPrice > 0 ? `À partir de ${formatPrice(event.minPrice)}` : event.minPrice === 0 ? "Entrée gratuite" : null,
    "Billets en ligne sur Ticketché.",
  ]
    .filter(Boolean)
    .join(" - ")
    .slice(0, 300);
  const image = event.images[0] ?? `${SITE_URL}/images/og-image.png`;

  return {
    title: `${event.name} | Billetterie Ticketché`,
    description,
    alternates: { canonical: event.path },
    openGraph: { type: "article", title: `${event.name} | Ticketché`, description, url: `${SITE_URL}${event.path}`, images: [{ url: image, alt: event.name }] },
    twitter: { card: "summary_large_image", title: `${event.name} | Ticketché`, description, images: [image] },
    other: { "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://events/details?eventId=${event.id}` },
  };
}

/** Donnees structurees schema.org/Event, avec les offres de billets (resultats enrichis : date et prix). */
function EventStructuredData({ event }) {
  const url = `${SITE_URL}${event.path}`;
  const online = event.format === "EN_LIGNE";
  const graph = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description || undefined,
    startDate: event.start ?? undefined,
    endDate: event.end ?? undefined,
    eventStatus: event.status === "cancelled" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    eventAttendanceMode: online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    image: [event.images[0] ?? `${SITE_URL}/images/og-image.png`],
    url,
    organizer: { "@id": `${SITE_URL}/#organization` },
    offers: event.tickets.map((ticket) => ({
      "@type": "Offer",
      name: ticket.title,
      price: String(ticket.price),
      priceCurrency: "XOF",
      availability: ticket.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url,
      validThrough: event.salesCutoff ?? event.start ?? undefined,
    })),
    location: online
      ? { "@type": "VirtualLocation", url }
      : {
          "@type": "Place",
          name: event.locationName ?? "Bénin",
          address: { "@type": "PostalAddress", addressLocality: event.locationName ?? undefined, addressCountry: "BJ" },
          geo: event.position ? { "@type": "GeoCoordinates", latitude: event.position.lat, longitude: event.position.lng } : undefined,
        },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) notFound();

  const now = new Date();
  const [catalog, related] = await Promise.all([getCatalog(), getRelated("EVENT", event.id, 10)]);
  const index = indexCatalog({
    places: catalog.places.map((entry) => toCard(entry, now)),
    events: catalog.events.map((entry) => toCard(entry, now)),
    restaurants: catalog.restaurants.map((entry) => toCard(entry, now)),
  });
  const relatedItems = hydrateReco(related, index, 10);
  const partnerPlaces = event.partnerPlaces.map((place) => index.get(`place:${place.id}`)).filter(Boolean);

  const badge = dateBadge(event.start);
  const CategoryIcon = eventCategoryIcon(event.category?.title);
  const online = event.format === "EN_LIGNE";
  const ended = new Date(event.end ?? event.start) < now;
  const cancelled = event.status === "cancelled";
  const bookable = !ended && !cancelled;
  const directions = event.position && !online ? `https://www.google.com/maps/dir/?api=1&destination=${event.position.lat},${event.position.lng}` : null;
  const self = { kind: "event", id: event.id, name: event.name };
  const target = { kind: "event", id: event.id };
  const when = [formatShortDateTime(event.start), event.end && formatTime(event.end) ? `fin à ${formatTime(event.end)}` : null].filter(Boolean).join(", ");

  return (
    <>
      <EventStructuredData event={event} />
      <BreadcrumbStructuredData
        items={[
          { name: "Accueil", path: "/" },
          { name: "Événements", path: "/events/" },
          { name: event.name, path: event.path },
        ]}
      />
      <ViewTracker item={self} surface="EVENT_DETAILS" />

      <div className="tk-shell pt-5 pb-28 lg:pb-8">
        <nav aria-label="Fil d’Ariane" className="tk-label mb-4 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
          <Link href="/events/" className="hover:text-brand">Événements</Link>
          {event.category && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/events/?categorie=${event.category.id}`} className="hover:text-brand">{event.category.title}</Link>
            </>
          )}
        </nav>

        <Gallery item={{ kind: "event", id: event.id, name: event.name, images: event.images, category: event.category }} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-10">
            <header>
              <ul className="mb-3 flex flex-wrap gap-1.5">
                {event.category && (
                  <li className="tk-label flex h-7 items-center gap-1.5 rounded-full border border-clay/40 px-3 text-[0.75rem] text-clay">
                    <CategoryIcon className="size-3.5" aria-hidden />
                    {event.category.title}
                  </li>
                )}
                {FORMATS[event.format] && (
                  <li className="tk-label flex h-7 items-center gap-1.5 rounded-full border border-line-strong px-3 text-[0.75rem] text-brand">
                    <Globe className="size-3.5" aria-hidden />
                    {FORMATS[event.format]}
                  </li>
                )}
                {(ended || cancelled) && (
                  <li className="tk-label flex h-7 items-center rounded-full bg-danger px-3 text-[0.75rem] text-white">
                    {cancelled ? "Annulé" : "Terminé"}
                  </li>
                )}
              </ul>
              <h1 className="tk-display text-[clamp(2.25rem,5vw,4rem)]">{event.name}</h1>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-ink-2">
                {event.rating && (
                  <li className="flex items-center gap-1.5">
                    <Star className="size-4 fill-star text-star" aria-hidden />
                    <a href="#avis" className="tk-label text-ink underline-offset-4 hover:underline">
                      {event.rating.toFixed(1).replace(".", ",")}
                    </a>
                    {event.reviewCount} avis
                  </li>
                )}
                <li className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 shrink-0 text-brand" aria-hidden />
                  <span className="first-letter:uppercase">{formatLongDate(event.start)}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="size-4 shrink-0 text-brand" aria-hidden />
                  {formatTime(event.start)}
                  {event.end && ` à ${formatTime(event.end)}`}
                </li>
                {event.locationName && (
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
                    {event.locationName}
                  </li>
                )}
              </ul>
            </header>

            {event.description && (
              <Section id="a-propos" title="À propos">
                <p className="max-w-[68ch] whitespace-pre-line text-ink-2">{event.description}</p>
                {(event.organizer || event.capacity) && (
                  <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem]">
                    {event.organizer && (
                      <li>
                        <span className="block text-[0.8125rem] text-ink-3">Organisé par</span>
                        <span className="tk-label text-ink">{event.organizer.name}</span>
                      </li>
                    )}
                    {event.capacity && (
                      <li>
                        <span className="block text-[0.8125rem] text-ink-3">Capacité</span>
                        <span className="tk-label flex items-center gap-1.5 text-ink">
                          <Users className="size-4 text-brand" aria-hidden />
                          {event.capacity.toLocaleString("fr-FR")} places
                        </span>
                      </li>
                    )}
                  </ul>
                )}
              </Section>
            )}

            {event.tickets.length > 0 && (
              <Section id="tickets" title="Tickets">
                <ul className="flex flex-col gap-2.5">
                  {event.tickets.map((ticket) => {
                    const onSale = ticket.available && bookable;

                    return (
                      <li key={ticket.id} className={`tk-ticket-row ${onSale ? "" : "opacity-60"}`}>
                        <div className="flex min-w-0 flex-col justify-center px-5 py-4">
                          <h3 className="tk-title text-[1.125rem] text-white">{ticket.title}</h3>
                          {ticket.description && <p className="mt-1 text-[0.9375rem] text-white/75">{ticket.description}</p>}
                        </div>
                        <div className="flex min-w-0 flex-col items-start justify-center gap-0.5 px-4 py-4 sm:px-5">
                          <p className="flex items-baseline gap-1.5 whitespace-nowrap">
                            <span className="tk-display text-[1.625rem] text-gold sm:text-[1.875rem]">
                              {ticket.price > 0 ? ticket.price.toLocaleString("fr-FR") : "Gratuit"}
                            </span>
                            {ticket.price > 0 && <span className="tk-label text-[0.75rem] text-white/80">FCFA</span>}
                          </p>
                          <p className={`tk-label text-[0.75rem] ${onSale ? "text-[#8be062]" : "text-white/60"}`}>
                            {onSale ? "Disponible" : "Indisponible"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {bookable && (
                  <GetApp target={target} variant="brand" className="mt-4" reason="L’achat des tickets se fait dans l’application : paiement Mobile Money, ticket en QR code.">
                    Prendre un ticket dans l’application
                  </GetApp>
                )}
              </Section>
            )}

            {event.program.length > 0 && (
              <Section id="programme" title="Programme">
                <ol className="relative flex flex-col gap-5 border-l border-line-strong pl-6">
                  {event.program.map((item) => (
                    <li key={item.id} className="relative">
                      <span className="absolute top-1.5 -left-[1.8125rem] size-2.5 rounded-full bg-brand" aria-hidden />
                      {item.start && <p className="tk-label text-[0.8125rem] text-brand">{formatShortDateTime(item.start)}</p>}
                      <h3 className="tk-label text-[1.0625rem] text-ink">{item.title}</h3>
                      {item.description && <p className="mt-1 max-w-[62ch] text-[0.9375rem] text-ink-2">{item.description}</p>}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {event.position && !online && (
              <Section id="acces" title="S’y rendre">
                <LazyMount className="h-72 overflow-hidden rounded-card border border-line">
                  <MapView items={[toCard(event, now)]} selectedId={event.id} embedded className="size-full" />
                </LazyMount>
                <Button href={directions} variant="soft" className="mt-3">
                  <Navigation className="size-[1.125rem]" aria-hidden />
                  Itinéraire dans Google Maps
                </Button>
              </Section>
            )}

            <Section id="avis" title="Avis">
              <Reviews reviews={event.reviews} rating={event.rating} emptyText="Aucun avis pour le moment. Les participants peuvent en laisser un depuis l’application." />
            </Section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-5 rounded-panel border border-line bg-surface p-6">
              {badge && (
                <div className="flex items-center gap-4">
                  <p className="grid min-w-16 place-items-center rounded-xl bg-brand-soft px-3 py-2 text-center leading-none text-brand">
                    <span className="tk-display text-3xl">{badge.day}</span>
                    <span className="tk-label mt-1 text-[0.75rem]">{badge.month}</span>
                  </p>
                  <p className="text-[0.9375rem] text-ink-2">
                    <span className="tk-label block text-ink first-letter:uppercase">{badge.weekday} à {badge.time}</span>
                    {event.locationName}
                  </p>
                </div>
              )}
              <div>
                <p className="text-[0.8125rem] text-ink-2">{event.minPrice > 0 ? "À partir de" : "Tarif"}</p>
                <p className="tk-display mt-1 text-4xl text-ink">{priceLabel(event)}</p>
              </div>
              {bookable ? (
                <GetApp target={target} size="lg" className="w-full" reason="L’achat des tickets se fait dans l’application : paiement Mobile Money, ticket en QR code.">
                  Prendre un ticket
                </GetApp>
              ) : (
                <Button href="/events/" variant="soft" size="lg" className="w-full">
                  Voir les événements à venir
                </Button>
              )}
              <div className="flex flex-col gap-2">
                {directions && (
                  <Button href={directions} variant="outline" className="w-full">
                    <Navigation className="size-[1.125rem]" aria-hidden />
                    Itinéraire
                  </Button>
                )}
                <ShareButton item={self} surface="EVENT_DETAILS" className="w-full" />
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
          <ShareButton item={self} surface="EVENT_DETAILS" />
        </div>
      </div>

      <div className="-mt-8 lg:mt-0">
        <RelatedRail title="Sur place" items={partnerPlaces} seed={self} description="Les lieux partenaires de cet événement : parking, hébergement, services." />
        <RelatedRail items={relatedItems} seed={self} description="D’après les participants et les offres qui ressemblent à celle-ci." />
      </div>

      {bookable && <StickyCta label={when} price={priceLabel(event)} target={target} action="Prendre un ticket" />}
    </>
  );
}
