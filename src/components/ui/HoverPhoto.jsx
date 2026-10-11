import { Media } from "@/components/ui/Media";

/**
 * Photo qui passe en fond d'une tuile au survol ou au focus clavier, sous un voile sombre.
 *
 * La tuile porte `photoGroup(src)` ; ses textes portent `ON_PHOTO` (ou `ON_PHOTO_SOFT` pour un texte secondaire,
 * `ON_PHOTO_TILE` pour une pastille d'icone) afin de passer en blanc en meme temps. Sans photo, rien ne change.
 */
export const photoGroup = (src) => (src ? "group/photo relative isolate overflow-hidden" : "");

const HOVER = "transition-colors duration-500";

export const ON_PHOTO = `${HOVER} group-hover/photo:text-white group-focus-within/photo:text-white group-focus-visible/photo:text-white`;

export const ON_PHOTO_SOFT = `${HOVER} group-hover/photo:text-white/85 group-focus-within/photo:text-white/85 group-focus-visible/photo:text-white/85`;

export const ON_PHOTO_TILE = `${ON_PHOTO} group-hover/photo:bg-white/18 group-focus-within/photo:bg-white/18 group-focus-visible/photo:bg-white/18`;

export function HoverPhoto({ src, kind = "place", sizes }) {
  if (!src) return null;

  return (
    <span
      className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-out-soft group-hover/photo:opacity-100 group-focus-within/photo:opacity-100 group-focus-visible/photo:opacity-100"
      aria-hidden
    >
      <Media
        src={src}
        alt=""
        sizes={sizes}
        kind={kind}
        className="size-full scale-110 transition-transform duration-[900ms] ease-out-soft group-hover/photo:scale-100 group-focus-within/photo:scale-100 group-focus-visible/photo:scale-100"
      />
      <span className="absolute inset-0 bg-linear-to-t from-[#0d2326]/95 via-[#0d2326]/70 to-[#0d2326]/50" />
    </span>
  );
}
