"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/tracking";

/**
 * Impression d'une carte : visible a moitie pendant une seconde, comptee une seule fois (meme regle que l'app).
 * Retourne la ref a poser sur la carte et le gestionnaire de clic.
 */
export function useCardTracking(item, context) {
  const ref = useRef(null);
  const surface = context?.surface;
  const seedKind = context?.seed?.kind;
  const seedId = context?.seed?.id;

  useEffect(() => {
    const el = ref.current;
    if (!el || !surface) return;

    const tracking = { surface, ...(seedId && { seed: { kind: seedKind, id: seedId } }) };
    let timer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer ??= setTimeout(() => {
            track("IMPRESSION", item, tracking);
            observer.disconnect();
          }, 1000);
        } else {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
    // L'identite de la carte suffit : `item` est recree a chaque rendu serveur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, surface, seedKind, seedId]);

  const onClick = () => {
    if (surface) track("CLICK", item, { surface, ...(seedId && { seed: { kind: seedKind, id: seedId } }) });
  };

  return { ref, onClick };
}
