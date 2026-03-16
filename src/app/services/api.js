const proxy = (path) => `/api/proxy?path=${encodeURIComponent(path)}`;

const safeFetch = async (url) => {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json().catch(() => null);
};

export const fetchAllPlaces = () => safeFetch(proxy("/api/v1/all_places"));
export const fetchAllEvents = () => safeFetch(proxy("/api/v2/events"));
export const fetchEventById = (id) => safeFetch(proxy(`/api/v2/events/${id}`));
export const fetchEventCategories = () => safeFetch(proxy("/api/v2/event_categories"));
export const searchEvents = (query) =>
  safeFetch(proxy(`/api/v2/events/search?query=${encodeURIComponent(query)}`));