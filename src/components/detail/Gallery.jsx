"use client";

import { Images } from "@/components/icons";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Media } from "@/components/ui/Media";
import { itemIcon } from "@/lib/icons";

/**
 * Photos d'une fiche. Sur telephone : un carrousel a faire glisser. Sur grand ecran : une grande photo et
 * deux petites. Le bloc porte le nom de transition de la carte d'ou l'on vient : sa photo s'y deploie.
 */
export function Gallery({ item }) {
  const { images, name } = item;
  const transitionName = `media-${item.kind}-${item.id}`;
  const icon = itemIcon(item);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const railRef = useRef(null);
  const stripRef = useRef(null);
  const photos = images.length > 0 ? images : [null];

  // La vignette de la photo affichee reste visible dans la bande.
  useEffect(() => {
    if (!lightbox) return;
    stripRef.current?.querySelector(`[data-thumb="${index}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, lightbox]);

  const onScroll = () => {
    const rail = railRef.current;
    setIndex(Math.round(rail.scrollLeft / rail.clientWidth));
  };

  const go = (step) => {
    const rail = railRef.current;
    rail.scrollTo({ left: (index + step) * rail.clientWidth, behavior: "smooth" });
  };

  return (
    <ViewTransition name={transitionName} share="tk-morph" default="none">
    <div className="relative">
      {/* Telephone et tablette : carrousel */}
      <div className="relative lg:hidden">
        <div ref={railRef} onScroll={onScroll} className="relative flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto rounded-panel tk-no-scrollbar sm:aspect-[16/9]">
          {photos.map((src, photoIndex) => (
            <div key={src ?? "vide"} className="relative w-full shrink-0 snap-center bg-sunken">
              <Media src={src} alt={`${name}, photo ${photoIndex + 1}`} sizes="100vw" priority={photoIndex === 0} icon={icon} className="size-full" />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <p className="tk-label absolute right-3 bottom-3 rounded-full bg-[#0d2326]/75 px-2.5 py-1 text-[0.75rem] text-white backdrop-blur-sm" aria-live="polite">
            {index + 1} / {photos.length}
          </p>
        )}
      </div>

      {/* Grand ecran : mosaique */}
      <div className={`hidden h-[30rem] gap-2 lg:grid ${photos.length >= 3 ? "grid-cols-[2fr_1fr] grid-rows-2" : photos.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {photos.slice(0, 3).map((src, photoIndex) => {
          const tile = (
            <button
              type="button"
              onClick={() => {
                setIndex(photoIndex);
                setLightbox(true);
              }}
              disabled={!src}
              aria-label={`Agrandir la photo ${photoIndex + 1} de ${name}`}
              className={`group/photo relative size-full overflow-hidden bg-sunken ${photoIndex === 0 ? "rounded-l-panel" : ""} ${
                photos.length < 3 ? "rounded-r-panel" : photoIndex === 1 ? "rounded-tr-panel" : photoIndex === 2 ? "rounded-br-panel" : ""
              } ${photos.length === 1 ? "rounded-panel" : ""}`}
            >
              <Media
                src={src}
                alt=""
                sizes={photoIndex === 0 ? "(max-width: 1320px) 66vw, 860px" : "(max-width: 1320px) 33vw, 430px"}
                priority={photoIndex === 0}
                icon={icon}
                className="size-full transition-transform duration-700 ease-out-soft group-hover/photo:scale-[1.03]"
              />
            </button>
          );

          return (
            <div key={src ?? "vide"} className={`min-h-0 ${photoIndex === 0 ? "row-span-2" : ""}`}>
              {tile}
            </div>
          );
        })}
        {photos.length > 3 && (
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setLightbox(true);
            }}
            className="tk-label absolute right-4 bottom-4 flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-[0.875rem] text-ink shadow-[0_4px_16px_rgb(0_0_0/0.2)]"
          >
            <Images className="size-4" aria-hidden />
            Voir les {photos.length} photos
          </button>
        )}
      </div>

      {/* Largeur calee sur la hauteur disponible : la photo (3:2) et ses vignettes tiennent a l'ecran, sans defilement. */}
      <Dialog
        open={lightbox}
        onClose={() => setLightbox(false)}
        title={`Photos de ${name}`}
        className="w-[min(94vw,64rem,calc((100dvh-15rem)*1.5+3.5rem))]"
      >
        <div
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") setIndex((index + 1) % photos.length);
            if (event.key === "ArrowLeft") setIndex((index - 1 + photos.length) % photos.length);
          }}
        >
          {/* La marge de droite laisse sa place au bouton de fermeture de la fenetre. */}
          <p className="tk-label mb-4 flex items-baseline gap-3 pr-12 text-ink">
            <span className="truncate text-[1.0625rem]">{name}</span>
            <span className="shrink-0 text-[0.875rem] text-ink-3" aria-live="polite">
              {index + 1} / {photos.length}
            </span>
          </p>
          <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-sunken">
            {lightbox && (
              <Media
                key={photos[index]}
                src={photos[index]}
                alt={`${name}, photo ${index + 1}`}
                sizes="(max-width: 1100px) 94vw, 1000px"
                icon={icon}
                className="size-full motion-safe:animate-[tk-appear_0.3s_var(--ease-out-soft)_backwards]"
              />
            )}
          </div>
          {photos.length > 1 && (
            <div ref={stripRef} className="relative mt-3 flex gap-2 overflow-x-auto p-1 tk-no-scrollbar" role="group" aria-label="Toutes les photos">
              {photos.map((src, photoIndex) => (
                <button
                  key={src ?? "vide"}
                  type="button"
                  data-thumb={photoIndex}
                  onClick={() => setIndex(photoIndex)}
                  aria-label={`Afficher la photo ${photoIndex + 1}`}
                  aria-current={photoIndex === index}
                  className={`relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-media bg-sunken outline-offset-2 transition-opacity duration-200 sm:w-28 ${
                    photoIndex === index ? "outline-2 outline-brand" : "opacity-55 hover:opacity-100"
                  }`}
                >
                  {lightbox && <Media src={src} alt="" sizes="112px" icon={icon} className="size-full" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </div>
    </ViewTransition>
  );
}
