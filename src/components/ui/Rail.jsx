"use client";

import { ChevronLeft, ChevronRight } from "@/components/icons";
import { useCallback, useEffect, useRef, useState } from "react";

/** Rangee defilante. Les fleches n'apparaissent qu'au survol, sur un ecran a pointeur, et seulement si ca deborde. */
export function Rail({ children, label, className = "" }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft > 8,
      end: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [measure, children]);

  const scroll = (direction) => {
    const el = ref.current;
    el.scrollBy({ left: direction * el.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <div className={`group/rail relative ${className}`}>
      <div
        ref={ref}
        onScroll={measure}
        className="tk-rail"
        data-fade-start={edges.start}
        data-fade-end={edges.end}
        role="list"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      {[-1, 1].map((direction) => {
        const visible = direction < 0 ? edges.start : edges.end;
        const Icon = direction < 0 ? ChevronLeft : ChevronRight;

        return (
          <button
            key={direction}
            type="button"
            onClick={() => scroll(direction)}
            aria-label={direction < 0 ? "Faire défiler vers la gauche" : "Faire défiler vers la droite"}
            tabIndex={visible ? 0 : -1}
            className={`absolute top-[38%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-[0_6px_20px_rgb(0_0_0/0.12)] transition-opacity duration-200 hover:text-brand pointer-fine:grid ${
              direction < 0 ? "left-[max(0.75rem,calc((100%-82rem)/2+0.75rem))]" : "right-[max(0.75rem,calc((100%-82rem)/2+0.75rem))]"
            } ${visible ? "opacity-0 group-hover/rail:opacity-100 focus-visible:opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Icon className="size-5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
