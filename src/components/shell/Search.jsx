"use client";

import { Briefcase, CalendarDays, Loader2, MapPin, Search as SearchIcon, SearchX, UtensilsCrossed, X } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { fetchJobs } from "@/app/services/jobsApi";
import { SHORTCUTS, SITE_GROUPS } from "@/components/shell/site-entries";
import { toEvent, toPlace, toRestaurant } from "@/lib/catalog";
import { formatShortDateTime } from "@/lib/format";
import { canOptimize } from "@/lib/images";
import { searchEntries } from "@/lib/site-search";
import { track } from "@/lib/tracking";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";

const CATALOG = [
  { key: "EVENTS", label: "Événements", icon: CalendarDays, normalize: toEvent, detail: (item) => formatShortDateTime(item.start) },
  { key: "PLACES", label: "Lieux", icon: MapPin, normalize: toPlace, detail: (item) => [item.types[0]?.label, item.city].filter(Boolean).join(", ") },
  { key: "RESTAURANTS", label: "Restaurants", icon: UtensilsCrossed, normalize: toRestaurant, detail: (item) => [item.cuisine, item.city].filter(Boolean).join(", ") },
];

async function searchCatalog(term, signal) {
  const params = new URLSearchParams({ q: term, limit: "5" });
  CATALOG.forEach(({ key }) => params.append("sections[]", key));

  const response = await fetch(`${API_URL}/search?${params}`, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error(String(response.status));
  const { data } = await response.json();

  return CATALOG.map(({ key, label, icon, normalize, detail }) => ({
    key,
    label,
    items: (data?.[key]?.items ?? [])
      .map(normalize)
      .filter((item) => item?.path)
      .map((item) => ({ id: item.id, title: item.name, detail: detail(item), href: item.path, image: item.images?.[0], icon })),
  })).filter((group) => group.items.length > 0);
}

const toJobEntry = (job) => ({
  id: job.slug,
  title: job.job_title,
  detail: [job.department, job.location?.city].filter(Boolean).join(", "),
  href: `/recrutement/${job.slug}/`,
  icon: Briefcase,
  keywords: `emploi poste offre recrutement ${job.type ?? ""}`,
});

function Result({ item, onNavigate }) {
  const Icon = item.icon;
  const className = "flex items-center gap-3 rounded-[10px] px-2.5 py-2 hover:bg-sunken focus-visible:bg-sunken";
  const content = (
    <>
      {item.image ? (
        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sunken">
          <Image src={item.image} alt="" fill sizes="40px" unoptimized={!canOptimize(item.image)} className="object-cover" />
        </span>
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <Icon className="size-4" aria-hidden />
        </span>
      )}
      <span className="min-w-0">
        <span className="tk-label block truncate text-[0.9375rem] text-ink">{item.title}</span>
        {item.detail && <span className="block truncate text-[0.8125rem] text-ink-2">{item.detail}</span>}
      </span>
    </>
  );

  if (/^(https?:|tel:|mailto:)/.test(item.href)) {
    return (
      <a href={item.href} data-result className={className} {...(item.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} data-result onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}

/**
 * Recherche du site : le catalogue (GET /search : evenements, lieux, restaurants) et les contenus du site
 * (pages, questions frequentes, contacts, offres d'emploi), trouves sur place sans appel reseau.
 * Champ vide : des raccourcis. Fleches haut et bas pour parcourir, Entree pour ouvrir le premier resultat.
 */
export function Search({ className = "", autoFocus = false, onNavigate }) {
  const [term, setTerm] = useState("");
  const [state, setState] = useState({ status: "idle", groups: [] });
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();
  const pathname = usePathname();
  const query = term.trim();
  const searching = query.length >= 2;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searching) {
      setState({ status: "idle", groups: [] });
      return;
    }

    const controller = new AbortController();
    setState((previous) => ({ ...previous, status: "loading" }));
    const timer = setTimeout(() => {
      searchCatalog(query, controller.signal)
        .then((groups) => {
          setState({ status: "done", groups });
          track("SEARCH", { kind: "search_query", id: query }, { surface: "SEARCH" });
        })
        .catch((error) => error.name !== "AbortError" && setState({ status: "error", groups: [] }));
    }, 260);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searching]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => !rootRef.current?.contains(event.target) && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Les offres ne se chargent qu'a la premiere ouverture ; sans elles, le reste de la recherche fonctionne.
  useEffect(() => {
    if (!open || jobs.length > 0) return;
    let cancelled = false;
    fetchJobs()
      .then((list) => !cancelled && setJobs(list.map(toJobEntry)))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [open, jobs.length]);

  // Ctrl+K ou Cmd+K : le champ visible prend le focus (l'en-tete en monte un par taille d'ecran).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || !inputRef.current?.offsetParent) return;
      event.preventDefault();
      inputRef.current.focus();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const siteGroups = useMemo(() => {
    if (!searching) return [];

    return [...SITE_GROUPS, { key: "JOBS", label: "Offres d’emploi", limit: 3, entries: jobs }]
      .map(({ key, label, limit, entries }) => ({ key, label, items: searchEntries(entries, query, limit) }))
      .filter((group) => group.items.length > 0);
  }, [query, searching, jobs]);

  const groups = searching ? [...state.groups, ...siteGroups] : [{ key: "SHORTCUTS", label: "Raccourcis", items: SHORTCUTS }];

  const onKeyDown = (event) => {
    if (event.key === "Escape") return setOpen(false);
    const results = [...(rootRef.current?.querySelectorAll("[data-result]") ?? [])];
    if (results.length === 0) return;

    if (event.key === "Enter" && event.target === inputRef.current && searching) {
      event.preventDefault();
      results[0].click();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = results.indexOf(document.activeElement) + (event.key === "ArrowDown" ? 1 : -1);
      (results[next] ?? inputRef.current).focus();
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <label className="flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface px-4 transition-colors focus-within:border-brand">
        {state.status === "loading" ? (
          <Loader2 className="size-[1.125rem] shrink-0 animate-spin text-brand" aria-hidden />
        ) : (
          <SearchIcon className="size-[1.125rem] shrink-0 text-ink-3" aria-hidden />
        )}
        <span className="sr-only">Rechercher un événement, un lieu, un restaurant ou une information sur Ticketché</span>
        <input
          ref={inputRef}
          type="search"
          value={term}
          autoFocus={autoFocus}
          onChange={(event) => {
            setTerm(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Un concert, un hôtel, une question…"
          enterKeyHint="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          className="min-w-0 grow bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
        />
        {term && (
          <button type="button" onClick={() => setTerm("")} aria-label="Effacer la recherche" className="grid size-7 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-sunken hover:text-ink">
            <X className="size-4" aria-hidden />
          </button>
        )}
      </label>

      {open && (
        <div
          id={listId}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(70dvh,34rem)] overflow-y-auto rounded-card border border-line bg-surface p-2 shadow-[0_18px_50px_rgb(0_0_0/0.18)] motion-safe:animate-[tk-rise_0.24s_var(--ease-out-soft)]"
        >
          {groups.map(({ key, label, items }) => (
            <section key={key} className="py-1">
              <h3 className="tk-label px-2.5 py-1.5 text-[0.75rem] text-ink-3">{label}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <Result item={item} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {state.status === "loading" && state.groups.length === 0 && (
            <div className="space-y-2 p-2" aria-hidden>
              {[0, 1, 2].map((row) => (
                <div key={row} className="tk-skeleton h-12" />
              ))}
            </div>
          )}
          {state.status === "done" && groups.length === 0 && (
            <p className="flex items-center gap-3 px-3 py-4 text-[0.9375rem] text-ink-2">
              <SearchX className="size-5 shrink-0 text-ink-3" aria-hidden />
              Aucun résultat pour « {query} ». Essayez un autre mot, ou le nom d’une ville.
            </p>
          )}
          {state.status === "error" && (
            <p className="px-3 py-4 text-[0.9375rem] text-ink-2">
              {groups.length > 0 ? "Le catalogue ne répond pas : seuls les contenus du site sont affichés." : "La recherche ne répond pas. Vérifiez votre connexion puis réessayez."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
