import { eventPath } from "@/lib/event-slug";
import { placePath, restaurantPath } from "@/lib/paths";

/**
 * Mise en forme des reponses de l'API pour le site.
 *
 * Les endpoints publics renvoient des modeles presque bruts : telephone et e-mail des proprietaires,
 * soldes, gerants. Rien de tout cela ne doit atteindre le navigateur : chaque objet est reduit ici,
 * cote serveur, aux seuls champs affiches.
 */

const number = (value) => {
  const n = Number(value);

  return value !== null && value !== undefined && value !== "" && Number.isFinite(n) ? n : null;
};

const coords = (lat, lng) => {
  const latitude = number(lat);
  const longitude = number(lng);
  if (latitude === null || longitude === null) return null;

  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 ? { lat: latitude, lng: longitude } : null;
};

function rating(notes) {
  const stars = (notes ?? []).map((note) => number(note.star)).filter((star) => star !== null);
  if (stars.length === 0) return { rating: null, reviewCount: 0 };

  return {
    rating: Math.round((stars.reduce((sum, star) => sum + star, 0) / stars.length) * 10) / 10,
    reviewCount: stars.length,
  };
}

const authorName = (user) =>
  [user?.first_name, user?.second_name ? `${String(user.second_name).charAt(0)}.` : null]
    .filter(Boolean)
    .join(" ") || "Utilisateur Ticketché";

const review = (note) => ({
  id: note.id,
  star: number(note.star) ?? 0,
  text: note.description ?? "",
  date: note.created_at ?? null,
  author: authorName(note.user),
  avatar: note.user?.profile_picture_url ?? null,
});

export function toPlace(raw) {
  if (!raw?.id) return null;

  return {
    kind: "place",
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    city: raw.city ?? null,
    position: coords(raw.latitude, raw.longitude),
    images: (raw.images ?? []).map((image) => image.link).filter(Boolean),
    types: (raw.types ?? []).map(({ type, label, icon }) => ({ type, label, icon })),
    minPrice: number(raw.minimum_price),
    hours: (raw.availabilities ?? []).map((slot) => ({
      day: slot.day,
      open: slot.open_hour,
      close: slot.close_hour,
    })),
    totalPlaces: number(raw.total_place),
    availablePlaces: number(raw.available_places),
    createdAt: raw.created_at ?? null,
    updatedAt: raw.updated_at ?? null,
    path: placePath(raw),
    ...rating(raw.noteUsers),
  };
}

export function toPlaceDetail(raw) {
  const place = toPlace(raw);
  if (!place) return null;

  return {
    ...place,
    status: raw.status,
    services: (raw.service_types ?? [])
      .filter((service) => service.status === "ON")
      .map((service) => ({
        id: service.id,
        name: service.name,
        price: number(service.price),
        type: service.place_type,
        typeLabel: service.place_type_label,
        icon: service.icon,
      })),
    reviews: (raw.noteUsers ?? []).map(review),
    // Coordonnees de l'etablissement, publiees pour etre appele : jamais celles du proprietaire.
    contact: raw.contact?.phone_number
      ? {
          phone: `${raw.contact.country_code ?? ""}${raw.contact.phone_number}`,
          channels: raw.contact.contact_channels ?? [],
        }
      : null,
  };
}

function ticketPrices(tickets) {
  const prices = (tickets ?? []).map((ticket) => number(ticket.price)).filter((price) => price !== null);

  return prices.length > 0 ? Math.min(...prices) : null;
}

export function toEvent(raw) {
  if (!raw?.id) return null;
  const images = [raw.cover_image_url, ...(raw.images ?? []).map((image) => image.url)].filter(Boolean);

  return {
    kind: "event",
    id: raw.id,
    name: raw.title,
    description: raw.description ?? "",
    start: raw.start_date ?? null,
    end: raw.end_date ?? null,
    locationName: raw.location_name ?? null,
    position: coords(raw.latitude, raw.longitude),
    format: raw.format ?? "PRESENTIEL",
    status: raw.status,
    category: raw.category ? { id: raw.category.id, title: raw.category.title } : null,
    images: [...new Set(images)],
    minPrice: ticketPrices(raw.tickets),
    reservations: number(raw.reservations_count) ?? 0,
    updatedAt: raw.updated_at ?? null,
    path: eventPath(raw),
    ...rating(raw.note_users),
  };
}

export function toEventDetail(raw) {
  const event = toEvent(raw);
  if (!event) return null;

  return {
    ...event,
    capacity: number(raw.capacity),
    salesCutoff: raw.sales_cutoff_date ?? null,
    tickets: (raw.tickets ?? []).map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description ?? "",
      price: number(ticket.price) ?? 0,
      available: ticket.is_available !== false,
    })),
    program: (raw.program_items ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      start: item.start_date ?? null,
    })),
    organizer: raw.organizer
      ? { name: authorName(raw.organizer), avatar: raw.organizer.profile_picture_url ?? null }
      : null,
    reviews: (raw.note_users ?? []).map(review),
    partnerPlaces: (raw.places ?? []).map(toPlace).filter(Boolean),
  };
}

const DAY_KEYS = [
  ["monday", "Lundi"],
  ["tuesday", "Mardi"],
  ["wednesday", "Mercredi"],
  ["thursday", "Jeudi"],
  ["friday", "Vendredi"],
  ["saturday", "Samedi"],
  ["sunday", "Dimanche"],
];

export function toRestaurant(raw) {
  if (!raw?.id) return null;

  return {
    kind: "restaurant",
    id: raw.id,
    menuKey: raw.resthora_id ?? raw.id,
    name: raw.name,
    description: raw.description ?? "",
    cuisine: raw.cuisine ?? null,
    city: raw.city ?? null,
    address: raw.address ?? null,
    position: coords(raw.latitude, raw.longitude),
    images: [raw.logo_url].filter(Boolean),
    isOpen: typeof raw.is_open === "boolean" ? raw.is_open : null,
    // Restaurant connecte a Resthora (commande dans l'application), par opposition a une simple vitrine.
    resthora: raw.source === "RESTHORA",
    canOrder: raw.can_order === true,
    orderUrl: raw.shop_url ?? raw.website_url ?? null,
    hours: DAY_KEYS.map(([key, day]) => {
      const slot = raw.opening_hours?.[key];

      return slot && !slot.closed ? { day, open: slot.open, close: slot.close } : null;
    }).filter(Boolean),
    path: restaurantPath(raw),
  };
}

export function toMenu(raw) {
  return (raw?.categories ?? [])
    .map((category) => ({
      id: category.id,
      name: category.name,
      items: (category.items ?? [])
        .filter((item) => item?.name)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? "",
          price: number(item.price),
          image: typeof item.image === "string" ? item.image : null,
          available: item.available !== false,
        })),
    }))
    .filter((category) => category.items.length > 0);
}

/** Les evenements n'ont pas de ville : on la deduit du nom du lieu quand il la mentionne. */
export function eventCity(event, cities) {
  const haystack = String(event?.locationName ?? "").toLowerCase();

  return cities.find((city) => haystack.includes(city.toLowerCase())) ?? null;
}
