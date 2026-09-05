import { fetchAllEvents } from "@/app/services/api";
import { eventPath } from "@/lib/event-slug";

/**
 * Audit SEO 2026-09-04 (SEO-01, SEO-02, SEO-05).
 *
 * SEO-01 : les URL pointaient vers `https://www.ticketche.com`, un hote qui n'a
 * aucun enregistrement DNS. Googlebot ne pouvait donc ni recuperer ce sitemap ni
 * atteindre les URL qu'il declare. Le domaine canonique est l'apex.
 *
 * SEO-02 : le sitemap ne listait que 10 pages statiques. Les fiches
 * d'evenement - les pages a plus forte intention d'achat du site - n'y
 * figuraient pas, donc n'etaient decouvertes par aucun moteur.
 *
 * SEO-05 : `next.config.mjs` fixe `trailingSlash: true`. Une URL declaree sans
 * barre oblique finale provoque une redirection 301 a chaque exploration, ce qui
 * consomme du budget de crawl inutilement. Les URL sont donc normalisees ici.
 */
const BASE_URL = "https://ticketche.com";

/** Le sitemap est reconstruit toutes les heures pour suivre les nouveaux evenements. */
export const revalidate = 3600;

/** Construit une URL absolue avec barre oblique finale, comme les sert le serveur. */
function absoluteUrl(path) {
  if (!path) return `${BASE_URL}/`;
  const normalized = path.startsWith("/") ? path.slice(1) : path;

  return `${BASE_URL}/${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

const STATIC_PAGES = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "a-propos", changeFrequency: "monthly", priority: 0.8 },
  { path: "events", changeFrequency: "daily", priority: 0.9 },
  { path: "establishments", changeFrequency: "weekly", priority: 0.9 },
  { path: "download", changeFrequency: "monthly", priority: 0.8 },
  { path: "recrutement", changeFrequency: "weekly", priority: 0.7 },
  { path: "contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "politiques/mentions", changeFrequency: "yearly", priority: 0.3 },
  { path: "politiques/confidentialite", changeFrequency: "yearly", priority: 0.3 },
  { path: "politiques/conditions", changeFrequency: "yearly", priority: 0.3 },
];

/** Fiches d'evenement publiees, ou liste vide si l'API ne repond pas. */
async function eventEntries() {
  const payload = await fetchAllEvents();
  const events = Array.isArray(payload?.data) ? payload.data : [];

  return events
    .filter((event) => event?.id && event.status === "published")
    .map((event) => {
      const path = eventPath(event);
      if (!path) return null;

      return {
        url: absoluteUrl(path),
        lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      };
    })
    .filter(Boolean);
}

export default async function sitemap() {
  const lastModified = new Date();

  const staticEntries = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));

  // Une panne de l'API ne doit pas produire un sitemap vide : les pages
  // statiques sont toujours servies, les evenements s'y ajoutent s'ils repondent.
  return [...staticEntries, ...(await eventEntries())];
}
