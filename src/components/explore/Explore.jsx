import { Map, SearchX } from "@/components/icons";
import Link from "next/link";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

/** Adresse de la page avec un parametre ajoute, remplace ou retire : chaque filtre est un lien partageable. */
export function hrefWith(basePath, params, changes) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...params, ...changes })) {
    if (typeof value === "string" && value !== "") search.set(key, value);
  }
  const query = search.toString();

  return query ? `${basePath}?${query}` : basePath;
}

function FilterRow({ label, basePath, params, param, options, allLabel }) {
  if (options.length === 0) return null;
  const current = params[param] ?? "";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="tk-label hidden w-16 shrink-0 text-[0.8125rem] text-ink-3 sm:block">{label}</span>
      <div className="relative -mx-[clamp(1rem,4vw,2.5rem)] flex gap-2 overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] tk-no-scrollbar sm:mx-0 sm:px-0" role="group" aria-label={label}>
        {allLabel && (
          <Chip href={hrefWith(basePath, params, { [param]: "" })} active={current === ""}>
            {allLabel}
          </Chip>
        )}
        {options.map(({ value, label: optionLabel, icon, count }) => (
          <Chip
            key={value}
            href={hrefWith(basePath, params, { [param]: current === value && allLabel ? "" : value })}
            active={current === value}
            icon={icon}
            count={count}
          >
            {optionLabel}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/**
 * Page de liste (lieux, evenements, restaurants) : titre, filtres en liens, grille de cartes.
 * Tout est rendu cote serveur a partir des parametres de l'URL.
 */
export function Explore({ title, intro, basePath, params, filters, items, tracking, mapHref, emptyHint }) {
  const active = filters.some(({ param, allLabel }) => allLabel && params[param]);

  return (
    <div className="tk-shell flex flex-col gap-8 pt-8 pb-8 lg:pt-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="tk-display text-[clamp(2.5rem,6vw,4.5rem)]">{title}</h1>
          <p className="mt-3 max-w-[58ch] text-[1.0625rem] text-ink-2">{intro}</p>
        </div>
        {mapHref && (
          <Button href={mapHref} variant="outline" className="shrink-0 self-start md:self-auto">
            <Map className="size-[1.125rem]" aria-hidden />
            Voir sur la carte
          </Button>
        )}
      </header>

      <div className="flex flex-col gap-3 border-y border-line py-4">
        {filters.map((filter) => (
          <FilterRow key={filter.param} basePath={basePath} params={params} {...filter} />
        ))}
      </div>

      <p className="tk-label -mb-3 text-[0.875rem] text-ink-2" aria-live="polite">
        {items.length} résultat{items.length > 1 ? "s" : ""}
        {active && (
          <Link href={basePath} scroll={false} className="ml-3 text-brand underline underline-offset-4">
            Effacer les filtres
          </Link>
        )}
      </p>

      {items.length > 0 ? (
        <div role="list" className="grid grid-cols-1 gap-x-3.5 gap-y-6 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <CatalogCard
              key={`${item.kind}-${item.id}`}
              item={item}
              tracking={tracking}
              priority={index < 4}
              sizes="(max-width: 416px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 310px"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-panel border border-line bg-surface p-8">
          <SearchX className="size-9 text-ink-3" aria-hidden />
          <div>
            <h2 className="tk-title text-xl">Aucun résultat avec ces filtres</h2>
            <p className="mt-1.5 text-ink-2">{emptyHint ?? "Retirez un filtre pour élargir la recherche."}</p>
          </div>
          <Button href={basePath} variant="soft">
            Tout afficher
          </Button>
        </div>
      )}
    </div>
  );
}
