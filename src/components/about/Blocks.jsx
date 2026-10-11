const TONES = {
  brand: "bg-brand-soft text-brand",
  clay: "bg-clay-soft text-clay",
};

/** Section en deux colonnes : titre et introduction à gauche, contenu à droite. */
export function Split({ id, title, intro, action, children }) {
  return (
    <section className="tk-shell grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby={id}>
      <div className="flex flex-col items-start gap-4">
        <h2 id={id} className="tk-display text-[clamp(2rem,4vw,3.25rem)]">
          {title}
        </h2>
        {intro && <p className="max-w-[44ch] text-ink-2">{intro}</p>}
        {action}
      </div>
      {children}
    </section>
  );
}

export function IconList({ items, tone = "brand" }) {
  return (
    <ul className="grid content-start gap-x-8 gap-y-6 sm:grid-cols-2">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3.5">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${TONES[tone]}`}>
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="tk-label text-ink">{title}</h3>
            <p className="mt-1 text-[0.9375rem] text-ink-2">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
