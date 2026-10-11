import { dateBadge, distanceKm, formatDistance, formatPrice, formatShortDateTime, openState } from "@/lib/format";
import { idFromSlug, placePath } from "@/lib/paths";

const HOURS = [
  { day: "Lundi", open: "08:00", close: "18:00" },
  { day: "Samedi", open: "18:00", close: "23:59" },
];

describe("format", () => {
  it("affiche les dates à l'heure du Bénin, quel que soit le fuseau de la machine", () => {
    // 23 h 30 UTC le vendredi = 0 h 30 le samedi a Cotonou.
    expect(dateBadge("2026-10-23T23:30:00Z")).toMatchObject({ day: "24", month: "oct", weekday: "sam" });
    expect(formatShortDateTime("2026-10-24T19:00:00Z")).toBe("sam. 24 oct., 20 h 00");
  });

  it("formate les prix en francs CFA", () => {
    expect(formatPrice(5000).replace(/\s/g, " ")).toBe("5 000 FCFA");
    expect(formatPrice(0)).toBe("Gratuit");
    expect(formatPrice(null)).toBeNull();
  });

  it("donne l'état d'ouverture d'après les horaires de la semaine", () => {
    // Lundi 12 octobre 2026.
    expect(openState(HOURS, new Date("2026-10-12T09:00:00Z"))).toMatchObject({ open: true, day: "Lundi", closesAt: "18:00" });
    expect(openState(HOURS, new Date("2026-10-12T18:30:00Z")).open).toBe(false);
    // Mardi : aucun horaire publie ce jour-la.
    expect(openState(HOURS, new Date("2026-10-13T09:00:00Z")).open).toBe(false);
    expect(openState([], new Date())).toBeNull();
  });

  it("calcule et affiche une distance", () => {
    const km = distanceKm({ lat: 6.3703, lng: 2.3912 }, { lat: 6.4969, lng: 2.6289 });

    expect(km).toBeGreaterThan(28);
    expect(km).toBeLessThan(32);
    expect(formatDistance(0.42)).toBe("400 m");
    expect(formatDistance(3.26)).toBe("3,3 km");
    expect(formatDistance(42.4)).toBe("42 km");
  });
});

describe("adresses des fiches", () => {
  const id = "01a11f72-c2d3-7116-90c1-1ba6e06492d7";

  it("construit une adresse lisible et retrouve l'identifiant", () => {
    const path = placePath({ id, name: "Écolodge de la Pendjari" });

    expect(path).toBe(`/places/ecolodge-de-la-pendjari-${id}/`);
    expect(idFromSlug(`ecolodge-de-la-pendjari-${id}`)).toBe(id);
    expect(idFromSlug("pas-un-identifiant")).toBeNull();
  });
});
