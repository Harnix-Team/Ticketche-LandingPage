import {
  Baby, Briefcase, CalendarClock, CalendarDays, Camera, Church, Clapperboard, Clock, Coins, Drama,
  Dumbbell, FerrisWheel, Flame, Fuel, GraduationCap, Heart, Hotel, KeySquare, Landmark, Layers,
  MapPin, Martini, Music, Navigation, Palette, PartyPopper, Presentation, Shirt, Sparkles, Star,
  Store, ThumbsUp, Timer, TrendingUp, Trees, Trophy, Users, UtensilsCrossed, Wallet, Wrench,
} from "@/components/icons";

/** Icones des types de lieux : l'API renvoie le nom Lucide (`GET /place-types`), meme table que l'app. */
const PLACE_TYPE_ICONS = {
  KeySquare, Sparkles, Wrench, Fuel, Palette, FerrisWheel, Hotel, Trees, Landmark, Camera, Martini,
  Dumbbell, Store, Drama,
};

export const placeTypeIcon = (name) => PLACE_TYPE_ICONS[name] ?? MapPin;

/** Meme deduction par mot-cle que l'app (FRONTEND/utils/event-categories.ts). */
const EVENT_CATEGORY_ICONS = [
  [["concert", "musique"], Music],
  [["festival"], PartyPopper],
  [["soiree", "nocturne"], Martini],
  [["sport"], Trophy],
  [["conference", "seminaire"], Presentation],
  [["formation"], GraduationCap],
  [["atelier"], Wrench],
  [["theatre", "spectacle"], Drama],
  [["cinema"], Clapperboard],
  [["exposition", "art", "culture"], Palette],
  [["gastronomie", "restaurant", "brunch"], UtensilsCrossed],
  [["religieu"], Church],
  [["famille"], Users],
  [["enfant"], Baby],
  [["business", "affaires"], Briefcase],
  [["mode"], Shirt],
];

export function eventCategoryIcon(title) {
  const key = String(title ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

  return EVENT_CATEGORY_ICONS.find(([words]) => words.some((word) => key.includes(word)))?.[1] ?? CalendarDays;
}

/** Icone d'un objet du catalogue : sa categorie pour un evenement, son type principal pour un lieu. */
export function itemIcon(item) {
  if (item?.kind === "event") return eventCategoryIcon(item.category?.title);
  if (item?.kind === "restaurant") return UtensilsCrossed;

  return placeTypeIcon(item?.types?.[0]?.icon);
}

/** Raisons renvoyees par le moteur de recommandation, memes libelles que l'app. */
export const RECO_REASONS = {
  CATEGORY_AFFINITY: { label: "Dans vos centres d’intérêt", icon: Heart },
  POPULAR: { label: "Très populaire", icon: Flame },
  NEAR_YOU: { label: "Près de vous", icon: MapPin },
  STARTING_SOON: { label: "Commence bientôt", icon: Timer },
  TOP_RATED: { label: "Très bien noté", icon: Star },
  TRENDING: { label: "Tendance du moment", icon: TrendingUp },
  NEW: { label: "Nouveau", icon: Sparkles },
  OPEN_NOW: { label: "Ouvert maintenant", icon: Clock },
  TIME_FIT: { label: "Au bon moment pour vous", icon: CalendarClock },
  PRICE_FIT: { label: "Dans votre budget", icon: Wallet },
  SIMILAR_TO_YOUR_TASTE: { label: "Proche de vos goûts", icon: ThumbsUp },
  SIMILAR_OFFER: { label: "Offre similaire", icon: Layers },
  ALSO_LIKED_BY_OTHERS: { label: "Aimé aussi par d’autres", icon: Users },
  CLOSE_TO_THIS: { label: "Tout près d’ici", icon: Navigation },
  SAME_BUDGET: { label: "Même budget", icon: Coins },
};
