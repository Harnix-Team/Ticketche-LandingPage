import { Button } from "@/components/ui/Button";

export const metadata = { title: "Page introuvable | Ticketché" };

export default function NotFound() {
  return (
    <div className="tk-shell flex min-h-[60dvh] flex-col items-start justify-center gap-5 py-16">
      <p className="tk-display text-[clamp(5rem,16vw,11rem)] text-brand">404</p>
      <h1 className="tk-title text-[clamp(1.5rem,3vw,2.25rem)]">Cette page n’existe pas, ou plus.</h1>
      <p className="max-w-[52ch] text-ink-2">
        L’événement est peut-être terminé, ou le lieu n’est plus référencé. Repartez d’une de ces listes.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Button href="/events/">Événements</Button>
        <Button href="/establishments/" variant="outline">Lieux</Button>
        <Button href="/" variant="ghost">Accueil</Button>
      </div>
    </div>
  );
}
