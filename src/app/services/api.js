const isDev = process.env.NODE_ENV === 'development';

const safeFetch = async (url) => {
  try {
    const path = url.replace("https://api.ticketche.com", "");
    const proxyUrl = isDev
      ? `/api/proxy${path}`
      : `/proxy.php?path=${encodeURIComponent(path)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) return null;
    return res.json().catch(() => null);
  } catch {
    return null;
  }
};

export const fetchAllPlaces = () => safeFetch(`https://api.ticketche.com/api/v1/all_places?validatedOnly=1`);
export const fetchAllEvents = () => safeFetch(`https://api.ticketche.com/api/v2/events`);
export const fetchEventById = (id) => safeFetch(`https://api.ticketche.com/api/v2/events/${id}`);
export const fetchEventCategories = () => safeFetch(`https://api.ticketche.com/api/v2/event_categories`);
export const searchEvents = (query) =>
  safeFetch(`https://api.ticketche.com/api/v2/events/search?query=${encodeURIComponent(query)}`);

export const getPlacesByLocation = (latitude, longitude, radius = 20000) => {
  const proxyUrl = isDev
    ? `/api/proxy/api/v2/getPlaces`
    : `/proxy.php?path=${encodeURIComponent('/api/v2/getPlaces')}`;
  return fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude, radius }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
};

export const queryKeys = {
  allPlaces: ["places", "all"],
  allEvents: ["events", "all"],
  eventById: (id) => ["events", id],
  eventCategories: ["events", "categories"],
  searchEvents: (query) => ["events", "search", query],
  placesByLocation: (lat, lng) => ["places", "location", lat, lng],
};