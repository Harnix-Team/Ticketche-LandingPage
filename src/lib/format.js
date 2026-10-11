/** Fuseau du Benin : serveur et navigateur produisent le meme texte, quel que soit leur fuseau. */
export const TIME_ZONE = "Africa/Porto-Novo";

const WEEKDAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const fmt = (options) => new Intl.DateTimeFormat("fr-FR", { timeZone: TIME_ZONE, ...options });

const dayFmt = fmt({ day: "numeric" });
const monthShortFmt = fmt({ month: "short" });
const weekdayShortFmt = fmt({ weekday: "short" });
const timeFmt = fmt({ hour: "2-digit", minute: "2-digit" });
const longDateFmt = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDateFmt = fmt({ weekday: "short", day: "numeric", month: "short" });
const partsFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const toDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const clean = (text) => text.replace(/\.$/, "");

/** Jour, mois et heure d'une date, pour l'etiquette posee sur une affiche. */
export function dateBadge(value) {
  const date = toDate(value);
  if (!date) return null;

  return {
    weekday: clean(weekdayShortFmt.format(date)),
    day: dayFmt.format(date),
    month: clean(monthShortFmt.format(date)),
    time: timeFmt.format(date).replace(":", " h "),
  };
}

export function formatLongDate(value) {
  const date = toDate(value);

  return date ? longDateFmt.format(date) : null;
}

/** « sam. 24 oct., 19 h 00 » */
export function formatShortDateTime(value) {
  const date = toDate(value);

  return date ? `${shortDateFmt.format(date)}, ${timeFmt.format(date).replace(":", " h ")}` : null;
}

export function formatTime(value) {
  const date = toDate(value);

  return date ? timeFmt.format(date).replace(":", " h ") : null;
}

export function formatPrice(amount) {
  // `Number(null)` vaut 0 : un prix absent ne doit pas s'afficher « Gratuit ».
  if (amount === null || amount === undefined || amount === "") return null;
  const value = Number(amount);
  if (!Number.isFinite(value)) return null;

  return value <= 0 ? "Gratuit" : `${value.toLocaleString("fr-FR")} FCFA`;
}

export function formatDistance(km) {
  if (!Number.isFinite(km)) return null;
  if (km < 1) return `${Math.max(50, Math.round(km * 20) * 50)} m`;

  return `${km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)} km`;
}

export function distanceKm(a, b) {
  if (!a || !b) return null;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const minutes = (hhmm) => {
  const [h, m] = String(hhmm ?? "").split(":").map(Number);

  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};

/** Jour (en francais, comme dans l'API) et minute courante au Benin. */
export function beninNow(now = new Date()) {
  const parts = Object.fromEntries(partsFmt.formatToParts(now).map((p) => [p.type, p.value]));
  const index = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);

  return { day: WEEKDAYS[index], minute: Number(parts.hour) * 60 + Number(parts.minute) };
}

/**
 * Etat d'ouverture d'un lieu a partir de ses horaires hebdomadaires.
 * Null quand le lieu n'a publie aucun horaire : on n'affiche alors ni « Ouvert » ni « Ferme ».
 */
export function openState(hours, now = new Date()) {
  if (!Array.isArray(hours) || hours.length === 0) return null;

  const { day, minute } = beninNow(now);
  const today = hours.find((slot) => slot.day === day);
  const open = minutes(today?.open);
  const close = minutes(today?.close);
  if (open === null || close === null) return { open: false, day };

  return { open: minute >= open && minute <= close, day, closesAt: today.close, opensAt: today.open };
}
