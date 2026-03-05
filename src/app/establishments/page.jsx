"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import {
  NavigationArrow, MagnifyingGlass, X, Car, Drop, Wrench,
  SlidersHorizontal, Star, MapPin, CaretRight, ArrowUpRight,
  Funnel, Buildings,
} from "@phosphor-icons/react";

/* ── helpers ── */
const formatImage = (img) =>
  img ? img.replace("/storage/app/public", "/storage") : "/images/logo.png";

const getPlaceImage = (place) =>
  place.images?.length > 0 ? formatImage(place.images[0].link) : "/images/Space/recom1.png";

const getServiceTags = (place) =>
  [...new Set(place.services.filter((s) => s.pivot.status === "ON").map((s) => s.name))].slice(0, 3);

const getMinPrice = (place) => {
  if (place.minimum_price) return `${place.minimum_price} FCFA`;
  const prices = place.services.filter((s) => s.pivot.status === "ON").map((s) => s.pivot.price).filter(Boolean);
  return prices.length > 0 ? `${Math.min(...prices).toLocaleString()} FCFA` : "Sur demande";
};

const getRating = (place) => {
  if (!place.noteUsers?.length) return null;
  const total = place.noteUsers.reduce((s, n) => s + parseFloat(n.star), 0);
  return (total / place.noteUsers.length).toFixed(1);
};

const FILTERS = [
  { key: "all",     label: "Tous",    icon: SlidersHorizontal },
  { key: "parking", label: "Parking", icon: Car               },
  { key: "lavage",  label: "Lavage",  icon: Drop              },
  { key: "garage",  label: "Garage",  icon: Wrench            },
];

/* ── Featured hero card ── */
function HeroCard({ place, onClick, onItinerary }) {
  const rating = getRating(place);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(place)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl"
      style={{ height: "420px" }}
    >
      <Image src={getPlaceImage(place)} alt={place.name} fill
        className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* tags top */}
      <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
        {getServiceTags(place).map((tag, i) => (
          <span key={i} className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      {rating && (
        <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full">
          <Star className="w-3.5 h-3.5 text-amber-400" weight="fill" />
          <span className="font-black text-sm">{rating}</span>
        </div>
      )}

      {/* content bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <p className="text-white/60 text-xs font-black uppercase tracking-[0.15em] mb-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#00949f]" /> {place.city}
        </p>
        <h2 className="text-white text-2xl sm:text-3xl font-black leading-tight mb-4 max-w-xl">
          {place.name}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-white font-black text-lg">{getMinPrice(place)}</span>
          <button
            onClick={(e) => onItinerary(e, place.id)}
            className="flex items-center gap-2 bg-white text-[#005f69] font-black text-sm px-5 py-2.5 rounded-full hover:bg-[#005f69] hover:text-white transition-colors duration-300"
          >
            <NavigationArrow className="w-4 h-4" /> Itinéraire
          </button>
          <span className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-full group-hover:bg-white/25 transition-colors duration-300">
            Voir le détail <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Horizontal list row ── */
function ListCard({ place, index, onClick, onItinerary }) {
  const rating = getRating(place);
  const tags   = getServiceTags(place);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(place)}
      className="group flex items-stretch gap-0 cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-[#005f69]/8 hover:border-[#005f69]/20 transition-all duration-300"
    >
      {/* Color accent left — service type */}
      <div className="flex-shrink-0 w-14 sm:w-16 flex flex-col items-center justify-center py-4 gap-1"
        style={{ background: "linear-gradient(to bottom, #005f69, #004a52)" }}>
        {tags[0]?.toLowerCase().includes("parking") ? (
          <Car className="w-5 h-5 text-white" />
        ) : tags[0]?.toLowerCase().includes("lavage") ? (
          <Drop className="w-5 h-5 text-white" />
        ) : (
          <Wrench className="w-5 h-5 text-white" />
        )}
        <span className="text-white/60 text-[8px] font-black uppercase tracking-widest text-center leading-tight mt-1 px-1">
          {tags[0] ?? "Service"}
        </span>
      </div>

      {/* Image */}
      <div className="relative flex-shrink-0 w-28 sm:w-40 overflow-hidden">
        <Image src={getPlaceImage(place)} alt={place.name} fill
          className="object-cover transition-transform duration-500 group-hover:scale-110" />
        {rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow">
            <Star className="w-2.5 h-2.5 text-amber-400" weight="fill" />
            <span className="text-[10px] font-black text-gray-800">{rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
        <div>
          <div className="flex gap-1.5 flex-wrap mb-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-black text-[#692C00] uppercase tracking-widest border border-[#692C00]/30 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug mb-1 group-hover:text-[#005f69] transition-colors duration-200 line-clamp-2">
            {place.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3 text-[#005f69] flex-shrink-0" />
            {place.city}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="font-black text-[#005f69] text-sm">{getMinPrice(place)}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => onItinerary(e, place.id)}
              className="flex items-center gap-1 text-[11px] font-black text-[#005f69] bg-[#005f69]/8 hover:bg-[#005f69] hover:text-white px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              <NavigationArrow className="w-3 h-3" /> Itinéraire
            </button>
            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-black opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Voir <CaretRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Compact grid card ── */
function GridCard({ place, index, onClick, onItinerary }) {
  const rating = getRating(place);
  const tags   = getServiceTags(place);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => onClick(place)}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#005f69]/10 hover:border-[#005f69]/20 transition-all duration-300"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image src={getPlaceImage(place)} alt={place.name} fill
          className="object-cover transition-transform duration-500 group-hover:scale-108" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {rating && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow">
            <Star className="w-3 h-3 text-amber-400" weight="fill" />
            <span className="text-xs font-black text-gray-800">{rating}</span>
          </div>
        )}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {place.city}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-1.5 flex-wrap mb-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-black text-[#692C00] uppercase tracking-wide">
              {i > 0 && <span className="text-gray-200 mr-1.5">·</span>}{tag}
            </span>
          ))}
        </div>
        <h3 className="font-black text-gray-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#005f69] transition-colors">
          {place.name}
        </h3>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="font-black text-[#005f69] text-sm">{getMinPrice(place)}</span>
          <button
            onClick={(e) => onItinerary(e, place.id)}
            className="flex items-center gap-1 text-[11px] font-black text-[#005f69] bg-[#005f69]/8 hover:bg-[#005f69] hover:text-white px-3 py-1.5 rounded-xl transition-all duration-200"
          >
            <NavigationArrow className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══ MAIN PAGE ══ */
export default function EstablishmentsPage() {
  const [all, setAll]               = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy]         = useState("default");
  const [viewMode, setViewMode]     = useState("list");

  useEffect(() => {
    fetchAllPlaces()
      .then((r) => { if (r.success) setAll(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleClick     = useCallback((place) => {
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
      res = res.filter((p) =>
        p.services.some((s) => s.pivot.status === "ON" && s.name.toLowerCase().includes(activeFilter))
      );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.services.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    return res.sort((a, b) => {
      if (sortBy === "rating") {
        return (parseFloat(getRating(b)) || 0) - (parseFloat(getRating(a)) || 0);
      }
      if (sortBy === "price") {
        const pa = parseFloat(a.minimum_price) || Infinity;
        const pb = parseFloat(b.minimum_price) || Infinity;
        return pa - pb;
      }
      return 0;
    });
  }, [all, activeFilter, searchQuery, sortBy]);

  const topPlace   = filtered[0];
  const restPlaces = filtered.slice(1);

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

      {/* ── PAGE HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-black uppercase tracking-widest mb-3">
              <Link href="/" className="hover:text-[#005f69] transition-colors">Accueil</Link>
              <CaretRight className="w-3 h-3" />
              <span className="text-[#005f69]">Établissements</span>
            </div>
            <h1 className="title-hero text-gray-900">
              Nos <span className="title-accent">établissements</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              {filtered.length} établissement{filtered.length !== 1 ? "s" : ""} partenaire{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 self-start sm:self-auto">
            <button onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                viewMode === "list" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              Liste
            </button>
            <button onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                viewMode === "grid" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              Grille
            </button>
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
            className="w-full lg:w-64 flex-shrink-0 space-y-4"
          >
            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Recherche</p>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nom, ville..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f69]/25 focus:border-[#005f69] text-sm transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Trier par
              </p>
              <div className="flex flex-col gap-1">
                {[
                  { key: "default", label: "Par défaut"       },
                  { key: "rating",  label: "Meilleure note"   },
                  { key: "price",   label: "Prix (croissant)" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setSortBy(key)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      sortBy === key
                        ? "bg-[#005f69]/10 text-[#005f69]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}>
                    {sortBy === key && <span className="mr-1.5 text-[#005f69]">›</span>}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Funnel className="w-3.5 h-3.5" /> Type de service
              </p>
              <div className="flex flex-col gap-1">
                {FILTERS.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setActiveFilter(key)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 ${
                      activeFilter === key
                        ? "bg-[#005f69] text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats bloc */}
            <div className="bg-gradient-to-br from-[#005f69] to-[#004a52] rounded-2xl p-5 text-white shadow-lg shadow-[#005f69]/20">
              <Buildings className="w-6 h-6 text-white/60 mb-3" />
              <p className="text-3xl font-black">{all.length}</p>
              <p className="text-white/70 text-sm font-bold mt-0.5">établissements partenaires</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1.5">
                {FILTERS.slice(1).map(({ key, label, icon: Icon }) => {
                  const count = all.filter((p) =>
                    p.services.some((s) => s.pivot.status === "ON" && s.name.toLowerCase().includes(key))
                  ).length;
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-white/70 font-bold">
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </span>
                      <span className="font-black text-white">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* ════ MAIN CONTENT ════ */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {filtered.length === 0 ? (
                <motion.div key="empty"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 bg-white rounded-3xl border border-gray-100">
                  <div className="text-5xl mb-4">🏢</div>
                  <p className="text-gray-700 font-black text-lg mb-1">Aucun établissement trouvé</p>
                  <p className="text-gray-400 text-sm mb-6">Essayez d'autres filtres ou mots-clés</p>
                  <button
                    onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                    className="bg-[#005f69] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#004a52] transition-colors">
                    Tout afficher
                  </button>
                </motion.div>

              ) : viewMode === "list" ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Hero top */}
                  {topPlace && !searchQuery && activeFilter === "all" && (
                    <div className="mb-6">
                      <HeroCard place={topPlace} onClick={handleClick} onItinerary={handleItinerary} />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-4">
                    {(searchQuery || activeFilter !== "all" ? filtered : restPlaces).length} établissement{(searchQuery || activeFilter !== "all" ? filtered : restPlaces).length !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-3">
                    {(searchQuery || activeFilter !== "all" ? filtered : restPlaces).map((place, i) => (
                      <ListCard key={place.id} place={place} index={i} onClick={handleClick} onItinerary={handleItinerary} />
                    ))}
                  </div>
                </motion.div>

              ) : (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {topPlace && !searchQuery && activeFilter === "all" && (
                    <div className="mb-6">
                      <HeroCard place={topPlace} onClick={handleClick} onItinerary={handleItinerary} />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-4">
                    {(searchQuery || activeFilter !== "all" ? filtered : restPlaces).length} établissements
                  </p>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(searchQuery || activeFilter !== "all" ? filtered : restPlaces).map((place, i) => (
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
