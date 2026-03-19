"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllPlaces, getPlacesByLocation } from "@/app/services/api";
import {
  NavigationArrow, MagnifyingGlass, X, Car, Drop, Wrench,
  SlidersHorizontal, Star, MapPin, CaretRight, ArrowUpRight,
  Funnel, Buildings, List, SquaresFour, Warning, Camera,
} from "@phosphor-icons/react";

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const formatImage = (img) => {
  if (!img) return "/images/logo.png";
  // Lien déjà absolu (https://...)
  if (img.startsWith("http")) return img;
  // Lien relatif legacy
  return img.replace("/storage/app/public", "/storage");
};

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
  if (t.includes("lavage")) return <Drop {...props} />;
  return <Wrench {...props} />;
};

const FILTERS = [
  { key: "all", label: "Tous", Icon: SlidersHorizontal },
  { key: "parking", label: "Parking", Icon: Car },
  { key: "lavage", label: "Lavage", Icon: Drop },
  { key: "garage", label: "Garage", Icon: Wrench },
];

const RADIUS_M = 20000; // 20 km

/* ══════════════════════════════════════════════
   HERO CARD
══════════════════════════════════════════════ */
function HeroCard({ place, onClick, onItinerary, isNearby, distanceKm }) {
  const rating = getRating(place);
  const tags = getServiceTags(place);

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
      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1.45fr 1fr; gap: 6px; padding: 8px 8px 0 8px; height: 272px; }
        .hero-second-photo { display: block; }
        @media (max-width: 640px) {
          .hero-grid { grid-template-columns: 1fr; height: 240px; padding: 0; }
          .hero-second-photo { display: none; }
        }
      `}</style>

      <div className="hero-grid">
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
          <Image src={getPlaceImage(place)} alt={place.name} fill style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.15) 55%, transparent 100%)" }} />

          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {isNearby ? (
              <span style={{ background: "#005f69", color: "white", fontSize: 10, fontWeight: 800, padding: "4px 11px", borderRadius: 20, letterSpacing: .5, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
                <MapPin weight="fill" style={{ width: 10, height: 10 }} />
                {distanceKm != null ? `À ${distanceKm < 1 ? Math.round(distanceKm * 1000) + " m" : distanceKm.toFixed(1) + " km"} de vous` : "Le plus proche"}
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

          {rating && (
            <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.18)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.3)", color: "white", padding: "5px 11px", borderRadius: 20 }}>
              <Star weight="fill" style={{ width: 12, height: 12, color: "#fbbf24" }} />
              <span style={{ fontWeight: 900, fontSize: 13 }}>{rating}</span>
            </div>
          )}

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
            {[1, 2, 3, 4, 5].map(s => (
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
   LIST CARD
══════════════════════════════════════════════ */
function ListCard({ place, index, onClick, onItinerary }) {
  const rating = getRating(place);
  const tags = getServiceTags(place);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(place)}
      className="group flex items-stretch gap-0 cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-[#005f69]/8 hover:border-[#005f69]/20 transition-all duration-300"
    >
      <div className="flex-shrink-0 w-14 sm:w-16 bg-gradient-to-b from-[#005f69] to-[#004a52] flex flex-col items-center justify-center gap-1.5 py-4">
        <ServiceIcon tag={tags[0] ?? ""} style={{ width: 18, height: 18, color: "white" }} />
        <span className="text-white/50 text-[8px] font-black uppercase tracking-wider text-center leading-tight px-1">
          {tags[0] ?? "Service"}
        </span>
      </div>

      <div className="relative flex-shrink-0 w-24 sm:w-36 overflow-hidden">
        <Image src={getPlaceImage(place)} alt={place.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        {rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star weight="fill" className="w-2.5 h-2.5 text-yellow-400" />
            <span className="text-[10px] font-black text-gray-900">{rating}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 min-w-0">
        <div>
          <div className="flex gap-1.5 flex-wrap mb-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-black text-[#692C00] uppercase tracking-wide border border-[#692C00]/22 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug mb-1.5 group-hover:text-[#005f69] transition-colors duration-200 line-clamp-2">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin weight="fill" className="w-3 h-3 text-[#005f69]" />
            {place.city}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 flex-wrap gap-2">
          <span className="font-black text-[#005f69] text-sm">{getMinPrice(place)}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => onItinerary(e, place.id)}
              className="flex items-center gap-1.5 text-[11px] font-black text-[#005f69] bg-[#005f69]/7 border-none px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <NavigationArrow className="w-3 h-3" /> Itinéraire
            </button>
            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
              Voir <CaretRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   GRID CARD
══════════════════════════════════════════════ */
function GridCard({ place, index, onClick, onItinerary }) {
  const rating = getRating(place);
  const tags = getServiceTags(place);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, delay: index * 0.05 }}
      onClick={() => onClick(place)}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-[#005f69]/10 hover:border-[#005f69]/20 transition-all duration-300"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <Image src={getPlaceImage(place)} alt={place.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {rating && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/92 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star weight="fill" className="w-2.5 h-2.5 text-yellow-400" />
            <span className="text-[11px] font-black text-gray-900">{rating}</span>
          </div>
        )}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="bg-black/42 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{place.city}</span>
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex gap-1.5 mb-1.5">
          {tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-black text-[#692C00] uppercase tracking-wide">
              {i > 0 && <span className="text-gray-200 mr-1.5">·</span>}{tag}
            </span>
          ))}
        </div>
        <h3 className="font-black text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{place.name}</h3>
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50">
          <span className="font-black text-[#005f69] text-sm">{getMinPrice(place)}</span>
          <button
            onClick={(e) => onItinerary(e, place.id)}
            className="flex items-center gap-1 text-[11px] font-black text-[#005f69] bg-[#005f69]/7 border-none px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <NavigationArrow className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MOBILE FILTER DRAWER
══════════════════════════════════════════════ */
function MobileFilterDrawer({ open, onClose, activeFilter, setActiveFilter, sortBy, setSortBy, searchQuery, setSearchQuery }) {
  const activeCount = (activeFilter !== "all" ? 1 : 0) + (sortBy !== "default" ? 1 : 0) + (searchQuery ? 1 : 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 overflow-y-auto lg:hidden"
            style={{ maxHeight: "85vh", paddingBottom: "env(safe-area-inset-bottom, 20px)" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="px-5 pb-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-black text-gray-900 text-lg">Filtres</span>
                <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Recherche</p>
                <div className="relative">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  <input
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nom, ville..."
                    className="w-full pl-9 pr-9 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f69]/25 focus:border-[#005f69] text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Type de service</p>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map(({ key, label, Icon }) => (
                    <button key={key} onClick={() => setActiveFilter(key)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-bold transition-all ${activeFilter === key ? "bg-[#005f69] text-white border-[#005f69]" : "text-gray-500 border-gray-200"}`}>
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Trier par</p>
                <div className="flex flex-wrap gap-2">
                  {[{ key: "default", label: "Par défaut" }, { key: "rating", label: "Meilleure note" }, { key: "price", label: "Prix croissant" }].map(({ key, label }) => (
                    <button key={key} onClick={() => setSortBy(key)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${sortBy === key ? "bg-[#005f69] text-white border-[#005f69]" : "text-gray-500 border-gray-200"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={onClose} className="w-full bg-[#005f69] text-white font-black text-sm py-3.5 rounded-2xl">
                Appliquer{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
            </div>
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
          className="fixed top-24 left-4 z-50 bg-gray-900 text-white rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl text-sm font-semibold whitespace-nowrap"
          style={{ maxWidth: "calc(100vw - 32px)" }}
        >
          <Warning weight="fill" className="w-4 h-4 text-yellow-400 flex-shrink-0" />
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
  const router = useRouter();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("list");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Geoloc & hero
  const [nearbyPlace, setNearbyPlace] = useState(null);  // { place, distanceKm }
  const [showNoNearbyToast, setShowNoNearbyToast] = useState(false);
  const toastTimerRef = useRef(null);

  /* ── 1. Charger tous les établissements ── */
  useEffect(() => {
    fetchAllPlaces()
      .then((r) => { if (r?.success) setAll(r?.data ?? []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── 2. Géolocalisation → appel API getPlacesByLocation ── */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const CACHE_KEY = "ticketche_nearby_place";
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    const fetchNearby = async (latitude, longitude, fromCache = false) => {
      try {
        const data = await getPlacesByLocation(latitude, longitude, RADIUS_M);
        const places = data?.data ?? [];
        if (places.length > 0) {
          const result = { place: places[0], distanceKm: places[0].distance ?? null };
          setNearbyPlace(result);
          // Mettre en cache la position + résultat
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            latitude, longitude,
            result,
            timestamp: Date.now(),
          }));
        } else if (!fromCache) {
          setShowNoNearbyToast(true);
          clearTimeout(toastTimerRef.current);
          toastTimerRef.current = setTimeout(() => setShowNoNearbyToast(false), 4000);
        }
      } catch {
        // Erreur réseau → fallback silencieux sur "mieux noté"
      }
    };

    // 1. Charger immédiatement depuis le cache si disponible et récent
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setNearbyPlace(cached.result);
        // Rafraîchir en arrière-plan sans bloquer l'affichage
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchNearby(pos.coords.latitude, pos.coords.longitude),
          () => {},
          { enableHighAccuracy: false, timeout: 8000 }
        );
        return () => clearTimeout(toastTimerRef.current);
      }
    } catch {}

    // 2. Pas de cache → demander la position normalement
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchNearby(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Géoloc refusée → fallback silencieux sur "mieux noté"
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return () => clearTimeout(toastTimerRef.current);
  }, []);

  const handleClick = useCallback((place) => {
    localStorage.setItem("selectedPlace", JSON.stringify(place));
    router.push(`/places/${place.id}`);
  }, [router]);

  const handleItinerary = useCallback((e, id) => {
    e.stopPropagation();
    window.open(`https://app.ticketche.com/places/itinerary?placeId=${id}`, "_blank");
  }, []);

  /* ── Filtrage & tri ── */
  const filtered = useMemo(() => {
    let res = [...all].filter((p) => p.status === "VALIDATED");
    if (activeFilter !== "all")
      res = res.filter((p) => p.services.some((s) => s.pivot.status === "ON" && s.name.toLowerCase().includes(activeFilter)));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.services.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    return res.sort((a, b) => {
      if (sortBy === "rating") return (parseFloat(getRating(b)) || 0) - (parseFloat(getRating(a)) || 0);
      if (sortBy === "price") return (parseFloat(a.minimum_price) || Infinity) - (parseFloat(b.minimum_price) || Infinity);
      return 0;
    });
  }, [all, activeFilter, searchQuery, sortBy]);

  /* ── Hero : nearby (API) > mieux noté (fallback) ── */
  const heroPlace = useMemo(() => {
    // Si filtre ou recherche actif → premier résultat filtré
    if (searchQuery || activeFilter !== "all") {
      return filtered.length > 0 ? { place: filtered[0], isNearby: false } : null;
    }
    // Priorité 1 : résultat de getPlacesByLocation
    if (nearbyPlace) return { place: nearbyPlace.place, isNearby: true, distanceKm: nearbyPlace.distanceKm };
    // Priorité 2 : mieux noté parmi tous
    const best = getBestRatedPlace(all);
    return best ? { place: best, isNearby: false } : null;
  }, [nearbyPlace, all, filtered, searchQuery, activeFilter]);

  /* ── Liste sans le hero ── */
  const listItems = useMemo(() => {
    if (!heroPlace) return filtered;
    return filtered.filter((p) => p.id !== heroPlace.place.id);
  }, [filtered, heroPlace]);

  const activeFilterCount = (activeFilter !== "all" ? 1 : 0) + (sortBy !== "default" ? 1 : 0) + (searchQuery ? 1 : 0);

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center">
      <div className="flex items-center gap-3">
        {[0, 0.15, 0.3].map((d, i) => (
          <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-[#005f69]"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: d }} />
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8f7f5] pt-24 pb-20">

      <NearbyToast visible={showNoNearbyToast} />

      <MobileFilterDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
        sortBy={sortBy} setSortBy={setSortBy}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
      />

      {/* ── PAGE HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
              <Link href="/" className="hover:text-[#005f69] transition-colors">Accueil</Link>
              <CaretRight className="w-3 h-3" />
              <span className="text-[#005f69]">Établissements</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Nos <span className="text-[#005f69]">établissements</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              {filtered.length} établissement{filtered.length !== 1 ? "s" : ""} partenaire{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-600"
            >
              <Funnel className="w-4 h-4" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="bg-[#005f69] text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === "list" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === "grid" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Grille
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ════ SIDEBAR ════ */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:block w-full lg:w-64 flex-shrink-0 space-y-4"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Recherche</p>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom, ville..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f69]/25 focus:border-[#005f69] text-sm transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Trier par
              </p>
              <div className="flex flex-col gap-1">
                {[
                  { key: "default", label: "Par défaut" },
                  { key: "rating", label: "Meilleure note" },
                  { key: "price", label: "Prix (croissant)" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setSortBy(key)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${sortBy === key ? "bg-[#005f69]/10 text-[#005f69]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                    {sortBy === key && <span className="mr-1.5 text-[#005f69]">›</span>}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Funnel className="w-3.5 h-3.5" /> Type de service
              </p>
              <div className="flex flex-col gap-1">
                {FILTERS.map(({ key, label, Icon }) => (
                  <button key={key} onClick={() => setActiveFilter(key)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeFilter === key ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#005f69] to-[#004a52] rounded-2xl p-5 text-white shadow-lg">
              <Buildings className="w-5 h-5 text-white/50 mb-3" />
              <p className="text-4xl font-black leading-none tracking-tight">{all.length}</p>
              <p className="text-white/60 text-sm font-semibold mt-1">établissements partenaires</p>
              <div className="mt-4 pt-4 border-t border-white/12 space-y-2.5">
                {FILTERS.slice(1).map(({ key, label, Icon }) => {
                  const count = all.filter((p) => p.services.some((s) => s.pivot.status === "ON" && s.name.toLowerCase().includes(key))).length;
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-white/60 font-semibold">
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </span>
                      <span className="font-black">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* ════ MAIN CONTENT ════ */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {filtered.length === 0 && (
                <motion.div key="empty"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 bg-white rounded-3xl border border-gray-100"
                >
                  <div className="mb-4"><Buildings className="w-12 h-12 text-gray-300 mx-auto" /></div>
                  <p className="text-gray-700 font-black text-lg mb-1">Aucun établissement trouvé</p>
                  <p className="text-gray-400 text-sm mb-6">Essayez d'autres filtres ou mots-clés</p>
                  <button
                    onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                    className="bg-[#005f69] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#004a52] transition-colors"
                  >
                    Tout afficher
                  </button>
                </motion.div>
              )}

              {filtered.length > 0 && viewMode === "list" && (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {heroPlace && (
                    <HeroCard
                      place={heroPlace.place}
                      onClick={handleClick}
                      onItinerary={handleItinerary}
                      isNearby={heroPlace.isNearby}
                      distanceKm={heroPlace.distanceKm}
                    />
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      {listItems.length} établissement{listItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {listItems.map((place, i) => (
                      <ListCard key={place.id} place={place} index={i} onClick={handleClick} onItinerary={handleItinerary} />
                    ))}
                  </div>
                </motion.div>
              )}

              {filtered.length > 0 && viewMode === "grid" && (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {heroPlace && (
                    <HeroCard
                      place={heroPlace.place}
                      onClick={handleClick}
                      onItinerary={handleItinerary}
                      isNearby={heroPlace.isNearby}
                      distanceKm={heroPlace.distanceKm}
                    />
                  )}
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
                    {listItems.length} établissement{listItems.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
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