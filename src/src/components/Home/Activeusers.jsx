"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, MapTrifold, Buildings, Star, MagnifyingGlass, Ticket, CalendarBlank } from "@phosphor-icons/react";
import { fetchAllPlaces } from "@/app/services/api";

const API_BASE_URL = "https://api.ticketche.com/api/v2";

/* ─── Star Clusters ─────────────────────────────── */
const CLUSTERS = [
  { cx: "3%", cy: "10%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.50, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 9, opacity: 0.30, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "92%", cy: "8%", stars: [{ x: 0, y: 0, size: 14, opacity: 0.45, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -13, y: 12, size: 9, opacity: 0.30, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%", cy: "50%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "95%", cy: "45%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.40, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
  { cx: "5%", cy: "82%", stars: [{ x: 0, y: 0, size: 9, opacity: 0.30, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }] },
  { cx: "88%", cy: "78%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }] },
  { cx: "48%", cy: "3%", stars: [{ x: 0, y: 0, size: 8, opacity: 0.28, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `auStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
};

const getEventImage = (e) => e.images?.length > 0 ? e.images[0].url : null;
const getPlaceImage = (p) => p.images?.length > 0 ? p.images[0].link : null;

export default function ActiveUsers() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const clusterRef = useRef(null);
  const markersRef = useRef({});
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then(r => r.json())
      .then(({ success, data }) => {
        if (success) setEvents((data ?? []).filter(e => e.latitude && e.longitude));
      })
      .catch(console.error);

    fetchAllPlaces()
      .then(res => {
        if (res.success) setPlaces((res.data ?? []).filter(
          p => p.latitude && p.longitude //&& p.status === "VALIDATED"
        ));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const l = document.createElement("link");
      l.id = "leaflet-css"; l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(l);
    }
    if (!document.getElementById("cluster-css")) {
      const c1 = document.createElement("link");
      c1.id = "cluster-css"; c1.rel = "stylesheet";
      c1.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
      document.head.appendChild(c1);
      const c2 = document.createElement("link");
      c2.rel = "stylesheet";
      c2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
      document.head.appendChild(c2);
    }

    const load = () => new Promise(res => {
      if (window.L && window.L.markerClusterGroup) return res(window.L);
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
        s2.onload = () => res(window.L);
        document.head.appendChild(s2);
      };
      document.head.appendChild(s);
    });

    load().then(L => {
      const map = L.map(mapRef.current, {
        center: [9.3, 2.3], zoom: 6,
        zoomControl: false, attributionControl: false,
        minZoom: 2, maxZoom: 16,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: "© CartoDB · OSM" }).addTo(map);
      map.on("click", e => {
        if (!e.originalEvent.target.closest?.(".tc-marker")) {
          setActive(null);
          Object.values(markersRef.current).forEach(m => m?.el?.classList.remove("tc-marker--active"));
        }
      });
      mapInst.current = map;
      setLoaded(true);
    });

    return () => { mapInst.current?.remove(); mapInst.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInst.current || !loaded) return;
    const L = window.L;
    if (!L) return;

    if (clusterRef.current) mapInst.current.removeLayer(clusterRef.current);
    markersRef.current = {};

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="width:36px;height:36px;border-radius:50%;background:#005f69;color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;box-shadow:0 4px 16px rgba(0,95,105,0.4)">${count}</div>`,
          className: "",
          iconSize: [36, 36],
        });
      },
    });
    clusterRef.current = clusterGroup;

    const addMarker = (item, type) => {
      const isEvent = type === "event";
      const color = isEvent ? "#04797e" : "#692C00";
      const label = isEvent ? item.title : item.name;
      const sublabel = isEvent ? (item.location_name ?? formatDate(item.start_date) ?? "") : (item.city ?? "");
      const id = `${type}-${item.id}`;

      const iconHtml = `
        <div class="tc-marker" data-id="${id}" style="--mc:${color};">
          <div class="tc-card">
            <div class="tc-pulse-ring"></div>
            <div class="tc-type-badge" style="background:${color}">
              ${isEvent
          ? `<svg width="10" height="10" viewBox="0 0 256 256" fill="white"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"/></svg>`
          : `<svg width="10" height="10" viewBox="0 0 256 256" fill="white"><path d="M128,16a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,16Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,192Zm0-104a24,24,0,1,0,24,24A24,24,0,0,0,128,88Z"/></svg>`
        }
            </div>
            <div class="tc-info">
              <span class="tc-name">${label.length > 18 ? label.slice(0, 18) + "…" : label}</span>
              ${sublabel ? `<span class="tc-users" style="color:${color}">${sublabel.length > 20 ? sublabel.slice(0, 20) + "…" : sublabel}</span>` : ""}
            </div>
          </div>
          <div class="tc-stem"></div>
          <div class="tc-dot"></div>
        </div>`;

      const icon = L.divIcon({ html: iconHtml, className: "", iconSize: [180, 60], iconAnchor: [90, 60] });
      const lat = parseFloat(item.latitude);
      const lng = parseFloat(item.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const leafletMarker = L.marker([lat, lng], { icon, zIndexOffset: 100 });
      leafletMarker.on("click", () => {
        mapInst.current.flyTo([lat, lng], 14, { duration: 1.1, easeLinearity: 0.3 });
        setActive({ ...item, _type: type });
        setTimeout(() => {
          Object.values(markersRef.current).forEach(m => m?.el?.classList.remove("tc-marker--active"));
          markersRef.current[id]?.el?.classList.add("tc-marker--active");
        }, 50);
      });
      clusterGroup.addLayer(leafletMarker);
      setTimeout(() => {
        const el = mapRef.current?.querySelector(`[data-id="${id}"]`);
        markersRef.current[id] = { el, _leafletMarker: leafletMarker };
      }, 400);
    };

    if (filter === "all" || filter === "events") events.forEach(e => addMarker(e, "event"));
    if (filter === "all" || filter === "places") places.forEach(p => addMarker(p, "place"));
    if (clusterGroup.getLayers().length > 0) {
      const bounds = clusterGroup.getBounds().pad(0.2);
      mapInst.current.fitBounds(bounds, { maxZoom: 10 });
    }
    mapInst.current.addLayer(clusterGroup);

  }, [loaded, events, places, filter]);

  const resetView = () => {
    mapInst.current?.flyTo([9.3, 2.3], 6, { duration: 1.2 });
    setActive(null);
    Object.values(markersRef.current).forEach(m => m?.el?.classList.remove("tc-marker--active"));
  };

  const isEvent = active?._type === "event";

  const globalStats = [
    { val: `${events.length}`, label: "Événements", icon: <Ticket weight="bold" style={{ width: 24, height: 24, color: "#04797e" }} /> },
    { val: `${places.length}`, label: "Emplacements", icon: <Buildings weight="bold" style={{ width: 24, height: 24, color: "#692C00" }} /> },
    {
      val: `${new Set([
        ...events.map(e => e.location_name?.split(",")[0].trim()),
        ...places.map(p => p.city?.split(",")[0].trim()),
      ].filter(Boolean)).size}`, label: "Villes couvertes", icon: <MapTrifold weight="bold" style={{ width: 24, height: 24, color: "#005f69" }} />
    },
  ];

  return (
    <section style={{ fontFamily: "'Archivo',sans-serif", padding: "clamp(60px,8vw,100px) 0", background: "#ffffff", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes auStar0 { 0%,100% { transform: translateY(0px) rotate(0deg) scale(1); } 33% { transform: translateY(-8px) rotate(15deg) scale(1.10); } 66% { transform: translateY(-3px) rotate(-8deg) scale(0.95); } }
        @keyframes auStar1 { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-11px) rotate(20deg) scale(1.07); } }
        @keyframes auStar2 { 0%,100% { transform: translateY(0px) scale(1); } 40% { transform: translateY(-7px) rotate(-12deg) scale(1.12); } 80% { transform: translateY(-2px) rotate(6deg) scale(0.92); } }
        .tc-marker { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1); filter: drop-shadow(0 3px 10px color-mix(in srgb, var(--mc) 30%, transparent)); }
        .tc-marker:hover, .tc-marker--active { transform: translateY(-5px) scale(1.08); z-index: 999 !important; filter: drop-shadow(0 8px 20px color-mix(in srgb, var(--mc) 50%, transparent)); }
        .tc-card { position: relative; display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); backdrop-filter: blur(14px); border: 1.5px solid color-mix(in srgb, var(--mc) 35%, rgba(255,255,255,0.8)); border-radius: 12px; padding: 7px 12px 7px 7px; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,81,90,0.12), inset 0 1px 0 rgba(255,255,255,0.9); }
        .tc-marker--active .tc-card { background: #ffffff; border-color: var(--mc); box-shadow: 0 8px 32px color-mix(in srgb, var(--mc) 25%, transparent); }
        .tc-pulse-ring { position: absolute; inset: -6px; border-radius: 14px; border: 1.5px solid var(--mc); opacity: 0; animation: tcPulse 2.4s ease-out infinite; }
        .tc-type-badge { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tc-info { display: flex; flex-direction: column; gap: 1px; }
        .tc-name { font-size: 11px; font-weight: 800; color: #0a1a1c; letter-spacing: -0.01em; }
        .tc-users { font-size: 10px; font-weight: 600; }
        .tc-stem { width: 2px; height: 10px; background: linear-gradient(to bottom, var(--mc), transparent); }
        .tc-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mc); box-shadow: 0 0 0 3px color-mix(in srgb, var(--mc) 22%, transparent); animation: tcDotPulse 2s ease-in-out infinite; }
        @keyframes tcPulse { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes tcDotPulse { 0%,100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--mc) 22%, transparent); } 50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--mc) 10%, transparent); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 4px 20px rgba(0,81,90,0.15) !important; border-radius: 10px !important; overflow: hidden; }
        .leaflet-control-zoom a { background: #ffffff !important; color: #005f69 !important; border: none !important; border-bottom: 1px solid rgba(0,95,105,0.10) !important; font-weight: 700 !important; width: 34px !important; height: 34px !important; line-height: 34px !important; transition: all 0.2s !important; }
        .leaflet-control-zoom a:hover { background: #005f69 !important; color: #fff !important; }
        .leaflet-control-attribution { background: rgba(255,255,255,0.75) !important; color: rgba(0,60,70,0.45) !important; font-size: 9px !important; border-radius: 6px 0 0 0 !important; }
        .leaflet-control-attribution a { color: rgba(0,95,105,0.6) !important; }
        .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large { background: rgba(0,95,105,0.15) !important; }
        .marker-cluster-small div, .marker-cluster-medium div, .marker-cluster-large div { background: #005f69 !important; color: white !important; font-weight: 800 !important; font-family: 'Archivo', sans-serif !important; }
      `}</style>

      <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-5%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,129,143,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <StarClusters />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative", zIndex: 2 }}>

        <div style={{ textAlign: "center", marginBottom: "clamp(28px,4vw,44px)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "14px", background: "rgba(0,95,105,0.10)", color: "#005f69", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", padding: "5px 18px", borderRadius: "999px", border: "1px solid rgba(0,95,105,0.18)" }}>
            <Globe weight="bold" style={{ width: 14, height: 14 }} />
            Carte interactive
          </span>
          <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#0a1a1c", margin: "0 auto", maxWidth: "600px" }}>
            Événements & emplacements{" "}
            <span style={{ background: "linear-gradient(135deg, #005f69 0%, #00818f 50%, #00c8d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              en temps réel
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            { key: "all", label: "Tout afficher" },
            { key: "events", label: "Événements", color: "#04797e" },
            { key: "places", label: "Emplacements", color: "#692C00" },
          ].map(f => (
            <button key={f.key} onClick={() => { setFilter(f.key); setActive(null); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "8px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, border: filter === f.key ? `2px solid ${f.color ?? "#005f69"}` : "2px solid rgba(0,95,105,0.15)", background: filter === f.key ? (f.color ? `${f.color}15` : "rgba(0,95,105,0.08)") : "white", color: filter === f.key ? (f.color ?? "#005f69") : "#6b7280", cursor: "pointer", transition: "all 0.2s" }}>
              {f.key === "events" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#04797e", display: "inline-block" }} />}
              {f.key === "places" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#692C00", display: "inline-block" }} />}
              {f.label}
              <span style={{ fontSize: "11px", fontWeight: 600, opacity: 0.7 }}>
                ({f.key === "all" ? events.length + places.length : f.key === "events" ? events.length : places.length})
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: active ? "1fr 300px" : "1fr", gap: "16px", alignItems: "start", transition: "grid-template-columns 0.4s ease" }}>

          <div style={{ borderRadius: "20px", overflow: "hidden", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", boxShadow: "0 8px 40px rgba(0,81,90,0.14), 0 0 0 1px rgba(0,95,105,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: "rgba(255,255,255,0.85)", borderBottom: "1px solid rgba(0,95,105,0.10)", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  {["#692C00", "#04797e", "#005f69"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(10,26,28,0.45)", letterSpacing: "0.05em" }}>ticketché — carte interactive</span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {active && (
                  <button onClick={resetView} style={{ background: "rgba(0,95,105,0.10)", border: "1px solid rgba(0,95,105,0.22)", color: "#005f69", fontSize: "0.72rem", fontWeight: 700, padding: "4px 14px", borderRadius: "999px", cursor: "pointer" }}>
                    ← Vue globale
                  </button>
                )}
                <span style={{ fontSize: "0.7rem", color: loaded ? "#00818f" : "rgba(10,26,28,0.25)", fontWeight: 600 }}>
                  {loaded ? "● Live" : "○ Chargement..."}
                </span>
              </div>
            </div>
            <div ref={mapRef} style={{ width: "100%", height: "clamp(380px,50vw,520px)" }} />
          </div>

          {active && (
            <div style={{ borderRadius: "20px", overflow: "hidden", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,95,105,0.12)", boxShadow: "0 8px 40px rgba(0,81,90,0.12)", animation: "slideIn 0.35s cubic-bezier(.34,1.56,.64,1) both" }}>
              {(isEvent ? getEventImage(active) : getPlaceImage(active)) && (
                <div style={{ width: "100%", height: "160px", overflow: "hidden", position: "relative" }}>
                  <img src={isEvent ? getEventImage(active) : getPlaceImage(active)} alt={isEvent ? active.title : active.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: isEvent ? "#04797e" : "#692C00", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", letterSpacing: "0.06em" }}>
                    {isEvent ? "ÉVÉNEMENT" : "EMPLACEMENT"}
                  </span>
                </div>
              )}

              <div style={{ padding: "18px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 900, color: "#0a1a1c", lineHeight: 1.2 }}>
                  {isEvent ? active.title : active.name}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                  {isEvent && active.start_date && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "rgba(4,121,126,0.05)", borderRadius: "10px", border: "1px solid rgba(4,121,126,0.10)" }}>
                      <CalendarBlank weight="bold" style={{ width: 15, height: 15, color: "#04797e", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.45)", fontWeight: 600, marginBottom: 1 }}>Date</div>
                        <div style={{ fontSize: "0.80rem", fontWeight: 800, color: "#0a1a1c" }}>{formatDate(active.start_date)}</div>
                      </div>
                    </div>
                  )}
                  {(active.location_name || active.city) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "rgba(0,95,105,0.05)", borderRadius: "10px", border: "1px solid rgba(0,95,105,0.10)" }}>
                      <MagnifyingGlass weight="bold" style={{ width: 15, height: 15, color: "#005f69", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.45)", fontWeight: 600, marginBottom: 1 }}>Lieu</div>
                        <div style={{ fontSize: "0.80rem", fontWeight: 800, color: "#0a1a1c" }}>{active.location_name ?? active.city}</div>
                      </div>
                    </div>
                  )}
                  {isEvent && active.tickets?.length > 0 && (() => {
                    const prices = active.tickets.map(t => t.price).filter(p => p > 0);
                    const min = prices.length > 0 ? Math.min(...prices).toLocaleString() + " FCFA" : "Gratuit";
                    return (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "rgba(4,121,126,0.05)", borderRadius: "10px", border: "1px solid rgba(4,121,126,0.10)" }}>
                        <Ticket weight="bold" style={{ width: 15, height: 15, color: "#04797e", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.45)", fontWeight: 600, marginBottom: 1 }}>Prix à partir de</div>
                          <div style={{ fontSize: "0.80rem", fontWeight: 800, color: "#0a1a1c" }}>{min}</div>
                        </div>
                      </div>
                    );
                  })()}
                  {!isEvent && active.services?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                      {[...new Set(active.services.filter(s => s.pivot?.status === "ON").map(s => s.name))].slice(0, 4).map((name, i) => (
                        <span key={i} style={{ background: "rgba(105,44,0,0.08)", color: "#692C00", border: "1px solid rgba(105,44,0,0.15)", borderRadius: "999px", padding: "3px 10px", fontSize: "11px", fontWeight: 600 }}>{name}</span>
                      ))}
                    </div>
                  )}
                </div>

                <a href={isEvent ? `/events/${active.id}` : `/places/${active.id}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px", background: isEvent ? "linear-gradient(135deg, #04797e, #025f63)" : "linear-gradient(135deg, #692C00, #4a1f00)", color: "#fff", borderRadius: "999px", padding: "11px 20px", fontSize: "13px", fontWeight: 800, textDecoration: "none", transition: "transform 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  {isEvent ? "Voir l'événement" : "Voir l'emplacement"}
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px", marginTop: "16px" }}>
          {globalStats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 12px", background: "rgba(255,255,255,0.70)", backdropFilter: "blur(8px)", borderRadius: "14px", border: "1px solid rgba(0,95,105,0.12)", boxShadow: "0 2px 12px rgba(0,81,90,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(1.1rem,1.8vw,1.5rem)", fontWeight: 900, color: "#005f69", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.45)", fontWeight: 500, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}