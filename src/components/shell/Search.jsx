"use client";

import { CalendarDays, Loader2, MapPin, Search as SearchIcon, SearchX, UtensilsCrossed, X } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { toEvent, toPlace, toRestaurant } from "@/lib/catalog";
import { formatShortDateTime } from "@/lib/format";
import { track } from "@/lib/tracking";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";

const SECTIONS = [
  { key: "EVENTS", label: "Événements", icon: CalendarDays, normalize: toEvent, detail: (item) => formatShortDateTime(item.start) },
  { key: "PLACES", label: "Lieux", icon: MapPin, normalize: toPlace, detail: (item) => [item.types[0]?.label, item.city].filter(Boolean).join(", ") },
  { key: "RESTAURANTS", label: "Restaurants", icon: UtensilsCrossed, normalize: toRestaurant, detail: (item) => [item.cuisine, item.city].filter(Boolean).join(", ") },
];

async function searchCatalog(term, signal) {
  const params = new URLSearchParams({ q: term, limit: "5" });
  SECTIONS.forEach(({ key }) => params.append("sections[]", key));

  const response = await fetch(`${API_URL}/search?${params}`, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error(String(response.status));
  const { data } = await response.json();

  return SECTIONS.map((section) => ({
    ...section,
    items: (data?.[section.key]?.items ?? []).map(section.normalize).filter((item) => item?.path),
  })).filter((section) => section.items.length > 0);
}

/** Recherche dans tout le catalogue (GET /search). Les resultats s'ouvrent sous le champ, des 2 caracteres. */
export function Search({ className = "", autoFocus = false, onNavigate }) {
  const [term, setTerm] = useState("");
  const [state, setState] = useState({ status: "idle", sections: [] });
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const pathname = usePathname();
  const query = term.trim();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (query.length < 2) {
      setState({ status: "idle", sections: [] });
      return;
    }

    const controller = new AbortController();
    setState((previous) => ({ ...previous, status: "loading" }));
    const timer = setTimeout(() => {
      searchCatalog(query, controller.signal)
        .then((sections) => {
          setState({ status: "done", sections });
          track("SEARCH", { kind: "search_query", id: query }, { surface: "SEARCH" });
        })
        .catch((error) => error.name !== "AbortError" && setState({ status: "error", sections: [] }));
    }, 260);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => !rootRef.current?.contains(event.target) && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const showPanel = open && query.length >= 2;

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={(event) => event.key === "Escape" && setOpen(false)}>
      <label className="flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface px-4 transition-colors focus-within:border-brand">
        {state.status === "loading" ? (
          <Loader2 className="size-[1.125rem] shrink-0 animate-spin text-brand" aria-hidden />
        ) : (
          <SearchIcon className="size-[1.125rem] shrink-0 text-ink-3" aria-hidden />
        )}
        <span className="sr-only">Rechercher un événement, un lieu ou un restaurant</span>
        <input
          type="search"
          value={term}
          autoFocus={autoFocus}
          onChange={(event) => {
            setTerm(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Un concert, un hôtel, un maquis…"
          enterKeyHint="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          className="min-w-0 grow bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-ink-3 [&::-webkit-search-cancel-button]:hidden"
        />
        {term && (
          <button type="button" onClick={() => setTerm("")} aria-label="Effacer la recherche" className="grid size-7 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-sunken hover:text-ink">
            <X className="size-4" aria-hidden />
          </button>
        )}
      </label>

      {showPanel && (
        <div
          id={listId}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(70dvh,32rem)] overflow-y-auto rounded-card border border-line bg-surface p-2 shadow-[0_18px_50px_rgb(0_0_0/0.18)] motion-safe:animate-[tk-rise_0.24s_var(--ease-out-soft)]"
        >
          {state.sections.map(({ key, label, icon: Icon, items, detail }) => (
            <section key={key} className="py-1">
              <h3 className="tk-label px-2.5 py-1.5 text-[0.75rem] text-ink-3">{label}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <Link href={item.path} onClick={onNavigate} className="flex items-center gap-3 rounded-[10px] px-2.5 py-2 hover:bg-sunken focus-visible:bg-sunken">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="tk-label block truncate text-[0.9375rem] text-ink">{item.name}</span>
                        <span className="block truncate text-[0.8125rem] text-ink-2">{detail(item)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {state.status === "done" && state.sections.length === 0 && (
            <p className="flex items-center gap-3 px-3 py-4 text-[0.9375rem] text-ink-2">
              <SearchX className="size-5 shrink-0 text-ink-3" aria-hidden />
              Aucun résultat pour « {query} ». Essayez un autre mot, ou le nom d’une ville.
            </p>
          )}
          {state.status === "error" && (
            <p className="px-3 py-4 text-[0.9375rem] text-ink-2">La recherche ne répond pas. Vérifiez votre connexion puis réessayez.</p>
          )}
          {state.status === "loading" && state.sections.length === 0 && (
            <div className="space-y-2 p-2" aria-hidden>
              {[0, 1, 2].map((row) => (
                <div key={row} className="tk-skeleton h-12" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
