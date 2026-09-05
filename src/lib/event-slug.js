/**
 * Fabrication et lecture des URL d'evenement (audit SEO 2026-09-04, SEO-02).
 *
 * Avant : `/events/details?eventId=<uuid>`. Une URL en parametre de requete,
 * avec un titre et une description identiques pour tous les evenements, et
 * aucun contenu dans le HTML servi. Chaque concert ou festival - les pages a
 * plus forte intention d'achat du site - etait donc invisible des moteurs.
 *
 * Apres : `/events/<titre-en-slug>-<uuid>`. Le slug porte les mots-cles, l'UUID
 * complet en fin de chaine garantit l'unicite et permet de retrouver
 * l'evenement sans appel supplementaire.
 */

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Transforme un titre en segment d'URL lisible et stable. */
export function slugifyTitle(title) {
  return String(title ?? "")
    .normalize("NFD")
    // Retire les diacritiques : "Soirée" -> "Soiree".
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** URL canonique d'un evenement, barre oblique finale incluse (trailingSlash). */
export function eventPath(event) {
  if (!event?.id) return null;
  const slug = slugifyTitle(event.title);

  return slug ? `/events/${slug}-${event.id}/` : `/events/${event.id}/`;
}

/**
 * Extrait l'identifiant d'un slug d'URL.
 * Retourne null si le segment ne se termine pas par un UUID.
 */
export function eventIdFromSlug(slug) {
  const match = UUID_PATTERN.exec(String(slug ?? ""));

  return match ? match[0] : null;
}
