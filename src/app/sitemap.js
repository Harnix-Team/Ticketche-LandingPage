import { getCatalog } from "@/lib/api";

/**
 * Audit SEO 2026-09-04 (SEO-01, SEO-02, SEO-05) : domaine canonique sur l'apex, fiches a forte intention
 * declarees, adresses avec barre oblique finale (`trailingSlash: true`) pour eviter une redirection par URL.
 */
const BASE_URL = "https://ticketche.com";

/** Le sitemap est reconstruit toutes les heures pour suivre les nouveaux evenements et lieux. */
export const revalidate = 3600;

const absoluteUrl = (path) => `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/?$/, "/");

const STATIC_PAGES = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/events/", changeFrequency: "daily", priority: 0.9 },
  { path: "/establishments/", changeFrequency: "daily", priority: 0.9 },
  { path: "/restaurants/", changeFrequency: "weekly", priority: 0.8 },
  { path: "/carte/", changeFrequency: "weekly", priority: 0.7 },
  { path: "/download/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/a-propos/", changeFrequency: "monthly", priority: 0.6 },
  { path: "/recrutement/", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact/", changeFrequency: "monthly", priority: 0.5 },
  { path: "/politiques/mentions/", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politiques/confidentialite/", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politiques/conditions/", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap() {
  const lastModified = new Date();
  // Une panne de l'API ne doit pas produire un sitemap vide : les listes valent alors [].
  const { events, places, restaurants } = await getCatalog();

  const entity = (priority, changeFrequency) => (item) => ({
    url: absoluteUrl(item.path),
    lastModified: item.updatedAt ? new Date(item.updatedAt) : lastModified,
    changeFrequency,
    priority,
  });

  return [
    ...STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({ url: absoluteUrl(path), lastModified, changeFrequency, priority })),
    ...events.filter((event) => event.status === "published" && event.path).map(entity(0.8, "daily")),
    ...places.filter((place) => place.path).map(entity(0.7, "weekly")),
    ...restaurants.filter((restaurant) => restaurant.path).map(entity(0.6, "weekly")),
  ];
}
