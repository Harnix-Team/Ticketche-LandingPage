import { Star } from "@/components/icons";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { Rail } from "@/components/ui/Rail";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { openState, TIME_ZONE } from "@/lib/format";

export function Section({ id, title, children, className = "" }) {
  return (
    <section id={id} aria-labelledby={`${id}-titre`} className={`scroll-mt-24 border-t border-line pt-8 ${className}`}>
      <h2 id={`${id}-titre`} className="tk-title mb-4 text-[1.5rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

const hour = (value) => String(value ?? "").replace(":", " h ");

/** Horaires de la semaine, jour courant mis en avant avec son etat (comme dans l'app). */
export function WeekHours({ hours, now }) {
  const state = openState(hours, now);
  const order = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const byDay = new Map(hours.map((slot) => [slot.day, slot]));

  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {order.map((day) => {
        const slot = byDay.get(day);
        const today = state?.day === day;

        return (
          <li
            key={day}
            className={`flex items-center justify-between gap-3 rounded-[10px] border px-3.5 py-2.5 text-[0.9375rem] ${
              today ? "border-transparent bg-brand-soft" : "border-line"
            }`}
          >
            <span className={today ? "tk-label text-brand" : "text-ink-2"}>{day}</span>
            <span className="flex items-center gap-2.5">
              <span className={today ? "tk-label text-ink" : "text-ink"}>
                {slot ? (slot.open === "00:00" && slot.close === "23:59" ? "24 h sur 24" : `${hour(slot.open)} à ${hour(slot.close)}`) : "Fermé"}
              </span>
              {today && (
                <span className={`tk-label rounded-md px-2 py-0.5 text-[0.6875rem] text-white ${state.open ? "bg-ok dark:text-[#0b191b]" : "bg-danger"}`}>
                  {state.open ? "Ouvert" : "Fermé"}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const reviewDate = new Intl.DateTimeFormat("fr-FR", { timeZone: TIME_ZONE, day: "numeric", month: "long", year: "numeric" });

export function Reviews({ reviews, rating, emptyText }) {
  if (reviews.length === 0) return <p className="text-ink-2">{emptyText}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-10">
      <div>
        <p className="tk-display text-6xl text-ink">{rating?.toFixed(1).replace(".", ",")}</p>
        <p className="mt-2 flex gap-0.5" aria-hidden>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star key={value} className={`size-4 ${value <= Math.round(rating ?? 0) ? "fill-star text-star" : "text-line-strong"}`} />
          ))}
        </p>
        <p className="mt-1.5 text-[0.875rem] text-ink-2">
          {reviews.length} avis
        </p>
      </div>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {reviews.slice(0, 6).map((review) => (
          <li key={review.id} className="rounded-card border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="tk-label flex items-center gap-2.5 text-[0.9375rem] text-ink">
                <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-[0.8125rem] text-brand" aria-hidden>
                  {review.author.charAt(0)}
                </span>
                {review.author}
              </p>
              <p className="tk-label flex items-center gap-1 text-[0.8125rem] text-ink">
                <Star className="size-3.5 fill-star text-star" aria-hidden />
                {String(review.star).replace(".", ",")}
                <span className="sr-only"> sur 5</span>
              </p>
            </div>
            {review.text && <p className="mt-2.5 text-[0.9375rem] text-ink-2">{review.text}</p>}
            {review.date && <p className="mt-2 text-[0.75rem] text-ink-3">{reviewDate.format(new Date(review.date))}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** « Vous aimeriez aussi » : objets lies renvoyes par le moteur, raison affichee sous chaque carte. */
export function RelatedRail({ title = "Vous aimeriez aussi", items, seed, description }) {
  if (items.length === 0) return null;

  return (
    <section aria-label={title} className="mt-16">
      <SectionHeader title={title} description={description} />
      <Rail label={title}>
        {items.map((item) => (
          <CatalogCard
            key={`${item.kind}-${item.id}`}
            item={item}
            tracking={{ surface: "RELATED", seed: { kind: seed.kind, id: seed.id } }}
            className="w-[min(78vw,19rem)]"
          />
        ))}
      </Rail>
    </section>
  );
}
