"use client";

import { setConsent, useConsent } from "@/lib/tracking";

/** Lien du pied de page : revenir sur son choix a tout moment. */
export function ConsentToggle() {
  const consent = useConsent();
  if (consent === undefined) return null;

  const granted = consent === "granted";

  return (
    <button
      type="button"
      onClick={() => setConsent(granted ? "denied" : "granted")}
      className="text-left underline-offset-4 hover:text-ink hover:underline"
    >
      {granted ? "Désactiver les suggestions personnalisées" : "Activer les suggestions personnalisées"}
    </button>
  );
}
