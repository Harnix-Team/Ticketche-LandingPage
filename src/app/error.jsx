"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }) {
  return (
    <div className="tk-shell flex min-h-[60dvh] flex-col items-start justify-center gap-5 py-16">
      <h1 className="tk-display text-[clamp(2.25rem,6vw,4rem)]">Le service ne répond pas</h1>
      <p className="max-w-[52ch] text-ink-2">
        Les informations n’ont pas pu être chargées. Vérifiez votre connexion, puis réessayez dans un instant.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Button onClick={() => reset()}>Réessayer</Button>
        <Button href="/" variant="outline">Accueil</Button>
      </div>
    </div>
  );
}
