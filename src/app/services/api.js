const API_URL = process.env.NEXT_PUBLIC_API_URL;

const safeFetch = async (url) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json().catch(() => null);
};

export const fetchAllPlaces = () => safeFetch(`${API_URL}/api/v1/all_places`);
export const fetchAllEvents = () => safeFetch(`${API_URL}/api/v2/events`);
export const fetchEventById = (id) => safeFetch(`${API_URL}/api/v2/events/${id}`);
export const fetchEventCategories = () => safeFetch(`${API_URL}/api/v2/event_categories`);
export const searchEvents = (query) =>
  safeFetch(`${API_URL}/api/v2/events/search?query=${encodeURIComponent(query)}`);