"use client";

import { useEffect, useRef, useState } from "react";

/** Ne monte son contenu qu'a l'approche de l'ecran : evite de charger la carte tant qu'on ne descend pas jusqu'a elle. */
export function LazyMount({ children, className = "", rootMargin = "400px" }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {mounted ? children : <div className="tk-skeleton size-full rounded-none" aria-hidden />}
    </div>
  );
}
