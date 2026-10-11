"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1400;
const format = (value) => Math.round(value).toLocaleString("fr-FR");
const easeOut = (progress) => 1 - (1 - progress) ** 4;

/**
 * Nombre qui se compte de zero a sa valeur quand il entre a l'ecran, une seule fois.
 * Le serveur rend la valeur finale : sans JavaScript, ou avec les animations reduites, elle s'affiche telle quelle.
 */
export function CountUp({ value, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = null;
    setShown(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / DURATION);
          setShown(value * easeOut(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      setShown(value);
    };
  }, [value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {/* Lecteurs d'ecran : la valeur finale, pas le defilement des chiffres. */}
      <span className="sr-only">{`${prefix}${format(value)}${suffix}`}</span>
      <span aria-hidden>{`${prefix}${format(shown)}${suffix}`}</span>
    </span>
  );
}
