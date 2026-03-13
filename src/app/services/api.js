// services/api.js
const API_V1 = 'https://api.ticketche.com/api/v1';
const API_V2 = 'https://api.ticketche.com/api/v2';

/* ── Places ── */
export const fetchAllPlaces = async () => {
  const response = await fetch(`${API_V1}/all_places`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des places');
  return response.json();
};

/* ── Events ── */
export const fetchAllEvents = async () => {
  const response = await fetch(`${API_V2}/events`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des événements');
  return response.json();
};

export const fetchEventById = async (id) => {
  const response = await fetch(`${API_V2}/events/${id}`);
  if (!response.ok) throw new Error('Événement introuvable');
  return response.json();
};

export const fetchEventCategories = async () => {
  const response = await fetch(`${API_V2}/event_categories`);
  if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
  return response.json();
};

export const searchEvents = async (query) => {
  const response = await fetch(`${API_V2}/events/search?${new URLSearchParams({ query })}`);
  if (!response.ok) throw new Error('Erreur lors de la recherche');
  return response.json();
};
