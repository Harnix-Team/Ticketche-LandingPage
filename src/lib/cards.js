import { openState } from "@/lib/format";

/**
 * Version allegee d'un objet du catalogue pour une carte : sans description ni horaires, avec l'etat
 * d'ouverture calcule au moment du rendu serveur (la page est regeneree toutes les 5 minutes).
 */
export function toCard(item, now = new Date()) {
  const {
    description, hours, createdAt, updatedAt, totalPlaces, availablePlaces, status, services, reviews, contact,
    capacity, salesCutoff, tickets, program, organizer, partnerPlaces, address, menuKey, orderUrl,
    ...card
  } = item;

  if (item.kind === "place") return { ...card, isOpen: openState(hours, now)?.open ?? null };

  return item.kind === "event" ? { ...card, format: item.format } : { ...card, address };
}

export const isUpcoming = (event, now = new Date()) => new Date(event.end ?? event.start) >= now;

export const byStart = (a, b) => new Date(a.start) - new Date(b.start);
