"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Calendar, MapPin, Tag, Users, Ticket,
  MagnifyingGlass, X, Funnel, ArrowUpRight,
  SlidersHorizontal, CaretRight
} from "@phosphor-icons/react";

const API_BASE_URL = "https://api.ticketche.com/api/v2";

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
        {event.is_featured && (
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
            Réserver
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
        {event.is_featured && (
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
function GridCard({ event, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => onClick(event)}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#005f69]/10 hover:border-[#005f69]/20 transition-all duration-300"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={getEventImage(event)}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {formatDateShort(event.start_date)}
          </span>
          {event.is_featured && (
            <span className="bg-[#692C00] text-white text-[9px] font-black px-2 py-1 rounded-full">★</span>
          )}
        </div>
      </div>
      <div className="p-4">
        {event.category && (
          <span className="text-[#005f69] text-[10px] font-black uppercase tracking-widest">{event.category.title}</span>
        )}
        <h3 className="font-black text-gray-900 text-sm leading-snug mt-1 mb-3 line-clamp-2 group-hover:text-[#005f69] transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin className="w-3 h-3 text-[#005f69] flex-shrink-0" />
          <span className="truncate">{event.location_name}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="font-black text-[#692C00] text-sm">{getMinPrice(event.tickets)}</span>
          <span className="text-[10px] text-gray-400">{event.reservations_count ?? 0} rés.</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ══ MAIN PAGE ══ */
export default function EventsPage() {
  const [allEvents, setAllEvents]         = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [searching, setSearching]         = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [categories, setCategories]       = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewMode, setViewMode]           = useState("list"); // "list" | "grid"
  const [sortBy, setSortBy]               = useState("featured"); // "featured" | "date" | "price"
  const searchTimeout = useRef(null);
const router = useRouter();
  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setAllEvents(data.data ?? []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/event_categories`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setCategories(data.data ?? []); })
      .catch(console.error);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim()) { setSearchResults(null); return; }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API_BASE_URL}/events/search?${new URLSearchParams({ query: query.trim() })}`);
        const data = await res.json();
        if (data.success) setSearchResults(data.data ?? []);
      } catch (err) { console.error(err); }
      finally { setSearching(false); }
    }, 400);
  }, []);

 const handleEventClick = (event) => {
  router.push(`/events/${event.id}`);
};

  const filteredEvents = useMemo(() => {
    const base = searchResults ?? allEvents;
    const byCat = activeCategory
      ? base.filter((e) => e.event_category_id === activeCategory.id)
      : base;

    return [...byCat].sort((a, b) => {
      if (sortBy === "featured") {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
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

  const featuredEvent = filteredEvents.find((e) => e.is_featured) ?? filteredEvents[0];
  const listEvents    = filteredEvents.filter((e) => e.id !== featuredEvent?.id);

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

          {/* View toggle */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                viewMode === "list" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                viewMode === "grid" ? "bg-[#005f69] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Grille
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ════ SIDEBAR FILTERS ════ */}
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
                  { key: "date",     label: "Date (proche)" },
                  { key: "price",    label: "Prix (croissant)" },
                ].map(({ key, label }) => (
                  <button key={key}
                    onClick={() => setSortBy(key)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      sortBy === key
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
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    !activeCategory
                      ? "bg-[#005f69] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  Toutes les catégories
                </button>
                {categories.map((cat) => (
                  <button key={cat.id}
                    onClick={() => setActiveCategory((p) => p?.id === cat.id ? null : cat)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      activeCategory?.id === cat.id
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
                  <div className="text-5xl mb-4">🎟️</div>
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
                  {/* Hero featured */}
                  {featuredEvent && !searchQuery && !activeCategory && (
                    <div className="mb-6">
                      <HeroCard event={featuredEvent} onClick={handleEventClick} />
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
                  {/* Hero featured */}
                  {featuredEvent && !searchQuery && !activeCategory && (
                    <div className="mb-6">
                      <HeroCard event={featuredEvent} onClick={handleEventClick} />
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
