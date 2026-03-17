"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Tag, Users, Ticket, MagnifyingGlass, X, SlidersHorizontal, Sparkle, ArrowRight } from "@phosphor-icons/react";
import { fetchAllEvents, fetchEventCategories, searchEvents } from "@/app/services/api";



/* ── Confetti particles floating up ── */
function ConfettiDot({ x, color, delay, dur, size }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, bottom: "-10px", width: size, height: size, background: color, opacity: 0 }}
      animate={{ y: [0, -120, -220], opacity: [0, 0.5, 0], x: [0, Math.random() > 0.5 ? 12 : -12, 0] }}
      transition={{ duration: dur, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

const CONFETTI = [
  { x: "8%",  color: "#005f69", delay: 0,   dur: 5,   size: 6 },
  { x: "22%", color: "#6a2d02", delay: 1.2, dur: 6,   size: 4 },
  { x: "38%", color: "#005f69", delay: 0.5, dur: 4.5, size: 5 },
  { x: "55%", color: "#6a2d02", delay: 2,   dur: 5.5, size: 3 },
  { x: "70%", color: "#005f69", delay: 0.8, dur: 6,   size: 5 },
  { x: "85%", color: "#6a2d02", delay: 1.7, dur: 4.8, size: 4 },
  { x: "93%", color: "#005f69", delay: 3,   dur: 5.2, size: 6 },
  { x: "15%", color: "#6a2d02", delay: 2.5, dur: 7,   size: 3 },
  { x: "47%", color: "#005f69", delay: 1,   dur: 5.8, size: 4 },
  { x: "62%", color: "#6a2d02", delay: 3.5, dur: 4.2, size: 5 },
];

export const EventsSection = () => {
  const [allEvents, setAllEvents]         = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [searching, setSearching]         = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [categories, setCategories]       = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const searchTimeout = useRef(null);
  useEffect(() => {
    fetchAllEvents()
      .then((data) => { if (data?.success) setAllEvents(data?.data ?? []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEventCategories()
      .then((data) => { if (data?.success) setCategories(data?.data ?? []); })
      .catch(console.error);
  }, []);

  const filteredEvents = useMemo(() => {
    const base = searchResults ?? allEvents;
    if (!activeCategory) return base;
    return base.filter((e) => e.event_category_id === activeCategory.id);
  }, [allEvents, searchResults, activeCategory]);

  const displayedEvents = [...filteredEvents]
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      if (a.is_featured && b.is_featured) return (a.featured_order ?? 99) - (b.featured_order ?? 99);
      return 0;
    })
    .slice(0, 6);

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

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory((prev) => prev?.id === cat?.id ? null : cat);
  }, []);

  const resetFilters = () => { setSearchQuery(""); setActiveCategory(null); setSearchResults(null); };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const getMinPrice = (tickets) => {
    const prices = (tickets ?? []).map((t) => t.price).filter((p) => p > 0);
    return prices.length === 0 ? "Gratuit" : Math.min(...prices).toLocaleString() + " FCFA";
  };

  const getEventImage = (event) =>
    event.images?.length > 0 ? event.images[0].url : "/images/logo.png";

  const handleEventClick = (event) => {
    localStorage.setItem("selectedEvent", JSON.stringify(event));
    window.open(`/events/${event.id}`, "_blank");
  };

  const isFiltering = !!searchQuery.trim() || !!activeCategory;

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 36, scale: 0.97 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  if (loading)
    return (
      <section className="pt-10 pb-20 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 py-16">
            {[0, 0.2, 0.4].map((d, i) => (
              <motion.div key={i} className="w-3 h-3 rounded-full bg-[#005f69]"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Infinity, delay: d }}
              />
            ))}
          </div>
        </div>
      </section>
    );

  return (
    <section id="events" className="pb-24 relative overflow-hidden bg-gradient-to-b from-white via-[#FFF1E6]/25 to-white">

      {/* ── Gradient backdrop ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep radial glow teal top-left */}
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[120px] opacity-10"
          style={{ background: "radial-gradient(circle, #005f69, transparent)", left: "-15%", top: "-20%" }} />
        {/* Deep radial glow brown bottom-right */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-8"
          style={{ background: "radial-gradient(circle, #6a2d02, transparent)", right: "-10%", bottom: "-10%" }} />
      </div>

      {/* ── Dot-grid ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #005f69 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Super label */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-5 py-2 rounded-full mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Sparkle className="w-4 h-4 text-[#005f69]" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Billetterie en ligne
            </span>
          </motion.div>

          <h2 className="title-section mb-4">
            Évènements{" "}
            <span className="relative inline-block">
              <span className="text-[#005f69]">
                disponibles
              </span>
              <motion.svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 6" fill="none"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ originX: 0 }}>
                <path d="M0 3 Q75 0 150 3 Q225 6 300 3" stroke="url(#evGrad)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="evGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#005f69"/>
                    <stop offset="60%" stopColor="#00949f"/>
                    <stop offset="100%" stopColor="#6a2d02"/>
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </h2>

          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Découvrez les prochains évènements et réservez vos tickets en quelques clics.
          </p>
        </motion.div>

        {/* ── Search + Categories ── */}
        <motion.div
          className="mb-8 flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un évènement, un lieu..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f69]/30 focus:border-[#005f69] transition-all duration-200 text-sm shadow-sm"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#005f69] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {searchQuery && !searching && (
              <button onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap items-center">
            <motion.button
              onClick={() => handleCategoryClick(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border transition-all duration-200 ${
                !activeCategory
                  ? "bg-[#005f69] text-white border-[#005f69] shadow-lg shadow-[#005f69]/30"
                  : "bg-white text-gray-600 border-gray-200 shadow-sm hover:border-[#005f69]/50 hover:text-[#005f69]"
              }`}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              <SlidersHorizontal className="w-4 h-4" /> Tous
            </motion.button>

            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border transition-all duration-200 ${
                  activeCategory?.id === cat.id
                    ? "bg-[#6a2d02] text-white border-[#6a2d02] shadow-lg shadow-[#6a2d02]/30"
                    : "bg-white text-gray-600 border-gray-200 shadow-sm hover:border-[#6a2d02]/50 hover:text-[#6a2d02]"
                }`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              >
                <Tag className="w-4 h-4" /> {cat.title}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Result count ── */}
        <AnimatePresence>
          {isFiltering && !searching && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-400 mb-4 font-medium"
            >
              {displayedEvents.length === 0
                ? "Aucun résultat trouvé"
                : `${filteredEvents.length} évènement${filteredEvents.length > 1 ? "s" : ""} trouvé${filteredEvents.length > 1 ? "s" : ""}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {searching ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse border border-gray-200" />
              ))}
            </motion.div>

          ) : displayedEvents.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MagnifyingGlass className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-600 text-lg font-bold">Aucun évènement trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Essayez d'autres mots-clés ou retirez les filtres</p>
              <button onClick={resetFilters} className="mt-5 text-[#005f69] text-sm font-bold hover:underline underline-offset-2">
                Réinitialiser la recherche
              </button>
            </motion.div>

          ) : (
            <motion.div
              key={`grid-${activeCategory?.id ?? "all"}-${searchQuery}`}
              className="grid md:grid-cols-3 gap-5"
              variants={containerVariants} initial="hidden" animate="visible"
            >
              {displayedEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  layout
                  onClick={() => handleEventClick(event)}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
                  className="group bg-gray-50 border border-gray-200 p-3 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-[#005f69]/10 transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full pt-[56%] overflow-hidden rounded-xl">
                    <motion.div className="absolute inset-0"
                      whileHover={{ scale: 1.07 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                      <Image src={getEventImage(event)} alt={event.title} fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                      {/* Dark overlay gets lighter on hover */}
                      <div className="absolute inset-0 rounded-xl bg-black/10 group-hover:bg-black/5 transition-all duration-400" />
                    </motion.div>

                    {/* Category badge */}
                    {event.category && (
                      <motion.div
                        className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-md"
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}>
                        <Tag className="w-3 h-3 text-[#005f69]" />
                        <span className="text-xs font-semibold text-gray-800">{event.category.title}</span>
                      </motion.div>
                    )}
                    {/* Featured badge */}
                    {event.is_featured && (
                      <div className="absolute top-3 right-3 bg-[#6a2d02] rounded-full px-3 py-1 shadow-md">
                        <span className="text-xs font-bold text-white">✦ À la une</span>
                      </div>
                    )}
                    {/* Format badge */}
                    {event.format && (
                      <div className="absolute bottom-3 right-3 bg-[#005f69]/80 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-semibold text-white">{event.format}</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="py-4 px-2">
                    <motion.h3
                      className="text-md font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#005f69] transition-colors duration-300"
                    >
                      {event.title}
                    </motion.h3>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-[#005f69] flex-shrink-0" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-[#005f69] flex-shrink-0" />
                        <span className="truncate">{event.location_name}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      {/* Price */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#6a2d02]/20 flex items-center justify-center">
                          <Ticket className="w-3.5 h-3.5 text-[#c4693a]" />
                        </div>
                        <span className="font-bold text-sm text-[#c4693a]">{getMinPrice(event.tickets)}</span>
                      </div>
                      {/* Reservations */}
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {event.reservations_count ?? 0} réservation{(event.reservations_count ?? 0) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA ── */}
        <motion.div className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}>
          <motion.a
            href="/events"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 cursor-pointer bg-[#005f69] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-[#005f69]/30 relative overflow-hidden group no-underline"
            whileHover={{ scale: 1.04, boxShadow: "0 28px 56px -8px rgba(0, 95, 105, 0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="absolute inset-0 bg-[#004a52] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Voir tous les évènements</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};