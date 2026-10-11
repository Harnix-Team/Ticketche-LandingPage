import { unstable_cache } from "next/cache";
import { toEventDetail, toMenu, toPlaceDetail, toRestaurant } from "@/lib/catalog";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";

class NotFound extends Error {}

async function request(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (response.status === 404) throw new NotFound(path);
  if (!response.ok) throw new Error(`API ${response.status} sur ${path}`);

  return response.json();
}

/**
 * Met en cache le resultat deja reduit (et non la reponse brute, qui depasse la limite de 2 Mo du
 * cache de Next des que le catalogue grossit). Tout le site passe par l'IP du serveur : sans ce cache,
 * la limite de 60 requetes par minute de l'API serait atteinte en quelques visites.
 *
 * Une panne n'est jamais mise en cache : `undefined` signale « API injoignable », `null` « introuvable ».
 */
/** A incrementer quand la forme des objets mis en cache change : une ancienne entree ne doit pas etre relue. */
const CACHE_VERSION = "v3";

function cached(key, revalidate, loader) {
  const run = unstable_cache(
    async (...args) => {
      try {
        return { value: await loader(...args) };
      } catch (error) {
        if (error instanceof NotFound) return { value: null };
        throw error;
      }
    },
    [...key, CACHE_VERSION],
    { revalidate }
  );

  return async (...args) => {
    try {
      return (await run(...args)).value;
    } catch {
      return undefined;
    }
  };
}

const list = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

/**
 * Tous les lieux valides, au niveau de detail d'une fiche : `all_places` renvoie deja la meme ressource que
 * `places/{id}`. Une fiche de lieu se sert donc ici, sans nouvel appel a l'API.
 */
export const getPlaces = cached(["catalog-places"], 300, async () =>
  list(await request("/all_places?validatedOnly=1"))
    .filter((place) => place.status === "VALIDATED")
    .map(toPlaceDetail)
    .filter(Boolean)
);

const getPlaceById = cached(["catalog-place"], 300, async (id) => {
  const place = toPlaceDetail((await request(`/places/${id}`)).data);

  // L'endpoint sert aussi les lieux en attente, rejetes ou fermes : seuls les valides sont publics.
  return place?.status === "VALIDATED" ? place : null;
});

/** Fiche d'un lieu : depuis la liste en cache, sinon (lieu tout juste valide) par un appel dedie. */
export async function getPlace(id) {
  const places = await getPlaces();

  return places?.find((place) => place.id === id) ?? getPlaceById(id);
}

export const getEvents = cached(["catalog-events"], 300, async () =>
  list(await request("/events?per_page=100")).map(toEventDetail).filter(Boolean)
);

const getEventById = cached(["catalog-event"], 300, async (id) => toEventDetail((await request(`/events/${id}`)).data));

/**
 * Fiche d'un evenement. L'appel dedie ajoute le programme et l'organisateur ; s'il echoue (API saturee),
 * la version de la liste, deja en cache, suffit a afficher la fiche et ses tickets.
 */
export async function getEvent(id) {
  const event = await getEventById(id);
  if (event !== undefined) return event;

  const events = await getEvents();

  return events?.find((entry) => entry.id === id);
}

export const getRestaurants = cached(["catalog-restaurants"], 600, async () =>
  list(await request("/restaurants")).map(toRestaurant).filter(Boolean)
);

export const getMenu = cached(["catalog-menu"], 600, async (menuKey) =>
  toMenu((await request(`/restaurants/${encodeURIComponent(menuKey)}/menu`)).data)
);

export const getPlaceTypes = cached(["catalog-place-types"], 3600, async () =>
  list(await request("/place-types")).map(({ type, label, icon }) => ({ type, label, icon }))
);

const toRecoList = (payload) =>
  payload?.enabled
    ? {
        requestId: payload.reco_request_id ?? null,
        version: payload.reco_version ?? null,
        arm: payload.experiment_arm ?? null,
        items: (payload.items ?? []).map((item) => ({
          kind: String(item.subject_type).toLowerCase(),
          id: item.subject_id,
          reason: item.reason,
          position: item.position,
        })),
      }
    : null;

const query = (params) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) value.forEach((entry) => search.append(`${key}[]`, entry));
    else if (value !== undefined && value !== null) search.set(key, String(value));
  }

  return search.toString();
};

/** Section du fil recommande, pour un visiteur anonyme (classement non personnalise). Null si le moteur est coupe. */
export const getRecommendations = cached(["reco-list"], 300, async ({ section, types, placeTypes, limit = 12 }) =>
  toRecoList(
    await request(`/recommendations?${query({ surface: "HOME", section, types, place_types: placeTypes, limit })}`)
  )
);

/** « Vous aimeriez aussi » autour d'un objet. */
export const getRelated = cached(["reco-related"], 600, async (subjectType, subjectId, limit = 8) =>
  toRecoList(
    await request(
      `/recommendations/related?${query({ subject_type: subjectType, subject_id: subjectId, limit })}`
    )
  )
);

/** Lieux, evenements et restaurants, charges ensemble. Une liste vaut `[]` si l'API ne repond pas. */
export async function getCatalog() {
  const [places, events, restaurants, placeTypes] = await Promise.all([
    getPlaces(),
    getEvents(),
    getRestaurants(),
    getPlaceTypes(),
  ]);

  return {
    places: places ?? [],
    events: events ?? [],
    restaurants: restaurants ?? [],
    placeTypes: placeTypes ?? [],
    reachable: places !== undefined && events !== undefined,
  };
}
