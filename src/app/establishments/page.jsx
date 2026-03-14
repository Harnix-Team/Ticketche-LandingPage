"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import {
  NavigationArrow, MagnifyingGlass, X, Car, Drop, Wrench,
  SlidersHorizontal, Star, MapPin, CaretRight, ArrowUpRight,
  Funnel, Buildings, List, SquaresFour, Warning, Camera,
} from "@phosphor-icons/react";

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const formatImage = (img) =>
  img ? img.replace("/storage/app/public", "/storage") : "/images/logo.png";

const getPlaceImage = (place) =>
  place.images?.length > 0
    ? formatImage(place.images[0].link)
    : "/images/Space/recom1.png";

const getSecondImage = (place) =>
  place.images?.length > 1
    ? formatImage(place.images[1].link)
    : getPlaceImage(place);

const getServiceTags = (place) =>
  [...new Set(
    place.services.filter((s) => s.pivot.status === "ON").map((s) => s.name)
  )].slice(0, 3);

const getMinPrice = (place) => {
  if (place.minimum_price)
    return `${Number(place.minimum_price).toLocaleString()} FCFA`;
  const prices = place.services
    .filter((s) => s.pivot.status === "ON")
    .map((s) => s.pivot.price)
    .filter(Boolean);
  return prices.length > 0
    ? `${Math.min(...prices).toLocaleString()} FCFA`
    : "Sur demande";
};

const getRating = (place) => {
  if (!place.noteUsers?.length) return null;
  const total = place.noteUsers.reduce((s, n) => s + parseFloat(n.star), 0);
  return (total / place.noteUsers.length).toFixed(1);
};

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBestRatedPlace(places) {
  return [...places].sort((a, b) => {
    const ra = parseFloat(getRating(a)) || 0;
    const rb = parseFloat(getRating(b)) || 0;
    return rb - ra;
  })[0] ?? null;
}

const ServiceIcon = ({ tag = "", ...props }) => {
  const t = tag.toLowerCase();
  if (t.includes("parking")) return <Car {...props} />;
  if (t.includes("lavage"))  return <Drop {...props} />;
  return <Wrench {...props} />;
};

const FILTERS = [
  { key: "all",     label: "Tous",    Icon: SlidersHorizontal },
  { key: "parking", label: "Parking", Icon: Car               },
  { key: "lavage",  label: "Lavage",  Icon: Drop              },
  { key: "garage",  label: "Garage",  Icon: Wrench            },
];

const RADIUS_M = 5000;

/* ══════════════════════════════════════════════
   HERO CARD — responsive
══════════════════════════════════════════════ */
function HeroCard({ place, onClick, onItinerary, isNearby, distanceM }) {
  const rating = getRating(place);
  const tags   = getServiceTags(place);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(place)}
      style={{
        borderRadius: 24, overflow: "hidden", cursor: "pointer",
        background: "white", border: "1px solid #e5e7eb",
        boxShadow: "0 2px 20px rgba(0,95,105,.09)", marginBottom: 16,
        fontFamily: "'Archivo', sans-serif",
      }}
    >
      {/* Sur mobile : photo unique pleine largeur. Sur desktop : grille 2 colonnes */}
      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1.45fr 1fr; gap: 6px; padding: 8px 8px 0 8px; height: 272px; }
        .hero-second-photo { display: block; }
        @media (max-width: 640px) {
          .hero-grid { grid-template-columns: 1fr; height: 240px; padding: 0; }
          .hero-second-photo { display: none; }
        }
      `}</style>

      <div className="hero-grid">
        {/* Photo principale */}
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
          <Image src={getPlaceImage(place)} alt={place.name} fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.15) 55%, transparent 100%)" }} />

          {/* Badge */}
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {isNearby ? (
              <span style={{ background: "#005f69", color: "white", fontSize: 10, fontWeight: 800, padding: "4px 11px", borderRadius: 20, letterSpacing: .5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
                <MapPin weight="fill" style={{ width: 10, height: 10 }} />
                À {Math.round(distanceM)} m de vous
              </span>
            ) : (
              <span style={{ background: "#d97706", color: "white", fontSize: 10, fontWeight: 800, padding: "4px 11px", borderRadius: 20, letterSpacing: .5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
                <Star weight="fill" style={{ width: 10, height: 10 }} />
                Mieux noté
              </span>
            )}
            {tags.map((tag, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.3)", color: "white", fontSize: 10, fontWeight: 800, padding: "4px 11px", borderRadius: 20, letterSpacing: .5, textTransform: "uppercase" }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Note */}
          {rating && (
            <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.3)", color: "white", padding: "5px 11px", borderRadius: 20 }}>
              <Star weight="fill" style={{ width: 12, height: 12, color: "#fbbf24" }} />
              <span style={{ fontWeight: 900, fontSize: 13 }}>{rating}</span>
            </div>
          )}

          {/* Nom + actions */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
              <MapPin weight="fill" style={{ width: 12, height: 12, color: "#2dd4bf" }} />
              <span style={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 700, letterSpacing: .3 }}>{place.city}</span>
            </div>
            <h2 style={{ color: "white", fontSize: 21, fontWeight: 900, lineHeight: 1.2, marginBottom: 12, letterSpacing: -.3 }}>{place.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>{getMinPrice(place)}</span>
              <button
                onClick={(e) => onItinerary(e, place.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "white", color: "#005f69", fontWeight: 800, fontSize: 12, padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}
              >
                <NavigationArrow style={{ width: 13, height: 13 }} /> Itinéraire
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.25)", color: "white", fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 20 }}>
                Voir le détail <ArrowUpRight style={{ width: 13, height: 13 }} />
              </span>
            </div>
          </div>
        </div>

        {/* Photo secondaire — masquée sur mobile via CSS */}
        <div className="hero-second-photo" style={{ borderRadius: 18, overflow: "hidden", position: "relative" }}>
          <Image src={getSecondImage(place)} alt={place.name} fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.38) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: 12, right: 12 }}>
            <span style={{ background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
              <Camera style={{ width: 11, height: 11 }} /> Voir toutes les photos
            </span>
          </div>
        </div>
      </div>

      {/* Bande info */}
      <div style={{ padding: "12px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, borderTop: "1px solid #f3f4f6", marginTop: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {tags.map((tag, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4b5563", fontWeight: 600 }}>
              <ServiceIcon tag={tag} style={{ width: 15, height: 15, color: "#005f69" }} />
              {tag}
            </div>
          ))}
        </div>
        {rating && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} weight={s <= Math.round(parseFloat(rating)) ? "fill" : "regular"} style={{ width: 12, height: 12, color: s <= Math.round(parseFloat(rating)) ? "#fbbf24" : "#e5e7eb" }} />
            ))}
            <span style={{ fontSize: 12, fontWeight: 800, color: "#374151", marginLeft: 4 }}>{rating}</span>
            <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 2 }}>({place.noteUsers?.length} avis)</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   LIST CARD — responsive
══════════════════════════════════════════════ */
function ListCard({ place, index, onClick, onItinerary }) {
  const rating = getRating(place);
  const tags   = getServiceTags(place);

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(place)}
      style={{
        display: "flex", alignItems: "stretch", cursor: "pointer",
        background: "white", borderRadius: 20, border: "1px solid #e5e7eb",
        overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        transition: "all .2s ease",
      }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,95,105,.11)", borderColor: "rgba(0,95,105,.22)" }}
    >
      {/* Bande colorée de gauche — masquée sur très petit mobile */}
      <style>{`
        .listcard-band { display: flex; }
        .listcard-photo { width: 138px; flex-shrink: 0; }
        @media (max-width: 400px) {
          .listcard-band { display: none; }
          .listcard-photo { width: 100px; }
        }
      `}</style>

      <div className="listcard-band" style={{
        flexShrink: 0, width: 58,
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 5, background: "linear-gradient(160deg, #005f69, #004a52)",
      }}>
        <ServiceIcon tag={tags[0] ?? ""} style={{ width: 20, height: 20, color: "white" }} />
        <span style={{ color: "rgba(255,255,255,.55)", fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", lineHeight: 1.3, padding: "0 5px" }}>
          {tags[0] ?? "Service"}
        </span>
      </div>

      <div className="listcard-photo" style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <Image src={getPlaceImage(place)} alt={place.name} fill style={{ objectFit: "cover" }} />
        {rating && (
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,.92)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "3px 8px" }}>
            <Star weight="fill" style={{ width: 10, height: 10, color: "#fbbf24" }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: "#111827" }}>{rating}</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "14px 14px", minWidth: 0 }}>
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 7 }}>
            {tags.map((tag, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 800, color: "#692C00", textTransform: "uppercase", letterSpacing: .5, border: "1px solid rgba(105,44,0,.22)", padding: "2px 9px", borderRadius: 20 }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 style={{ fontWeight: 900, color: "#111827", fontSize: 15, lineHeight: 1.35, marginBottom: 5 }}>{place.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
            <MapPin weight="fill" style={{ width: 11, height: 11, color: "#005f69", flexShrink: 0 }} />
            {place.city}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f3f4f6", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontWeight: 900, color: "#005f69", fontSize: 14 }}>{getMinPrice(place)}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={(e) => onItinerary(e, place.id)}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: "#005f69", background: "rgba(0,95,105,.07)", border: "none", padding: "6px 13px", borderRadius: 10, cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}
            >
              <NavigationArrow style={{ width: 12, height: 12 }} /> Itinéraire
            </button>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>
              Voir <CaretRight style={{ width: 11, height: 11 }} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GRID CARD — inchangée
══════════════════════════════════════════════ */
function GridCard({ place, index, onClick, onItinerary }) {
  const rating = getRating(place);
  const tags   = getServiceTags(place);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, delay: index * 0.05 }}
      onClick={() => onClick(place)}
      style={{ background: "white", borderRadius: 20, overflow: "hidden", cursor: "pointer", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,.04)", transition: "all .2s ease" }}
      whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,95,105,.12)", borderColor: "rgba(0,95,105,.22)" }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
        <Image src={getPlaceImage(place)} alt={place.name} fill style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)" }} />
        {rating && (
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,.92)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "4px 9px" }}>
            <Star weight="fill" style={{ width: 11, height: 11, color: "#fbbf24" }} />
            <span style={{ fontSize: 11, fontWeight: 900, color: "#111827" }}>{rating}</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <span style={{ background: "rgba(0,0,0,.42)", backdropFilter: "blur(6px)", color: "white", fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 20 }}>{place.city}</span>
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
          {tags.map((tag, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 900, color: "#692C00", textTransform: "uppercase", letterSpacing: .4 }}>
              {i > 0 && <span style={{ color: "#e5e7eb", marginRight: 6 }}>·</span>}{tag}
            </span>
          ))}
        </div>
        <h3 style={{ fontWeight: 900, color: "#111827", fontSize: 14, lineHeight: 1.35, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{place.name}</h3>
        {place.details && (
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{place.details}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
          <span style={{ fontWeight: 900, color: "#005f69", fontSize: 14 }}>{getMinPrice(place)}</span>
          <button
            onClick={(e) => onItinerary(e, place.id)}
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: "#005f69", background: "rgba(0,95,105,.07)", border: "none", padding: "6px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}
          >
            <NavigationArrow style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   DRAWER SIDEBAR MOBILE
══════════════════════════════════════════════ */
function MobileFilterDrawer({ open, onClose, activeFilter, setActiveFilter, sortBy, setSortBy, searchQuery, setSearchQuery, all }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200 }}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              background: "white", borderRadius: "24px 24px 0 0",
              zIndex: 201, padding: "0 20px 40px",
              maxHeight: "85vh", overflowY: "auto",
              fontFamily: "'Archivo', sans-serif",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 18px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 4, background: "#e5e7eb" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 900, fontSize: 17, color: "#111827" }}>Filtres</span>
              <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 10, padding: "6px 8px", cursor: "pointer" }}>
                <X style={{ width: 16, height: 16, color: "#6b7280" }} />
              </button>
            </div>

            {/* Recherche */}
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, color: "#9ca3af", marginBottom: 10 }}>Recherche</p>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <MagnifyingGlass style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#d1d5db", pointerEvents: "none" }} />
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, ville…"
                style={{ width: "100%", padding: "11px 32px 11px 34px", border: "1.5px solid #e5e7eb", borderRadius: 12, background: "#f9fafb", fontSize: 14, fontWeight: 500, color: "#374151", outline: "none", fontFamily: "'Archivo', sans-serif", boxSizing: "border-box" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#d1d5db" }}>
                  <X style={{ width: 13, height: 13 }} />
                </button>
              )}
            </div>

            {/* Service */}
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, color: "#9ca3af", marginBottom: 10 }}>Type de service</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {FILTERS.map(({ key, label, Icon }) => (
                <button key={key} onClick={() => setActiveFilter(key)} style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 16px",
                  borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  fontFamily: "'Archivo', sans-serif",
                  borderColor: activeFilter === key ? "#005f69" : "#e5e7eb",
                  background: activeFilter === key ? "#005f69" : "white",
                  color: activeFilter === key ? "white" : "#6b7280",
                }}>
                  <Icon style={{ width: 14, height: 14 }} /> {label}
                </button>
              ))}
            </div>

            {/* Tri */}
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, color: "#9ca3af", marginBottom: 10 }}>Trier par</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {[
                { key: "default", label: "Par défaut" },
                { key: "rating",  label: "Meilleure note" },
                { key: "price",   label: "Prix croissant" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setSortBy(key)} style={{
                  padding: "9px 16px", borderRadius: 20, border: "1.5px solid", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, fontFamily: "'Archivo', sans-serif",
                  borderColor: sortBy === key ? "#005f69" : "#e5e7eb",
                  background: sortBy === key ? "#005f69" : "white",
                  color: sortBy === key ? "white" : "#6b7280",
                }}>
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              style={{ width: "100%", background: "#005f69", color: "white", fontWeight: 800, fontSize: 15, padding: "14px", borderRadius: 16, border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}
            >
              Appliquer les filtres
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function NearbyToast({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed", top: 90, left: "50%", transform: "translateX(-50%)",
            zIndex: 999, background: "#1c1c1e", color: "#fff",
            borderRadius: 16, padding: "13px 20px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,.22)",
            fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 600,
            whiteSpace: "nowrap", maxWidth: "90vw",
          }}
        >
          <Warning weight="fill" style={{ width: 16, height: 16, color: "#fbbf24", flexShrink: 0 }} />
          Aucun emplacement disponible autour de vous
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════ */
export default function EstablishmentsPage() {
  const [all, setAll]                     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [activeFilter, setActiveFilter]   = useState("all");
  const [sortBy, setSortBy]               = useState("default");
  const [viewMode, setViewMode]           = useState("list");
  const [drawerOpen, setDrawerOpen]       = useState(false);

  const [userCoords, setUserCoords]       = useState(null);
  const [geoReady, setGeoReady]           = useState(false);
  const [nearbyPlace, setNearbyPlace]     = useState(null);
  const [nearbyDist, setNearbyDist]       = useState(null);
  const [showNoNearbyToast, setShowNoNearbyToast] = useState(false);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    fetchAllPlaces()
      .then((r) => { if (r.success) setAll(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setGeoReady(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }); setGeoReady(true); },
      () => { setUserCoords(null); setGeoReady(true); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!geoReady || all.length === 0) return;
    if (!userCoords) {
      setNearbyPlace(null); setNearbyDist(null);
      setShowNoNearbyToast(true);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setShowNoNearbyToast(false), 4000);
      return;
    }
    const withCoords = all.filter((p) => p.latitude != null && p.longitude != null);
    let closest = null, closestDist = Infinity;
    for (const place of withCoords) {
      const d = getDistanceMeters(userCoords.lat, userCoords.lon, parseFloat(place.latitude), parseFloat(place.longitude));
      if (d <= RADIUS_M && d < closestDist) { closest = place; closestDist = d; }
    }
    if (closest) { setNearbyPlace(closest); setNearbyDist(closestDist); }
    else {
      setNearbyPlace(null); setNearbyDist(null);
      setShowNoNearbyToast(true);
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setShowNoNearbyToast(false), 4000);
    }
    return () => clearTimeout(toastTimerRef.current);
  }, [geoReady, userCoords, all]);

  const handleClick = useCallback((place) => {
    localStorage.setItem("selectedPlace", JSON.stringify(place));
    window.open(`/places/${place.id}`, "_blank");
  }, []);

  const handleItinerary = useCallback((e, id) => {
    e.stopPropagation();
    window.open(`https://app.ticketche.com/places/itinerary?placeId=${id}`, "_blank");
  }, []);

  const filtered = useMemo(() => {
    let res = [...all];
    if (activeFilter !== "all")
      res = res.filter((p) => p.services.some((s) => s.pivot.status === "ON" && s.name.toLowerCase().includes(activeFilter)));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((p) => p.name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.services.some((s) => s.name.toLowerCase().includes(q)));
    }
    return res.sort((a, b) => {
      if (sortBy === "rating") return (parseFloat(getRating(b)) || 0) - (parseFloat(getRating(a)) || 0);
      if (sortBy === "price")  return (parseFloat(a.minimum_price) || Infinity) - (parseFloat(b.minimum_price) || Infinity);
      return 0;
    });
  }, [all, activeFilter, searchQuery, sortBy]);

  const heroPlace = useMemo(() => {
    if (!searchQuery && activeFilter === "all") {
      if (nearbyPlace) return { place: nearbyPlace, isNearby: true, dist: nearbyDist };
      if (all.length > 0) return { place: getBestRatedPlace(all), isNearby: false, dist: null };
    }
    if (filtered.length > 0) return { place: filtered[0], isNearby: false, dist: null };
    return null;
  }, [nearbyPlace, nearbyDist, all, filtered, searchQuery, activeFilter]);

  const listItems = useMemo(() => {
    if (!heroPlace) return filtered;
    return filtered.filter((p) => p.id !== heroPlace.place.id);
  }, [filtered, heroPlace]);

  const activeFilterCount = (activeFilter !== "all" ? 1 : 0) + (sortBy !== "default" ? 1 : 0) + (searchQuery ? 1 : 0);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 0.15, 0.3].map((d, i) => (
          <motion.div key={i}
            style={{ width: 10, height: 10, borderRadius: "50%", background: "#005f69" }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: d }}
          />
        ))}
      </div>
    </div>
  );

  const sideCard  = { background: "white", borderRadius: 20, border: "1px solid #e5e7eb", padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,.04)", marginBottom: 12 };
  const sideLabel = { fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, color: "#9ca3af", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f7f5", paddingTop: 100, paddingBottom: 60, fontFamily: "'Archivo', sans-serif" }}>

      <style>{`
        /* Sidebar desktop / cachée sur mobile */
        .hiw-sidebar { display: flex; flex-direction: column; }
        /* Barre filtre mobile */
        .mobile-filter-bar { display: none; }

        @media (max-width: 768px) {
          .hiw-sidebar     { display: none !important; }
          .mobile-filter-bar { display: flex !important; }
          .main-layout { flex-direction: column !important; gap: 0 !important; }
        }
      `}</style>

      <NearbyToast visible={showNoNearbyToast} />

      {/* Drawer mobile */}
      <MobileFilterDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
        sortBy={sortBy} setSortBy={setSortBy}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        all={all}
      />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 16px" }}>

        {/* ── EN-TÊTE ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .8, marginBottom: 8 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
              <CaretRight style={{ width: 10, height: 10 }} />
              <span style={{ color: "#005f69" }}>Établissements</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111827", letterSpacing: -.4, lineHeight: 1.15 }}>
              Nos <span style={{ color: "#005f69" }}>établissements</span>
            </h1>
            <p style={{ color: "#9ca3af", marginTop: 5, fontSize: 13, fontWeight: 500 }}>
              {filtered.length} établissement{filtered.length !== 1 ? "s" : ""} partenaire{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Toggle vue */}
          <div style={{ display: "flex", background: "white", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: 4, gap: 3 }}>
            {[{ mode: "list", Icon: List }, { mode: "grid", Icon: SquaresFour }].map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 10, border: "none", cursor: "pointer",
                background: viewMode === mode ? "#005f69" : "transparent",
                color: viewMode === mode ? "white" : "#6b7280",
                transition: "all .15s",
              }}>
                <Icon style={{ width: 17, height: 17 }} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── BARRE FILTRE MOBILE ── */}
        <div className="mobile-filter-bar" style={{
          gap: 8, marginBottom: 16, alignItems: "center",
        }}>
          {/* Bouton filtre */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: activeFilterCount > 0 ? "#005f69" : "white",
              color: activeFilterCount > 0 ? "white" : "#374151",
              border: "1.5px solid", borderColor: activeFilterCount > 0 ? "#005f69" : "#e5e7eb",
              borderRadius: 20, padding: "9px 16px",
              fontSize: 13, fontWeight: 800, cursor: "pointer",
              fontFamily: "'Archivo', sans-serif", flexShrink: 0,
            }}
          >
            <Funnel style={{ width: 14, height: 14 }} />
            Filtres
            {activeFilterCount > 0 && (
              <span style={{ background: "rgba(255,255,255,.25)", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 900 }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Chips de filtre rapide */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {FILTERS.map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setActiveFilter(key)} style={{
                display: "flex", alignItems: "center", gap: 5,
                flexShrink: 0, padding: "8px 14px", borderRadius: 20,
                border: "1.5px solid", cursor: "pointer", fontSize: 12, fontWeight: 700,
                fontFamily: "'Archivo', sans-serif",
                borderColor: activeFilter === key ? "#005f69" : "#e5e7eb",
                background: activeFilter === key ? "#005f69" : "white",
                color: activeFilter === key ? "white" : "#6b7280",
              }}>
                <Icon style={{ width: 13, height: 13 }} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── LAYOUT SIDEBAR + CONTENU ── */}
        <div className="main-layout" style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>

          {/* SIDEBAR desktop */}
          <motion.aside
            className="hiw-sidebar"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{ width: 240, flexShrink: 0 }}
          >
            <div style={sideCard}>
              <p style={sideLabel}><MagnifyingGlass style={{ width: 13, height: 13 }} /> Recherche</p>
              <div style={{ position: "relative" }}>
                <MagnifyingGlass style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#d1d5db", pointerEvents: "none" }} />
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom, ville…"
                  style={{ width: "100%", padding: "9px 32px 9px 34px", border: "1.5px solid #e5e7eb", borderRadius: 12, background: "#f9fafb", fontSize: 13, fontWeight: 500, color: "#374151", outline: "none", fontFamily: "'Archivo', sans-serif", transition: "border .15s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#005f69"}
                  onBlur={e  => e.target.style.borderColor = "#e5e7eb"}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#d1d5db" }}>
                    <X style={{ width: 13, height: 13 }} />
                  </button>
                )}
              </div>
            </div>

            <div style={sideCard}>
              <p style={sideLabel}><SlidersHorizontal style={{ width: 13, height: 13 }} /> Trier par</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[{ key: "default", label: "Par défaut" }, { key: "rating", label: "Meilleure note" }, { key: "price", label: "Prix (croissant)" }].map(({ key, label }) => (
                  <button key={key} onClick={() => setSortBy(key)} style={{ textAlign: "left", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: sortBy === key ? 800 : 600, fontFamily: "'Archivo', sans-serif", background: sortBy === key ? "rgba(0,95,105,.07)" : "transparent", color: sortBy === key ? "#005f69" : "#6b7280", transition: "all .14s" }}>
                    {sortBy === key && <span style={{ marginRight: 5 }}>›</span>}{label}
                  </button>
                ))}
              </div>
            </div>

            <div style={sideCard}>
              <p style={sideLabel}><Funnel style={{ width: 13, height: 13 }} /> Type de service</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {FILTERS.map(({ key, label, Icon }) => (
                  <button key={key} onClick={() => setActiveFilter(key)} style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Archivo', sans-serif", background: activeFilter === key ? "#005f69" : "transparent", color: activeFilter === key ? "white" : "#6b7280", transition: "all .14s" }}>
                    <Icon style={{ width: 15, height: 15, flexShrink: 0 }} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(145deg, #005f69 0%, #004a52 100%)", borderRadius: 20, padding: "20px 18px", color: "white", boxShadow: "0 4px 16px rgba(0,95,105,.28)" }}>
              <Buildings style={{ width: 22, height: 22, color: "rgba(255,255,255,.5)", marginBottom: 10 }} />
              <p style={{ fontSize: 34, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{all.length}</p>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, fontWeight: 600, marginTop: 2 }}>établissements partenaires</p>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.12)" }}>
                {FILTERS.slice(1).map(({ key, label, Icon }) => {
                  const count = all.filter((p) => p.services.some((s) => s.pivot.status === "ON" && s.name.toLowerCase().includes(key))).length;
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, marginBottom: 9 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>
                        <Icon style={{ width: 13, height: 13 }} /> {label}
                      </span>
                      <span style={{ fontWeight: 900 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* CONTENU */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">

              {filtered.length === 0 && (
                <motion.div key="empty"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 24, border: "1px solid #e5e7eb" }}
                >
                  <Buildings size={44} color="#e5e7eb" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 16, fontWeight: 900, color: "#374151", marginBottom: 6 }}>Aucun établissement trouvé</p>
                  <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Essayez d'autres filtres ou mots-clés</p>
                  <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                    style={{ background: "#005f69", color: "white", fontWeight: 800, fontSize: 13, padding: "10px 24px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif" }}>
                    Tout afficher
                  </button>
                </motion.div>
              )}

              {filtered.length > 0 && viewMode === "list" && (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {heroPlace && <HeroCard place={heroPlace.place} onClick={handleClick} onItinerary={handleItinerary} isNearby={heroPlace.isNearby} distanceM={heroPlace.dist} />}
                  <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, marginBottom: 12 }}>
                    {listItems.length} établissement{listItems.length !== 1 ? "s" : ""}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {listItems.map((place, i) => (
                      <ListCard key={place.id} place={place} index={i} onClick={handleClick} onItinerary={handleItinerary} />
                    ))}
                  </div>
                </motion.div>
              )}

              {filtered.length > 0 && viewMode === "grid" && (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {heroPlace && <HeroCard place={heroPlace.place} onClick={handleClick} onItinerary={handleItinerary} isNearby={heroPlace.isNearby} distanceM={heroPlace.dist} />}
                  <p style={{ fontSize: 10, color: "#9ca3af", fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, marginBottom: 12 }}>
                    {listItems.length} établissement{listItems.length !== 1 ? "s" : ""}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                    {listItems.map((place, i) => (
                      <GridCard key={place.id} place={place} index={i} onClick={handleClick} onItinerary={handleItinerary} />
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}