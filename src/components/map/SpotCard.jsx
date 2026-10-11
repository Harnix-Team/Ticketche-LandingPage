"use client";

import { ArrowUpRight, Clock, MapPin, Star } from "@/components/icons";
import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { formatDistance, formatPrice, formatShortDateTime } from "@/lib/format";
import { eventCategoryIcon, placeTypeIcon } from "@/lib/icons";

/** Fiche horizontale du carrousel de la carte : selectionnable, avec un lien vers la fiche complete. */
export function SpotCard({ item, selected, onSelect, cardRef }) {
  const isEvent = item.kind === "event";
  const Icon = isEvent ? eventCategoryIcon(item.category?.title) : placeTypeIcon(item.types[0]?.icon);
  const kicker = isEvent ? item.category?.title : item.types.map((type) => type.label).slice(0, 2).join(", ");
  const price = isEvent
    ? item.minPrice === null ? null : item.minPrice > 0 ? `Dès ${formatPrice(item.minPrice)}` : "Gratuit"
    : item.minPrice ? `Dès ${formatPrice(item.minPrice)}` : null;

  return (
    <article
      ref={cardRef}
      data-spot={item.id}
      onClick={() => onSelect(item.id)}
      className={`flex w-[min(86vw,22rem)] shrink-0 cursor-pointer gap-3 rounded-card border bg-surface p-1.5 transition-[border-color,box-shadow] duration-300 ${
        selected ? "border-brand shadow-[0_8px_18px_-8px_rgb(0_0_0/0.35)]" : "border-line"
      }`}
    >
      <div className="relative min-h-[6.5rem] w-[6.5rem] shrink-0 self-stretch overflow-hidden rounded-media bg-sunken">
        <Media src={item.images[0]} alt="" sizes="104px" icon={Icon} className="size-full" />
      </div>
      <div className="flex min-w-0 grow flex-col py-1 pr-1.5">
        <p className="tk-label flex items-center gap-1.5 text-[0.75rem] text-brand">
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{kicker}</span>
        </p>
        <h3 className="tk-label mt-0.5 line-clamp-2 text-[0.9375rem] leading-snug text-ink">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 truncate text-[0.75rem] text-ink-2">
          {isEvent ? <Clock className="size-3 shrink-0" aria-hidden /> : <MapPin className="size-3 shrink-0" aria-hidden />}
          <span className="truncate">
            {isEvent
              ? formatShortDateTime(item.start)
              : item.distance != null ? `${formatDistance(item.distance)}, ${item.city}` : item.city}
          </span>
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <span className="tk-label flex items-center gap-2 truncate text-[0.8125rem] text-ink">
            {item.rating && (
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-star text-star" aria-hidden />
                {item.rating.toFixed(1).replace(".", ",")}
              </span>
            )}
            {price}
          </span>
          <Link
            href={item.path}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Voir ${item.name}`}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-colors hover:bg-brand-fill hover:text-white"
          >
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
