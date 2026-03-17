const API_URL = process.env.NEXT_PUBLIC_API_URL;

const safeFetch = async (url) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json().catch(() => null);
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
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ latitude, longitude, radius }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);