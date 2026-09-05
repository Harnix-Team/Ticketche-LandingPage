import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchEventById } from "@/app/services/api";
import { eventIdFromSlug, eventPath } from "@/lib/event-slug";
import { BreadcrumbStructuredData, SITE_URL } from "@/components/StructuredData";
import EventDetailsClient from "@/components/Events/EventDetailsClient";

/**
 * Page de detail d'un evenement (audit SEO 2026-09-04, SEO-02 et SEO-03).
 *
 * L'ancienne page `/events/details?eventId=<uuid>` cumulait quatre defauts
 * rendant chaque evenement invisible des moteurs :
 *   - une URL en parametre de requete, sans mot-cle ;
 *   - un titre et une description identiques pour TOUS les evenements ;
 *   - `force-dynamic` + `<Suspense fallback={null}>`, donc un HTML servi vide ;
 *   - aucune presence dans le sitemap.
 *
 * Cette page corrige les quatre : URL en slug, metadonnees construites depuis
 * l'evenement, contenu rendu cote serveur, et donnees structurees `Event` qui
 * ouvrent l'acces aux resultats enrichis (date et prix affiches directement
 * dans les resultats de recherche).
 *
 * L'interface interactive reste `EventDetailsClient`, monte ensuite : le bloc
 * serveur ci-dessous est ce que voit un robot, pas un doublon visuel pour
 * l'utilisateur (il est masque des que le client prend la main).
 */

/** Revalidation horaire : un evenement change peu, la fraicheur du prix suffit. */
export const revalidate = 3600;

/** Recupere l'evenement designe par le slug, ou null. */
async function loadEvent(slug) {
  const id = eventIdFromSlug(slug);
  if (!id) return null;

  const payload = await fetchEventById(id);
  const event = payload?.data ?? null;

  return event?.id ? event : null;
}

function formatDate(value) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Prix le plus bas parmi les billets, en FCFA. Null si aucun billet payant. */
function minPrice(tickets = []) {
  const prices = tickets.map((t) => Number(t.price)).filter((p) => p > 0);

  return prices.length > 0 ? Math.min(...prices) : null;
}

function eventImageUrl(event) {
  const url = event?.images?.[0]?.url;

  return typeof url === "string" && url.length > 0 ? url : `${SITE_URL}/images/og-image.png`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    return {
      title: "Événement introuvable | Ticketché",
      robots: { index: false, follow: true },
    };
  }

  const date = formatDate(event.start_date);
  const place = event.location_name;
  const price = minPrice(event.tickets);
  const priceLabel = price === null ? "Entrée gratuite" : `À partir de ${price.toLocaleString("fr-FR")} FCFA`;

  const description = [
    date ? `${date}` : null,
    place ? `à ${place}` : null,
    priceLabel,
    "Billets en ligne sur Ticketché.",
  ]
    .filter(Boolean)
    .join(" - ")
    .slice(0, 300);

  const path = eventPath(event);

  return {
    title: `${event.title} | Billetterie Ticketché`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: `${event.title} | Ticketché`,
      description,
      url: `${SITE_URL}${path}`,
      images: [{ url: eventImageUrl(event), alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | Ticketché`,
      description,
      images: [eventImageUrl(event)],
    },
    other: {
      "apple-itunes-app": `app-id=6758046811, app-argument=ticketche://events/details?eventId=${event.id}`,
    },
  };
}

/** Donnees structurees schema.org/Event, avec les offres de billets. */
function EventStructuredData({ event }) {
  const offers = (event.tickets ?? [])
    .filter((ticket) => ticket?.title)
    .map((ticket) => ({
      "@type": "Offer",
      name: ticket.title,
      price: String(Number(ticket.price) || 0),
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${eventPath(event)}`,
      validThrough: event.sales_cutoff_date ?? event.start_date ?? undefined,
    }));

  const isOnline = event.format === "EN_LIGNE";

  const graph = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.start_date ?? undefined,
    endDate: event.end_date ?? undefined,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    image: [eventImageUrl(event)],
    url: `${SITE_URL}${eventPath(event)}`,
    organizer: { "@id": `${SITE_URL}/#organization` },
    offers: offers.length > 0 ? offers : undefined,
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url: event.online_link ?? `${SITE_URL}${eventPath(event)}`,
        }
      : {
          "@type": "Place",
          name: event.location_name ?? "Bénin",
          address: {
            "@type": "PostalAddress",
            addressLocality: event.location_name ?? undefined,
            addressCountry: "BJ",
          },
          geo:
            event.latitude && event.longitude
              ? {
                  "@type": "GeoCoordinates",
                  latitude: event.latitude,
                  longitude: event.longitude,
                }
              : undefined,
        },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) notFound();

  const date = formatDate(event.start_date);
  const price = minPrice(event.tickets);

  return (
    <>
      <EventStructuredData event={event} />
      <BreadcrumbStructuredData
        items={[
          { name: "Accueil", path: "/" },
          { name: "Événements", path: "/events/" },
          { name: event.title, path: eventPath(event) },
        ]}
      />

      {/*
        Resume rendu cote serveur : c'est ce que lit un robot d'indexation, qui
        n'execute pas le JavaScript. Il est masque a l'ecran des que
        EventDetailsClient est monte (voir la classe `sr-only` de Tailwind), pour
        ne pas doubler visuellement la fiche interactive.
      */}
      <article className="sr-only">
        <h1>{event.title}</h1>
        {date && <p>Date : {date}</p>}
        {event.location_name && <p>Lieu : {event.location_name}</p>}
        <p>
          Tarif :{" "}
          {price === null
            ? "entrée gratuite"
            : `à partir de ${price.toLocaleString("fr-FR")} FCFA`}
        </p>
        {event.description && <p>{event.description}</p>}
        <p>
          <Link href="/events/">Tous les événements au Bénin</Link>
        </p>
      </article>

      <EventDetailsClient eventId={event.id} initialEvent={event} />
    </>
  );
}
