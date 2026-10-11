import { CalendarDays, Map, MapPin, UtensilsCrossed } from "@/components/icons";

export const PRIMARY_NAV = [
  { href: "/events/", label: "Événements", icon: CalendarDays, match: /^\/events/ },
  { href: "/establishments/", label: "Lieux", icon: MapPin, match: /^\/(establishments|places)/ },
  { href: "/restaurants/", label: "Restaurants", icon: UtensilsCrossed, match: /^\/restaurants/ },
  { href: "/carte/", label: "Carte", icon: Map, match: /^\/carte/ },
];

export const SECONDARY_NAV = [
  { href: "/a-propos/", label: "À propos" },
  { href: "/recrutement/", label: "Recrutement" },
  { href: "/questionnaires/", label: "Sondages" },
  { href: "/contact/", label: "Contact" },
];

export const LEGAL_NAV = [
  { href: "/politiques/confidentialite/", label: "Confidentialité" },
  { href: "/politiques/conditions/", label: "Conditions d’utilisation" },
  { href: "/politiques/mentions/", label: "Mentions légales" },
];
