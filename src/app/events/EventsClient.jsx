"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Calendar, MapPin, Tag, Users, Ticket,
  MagnifyingGlass, X, Funnel, ArrowUpRight,
  SlidersHorizontal, CaretRight, Confetti, Star
} from "@phosphor-icons/react";
import { fetchAllEvents, fetchEventCategories, searchEvents } from "@/app/services/api";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};
const formatDateShort = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};
const getMinPrice = (tickets) => {
  const prices = (tickets ?? []).map((t) => t.price).filter((p) => p > 0);
  return prices.length === 0 ? "Gratuit" : Math.min(...prices).toLocaleString() + " FCFA";
};
const getEventImage = (event) =>
  event.images?.length > 0 ? event.images[0].url : "/images/logo.png";

/* ── Logique hero event ── */
function isWeekendEvent(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const day = d.getDay(); // 0=dim, 5=ven, 6=sam
  const hour = d.getHours();
  return day === 0 || day === 6 || (day === 5 && hour >= 18);
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const diffDays = (new Date(dateStr) - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
}

// Un event dont la date n'est pas encore passée
function isNotPast(dateStr) {
  if (!dateStr) return true;
  return new Date(dateStr) >= new Date();
}

function selectHeroEvent(events) {
  if (!events.length) return null;

  // 1. Event weekend proche (dans les 7 jours)
  const weekendEvents = events
    .filter(e => isWeekendEvent(e.start_date) && isUpcoming(e.start_date))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  if (weekendEvents.length > 0) return { event: weekendEvents[0], label: "weekend" };

  // 2. Bon plan (is_featured) — uniquement si date pas passée
  const featured = events
    .filter(e => e.is_featured && isNotPast(e.start_date))
    .sort((a, b) => (a.featured_order ?? 99) - (b.featured_order ?? 99));
  if (featured.length > 0) return { event: featured[0], label: "featured" };

  // 3. Premier event sans filtre
  return { event: events[0], label: null };
}

/* ── Featured hero card ── */
function HeroCard({ event, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(event)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl"
      style={{ height: "480px" }}
    >
      <Image
        src={getEventImage(event)}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* badges top */}
      <div className="absolute top-5 left-5 flex gap-2">
        {event.is_featured && isNotPast(event.start_date) && (
          <span className="bg-[#692C00] text-white text-[11px] font-black px-3 py-1.5 rounded-full tracking-wide">
            ✦ À LA UNE
          </span>
        )}
        {event.category && (
          <span className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
            {event.category.title}
          </span>
        )}
      </div>

      {/* content bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.15em] mb-2">
          {formatDate(event.start_date)}
        </p>
        <h2 className="text-white text-2xl sm:text-3xl font-black leading-tight mb-3 max-w-xl" style={{ color: "#ffffff" }}>
          {event.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-5">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#00949f]" />
            {event.location_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {event.reservations_count ?? 0} réservations
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white font-black text-lg">{getMinPrice(event.tickets)}</span>
          <span className="flex items-center gap-2 bg-white text-[#005f69] font-black text-sm px-5 py-2.5 rounded-full group-hover:bg-[#005f69] group-hover:text-white transition-colors duration-300">
            Voir les détails
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── List row card ── */
function ListCard({ event, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(event)}
      className="group flex items-stretch gap-0 cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-[#005f69]/8 hover:border-[#005f69]/20 transition-all duration-300"
    >
      {/* Date pill - left accent */}
      <div className="flex-shrink-0 w-16 sm:w-20 bg-gradient-to-b from-[#005f69] to-[#004a52] flex flex-col items-center justify-center py-4 gap-0.5">
        <span className="text-white/70 text-[9px] font-black uppercase tracking-widest">
          {event.start_date ? new Date(event.start_date).toLocaleDateString("fr-FR", { month: "short" }) : "—"}
        </span>
        <span className="text-white text-2xl font-black leading-none">
          {event.start_date ? new Date(event.start_date).getDate() : "—"}
        </span>
        <span className="text-white/50 text-[9px] font-bold">
          {event.start_date ? new Date(event.start_date).getFullYear() : ""}
        </span>
      </div>

      {/* Image */}
      <div className="relative flex-shrink-0 w-28 sm:w-36 overflow-hidden">
        <Image
          src={getEventImage(event)}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {event.is_featured && isNotPast(event.start_date) && (
          <div className="absolute top-2 left-2">
            <span className="bg-[#692C00] text-white text-[9px] font-black px-2 py-0.5 rounded-full">★ UNE</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
        <div>
          {event.category && (
            <span className="inline-flex items-center gap-1 text-[#005f69] text-[10px] font-black uppercase tracking-widest mb-1.5">
              <Tag className="w-2.5 h-2.5" />
              {event.category.title}
            </span>
          )}
          <h3 className="font-black text-gray-900 text-sm sm:text-base leading-snug mb-2 group-hover:text-[#005f69] transition-colors duration-200 line-clamp-2">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#005f69]" />
              <span className="truncate max-w-[120px]">{event.location_name}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.reservations_count ?? 0} rés.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-[#692C00]" />
            <span className="font-black text-[#692C00] text-sm">{getMinPrice(event.tickets)}</span>
          </div>
          <span className="flex items-center gap-1 text-[#005f69] text-xs font-black">

            Voir <CaretRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Compact grid card ── */
/* ── Compact grid card ── */
function GridCard({ event, index, onClick }) {
  const price = getMinPrice(event.tickets);
  const isFree = price === "Gratuit";
  const dateStr = formatDateShort(event.start_date);
  const featuredActive = event.is_featured && isNotPast(event.start_date);

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => onClick(event)}
      whileHover={{ y: -8, boxShadow: "0 0 0 4px #ffffff, 0 24px 56px rgba(0,0,0,0.35)" }}
      style={{
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        border: "4px solid #ffffff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        cursor: "pointer",
        height: "320px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <Image
          src={getEventImage(event)}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.82) 100%)",
          zIndex: 1,
        }} />
      </div>

      {/* Badge top-left : date */}
      {dateStr && (
        <div style={{
          position: "absolute", top: 14, left: 14, zIndex: 3,
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
          border: "2px solid rgba(255,255,255,0.7)", borderRadius: "999px",
          padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#fff",
          letterSpacing: "0.04em", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <Calendar style={{ width: 11, height: 11 }} />
          {dateStr}
        </div>
      )}

      {/* Badge top-right : lieu */}
      {event.location_name && (
        <div style={{
          position: "absolute", top: 14, right: 14, zIndex: 3,
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: "999px",
          padding: "4px 10px", fontSize: 10, fontWeight: 600, color: "#fff",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <MapPin weight="fill" style={{ width: 10, height: 10 }} />
          {event.location_name.length > 18 ? event.location_name.slice(0, 18) + "…" : event.location_name}
        </div>
      )}

      {/* Body bas */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "16px 16px 18px",
        display: "flex", flexDirection: "column", gap: 8,
        zIndex: 2,
      }}>
        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {featuredActive && (
            <span style={{
              background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.45)",
              borderRadius: "999px", padding: "2px 10px",
              fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "0.03em",
            }}>✦ À la une</span>
          )}
          {event.category && (
            <span style={{
              background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.45)",
              borderRadius: "999px", padding: "2px 10px",
              fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "0.03em",
            }}>{event.category.title}</span>
          )}
        </div>

        {/* Titre */}
        <h3 style={{
          margin: 0, fontSize: 17, fontWeight: 800, color: "#fff",
          lineHeight: 1.25, letterSpacing: "-0.01em",
          textShadow: "0 1px 6px rgba(0,0,0,0.4)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {event.title}
          {featuredActive && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 16, height: 16, background: "#005f69", borderRadius: "50%",
              marginLeft: 6, verticalAlign: "middle",
            }}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </h3>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 8, borderTop: "1.5px solid rgba(255,255,255,0.22)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              <Users style={{ width: 13, height: 13 }} />
              {event.reservations_count ?? 0}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              <Ticket style={{ width: 13, height: 13 }} />
              {isFree ? "Gratuit" : price}
            </span>
          </div>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#ffffff", color: "#005f69",
              border: "none", borderRadius: "999px",
              padding: "6px 14px", fontSize: 11, fontWeight: 800,
              cursor: "pointer", letterSpacing: "0.02em",
              transition: "background 0.15s, transform 0.15s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => { e.stopPropagation(); onClick(event); }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e6f7f8"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <ArrowUpRight style={{ width: 12, height: 12 }} />
            Réserver
          </button>
        </div>
      </div>
    </motion.article>
  );
}
/* ── [AJOUT] Mobile filter drawer ── */
function MobileFilterDrawer({ open, onClose, searchQuery, onSearch, sortBy, setSortBy, categories, activeCategory, setActiveCategory }) {
  const activeCount = (sortBy !== "featured" ? 1 : 0) + (activeCategory ? 1 : 0) + (searchQuery ? 1 : 0);
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
                    type="text" value={searchQuery} onChange={(e) => onSearch(e.target.value)}
                    placeholder="Nom, lieu..."
                    className="w-full pl-9 pr-9 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f69]/25 focus:border-[#005f69] text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => onSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Trier par</p>
                <div className="flex flex-wrap gap-2">
                  {[{ key: "featured", label: "Mis en avant" }, { key: "date", label: "Date" }, { key: "price", label: "Prix" }].map(({ key, label }) => (
                    <button key={key} onClick={() => setSortBy(key)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${sortBy === key ? "bg-[#005f69] text-white border-[#005f69]" : "text-gray-500 border-gray-200"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Catégories</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${!activeCategory ? "bg-[#005f69] text-white border-[#005f69]" : "text-gray-500 border-gray-200"}`}>
                    Toutes
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setActiveCategory((p) => p?.id === cat.id ? null : cat)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${activeCategory?.id === cat.id ? "bg-[#692C00] text-white border-[#692C00]" : "text-gray-500 border-gray-200"}`}>
                      {cat.title}
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

/* ══ MAIN PAGE ══ */
export default function EventsPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "date" | "price"
  const [drawerOpen, setDrawerOpen] = useState(false); // [AJOUT]
  const searchTimeout = useRef(null);
  const router = useRouter();
  useEffect(() => {
    fetchAllEvents()
      .then((data) => { if (data?.success) setAllEvents(data?.data ?? []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEventCategories()
      .then((data) => {
        if (data?.success) setCategories(data?.data ?? []);
      })
      .catch(console.error);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim()) { setSearchResults(null); return; }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchEvents(query.trim());
        if (data.success) setSearchResults(data.data ?? []);
      } catch (err) { console.error(err); }
      finally { setSearching(false); }
    }, 400);
  }, []);

  const handleEventClick = (event) => {
    router.push(`/events/details?eventId=${event.id}`);
  };

  const filteredEvents = useMemo(() => {
    const base = searchResults ?? allEvents;
    const byCat = activeCategory
      ? base.filter((e) => e.event_category_id === activeCategory.id)
      : base;

    return [...byCat].sort((a, b) => {
      if (sortBy === "featured") {
        const aFeatured = a.is_featured && isNotPast(a.start_date);
        const bFeatured = b.is_featured && isNotPast(b.start_date);
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        return (a.featured_order ?? 99) - (b.featured_order ?? 99);
      }
      if (sortBy === "date") {
        return new Date(a.start_date) - new Date(b.start_date);
      }
      if (sortBy === "price") {
        const priceA = Math.min(...(a.tickets ?? []).map((t) => t.price).filter((p) => p > 0), Infinity);
        const priceB = Math.min(...(b.tickets ?? []).map((t) => t.price).filter((p) => p > 0), Infinity);
        return priceA - priceB;
      }
      return 0;
    });
  }, [allEvents, searchResults, activeCategory, sortBy]);

  const heroResult = searchQuery || activeCategory ? null : selectHeroEvent(filteredEvents);
  const heroEvent = heroResult?.event ?? null;
  const heroLabel = heroResult?.label ?? null;
  const listEvents = filteredEvents.filter((e) => e.id !== heroEvent?.id);

  const activeFilterCount = (sortBy !== "featured" ? 1 : 0) + (activeCategory ? 1 : 0) + (searchQuery ? 1 : 0); // [AJOUT]

  /* ── Loading ── */
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

      {/* [AJOUT] Drawer mobile */}
      <MobileFilterDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        searchQuery={searchQuery} onSearch={handleSearch}
        sortBy={sortBy} setSortBy={setSortBy}
        categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
              <Link href="/" className="hover:text-[#005f69] transition-colors">Accueil</Link>
              <CaretRight className="w-3 h-3" />
              <span className="text-[#005f69]">Événements</span>
            </div>
            <h1 className="title-hero text-gray-900" style={{ fontSize: "32px" }}>
              Tous les{" "}
              <span className="title-accent">événements</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              {loading ? "..." : `${allEvents.length} événement${allEvents.length !== 1 ? "s" : ""} disponible${allEvents.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* View toggle — [AJOUT] bouton Filtres mobile à gauche */}
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
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === "list" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${viewMode === "grid" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Grille
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ════ SIDEBAR FILTERS — [MODIF] hidden sur mobile ════ */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:block w-full lg:w-64 flex-shrink-0 space-y-4"
          >
            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Recherche</p>
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Nom, lieu..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f69]/25 focus:border-[#005f69] text-sm transition-all"
                />
                {searchQuery && (
                  <button onClick={() => handleSearch("")}
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
                  { key: "featured", label: "Mis en avant" },
                  { key: "date", label: "Date (proche)" },
                  { key: "price", label: "Prix (croissant)" },
                ].map(({ key, label }) => (
                  <button key={key}
                    onClick={() => setSortBy(key)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${sortBy === key
                      ? "bg-[#005f69]/10 text-[#005f69]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    {sortBy === key && <span className="mr-1.5 text-[#005f69]">›</span>}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Funnel className="w-3.5 h-3.5" /> Catégories
              </p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${!activeCategory
                    ? "bg-[#005f69] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                >
                  Toutes les catégories
                </button>
                {categories.map((cat) => (
                  <button key={cat.id}
                    onClick={() => setActiveCategory((p) => p?.id === cat.id ? null : cat)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeCategory?.id === cat.id
                      ? "bg-[#692C00] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                  >
                    <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* ════ MAIN CONTENT ════ */}
          <div className="flex-1 min-w-0">

            <AnimatePresence mode="wait">
              {searching ? (
                <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                  ))}
                </motion.div>

              ) : filteredEvents.length === 0 ? (
                <motion.div key="empty"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 bg-white rounded-3xl border border-gray-100"
                >
                  <div className="mb-4"><Ticket className="w-12 h-12 text-gray-300 mx-auto" /></div>
                  <p className="text-gray-700 font-black text-lg mb-1">Aucun événement trouvé</p>
                  <p className="text-gray-400 text-sm mb-6">Essayez d'autres filtres ou mots-clés</p>
                  <button
                    onClick={() => { setSearchQuery(""); setActiveCategory(null); setSearchResults(null); }}
                    className="bg-[#005f69] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#004a52] transition-colors"
                  >
                    Tout afficher
                  </button>
                </motion.div>

              ) : viewMode === "list" ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Hero event */}
                  {heroEvent && (
                    <div className="mb-6">
                      {heroLabel === "weekend" && (
                        <p className="text-xs font-black uppercase tracking-widest text-[#005f69] mb-3 flex items-center gap-2">
                          <Confetti className="w-3.5 h-3.5" /> Bons plans du weekend
                        </p>
                      )}
                      {heroLabel === "featured" && (
                        <p className="text-xs font-black uppercase tracking-widest text-[#692C00] mb-3 flex items-center gap-2">
                          <Star className="w-3.5 h-3.5" /> Bon plan
                        </p>
                      )}
                      <HeroCard event={heroEvent} onClick={handleEventClick} />
                    </div>
                  )}

                  {/* Count */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      {filteredEvents.length} événement{(searchQuery || activeCategory ? filteredEvents : listEvents).length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* List */}
                  <div className="space-y-3">
                    {(searchQuery || activeCategory ? filteredEvents : listEvents).map((event, i) => (
                      <ListCard key={event.id} event={event} index={i} onClick={handleEventClick} />
                    ))}
                  </div>
                </motion.div>

              ) : (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Hero event */}
                  {heroEvent && (
                    <div className="mb-6">
                      {heroLabel === "weekend" && (
                        <p className="text-xs font-black uppercase tracking-widest text-[#005f69] mb-3 flex items-center gap-2">
                          <Confetti className="w-3.5 h-3.5" /> Bons plans du weekend
                        </p>
                      )}
                      {heroLabel === "featured" && (
                        <p className="text-xs font-black uppercase tracking-widest text-[#692C00] mb-3 flex items-center gap-2">
                          <Star className="w-3.5 h-3.5" /> Bon plan
                        </p>
                      )}
                      <HeroCard event={heroEvent} onClick={handleEventClick} />
                    </div>
                  )}

                  {/* Count */}
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
                    {(searchQuery || activeCategory ? filteredEvents : listEvents).length} événements
                  </p>

                  {/* Grid */}
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(searchQuery || activeCategory ? filteredEvents : listEvents).map((event, i) => (
                      <GridCard key={event.id} event={event} index={i} onClick={handleEventClick} />
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