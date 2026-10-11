import { ChevronDown } from "@/components/icons";
import { PageHeader } from "@/components/ui/PageHeader";

function Summary({ sections, className = "" }) {
  return (
    <ol className={`flex flex-col text-[0.9375rem] ${className}`}>
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex gap-2.5 rounded-media px-2.5 py-2 text-ink-2 transition-colors duration-200 hover:bg-sunken hover:text-ink focus-visible:-outline-offset-2"
          >
            <span className="tk-label w-5 shrink-0 text-ink-3" aria-hidden>
              {index + 1}
            </span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Gabarit des pages juridiques : en-tête, sommaire d'ancres et corps de texte.
 * Chaque section fournit `id`, `title` et `content` ; `prefix` ajoute « Article » devant le numéro.
 */
export function LegalPage({ title, intro, updated, lead, sections, prefix }) {
  const heading = (section, index) => `${prefix ? `${prefix} ` : ""}${index + 1}. ${section.title}`;

  return (
    <article className="pb-8">
      <PageHeader title={title} intro={intro} className="[&>h1]:break-words">
        {updated && <p className="mt-4 text-[0.875rem] text-ink-3">{updated}</p>}
      </PageHeader>

      <div className="tk-shell mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Sommaire" className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7.5rem)] lg:self-start lg:overflow-y-auto">
          <details className="group/toc rounded-card border border-line bg-surface lg:hidden">
            <summary className="tk-label flex list-none items-center justify-between gap-4 px-4 py-3.5 text-ink [&::-webkit-details-marker]:hidden">
              Sommaire
              <ChevronDown className="size-5 shrink-0 text-brand transition-transform duration-200 group-open/toc:rotate-180" aria-hidden />
            </summary>
            <Summary sections={sections} className="border-t border-line p-2" />
          </details>

          <div className="hidden lg:block">
            <p className="tk-label mb-2 px-2.5 text-[0.875rem] text-ink">Sommaire</p>
            <Summary sections={sections} />
          </div>
        </nav>

        <div className="tk-prose min-w-0">
          {lead}
          {sections.map((section, index) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id}>{heading(section, index)}</h2>
              {section.content}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Paires libellé et valeur (coordonnées, durées de conservation). */
export function Facts({ items }) {
  return (
    <dl className="mb-3.5 border-t border-line">
      {items.map(({ label, value, href }) => (
        <div key={label} className="grid gap-x-6 gap-y-0.5 border-b border-line py-3 sm:grid-cols-[13rem_minmax(0,1fr)]">
          <dt className="tk-label text-[0.875rem] text-ink-3">{label}</dt>
          <dd className="break-words text-ink">{href ? <a href={href}>{value}</a> : value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Liste d'éléments formés d'un intitulé et de sa précision. */
export function Terms({ items, ordered = false }) {
  const List = ordered ? "ol" : "ul";

  return (
    <List>
      {items.map(({ title, desc }) => (
        <li key={title}>
          <strong className="block">{title}</strong>
          {desc}
        </li>
      ))}
    </List>
  );
}

export function Note({ children }) {
  return <p className="rounded-card bg-brand-soft px-4 py-3.5 text-ink">{children}</p>;
}
