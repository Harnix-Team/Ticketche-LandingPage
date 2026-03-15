"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Globe, MapTrifold, Rocket, TrendUp, CalendarBlank, Trophy, Star } from "@phosphor-icons/react";

const COUNTRIES = [
  { name: "France", code: "fr", lat: 46.23, lng: 2.21, users: "24 000", growth: "+18%", since: "2023", color: "#005f69", desc: "Hub européen principal" },
  { name: "Sénégal", code: "sn", lat: 14.50, lng: -14.45, users: "8 000", growth: "+34%", since: "2024", color: "#00818f", desc: "Expansion Afrique de l'Ouest" },
  { name: "Mali", code: "ml", lat: 17.57, lng: -1.98, users: "4 800", growth: "+22%", since: "2024", color: "#692C00", desc: "Marché émergent" },
  { name: "Côte d'Ivoire", code: "ci", lat: 6.80, lng: -5.54, users: "18 000", growth: "+41%", since: "2023", color: "#005f69", desc: "Croissance rapide" },
  { name: "Ghana", code: "gh", lat: 7.95, lng: -1.02, users: "9 500", growth: "+29%", since: "2024", color: "#00515a", desc: "Nouveau marché" },
  { name: "Bénin", code: "bj", lat: 9.30, lng: 2.35, users: "12 000", growth: "+55%", since: "2022", color: "#005f69", desc: "Marché fondateur" },
  { name: "Cameroun", code: "cm", lat: 4.86, lng: 12.35, users: "7 200", growth: "+27%", since: "2024", color: "#00818f", desc: "Afrique centrale" },
  { name: "Nigeria", code: "ng", lat: 10.00, lng: 8.00, users: "30 000", growth: "+62%", since: "2023", color: "#692C00", desc: "Plus grand marché" },
];

/* ─── Star Clusters ─────────────────────────────── */
const CLUSTERS = [
  { cx: "3%",  cy: "10%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.50, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 9, opacity: 0.30, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "92%", cy: "8%",  stars: [{ x: 0, y: 0, size: 14, opacity: 0.45, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -13, y: 12, size: 9, opacity: 0.30, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "50%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }, { x: 14, y: -8, size: 7, opacity: 0.25, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "95%", cy: "45%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.40, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }, { x: -12, y: 10, size: 7, opacity: 0.25, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "5%",  cy: "82%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.30, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }, { x: 11, y: -7, size: 6, opacity: 0.22, anim: 2, delay: "0.5s", dur: "3.6s", color: "#00515a" }] },
  { cx: "88%", cy: "78%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }, { x: -10, y: -9, size: 7, opacity: 0.22, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "48%", cy: "3%",  stars: [{ x: 0, y: 0, size: 8,  opacity: 0.28, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "95%", stars: [{ x: 0, y: 0, size: 8,  opacity: 0.25, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }] },
  { cx: "20%", cy: "6%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 2, delay: "0.2s", dur: "2.8s", color: "#00818f" }] },
  { cx: "75%", cy: "90%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
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

export default function ActiveUsers() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markersRef = useRef({});
  const [active, setActive] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const totalUsers = COUNTRIES.reduce((s, c) => s + parseInt(c.users.replace(/\s/g, "")), 0);

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const l = document.createElement("link");
      l.id = "leaflet-css"; l.rel = "stylesheet";
      l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(l);
    }

    const load = () => new Promise(res => {
      if (window.L) return res(window.L);
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = () => res(window.L);
      document.head.appendChild(s);
    });

    load().then(L => {
      const map = L.map(mapRef.current, {
        center: [15, 3], zoom: 4,
        zoomControl: false, attributionControl: false,
        minZoom: 2, maxZoom: 12,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);
      L.control.attribution({ position: "bottomleft", prefix: "© CartoDB · OSM" }).addTo(map);

      COUNTRIES.forEach(c => {
        const iconHtml = `
          <div class="tc-marker" data-code="${c.code}" style="--mc:${c.color};">
            <div class="tc-card">
              <div class="tc-pulse-ring"></div>
              <img class="tc-flag"
                src="https://flagcdn.com/w40/${c.code}.png"
                srcset="https://flagcdn.com/w80/${c.code}.png 2x"
                alt="${c.name}" />
              <div class="tc-info">
                <span class="tc-name">${c.name}</span>
                <span class="tc-users">${c.users} users</span>
              </div>
            </div>
            <div class="tc-stem"></div>
            <div class="tc-dot"></div>
          </div>`;

        const icon = L.divIcon({
          html: iconHtml, className: "",
          iconSize: [160, 60], iconAnchor: [80, 60],
        });

        L.marker([c.lat, c.lng], { icon, zIndexOffset: 100 })
          .addTo(map)
          .on("click", () => {
            map.flyTo([c.lat, c.lng], 6, { duration: 1.1, easeLinearity: 0.3 });
            setActive(c);
            setTimeout(() => {
              Object.entries(markersRef.current).forEach(([code, el]) =>
                el.classList.toggle("tc-marker--active", code === c.code)
              );
            }, 50);
          });

        setTimeout(() => {
          const el = mapRef.current?.querySelector(`[data-code="${c.code}"]`);
          if (el) markersRef.current[c.code] = el;
        }, 400);
      });

      map.on("click", e => {
        if (!e.originalEvent.target.closest?.(".tc-marker")) {
          setActive(null);
          Object.values(markersRef.current).forEach(el => el.classList.remove("tc-marker--active"));
        }
      });

      mapInst.current = map;
      setLoaded(true);
    });

    return () => { mapInst.current?.remove(); mapInst.current = null; };
  }, []);

  const resetView = () => {
    mapInst.current?.flyTo([15, 3], 4, { duration: 1.2 });
    setActive(null);
    Object.values(markersRef.current).forEach(el => el.classList.remove("tc-marker--active"));
  };

  const detailRows = active ? [
    { label: "Croissance", val: active.growth, icon: <TrendUp weight="bold" style={{ width: 15, height: 15, color: "#00818f" }} /> },
    { label: "Présent depuis", val: active.since, icon: <CalendarBlank weight="bold" style={{ width: 15, height: 15, color: "#00818f" }} /> },
    { label: "Rang", val: `#${[...COUNTRIES].sort((a, b) => parseInt(b.users.replace(/\s/g, "")) - parseInt(a.users.replace(/\s/g, ""))).findIndex(c => c.code === active.code) + 1} / ${COUNTRIES.length}`, icon: <Trophy weight="bold" style={{ width: 15, height: 15, color: "#00818f" }} /> },
  ] : [];

  const globalStats = [
    { val: `${totalUsers.toLocaleString("fr-FR")}+`, label: "Utilisateurs actifs", icon: <Users weight="bold" style={{ width: 26, height: 26, color: "#005f69" }} /> },
    { val: "8", label: "Pays couverts", icon: <Globe weight="bold" style={{ width: 26, height: 26, color: "#005f69" }} /> },
    { val: "3", label: "Continents", icon: <MapTrifold weight="bold" style={{ width: 26, height: 26, color: "#005f69" }} /> },
  ];

  return (
    <section style={{
      fontFamily: "'Archivo',sans-serif",
      padding: "clamp(60px,8vw,100px) 0",
      background: "#ffffff",
      overflow: "hidden",
      position: "relative",
    }}>

      <style>{`
        @keyframes auStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes auStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes auStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        .tc-marker {
          display: flex; flex-direction: column; align-items: center;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
          filter: drop-shadow(0 3px 10px color-mix(in srgb, var(--mc) 30%, transparent));
        }
        .tc-marker:hover, .tc-marker--active {
          transform: translateY(-5px) scale(1.08);
          z-index: 999 !important;
          filter: drop-shadow(0 8px 20px color-mix(in srgb, var(--mc) 50%, transparent));
        }
        .tc-card {
          position: relative;
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          border: 1.5px solid color-mix(in srgb, var(--mc) 35%, rgba(255,255,255,0.8));
          border-radius: 12px;
          padding: 7px 12px 7px 7px;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,81,90,0.12), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .tc-marker--active .tc-card {
          background: #ffffff;
          border-color: var(--mc);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--mc) 25%, transparent), 0 2px 8px rgba(0,0,0,0.08);
        }
        .tc-pulse-ring {
          position: absolute; inset: -6px; border-radius: 14px;
          border: 1.5px solid var(--mc);
          opacity: 0; animation: tcPulse 2.4s ease-out infinite;
        }
        .tc-flag {
          width: 28px; height: 28px; border-radius: 50%;
          object-fit: cover;
          border: 2px solid color-mix(in srgb, var(--mc) 40%, white);
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
        }
        .tc-info { display: flex; flex-direction: column; gap: 1px; }
        .tc-name  { font-size: 11px; font-weight: 800; color: #0a1a1c; letter-spacing: -0.01em; }
        .tc-users { font-size: 10px; font-weight: 600; color: var(--mc); }
        .tc-stem  { width: 2px; height: 10px; background: linear-gradient(to bottom, var(--mc), transparent); }
        .tc-dot   {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--mc);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--mc) 22%, transparent),
                      0 0 0 6px color-mix(in srgb, var(--mc) 08%, transparent);
          animation: tcDotPulse 2s ease-in-out infinite;
        }
        @keyframes tcPulse {
          0%   { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes tcDotPulse {
          0%,100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--mc) 22%, transparent), 0 0 0 6px color-mix(in srgb, var(--mc) 08%, transparent); }
          50%      { box-shadow: 0 0 0 5px color-mix(in srgb, var(--mc) 28%, transparent), 0 0 0 10px color-mix(in srgb, var(--mc) 06%, transparent); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,81,90,0.15) !important;
          border-radius: 10px !important; overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: #ffffff !important; color: #005f69 !important;
          border: none !important;
          border-bottom: 1px solid rgba(0,95,105,0.10) !important;
          font-weight: 700 !important;
          width: 34px !important; height: 34px !important; line-height: 34px !important;
          transition: all 0.2s !important;
        }
        .leaflet-control-zoom a:hover { background: #005f69 !important; color: #fff !important; }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.75) !important;
          color: rgba(0,60,70,0.45) !important; font-size: 9px !important;
          border-radius: 6px 0 0 0 !important; backdrop-filter: blur(4px);
        }
        .leaflet-control-attribution a { color: rgba(0,95,105,0.6) !important; }
      `}</style>

      {/* Blob déco fond */}
      <div style={{
        position: "absolute", top: "-10%", right: "-8%", width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,95,105,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-5%", left: "-5%", width: "400px", height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,129,143,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <StarClusters />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(20px,4vw,60px)", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(32px,4vw,48px)", animation: "fadeInUp 0.6s ease both" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            marginBottom: "14px",
            background: "rgba(0,95,105,0.10)", color: "#005f69",
            fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.09em",
            textTransform: "uppercase", padding: "5px 18px", borderRadius: "999px",
            border: "1px solid rgba(0,95,105,0.18)",
          }}>
            <Globe weight="bold" style={{ width: 14, height: 14 }} />
            Présence mondiale
          </span>

          <h2 style={{
            fontSize: "clamp(1.7rem,3vw,2.5rem)", fontWeight: 900,
            lineHeight: 1.1, letterSpacing: "-0.03em",
            color: "#0a1a1c", margin: "0 auto", maxWidth: "600px",
          }}>
            ticketché grandit partout,{" "}
            <span style={{
              background: "linear-gradient(135deg, #005f69 0%, #00818f 50%, #00c8d4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>8 pays nous font confiance</span>
          </h2>
        </div>

        {/* Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: active ? "1fr 300px" : "1fr",
          gap: "16px", alignItems: "start",
          transition: "grid-template-columns 0.4s ease",
        }}>

          {/* Map card */}
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 40px rgba(0,81,90,0.14), 0 1px 4px rgba(0,81,90,0.08), 0 0 0 1px rgba(0,95,105,0.08)",
            animation: "fadeInUp 0.7s ease 0.1s both",
          }}>
            {/* Toolbar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 18px",
              background: "rgba(255,255,255,0.85)",
              borderBottom: "1px solid rgba(0,95,105,0.10)",
              flexWrap: "wrap", gap: "10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  {["#692C00", "#00818f", "#005f69"].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(10,26,28,0.45)", letterSpacing: "0.05em" }}>
                  ticketché — carte interactive
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {active && (
                  <button onClick={resetView} style={{
                    background: "rgba(0,95,105,0.10)", border: "1px solid rgba(0,95,105,0.22)",
                    color: "#005f69", fontSize: "0.72rem", fontWeight: 700,
                    padding: "4px 14px", borderRadius: "999px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,95,105,0.18)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,95,105,0.10)" }}
                  >← Vue globale</button>
                )}
                <span style={{ fontSize: "0.7rem", color: loaded ? "#00818f" : "rgba(10,26,28,0.25)", fontWeight: 600 }}>
                  {loaded ? "● Live" : "○ Chargement..."}
                </span>
              </div>
            </div>

            <div ref={mapRef} style={{ width: "100%", height: "clamp(380px,50vw,520px)" }} />
          </div>

          {/* Panneau détail */}
          {active && (
            <div style={{
              borderRadius: "20px", overflow: "hidden",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0,95,105,0.12)",
              boxShadow: "0 8px 40px rgba(0,81,90,0.12)",
              animation: "slideIn 0.35s cubic-bezier(.34,1.56,.64,1) both",
            }}>
              <div style={{
                padding: "22px",
                background: `linear-gradient(135deg, color-mix(in srgb, ${active.color} 10%, white) 0%, rgba(255,255,255,0.5) 100%)`,
                borderBottom: "1px solid rgba(0,95,105,0.09)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <img
                    src={`https://flagcdn.com/w80/${active.code}.png`}
                    alt={active.name}
                    style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      objectFit: "cover",
                      border: `3px solid ${active.color}`,
                      boxShadow: `0 4px 16px ${active.color}44`,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0a1a1c", letterSpacing: "-0.02em" }}>
                      {active.name}
                    </div>
                    <div style={{ fontSize: "0.70rem", color: "rgba(10,26,28,0.45)", marginTop: "2px" }}>
                      {active.desc}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: "rgba(255,255,255,0.7)", borderRadius: "12px",
                  padding: "14px 16px", border: `1px solid ${active.color}22`,
                }}>
                  <div style={{ fontSize: "1.9rem", fontWeight: 900, color: active.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {active.users}
                  </div>
                  <div style={{ fontSize: "0.70rem", color: "rgba(10,26,28,0.45)", marginTop: "3px", fontWeight: 600 }}>
                    utilisateurs actifs
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {detailRows.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "rgba(0,95,105,0.04)",
                    borderRadius: "10px",
                    border: "1px solid rgba(0,95,105,0.08)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {s.icon}
                      <span style={{ fontSize: "0.74rem", color: "rgba(10,26,28,0.50)", fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: "0.80rem", fontWeight: 800, color: "#0a1a1c" }}>{s.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: "0 16px 18px" }}>
                <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.38)", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Part du total
                </div>
                <div style={{ background: "rgba(0,95,105,0.10)", borderRadius: "999px", height: "7px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "999px",
                    background: `linear-gradient(90deg, ${active.color}, color-mix(in srgb, ${active.color} 55%, #00c8d4))`,
                    width: `${(parseInt(active.users.replace(/\s/g, "")) / totalUsers * 100).toFixed(1)}%`,
                    transition: "width 0.8s ease",
                    boxShadow: `0 0 10px ${active.color}66`,
                  }} />
                </div>
                <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.40)", marginTop: "5px", textAlign: "right" }}>
                  {(parseInt(active.users.replace(/\s/g, "")) / totalUsers * 100).toFixed(1)}% des utilisateurs
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats globales */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "12px", marginTop: "16px",
          animation: "fadeInUp 0.8s ease 0.2s both",
        }}>
          {globalStats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "16px 12px",
              background: "rgba(255,255,255,0.70)",
              backdropFilter: "blur(8px)",
              borderRadius: "14px",
              border: "1px solid rgba(0,95,105,0.12)",
              boxShadow: "0 2px 12px rgba(0,81,90,0.07)",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(1.1rem,1.8vw,1.5rem)", fontWeight: 900, color: "#005f69", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(10,26,28,0.45)", fontWeight: 500, marginTop: "4px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}