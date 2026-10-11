"use client";

import { Check, Share2 } from "@/components/icons";
import { useEffect, useState } from "react";
import { GetApp } from "@/components/shell/GetApp";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/tracking";

/** Vue d'une fiche : comptee apres 10 secondes de consultation, comme dans l'app. */
export function ViewTracker({ item, surface }) {
  useEffect(() => {
    const startedAt = Date.now();
    const timer = setTimeout(() => track("VIEW", item, { surface, durationMs: Date.now() - startedAt }), 10_000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, surface]);

  return null;
}

export function ShareButton({ item, surface, className = "" }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: item.name, url: window.location.href };
    track("SHARE", item, { surface });

    if (navigator.share) {
      await navigator.share(data).catch(() => {});

      return;
    }
    await navigator.clipboard?.writeText(data.url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <Button variant="outline" onClick={share} className={className}>
      {copied ? <Check className="size-[1.125rem] text-ok" aria-hidden /> : <Share2 className="size-[1.125rem]" aria-hidden />}
      <span aria-live="polite">{copied ? "Lien copié" : "Partager"}</span>
    </Button>
  );
}

/**
 * Barre fixe en bas d'ecran sur telephone : le prix et l'action restent a portee de pouce.
 * La marge de droite reserve l'emplacement de la bulle du widget de chat, qui flotte au meme endroit.
 */
export function StickyCta({ label, price, target, action }) {
  return (
    <div data-sticky-cta className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pr-[4.75rem] pl-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 leading-tight">
          <span className="block truncate text-[0.75rem] text-ink-2">{label}</span>
          <span className="tk-title block truncate text-lg text-ink">{price}</span>
        </p>
        <GetApp target={target} className="shrink-0">
          {action}
        </GetApp>
      </div>
    </div>
  );
}
