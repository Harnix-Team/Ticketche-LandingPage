"use client";

import { ArrowRight, Clock, MapPin, Star } from "@/components/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Media } from "@/components/ui/Media";
import { dateBadge, formatPrice } from "@/lib/format";
import { eventCategoryIcon, placeTypeIcon, RECO_REASONS } from "@/lib/icons";
import { track } from "@/lib/tracking";

const SLIDE_MS = 6500;

/** Contenu du talon : ce qu'on lirait sur un vrai billet, selon le type d'objet. */
function stub(item) {
  if (item.kind === "event") {
    const badge = dateBadge(item.start);

    return {
      big: badge?.day,
      unit: badge?.month,
      lines: [badge && `${badge.weekday} à ${badge.time}`, item.locationName],
      price: item.minPrice === null ? null : item.minPrice > 0 ? formatPrice(item.minPrice) : "Gratuit",
      priceLabel: item.minPrice > 0 ? "À partir de" : "Entrée",
      action: "Voir l’événement",
    };
  }

  if (item.kind === "restaurant") {
    return {
      big: item.cuisine ?? "Restaurant",
      lines: [item.city ?? item.address, item.isOpen === true ? "Ouvert maintenant" : null],
      price: item.canOrder ? "Commande en ligne" : "Menu complet",
      action: "Voir le menu",
    };
  }

  return {
    big: item.rating ? item.rating.toFixed(1).replace(".", ",") : item.types[0]?.label,
    unit: item.rating ? "sur 5" : null,
    lines: [item.rating ? `${item.reviewCount} avis` : null, item.isOpen === true ? "Ouvert maintenant" : null],
    price: item.minPrice ? formatPrice(item.minPrice) : null,
    priceLabel: "À partir de",
    action: "Voir le lieu",
  };
}

const kicker = (item) => {
  if (item.kind === "event") return { icon: eventCategoryIcon(item.category?.title), label: item.category?.title ?? "Événement" };
  if (item.kind === "restaurant") return { icon: MapPin, label: item.city ?? "Restaurant" };

  return { icon: placeTypeIcon(item.types[0]?.icon), label: [item.types[0]?.label, item.city].filter(Boolean).join(", ") };
};

/**
 * Le billet de la une : les objets que le moteur de recommandation classe en tete, presentes comme un
 * ticket (affiche a gauche, talon detachable a droite). Defile seul, se met en pause au survol et au focus.
 */
export function TicketHero({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = items[index];

  useEffect(() => {
    if (paused || items.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % items.length), SLIDE_MS);

    return () => clearTimeout(timer);
  }, [index, paused, items.length]);

  useEffect(() => {
    if (item) track("IMPRESSION", item, { surface: "HOME" });
    // Une impression par diapositive affichee.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  if (!item) return null;

  const { big, unit, lines, price, priceLabel, action } = stub(item);
  const { icon: KickerIcon, label: kickerLabel } = kicker(item);
  const reason = RECO_REASONS[item.reco?.reason];

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link
        href={item.path}
        onClick={() => track("CLICK", item, { surface: "HOME" })}
        className="tk-ticket group/ticket h-[30rem] md:h-[25rem] lg:h-[27rem]"
        aria-label={`${item.name}. ${action}`}
      >
        <div className="relative min-h-0 overflow-hidden">
          {items.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out-soft ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
              aria-hidden={slideIndex !== index}
            >
              <Media
                src={slide.images[0]}
                alt=""
                sizes="(max-width: 896px) 100vw, 760px"
                priority={slideIndex === 0}
                eager={slideIndex === 0}
                icon={kicker(slide).icon}
                className={`size-full ${slideIndex === index ? "motion-safe:animate-[tk-drift_9s_linear_both]" : ""}`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-linear-to-t from-[#0d2326]/90 via-[#0d2326]/25 to-transparent" aria-hidden />

          <div key={item.id} className="tk-enter absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-5 sm:p-7">
            <p className="tk-label flex items-center gap-2 text-[0.8125rem] text-white/85" style={{ "--i": 0 }}>
              <KickerIcon className="size-4" aria-hidden />
              {kickerLabel}
            </p>
            <p className="tk-display max-w-[18ch] text-[clamp(1.75rem,3.6vw,2.75rem)] text-white" style={{ "--i": 1 }}>
              {item.name}
            </p>
            {reason && (
              <p className="tk-label flex w-fit items-center gap-1.5 rounded-full bg-white/16 px-3 py-1.5 text-[0.75rem] text-white backdrop-blur-md" style={{ "--i": 2 }}>
                <reason.icon className="size-3.5" aria-hidden />
                {reason.label}
              </p>
            )}
          </div>
        </div>

        <div key={`stub-${item.id}`} className="tk-enter flex min-w-0 items-center justify-between gap-4 p-5 md:flex-col md:items-start md:justify-between md:p-7">
          <div className="min-w-0" style={{ "--i": 1 }}>
            <p className="flex items-baseline gap-2">
              <span className={`tk-display text-gold ${String(big ?? "").length > 4 ? "text-3xl md:text-4xl" : "text-5xl md:text-7xl"}`}>{big}</span>
              {unit && <span className="tk-label text-base text-white/80 md:text-lg">{unit}</span>}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-[0.8125rem] text-white/80 md:mt-4 md:text-[0.875rem]">
              {lines.filter(Boolean).map((line, lineIndex) => {
                const LineIcon = lineIndex === 0 ? (item.kind === "place" ? Star : Clock) : MapPin;

                return (
                  <li key={line} className="flex items-center gap-1.5">
                    <LineIcon className="size-3.5 shrink-0 text-white/60" aria-hidden />
                    <span className="truncate">{line}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3 md:w-full md:items-start" style={{ "--i": 2 }}>
            {price && (
              <p className="text-right md:text-left">
                {priceLabel && <span className="block text-[0.75rem] text-white/65">{priceLabel}</span>}
                <span className="tk-title text-lg text-white md:text-xl">{price}</span>
              </p>
            )}
            <span className="tk-label inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.9375rem] text-[#0d2326] transition-transform duration-300 ease-out-soft group-hover/ticket:translate-x-1">
              {action}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>

      {items.length > 1 && (
        <div className="mt-4 flex items-center gap-2" role="group" aria-label="À la une">
          {items.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`${slideIndex + 1} sur ${items.length} : ${slide.name}`}
              aria-current={slideIndex === index}
              className="group/dot relative h-6 grow basis-0 sm:max-w-16"
            >
              <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line-strong">
                {slideIndex === index && (
                  <span
                    className="absolute inset-0 origin-left rounded-full bg-brand motion-reduce:animate-none"
                    style={{ animation: `tk-progress ${SLIDE_MS}ms linear both`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
