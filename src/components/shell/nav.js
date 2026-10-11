import { Briefcase, CalendarDays, ClipboardList, Mail, Map, MapPin, Users, UtensilsCrossed } from "@/components/icons";

export const PRIMARY_NAV = [
  { href: "/events/", label: "Événements", icon: CalendarDays, match: /^\/events/ },
  { href: "/establishments/", label: "Lieux", icon: MapPin, match: /^\/(establishments|places)/ },
  { href: "/restaurants/", label: "Restaurants", icon: UtensilsCrossed, match: /^\/restaurants/ },
  { href: "/carte/", label: "Carte", icon: Map, match: /^\/carte/ },
];

const ABOUT = { href: "/a-propos/", label: "À propos", icon: Users, match: /^\/a-propos/ };

/** Liens de la barre du haut sur grand ecran. */
export const HEADER_NAV = [...PRIMARY_NAV, ABOUT];

export const SECONDARY_NAV = [
  ABOUT,
  { href: "/recrutement/", label: "Recrutement", icon: Briefcase },
  { href: "/questionnaires/", label: "Sondages", icon: ClipboardList },
  { href: "/contact/", label: "Contact", icon: Mail },
];

export const LEGAL_NAV = [
  { href: "/politiques/confidentialite/", label: "Confidentialité" },
  { href: "/politiques/conditions/", label: "Conditions d’utilisation" },
  { href: "/politiques/mentions/", label: "Mentions légales" },
];
