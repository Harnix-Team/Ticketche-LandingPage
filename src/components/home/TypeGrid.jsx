import Link from "next/link";
import { CountUp } from "@/components/ui/CountUp";
import { HoverPhoto, ON_PHOTO, ON_PHOTO_TILE, photoGroup } from "@/components/ui/HoverPhoto";
import { placeTypeIcon } from "@/lib/icons";

/** Tous les types de lieux de la 2.0.28, avec le nombre de lieux publies pour chacun. */
export function TypeGrid({ placeTypes, places }) {
  const byType = new Map();
  places.forEach((place) =>
    place.types.forEach(({ type }) => byType.set(type, [...(byType.get(type) ?? []), place]))
  );
  const used = new Set();
  const tiles = placeTypes
    .map((type) => ({ ...type, places: byType.get(type.type) ?? [] }))
    .filter((type) => type.places.length > 0)
    .sort((a, b) => b.places.length - a.places.length)
    .map((type) => {
      // Un lieu a plusieurs types : chaque tuile prend une photo que les precedentes n'ont pas deja montree.
      const candidates = [...type.places].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).flatMap((place) => place.images.slice(0, 1));
      const image = candidates.find((src) => !used.has(src)) ?? candidates[0];
      if (image) used.add(image);

      return { ...type, count: type.places.length, image };
    });

  if (tiles.length === 0) return null;

  return (
    <ul className="tk-shell grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
      {tiles.map(({ type, label, icon, count, image }) => {
        const Icon = placeTypeIcon(icon);

        return (
          <li key={type}>
            <Link
              href={`/establishments/?type=${type}`}
              className={`flex h-full min-h-32 flex-col justify-between rounded-card border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-300 ease-out-soft hover:border-line-strong hover:shadow-[0_14px_28px_-14px_rgb(13_35_38/0.28)] ${photoGroup(image)}`}
            >
              {/* La photo du lieu le mieux note de ce type. */}
              <HoverPhoto src={image} sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 180px" />
              <span className="flex items-start justify-between">
                <span className={`grid size-11 place-items-center rounded-xl bg-brand-soft text-brand ${ON_PHOTO_TILE}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className={`tk-display text-3xl text-ink-3 ${ON_PHOTO}`} aria-hidden>
                  <CountUp value={count} />
                </span>
              </span>
              <span className={`tk-label mt-4 text-[0.9375rem] leading-tight text-ink ${ON_PHOTO}`}>
                {label}
                <span className="sr-only">, {count} lieu{count > 1 ? "x" : ""}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
