import { slugifyTitle } from "@/lib/event-slug";

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const withSlug = (base, label, id) => {
  if (!id) return null;
  const slug = slugifyTitle(label);

  return slug ? `${base}/${slug}-${id}/` : `${base}/${id}/`;
};

/** URL canonique d'un lieu : `/places/<nom-en-slug>-<uuid>/`, sur le modele des evenements. */
export const placePath = (place) => withSlug("/places", place?.name, place?.id);

export const restaurantPath = (restaurant) => withSlug("/restaurants", restaurant?.name, restaurant?.id);

/** Identifiant en fin de segment d'URL, ou null. */
export function idFromSlug(slug) {
  const match = UUID_PATTERN.exec(decodeURIComponent(String(slug ?? "")));

  return match ? match[0] : null;
}
