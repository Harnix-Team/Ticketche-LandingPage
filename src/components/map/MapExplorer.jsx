"use client";

import { CalendarDays, Layers, Loader2, LocateFixed, MapPin } from "@/components/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapView } from "@/components/map/MapView";
import { SpotCard } from "@/components/map/SpotCard";
import { Chip } from "@/components/ui/Chip";
import { distanceKm } from "@/lib/format";
import { placeTypeIcon } from "@/lib/icons";
import { fetchNearbyRanking } from "@/lib/tracking";

const MODES = [
  { key: "all", label: "Tout", icon: Layers },
  { key: "place", label: "Lieux", icon: MapPin },
  { key: "event", label: "Événements", icon: CalendarDays },
];

/**
 * Carte et carrousel de fiches, synchronises dans les deux sens, comme l'ecran Carte de l'app :
 * toucher un marqueur amene sa fiche, faire defiler les fiches deplace la carte.
 */
export function MapExplorer({ items, placeTypes, initialType = null, compact = false, className = "" }) {
  const [mode, setMode] = useState(initialType ? "place" : "all");
  const [types, setTypes] = useState(() => new Set(initialType ? [initialType] : []));
  const [selectedId, setSelectedId] = useState(null);
  const [location, setLocation] = useState({ status: "idle", position: null });
  const [nearbyRank, setNearbyRank] = useState(null);
  const railRef = useRef(null);
  const programmatic = useRef(false);

  const visible = useMemo(() => {
    const filtered = items.filter((item) => {
      if (mode !== "all" && item.kind !== mode) return false;
      if (item.kind === "place" && types.size > 0) return item.types.some((type) => types.has(type.type));

      return types.size === 0 || item.kind === "place";
    });
    if (!location.position) return filtered;

    // Autour de moi : d'abord l'ordre « Près de vous » du moteur de recommandation, puis le reste par distance.
    const rank = (item) => nearbyRank?.get(item.id) ?? Infinity;

    return filtered
      .map((item) => ({ ...item, distance: item.position ? distanceKm(location.position, item.position) : null }))
      .sort((a, b) => rank(a) - rank(b) || (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }, [items, mode, types, location.position, nearbyRank]);

  const availableTypes = useMemo(() => {
    const present = new Set(items.flatMap((item) => (item.kind === "place" ? item.types.map((type) => type.type) : [])));

    return placeTypes.filter((type) => present.has(type.type));
  }, [items, placeTypes]);

  useEffect(() => {
    if (selectedId && !visible.some((item) => item.id === selectedId)) setSelectedId(null);
  }, [visible, selectedId]);

  const scrollToCard = useCallback((id) => {
    const card = railRef.current?.querySelector(`[data-spot="${id}"]`);
    if (!card) return;
    programmatic.current = true;
    card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setTimeout(() => {
      programmatic.current = false;
    }, 700);
  }, []);

  const select = useCallback(
    (id) => {
      setSelectedId(id);
      scrollToCard(id);
    },
    [scrollToCard]
  );

  // Defilement manuel du carrousel : la fiche la plus proche du centre devient la selection.
  const onRailScroll = useRef(null);
  const handleScroll = () => {
    if (programmatic.current) return;
    clearTimeout(onRailScroll.current);
    onRailScroll.current = setTimeout(() => {
      const rail = railRef.current;
      if (!rail) return;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      let closest = null;
      let best = Infinity;
      rail.querySelectorAll("[data-spot]").forEach((card) => {
        const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (gap < best) {
          best = gap;
          closest = card.dataset.spot;
        }
      });
      if (closest) setSelectedId(closest);
    }, 140);
  };

  const locate = () => {
    if (!("geolocation" in navigator)) return setLocation({ status: "denied", position: null });
    setLocation((current) => ({ ...current, status: "locating" }));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        setLocation({ status: "located", position });
        fetchNearbyRanking(position).then((ids) => ids && setNearbyRank(new Map(ids.map((id, index) => [id, index]))));
      },
      () => setLocation({ status: "denied", position: null }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  };

  const toggleType = (type) => {
    setMode("place");
    setTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);

      return next;
    });
  };

  return (
    <div className={`tk-map-with-bar relative isolate overflow-hidden ${className}`}>
      <MapView
        items={visible}
        selectedId={selectedId}
        onSelect={select}
        userPosition={location.position}
        padding={{ bottom: compact ? 190 : 210, top: 80 }}
        embedded={compact}
        className="size-full"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex gap-2 overflow-x-auto p-3 tk-no-scrollbar [&>*]:pointer-events-auto [&>*]:shadow-[0_2px_10px_rgb(0_0_0/0.12)]">
        <button
          type="button"
          onClick={locate}
          disabled={location.status === "locating"}
          className="tk-label inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand-fill px-3.5 text-[0.8125rem] text-white"
        >
          {location.status === "locating" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <LocateFixed className="size-3.5" aria-hidden />
          )}
          {location.status === "located" ? "Triés par distance" : "Autour de moi"}
        </button>
        {MODES.map(({ key, label, icon }) => (
          <Chip
            key={key}
            icon={icon}
            active={mode === key && types.size === 0}
            onClick={() => {
              setMode(key);
              setTypes(new Set());
            }}
          >
            {label}
          </Chip>
        ))}
        {availableTypes.map((type) => (
          <Chip key={type.type} icon={placeTypeIcon(type.icon)} active={types.has(type.type)} onClick={() => toggleType(type.type)}>
            {type.label}
          </Chip>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 [&>*]:pointer-events-auto">
        <p aria-live="polite" className="tk-label mx-3 mb-2 inline-flex h-7 items-center rounded-full bg-surface px-3 text-[0.75rem] text-ink-2 shadow-[0_2px_10px_rgb(0_0_0/0.12)]">
          {location.status === "denied"
            ? "Position indisponible : autorisez la localisation pour trier par distance."
            : `${visible.length} résultat${visible.length > 1 ? "s" : ""}`}
        </p>
        <div ref={railRef} onScroll={handleScroll} className="relative flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pt-1 pb-5 tk-no-scrollbar [&>*]:snap-center">
          {visible.map((item) => (
            <SpotCard key={`${item.kind}-${item.id}`} item={item} selected={item.id === selectedId} onSelect={select} />
          ))}
          {visible.length === 0 && (
            <p className="w-full rounded-card border border-line bg-surface p-5 text-[0.9375rem] text-ink-2">
              Aucun résultat avec ces filtres. Retirez un type pour élargir la recherche.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
