"use client";

import Image from "next/image";
import { useState } from "react";
import { itemIcon } from "@/lib/icons";
import { canOptimize } from "@/lib/images";

/** Visuel d'une carte ou d'une fiche. Sans image (ou si elle ne charge pas), un aplat de marque avec l'icone de l'objet. */
export function Media({ src, alt, sizes, priority = false, eager = false, icon, kind, className = "" }) {
  const [failed, setFailed] = useState(false);
  // Un composant serveur ne peut pas passer une icone (une fonction) : il indique le type d'objet.
  const Icon = icon ?? (kind ? itemIcon({ kind }) : null);

  if (!src || failed) {
    return (
      <div className={`tk-brand-gradient grid place-items-center text-white/70 ${className}`} role="img" aria-label={alt}>
        {Icon && <Icon className="size-1/4 max-h-16 max-w-16" strokeWidth={1.25} aria-hidden />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      // `eager` seulement quand le visuel est a coup sur affiche : un visuel masque en CSS serait telecharge pour rien.
      loading={eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      unoptimized={!canOptimize(src)}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
