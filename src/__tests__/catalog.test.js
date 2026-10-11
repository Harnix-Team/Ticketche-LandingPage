import { toEventDetail, toPlaceDetail, toRestaurant } from "@/lib/catalog";
import { toCard } from "@/lib/cards";
import { rankWith } from "@/lib/params";
import { hydrateReco, indexCatalog } from "@/lib/reco";

const ID = "01a11f72-c2c3-71ad-93e2-e9d4ae0e1429";

const rawPlace = {
  id: ID,
  name: "Parking Marché Dantokpa",
  description: "Grand parking surveillé",
  city: "Cotonou",
  latitude: "6.3676",
  longitude: "2.4381",
  status: "VALIDATED",
  minimum_price: "200",
  balance: "125000",
  owner_id: "owner-1",
  owner: { id: "owner-1", first_name: "Codjo", second_name: "Adjovi", phone_number: "0197000101" },
  managers: [{ id: "m1", user: { email: "gerant@example.com", phone_number: "0197000102" } }],
  availabilities: [{ day: "Lundi", open_hour: "06:00", close_hour: "22:00" }],
  types: [{ type: "PARKING", label: "Parking", icon: "KeySquare" }],
  service_types: [
    { id: "s1", name: "Voiture", price: 500, status: "ON", place_type: "PARKING", place_type_label: "Parking", icon: "KeySquare" },
    { id: "s2", name: "Camion", price: 2000, status: "OFF", place_type: "PARKING", place_type_label: "Parking", icon: "KeySquare" },
  ],
  images: [{ id: "i1", link: "https://api.ticketche.com/storage/a.jpg" }],
  noteUsers: [
    { id: "n1", star: "5", description: "Très bien", user: { first_name: "Amber", second_name: "Fall", email: "amber@example.com", phone_number: "0100000000" } },
    { id: "n2", star: "4", description: "Correct", user: { first_name: "Bill", second_name: null } },
  ],
  contact: { country_code: "+229", phone_number: "0197410001", contact_channels: ["whatsapp"] },
};

describe("catalog : mise en forme des réponses de l'API", () => {
  it("ne laisse sortir aucune donnée personnelle d'un lieu", () => {
    const place = toPlaceDetail(rawPlace);
    const serialized = JSON.stringify(place);

    expect(serialized).not.toMatch(/0197000101|0197000102|example\.com|0100000000|125000|owner-1|Adjovi/);
    expect(place.reviews[0].author).toBe("Amber F.");
    // Le numero de l'etablissement, lui, est publie pour etre appele.
    expect(place.contact.phone).toBe("+2290197410001");
  });

  it("calcule la note, garde les services actifs et construit l'adresse lisible", () => {
    const place = toPlaceDetail(rawPlace);

    expect(place.rating).toBe(4.5);
    expect(place.reviewCount).toBe(2);
    expect(place.services.map((service) => service.name)).toEqual(["Voiture"]);
    expect(place.path).toBe(`/places/parking-marche-dantokpa-${ID}/`);
    expect(place.position).toEqual({ lat: 6.3676, lng: 2.4381 });
  });

  it("déduit le prix minimum d'un événement et masque son organisateur", () => {
    const event = toEventDetail({
      id: ID,
      title: "Concert de Jazz à Cotonou",
      start_date: "2026-10-24T19:00:00.000000Z",
      balance: "90000",
      tickets: [{ id: "t1", title: "VIP", price: 15000 }, { id: "t2", title: "Standard", price: 5000, is_available: false }],
      organizer: { first_name: "Ama", second_name: "Osei", email: "ama@example.com", phone_number: "0111111111" },
      note_users: [],
    });

    expect(event.minPrice).toBe(5000);
    expect(event.organizer).toEqual({ name: "Ama O.", avatar: null });
    expect(event.tickets[1].available).toBe(false);
    expect(JSON.stringify(event)).not.toMatch(/example\.com|0111111111|90000/);
    expect(event.path).toBe(`/events/concert-de-jazz-a-cotonou-${ID}/`);
  });

  it("garde un état d'ouverture inconnu pour un restaurant sans horaires", () => {
    const restaurant = toRestaurant({ id: ID, name: "Maison Royale", is_open: null, opening_hours: null, latitude: "-962", longitude: "2" });

    expect(restaurant.isOpen).toBeNull();
    expect(restaurant.hours).toEqual([]);
    expect(restaurant.position).toBeNull();
    expect(restaurant.resthora).toBe(false);
  });

  it("repère un restaurant connecté à Resthora", () => {
    expect(toRestaurant({ id: ID, name: "Elite Food", source: "RESTHORA", can_order: true }).resthora).toBe(true);
    expect(toRestaurant({ id: ID, name: "Chez Tantie Rose", source: "SHOWCASE" }).resthora).toBe(false);
  });

  it("allège un lieu en carte et fige son état d'ouverture", () => {
    // Lundi 12 octobre 2026, 10 h a Cotonou (UTC+1).
    const card = toCard(toPlaceDetail(rawPlace), new Date("2026-10-12T09:00:00Z"));

    expect(card.isOpen).toBe(true);
    expect(card).not.toHaveProperty("reviews");
    expect(card).not.toHaveProperty("contact");
    expect(card).not.toHaveProperty("description");
  });
});

describe("recommandations", () => {
  const places = [
    { kind: "place", id: "a", name: "A" },
    { kind: "place", id: "b", name: "B" },
    { kind: "place", id: "c", name: "C" },
  ];
  const reco = { requestId: "req", version: "rules-v2", arm: "TREATMENT", items: [
    { kind: "place", id: "c", reason: "POPULAR", position: 1 },
    { kind: "place", id: "disparu", reason: "NEW", position: 2 },
    { kind: "place", id: "a", reason: "TOP_RATED", position: 3 },
  ] };

  it("hydrate la liste dans l'ordre du moteur et ignore les objets dépubliés", () => {
    const items = hydrateReco(reco, indexCatalog({ places }));

    expect(items.map((item) => item.id)).toEqual(["c", "a"]);
    expect(items[0].reco).toEqual({ reason: "POPULAR", position: 1, requestId: "req", version: "rules-v2", arm: "TREATMENT" });
  });

  it("ne renvoie rien quand le moteur est coupé", () => {
    expect(hydrateReco(null, indexCatalog({ places }))).toEqual([]);
  });

  it("classe une liste filtrée selon le moteur, le reste à la suite", () => {
    expect(rankWith(places, reco).map((item) => item.id)).toEqual(["c", "a", "b"]);
    expect(rankWith(places, null)).toBe(places);
  });
});
