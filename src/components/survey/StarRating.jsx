"use client";

import { Star } from "@/components/icons";
import { useId, useState } from "react";

const NOTES = [1, 2, 3, 4, 5];

/** Couleur de la note d'une livraison : rouge jusqu'à 2, jaune à 3, teal au-delà. */
export function deliveryTone(rating) {
  if (rating <= 2) return "text-danger";
  if (rating === 3) return "text-star";
  return "text-brand";
}

export function StarRating({ legend, value, onChange, disabled = false, tone, legendClassName = "sr-only" }) {
  const name = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const color = tone ? tone(shown) : "text-brand";

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className={legendClassName}>{legend}</legend>
      <div className="flex justify-center gap-0.5" onMouseLeave={() => setHover(0)}>
        {NOTES.map((note) => (
          <label
            key={note}
            onMouseEnter={() => !disabled && setHover(note)}
            className="grid size-11 cursor-pointer place-items-center rounded-full transition-transform duration-150 active:scale-95 has-[:disabled]:cursor-default has-[:disabled]:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
          >
            <input
              type="radio"
              name={name}
              value={note}
              checked={value === note}
              onChange={() => onChange(note)}
              className="sr-only"
            />
            <Star
              className={`size-8 transition-colors duration-150 ${note <= shown ? `fill-current ${color}` : "text-line-strong"}`}
              aria-hidden
            />
            <span className="sr-only">{note} sur 5</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
