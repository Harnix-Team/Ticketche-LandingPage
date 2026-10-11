import { permanentRedirect, redirect } from "next/navigation";
import { getEvent } from "@/lib/api";

/**
 * Ancienne URL de detail d'un evenement (audit SEO 2026-09-04, SEO-02).
 *
 * `/events/details?eventId=<uuid>` reste servie parce qu'elle circule deja dans
 * des liens partages, des SMS et le lien universel de l'application mobile. Elle
 * redirige desormais en 308 vers l'URL canonique `/events/<slug>-<uuid>/`, pour
 * que les moteurs transferent le signal vers la nouvelle adresse plutot que
 * d'indexer deux URL pour la meme page.
 */
export const dynamic = "force-dynamic";

export default async function LegacyEventDetailsPage({ searchParams }) {
  const params = await searchParams;
  const eventId = typeof params?.eventId === "string" ? params.eventId : null;

  if (!eventId) redirect("/events/");

  const event = await getEvent(eventId);

  // Evenement introuvable (supprime, ou identifiant invalide) : on renvoie vers
  // la liste plutot que de laisser une page morte. Redirection temporaire, la
  // ressource pouvant reapparaitre.
  if (!event?.id) redirect("/events/");

  permanentRedirect(event.path);
}
