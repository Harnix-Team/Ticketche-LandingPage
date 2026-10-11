"use client";

import { useEffect, useRef } from "react";

/** Ce dont le survol anime l'icone : le lien, le bouton ou la tuile qui la contient, pas l'icone seule. */
const TRIGGER = "a, button, summary, label, [role='button'], [data-icon-trigger]";

/**
 * Donne a une icone de lucide-animated la meme interface qu'une icone Lucide (`className`, `strokeWidth`,
 * `size`) et la fait reagir au survol ou au focus de son conteneur interactif.
 */
export function animated(Icon) {
  function AnimatedIcon({ className = "", strokeWidth, size, style, ...props }) {
    const handle = useRef(null);
    const anchor = useRef(null);

    useEffect(() => {
      const trigger = anchor.current?.closest(TRIGGER) ?? anchor.current?.parentElement;
      if (!trigger) return;

      const start = () => handle.current?.startAnimation();
      const stop = () => handle.current?.stopAnimation();
      trigger.addEventListener("pointerenter", start);
      trigger.addEventListener("pointerleave", stop);
      trigger.addEventListener("focusin", start);
      trigger.addEventListener("focusout", stop);

      return () => {
        trigger.removeEventListener("pointerenter", start);
        trigger.removeEventListener("pointerleave", stop);
        trigger.removeEventListener("focusin", start);
        trigger.removeEventListener("focusout", stop);
      };
    }, []);

    return (
      // `contents` : ce repere sert a retrouver le conteneur, il n'ajoute aucune boite a la mise en page.
      <span ref={anchor} className="contents">
        <Icon
          ref={handle}
          className={`tk-icon ${className}`}
          style={{
            ...(size && { width: size, height: size }),
            ...(strokeWidth && { "--icon-stroke": strokeWidth }),
            ...style,
          }}
          {...props}
        />
      </span>
    );
  }

  AnimatedIcon.displayName = Icon.displayName ?? "AnimatedIcon";

  return AnimatedIcon;
}
