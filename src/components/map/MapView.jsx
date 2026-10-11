"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "@/components/icons";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { eventCategoryIcon, placeTypeIcon } from "@/lib/icons";

// Fonds de carte OpenFreeMap (donnees OpenStreetMap) : sans cle ni quota, un style par theme.
const STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
};

const BENIN_SOUTH = { center: [2.42, 6.42], zoom: 9.2 };

// Rayon (en pixels) sous lequel deux marqueurs fusionnent, et zoom a partir duquel plus rien n'est regroupe.
const CLUSTER_RADIUS = 52;
const CLUSTER_MAX_ZOOM = 14;
const REVEAL_ZOOM = CLUSTER_MAX_ZOOM + 1;

const currentTheme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const markerIcon = (item) => {
  if (item.kind === "event") return eventCategoryIcon(item.category?.title);
  if (item.kind === "place") return placeTypeIcon(item.types[0]?.icon);

  return MapPin;
};

/**
 * Carte des lieux et evenements. La bibliotheque (lourde) n'est chargee qu'au montage, donc seulement
 * quand une carte est reellement affichee.
 */
export function MapView({ items, selectedId, onSelect, userPosition, padding, embedded = false, className = "" }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const clusterRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const [markers, setMarkers] = useState([]);
  const [status, setStatus] = useState("loading");
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const paddingRef = useRef(padding);
  paddingRef.current = padding;

  useEffect(() => {
    let cancelled = false;
    let map = null;
    let themeObserver = null;

    Promise.all([import("maplibre-gl"), import("supercluster")])
      .then(([lib, { default: Supercluster }]) => {
        if (cancelled) return;
        lib.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");
        libRef.current = lib;
        clusterRef.current = Supercluster;

        map = new lib.Map({
          container: containerRef.current,
          style: STYLES[currentTheme()],
          ...BENIN_SOUTH,
          attributionControl: { compact: true },
          // Carte inseree dans une page : la molette et le doigt font defiler la page, pas la carte.
          cooperativeGestures: embedded,
          locale: {
            "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + molette pour zoomer sur la carte",
            "CooperativeGesturesHandler.MacHelpText": "⌘ + molette pour zoomer sur la carte",
            "CooperativeGesturesHandler.MobileHelpText": "Deux doigts pour déplacer la carte",
          },
          dragRotate: false,
          pitchWithRotate: false,
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(new lib.NavigationControl({ showCompass: false }), "top-right");
        map.on("load", () => !cancelled && setStatus("ready"));
        map.on("error", () => !cancelled && setStatus((value) => (value === "loading" ? "error" : value)));
        mapRef.current = map;

        themeObserver = new MutationObserver(() => map.setStyle(STYLES[currentTheme()]));
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      themeObserver?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
  }, [embedded]);

  // Marqueurs : un element HTML par objet (React y dessine l'icone du type), regroupes en grappes quand ils
  // se chevauchent. Les grappes sont recalculees a chaque palier de zoom : dezoomer agrege, zoomer revele.
  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    const Supercluster = clusterRef.current;
    if (status !== "ready" || !map || !lib || !Supercluster) return;

    const located = items.filter((item) => item.position);
    const byId = new Map(located.map((item) => [item.id, item]));
    const index = new Supercluster({ radius: CLUSTER_RADIUS, maxZoom: CLUSTER_MAX_ZOOM }).load(
      located.map((item) => ({
        type: "Feature",
        properties: { itemId: item.id },
        geometry: { type: "Point", coordinates: [item.position.lng, item.position.lat] },
      }))
    );
    const live = new Map();
    let level = null;

    const leaf = (item) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "tk-marker";
      element.dataset.kind = item.kind;
      element.setAttribute("aria-label", item.name);
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelectRef.current?.(item.id);
      });

      return { id: item.id, element, Icon: markerIcon(item) };
    };

    const cluster = (feature) => {
      const count = feature.properties.point_count;
      const element = document.createElement("button");
      element.type = "button";
      element.className = "tk-cluster";
      element.dataset.size = count >= 25 ? "l" : count >= 8 ? "m" : "s";
      element.textContent = String(count);
      element.setAttribute("aria-label", `${count} résultats ici, zoomer pour les voir`);
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        map.easeTo({
          center: feature.geometry.coordinates,
          zoom: Math.min(index.getClusterExpansionZoom(feature.id), 17),
          duration: 550,
        });
      });

      return { element };
    };

    const render = () => {
      const zoom = Math.floor(map.getZoom());
      if (zoom === level) return;
      level = zoom;

      const seen = new Set();
      for (const feature of index.getClusters([-180, -85, 180, 85], zoom)) {
        const key = feature.properties.cluster ? `grappe-${feature.id}` : feature.properties.itemId;
        seen.add(key);
        if (live.has(key)) continue;

        const entry = feature.properties.cluster ? cluster(feature) : leaf(byId.get(key));
        entry.marker = new lib.Marker({ element: entry.element }).setLngLat(feature.geometry.coordinates).addTo(map);
        live.set(key, entry);
      }
      for (const [key, entry] of live) {
        if (seen.has(key)) continue;
        entry.marker.remove();
        live.delete(key);
      }
      setMarkers([...live.values()].filter((entry) => entry.Icon));
    };

    map.on("zoom", render);
    if (located.length > 0) {
      const bounds = new lib.LngLatBounds();
      located.forEach((item) => bounds.extend([item.position.lng, item.position.lat]));
      map.fitBounds(bounds, { padding: { top: 70, bottom: 70, left: 50, right: 50, ...paddingRef.current }, maxZoom: 14, duration: 700 });
    }
    render();

    return () => {
      map.off("zoom", render);
      live.forEach(({ marker }) => marker.remove());
    };
  }, [items, status]);

  useEffect(() => {
    markers.forEach(({ id, element }) => {
      element.dataset.selected = String(id === selectedId);
    });
  }, [selectedId, markers]);

  // Selection : la carte glisse jusqu'a l'objet et zoome assez pour le sortir de sa grappe.
  useEffect(() => {
    const map = mapRef.current;
    const selected = itemsRef.current.find((item) => item.id === selectedId);
    if (status !== "ready" || !map || !selected?.position) return;

    map.easeTo({
      center: [selected.position.lng, selected.position.lat],
      zoom: Math.max(map.getZoom(), REVEAL_ZOOM),
      padding: { top: 0, bottom: 0, left: 0, right: 0, ...paddingRef.current },
      duration: 650,
    });
  }, [selectedId, status]);

  useEffect(() => {
    const map = mapRef.current;
    const lib = libRef.current;
    if (status !== "ready" || !map || !lib || !userPosition) return;

    const element = document.createElement("div");
    element.className = "size-4 rounded-full border-2 border-white bg-[#008df5] shadow-[0_0_0_6px_rgb(0_141_245/0.25)]";
    element.setAttribute("aria-label", "Votre position");
    const marker = new lib.Marker({ element }).setLngLat([userPosition.lng, userPosition.lat]).addTo(map);
    map.easeTo({ center: [userPosition.lng, userPosition.lat], zoom: 13, duration: 800 });

    return () => marker.remove();
  }, [userPosition, status]);

  return (
    <div className={`tk-map relative isolate overflow-hidden bg-sunken ${className}`} data-has-selection={Boolean(selectedId)}>
      {/* La feuille de style de MapLibre impose `position: relative` au conteneur : on le dimensionne, sans le positionner. */}
      <div ref={containerRef} className="size-full" />
      {status === "loading" && <div className="tk-skeleton absolute inset-0 rounded-none" aria-hidden />}
      {status === "error" && (
        <p className="absolute inset-0 grid place-items-center p-6 text-center text-[0.9375rem] text-ink-2">
          La carte ne charge pas. Vérifiez votre connexion, la liste reste disponible.
        </p>
      )}
      {markers.map(({ id, element, Icon }) => createPortal(<Icon className="size-[45%]" strokeWidth={2.2} aria-hidden />, element, id))}
    </div>
  );
}
