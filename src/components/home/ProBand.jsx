import { CalendarPlus, House } from "@/components/icons";
import { GetApp } from "@/components/shell/GetApp";
import { HoverPhoto, ON_PHOTO, ON_PHOTO_SOFT, ON_PHOTO_TILE, photoGroup } from "@/components/ui/HoverPhoto";

const OFFERS = [
  {
    key: "event",
    icon: CalendarPlus,
    title: "Vous organisez un événement",
    text: "Vendez vos billets en ligne, suivez les ventes et contrôlez les entrées par QR code, depuis votre téléphone.",
    action: "Créer un événement",
  },
  {
    key: "place",
    icon: House,
    title: "Vous gérez un lieu",
    text: "Hôtel, parking, salle, lavage, lieu culturel : publiez vos services et vos tarifs, encaissez sans carnet.",
    action: "Ajouter un lieu",
  },
];

export function ProBand({ images = {} }) {
  return (
    <section className="tk-shell grid gap-3 md:grid-cols-2" aria-label="Pour les organisateurs et les gérants">
      {OFFERS.map(({ key, icon: Icon, title, text, action }) => {
        const image = images[key];

        return (
          <article
            key={key}
            data-icon-trigger
            className={`flex flex-col items-start gap-4 rounded-panel border border-line bg-surface p-6 sm:p-8 ${photoGroup(image)}`}
          >
            {/* La photo d'un evenement ou d'un lieu deja publie. */}
            <HoverPhoto src={image} kind={key} sizes="(max-width: 768px) 100vw, 640px" />
            <span className={`grid size-12 place-items-center rounded-xl bg-clay-soft text-clay ${ON_PHOTO_TILE}`}>
              <Icon className="size-6" aria-hidden />
            </span>
            <div>
              <h2 className={`tk-title text-[clamp(1.25rem,2.2vw,1.625rem)] ${ON_PHOTO}`}>{title}</h2>
              <p className={`mt-2 max-w-[48ch] text-[0.9375rem] text-ink-2 ${ON_PHOTO_SOFT}`}>{text}</p>
            </div>
            <GetApp
              variant="outline"
              reason="La création se fait dans l’application, en quelques minutes."
              className="group-hover/photo:border-white/60 group-hover/photo:text-white group-hover/photo:hover:border-white group-hover/photo:hover:bg-white/15 group-hover/photo:hover:text-white group-focus-within/photo:border-white/60 group-focus-within/photo:text-white"
            >
              {action}
            </GetApp>
          </article>
        );
      })}
    </section>
  );
}
