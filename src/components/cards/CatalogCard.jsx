"use client";

import { Clock, Globe, MapPin, Star, UtensilsCrossed, Zap } from "@/components/icons";
import Link, { useLinkStatus } from "next/link";
import { useState, ViewTransition } from "react";
import { useCardTracking } from "@/components/cards/useCardTracking";
import { Media } from "@/components/ui/Media";
import { ResthoraBadge } from "@/components/ui/ResthoraBadge";
import { dateBadge, formatDistance, formatPrice, formatShortDateTime } from "@/lib/format";
import { eventCategoryIcon, placeTypeIcon, RECO_REASONS } from "@/lib/icons";

const FORMATS = {
  EN_LIGNE: { label: "En ligne", icon: Globe },
  MIXTE: { label: "Sur place et en ligne", icon: Zap },
};

function Pill({ icon: Icon, children, tone = "surface" }) {
  const tones = {
    surface: "bg-surface/92 text-ink backdrop-blur-sm",
    open: "bg-surface/92 text-ok backdrop-blur-sm",
    closed: "bg-surface/92 text-ink-3 backdrop-blur-sm",
  };

  return (
    <span className={`tk-label inline-flex h-6 items-center gap-1 rounded-md px-2 text-[0.6875rem] ${tones[tone]}`}>
      {Icon && <Icon className="size-3" aria-hidden />}
      {children}
    </span>
  );
}

/** Retour immediat au clic : la page suivante se prepare, la photo de la carte le montre. */
function PendingVeil() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span className="absolute inset-0 grid place-items-center bg-scrim opacity-0 motion-safe:animate-[tk-appear_0.2s_0.18s_forwards] motion-reduce:opacity-100" aria-hidden>
      <span className="size-7 animate-spin rounded-full border-2 border-white/35 border-t-white" />
    </span>
  );
}

function Rating({ rating, reviewCount }) {
  if (!rating) return null;

  return (
    <span className="tk-label flex shrink-0 items-center gap-1 text-[0.8125rem] text-ink" title={`${reviewCount} avis`}>
      <Star className="size-3.5 fill-star text-star" aria-hidden />
      {rating.toFixed(1).replace(".", ",")}
      <span className="sr-only"> sur 5, {reviewCount} avis</span>
    </span>
  );
}

function OpenPill({ open }) {
  if (open === null || open === undefined) return null;

  return (
    <Pill icon={Clock} tone={open ? "open" : "closed"}>
      {open ? "Ouvert" : "Fermé"}
    </Pill>
  );
}

/** Ce qui differe d'un type d'objet a l'autre : pastilles sur le visuel, ligne d'information, prix. */
function describe(item) {
  if (item.kind === "event") {
    const badge = dateBadge(item.start);
    const format = FORMATS[item.format];

    return {
      icon: eventCategoryIcon(item.category?.title),
      topLeft: badge && (
        <span className="grid min-w-11 place-items-center rounded-lg bg-surface/95 px-2 py-1 text-center leading-none text-ink backdrop-blur-sm">
          <span className="tk-title text-lg">{badge.day}</span>
          <span className="tk-label text-[0.625rem] text-ink-2">{badge.month}</span>
        </span>
      ),
      topRight: item.category && <Pill icon={eventCategoryIcon(item.category.title)}>{item.category.title}</Pill>,
      meta: [
        { icon: Clock, text: formatShortDateTime(item.start) },
        format ? { icon: format.icon, text: format.label } : { icon: MapPin, text: item.locationName },
      ],
      price: item.minPrice === null ? null : item.minPrice > 0 ? `Dès ${formatPrice(item.minPrice)}` : "Gratuit",
    };
  }

  if (item.kind === "restaurant") {
    return {
      icon: UtensilsCrossed,
      topLeft: item.cuisine && <Pill icon={UtensilsCrossed}>{item.cuisine}</Pill>,
      topRight: <OpenPill open={item.isOpen} />,
      meta: [{ icon: MapPin, text: item.city ?? item.address }],
      price: item.canOrder ? "Commande en ligne" : "Menu à consulter",
    };
  }

  const [type, ...others] = item.types;

  return {
    icon: placeTypeIcon(type?.icon),
    topLeft: type && (
      <span className="flex gap-1">
        <Pill icon={placeTypeIcon(type.icon)}>{type.label}</Pill>
        {others.length > 0 && <Pill>+{others.length}</Pill>}
      </span>
    ),
    topRight: <OpenPill open={item.isOpen} />,
    meta: [{ icon: MapPin, text: item.distance != null ? `${formatDistance(item.distance)}, ${item.city}` : item.city }],
    price: item.minPrice ? `Dès ${formatPrice(item.minPrice)}` : "Prix sur place",
  };
}

/**
 * Carte d'un lieu, d'un evenement ou d'un restaurant.
 * La raison de la recommandation s'affiche sous la carte, comme dans l'application.
 */
export function CatalogCard({ item, tracking, sizes = "(max-width: 640px) 78vw, 320px", priority = false, className = "" }) {
  const { ref, onClick } = useCardTracking(item, tracking);
  const [morphing, setMorphing] = useState(false);
  const { icon, topLeft, topRight, meta, price } = describe(item);
  const reason = RECO_REASONS[item.reco?.reason];

  return (
    <div ref={ref} role="listitem" className={`flex flex-col ${className}`}>
      <Link
        href={item.path}
        onClick={() => {
          // Un meme objet figure dans plusieurs rangees : seul le visuel clique porte le nom de transition.
          setMorphing(true);
          onClick();
        }}
        className="group/card flex grow flex-col rounded-card border border-line bg-surface p-1.5 transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:border-line-strong hover:shadow-[0_14px_28px_-14px_rgb(13_35_38/0.28)] pointer-fine:hover:-translate-y-0.5 dark:hover:shadow-[0_14px_28px_-12px_rgb(0_0_0/0.7)]"
      >
        <ViewTransition name={morphing ? `media-${item.kind}-${item.id}` : undefined} share="tk-morph" default="none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-sunken">
            <Media
              src={item.images[0]}
              alt=""
              sizes={sizes}
              priority={priority}
              icon={icon}
              className="size-full transition-transform duration-700 ease-out-soft pointer-fine:group-hover/card:scale-[1.04]"
            />
            <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
              {topLeft ?? <span />}
              {topRight}
            </div>
            {item.resthora && <ResthoraBadge className="absolute bottom-2 left-2" />}
            <PendingVeil />
          </div>
        </ViewTransition>

        <div className="flex grow flex-col gap-1.5 px-2 pt-3 pb-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="tk-label line-clamp-2 text-[1rem] leading-snug text-ink">{item.name}</h3>
            <Rating rating={item.rating} reviewCount={item.reviewCount} />
          </div>
          <ul className="flex flex-col gap-0.5 text-[0.8125rem] text-ink-2">
            {meta
              .filter((entry) => entry?.text)
              .map(({ icon: MetaIcon, text }) => (
                <li key={text} className="flex items-center gap-1.5">
                  <MetaIcon className="size-3.5 shrink-0 text-ink-3" aria-hidden />
                  <span className="truncate">{text}</span>
                </li>
              ))}
          </ul>
          {price && <p className="tk-label mt-auto pt-1.5 text-[0.875rem] text-ink">{price}</p>}
        </div>
      </Link>

      {reason && (
        <p className="tk-label mt-2 flex items-center gap-1.5 px-2 text-[0.75rem] text-brand">
          <reason.icon className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{reason.label}</span>
        </p>
      )}
    </div>
  );
}
