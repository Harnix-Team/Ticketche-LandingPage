const API_URL = "https://api.ticketche.com";

const safeFetch = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json().catch(() => null);
  } catch {
    return null;
  }
};

export const fetchAllPlaces = () => safeFetch(`${API_URL}/api/v1/all_places?validatedOnly=1`);
export const fetchAllEvents = () => safeFetch(`${API_URL}/api/v2/events`);
export const fetchEventById = (id) => safeFetch(`${API_URL}/api/v2/events/${id}`);
export const fetchEventCategories = () => safeFetch(`${API_URL}/api/v2/event_categories`);
export const searchEvents = (query) =>
  safeFetch(`${API_URL}/api/v2/events/search?query=${encodeURIComponent(query)}`);

export const getPlacesByLocation = (latitude, longitude, radius = 20000) =>
  fetch(`${API_URL}/api/v2/getPlaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude, radius }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

export const queryKeys = {
  allPlaces: ["places", "all"],
  allEvents: ["events", "all"],
  eventById: (id) => ["events", id],
  eventCategories: ["events", "categories"],
  searchEvents: (query) => ["events", "search", query],
  placesByLocation: (lat, lng) => ["places", "location", lat, lng],
};