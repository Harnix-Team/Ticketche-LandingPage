"use client";

import { Sparkles } from "@/components/icons";
import { useEffect, useState } from "react";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { Button } from "@/components/ui/Button";
import { Rail } from "@/components/ui/Rail";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { hydrateReco, indexCatalog } from "@/lib/reco";
import { fetchPersonalFeed, setConsent, useConsent } from "@/lib/tracking";

const TRACKING = { surface: "HOME" };

/**
 * Rubrique « Pour vous ».
 *
 * Sans accord du visiteur : une invitation a activer les suggestions. Avec son accord : le fil personnel
 * renvoye par le moteur (profil construit sur ses consultations), et en attendant le classement general.
 */
export function ForYou({ pool }) {
  const consent = useConsent();
  const [personal, setPersonal] = useState(null);

  useEffect(() => {
    if (consent !== "granted") return;
    let cancelled = false;

    (async () => {
      const feed = await fetchPersonalFeed();
      if (!feed || cancelled) return;

      // Le fil personnel peut sortir du classement general deja charge : on demande les cartes manquantes.
      const index = indexCatalog({ places: pool });
      const missing = feed.items.map((entry) => `${entry.kind}:${entry.id}`).filter((key) => !index.has(key));
      if (missing.length > 0) {
        const response = await fetch(`/api/cards/?ids=${missing.join(",")}`).catch(() => null);
        const payload = response?.ok ? await response.json() : null;
        (payload?.items ?? []).forEach((item) => index.set(`${item.kind}:${item.id}`, item));
      }

      const items = hydrateReco(feed, index, 12);
      if (!cancelled && items.length >= 4) setPersonal(items);
    })();

    return () => {
      cancelled = true;
    };
  }, [consent, pool]);

  if (consent === "denied" || pool.length === 0) return null;

  if (consent !== "granted") {
    return (
      <section className="tk-shell" aria-labelledby="pour-vous">
        <div className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <span className="tk-sweep grid size-11 shrink-0 place-items-center rounded-xl">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div>
              <h2 id="pour-vous" className="tk-title text-[clamp(1.25rem,2.2vw,1.625rem)]">
                Des suggestions à votre goût
              </h2>
              <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] text-ink-2">
                Autorisez Ticketché à retenir, sur cet appareil, les fiches que vous consultez : vos suggestions
                s’affinent au fil de vos visites. Vous pouvez revenir sur ce choix en bas de page.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Button onClick={() => setConsent("granted")}>Personnaliser mes suggestions</Button>
            <Button variant="ghost" onClick={() => setConsent("denied")}>
              Non merci
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const items = personal ?? pool.slice(0, 12);

  return (
    <section aria-label="Pour vous">
      <SectionHeader
        title="Pour vous"
        icon={Sparkles}
        sweep
        description={
          personal
            ? "Choisi d’après ce que vous avez consulté sur cet appareil."
            : "Parcourez quelques fiches : cette sélection s’ajustera à vos goûts."
        }
      />
      <Rail label="Pour vous">
        {items.map((item) => (
          <CatalogCard key={`${item.kind}-${item.id}`} item={item} tracking={TRACKING} className="w-[min(78vw,19rem)]" />
        ))}
      </Rail>
    </section>
  );
}
