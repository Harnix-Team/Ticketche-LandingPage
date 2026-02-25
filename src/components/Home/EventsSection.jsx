"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Tag, Users, Ticket, Search, X, SlidersHorizontal } from "lucide-react";

const API_BASE_URL = "https://api.ticketche.com/api/v2";

export const EventsSection = () => {
  const [allEvents, setAllEvents] = useState([]);   // tous les events (source de vérité)
  const [searchResults, setSearchResults] = useState(null); // null = pas de recherche active
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // objet { id, title } ou null
  const searchTimeout = useRef(null);

  // ─── Charger TOUS les events une seule fois ──────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setAllEvents(data.data ?? []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ─── Charger les catégories ──────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE_URL}/event_categories`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setCategories(data.data ?? []); })
      .catch(console.error);
  }, []);

  // ─── Events affichés = filtre client sur allEvents OU résultats de recherche ─
  const filteredEvents = useMemo(() => {
    // Si une recherche API est active, on part des résultats de recherche
    const base = searchResults ?? allEvents;

    // Filtre client par catégorie
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

  // ─── Recherche via API (texte) avec debounce ─────────────────────────────────
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!query.trim()) {
      // Vider la recherche → revenir aux allEvents (filtre catégorie reste actif)
      setSearchResults(null);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({ query: query.trim() });
        const res = await fetch(`${API_BASE_URL}/events/search?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) setSearchResults(data.data ?? []);
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  // ─── Clic catégorie (filtre client pur, pas d'appel API) ─────────────────────
  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory((prev) => prev?.id === cat?.id ? null : cat);
  }, []);

  // ─── Reset complet ───────────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
    setSearchResults(null);
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const getMinPrice = (tickets) => {
    const prices = (tickets ?? []).map((t) => t.price).filter((p) => p > 0);
    if (prices.length === 0) return "Gratuit";
    return Math.min(...prices).toLocaleString() + " FCFA";
  };

  const getEventImage = (event) => {
    if (event.images && event.images.length > 0) return event.images[0].url;
    return "/images/logo.png";
  };

  const handleEventClick = (event) => {
    localStorage.setItem("selectedEvent", JSON.stringify(event));
    window.open(`/events/${event.id}`, "_blank");
  };

  const isFiltering = !!searchQuery.trim() || !!activeCategory;

  // ─── Animations ──────────────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <section className="pt-10 lg:pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-600">Chargement des évènements...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Titre ── */}
        <motion.div
          className="text-center mb-10"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl md:text-4xl max-w-2xl mx-auto font-bold text-gray-800 mb-4">
            Évènements disponibles sur ticketché
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les prochains évènements et réservez vos tickets en quelques clics.
          </p>
        </motion.div>

        {/* ── Recherche + Filtres ── */}
        <motion.div
          className="mb-8 flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Champ de recherche */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un évènement, un lieu..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f69]/40 focus:border-[#005f69] transition-all duration-200 text-sm"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#005f69] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {searchQuery && !searching && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Catégories */}
          <div className="flex gap-2 flex-wrap items-center">
            <motion.button
              onClick={() => handleCategoryClick(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                !activeCategory
                  ? "bg-[#005f69] text-white border-[#005f69] shadow-md shadow-[#005f69]/20"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#005f69] hover:text-[#005f69]"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Tous
            </motion.button>

            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  activeCategory?.id === cat.id
                    ? "bg-[#692C00] text-white border-[#692C00] shadow-md shadow-[#692C00]/20"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#692C00] hover:text-[#692C00]"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Tag className="w-4 h-4" />
                {cat.title}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Compteur ── */}
        <AnimatePresence>
          {isFiltering && !searching && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-500 mb-4"
            >
              {displayedEvents.length === 0
                ? "Aucun résultat trouvé"
                : `${filteredEvents.length} évènement${filteredEvents.length > 1 ? "s" : ""} trouvé${filteredEvents.length > 1 ? "s" : ""}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Grille ── */}
        <AnimatePresence mode="wait">
          {searching ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </motion.div>
          ) : displayedEvents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Aucun évènement trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Essayez d'autres mots-clés ou retirez les filtres</p>
              <button onClick={resetFilters} className="mt-4 text-[#005f69] text-sm font-semibold hover:underline">
                Réinitialiser la recherche
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeCategory?.id ?? "all"}-${searchQuery}`}
              className="grid md:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  layout
                  onClick={() => handleEventClick(event)}
                  className="bg-gray-50 border border-gray-200 p-3 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative w-full pt-[56%] overflow-hidden rounded-2xl">
                    <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                      <Image
                        src={getEventImage(event)}
                        alt={event.title}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    </motion.div>

                    {event.category && (
                      <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                        <Tag className="w-3 h-3 text-[#005f69]" />
                        <span className="text-xs font-semibold text-gray-800">{event.category.title}</span>
                      </div>
                    )}
                    {event.is_featured && (
                      <div className="absolute top-3 right-3 bg-[#692C00] rounded-full px-3 py-1 shadow-md">
                        <span className="text-xs font-semibold text-white">À la une</span>
                      </div>
                    )}
                    {event.format && (
                      <div className="absolute bottom-3 right-3 bg-[#005f69] rounded-full px-3 py-1 shadow-md">
                        <span className="text-xs font-semibold text-white">{event.format}</span>
                      </div>
                    )}
                  </div>

                  <div className="py-4 px-2">
                    <motion.h3
                      className="text-md font-bold text-gray-900 mb-2"
                      whileHover={{ color: "#005f69" }}
                      transition={{ duration: 0.2 }}
                    >
                      {event.title}
                    </motion.h3>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 text-[#005f69]" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 text-[#005f69]" />
                      <span className="truncate">{event.location_name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[#692C00]">
                        <Ticket className="w-4 h-4" />
                        <span className="font-semibold text-sm">{getMinPrice(event.tickets)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.reservations_count ?? 0} réservation
                          {(event.reservations_count ?? 0) > 1 ? "s" : ""}
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
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.a
            href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block cursor-pointer bg-gradient-to-r from-[#005f69] to-[#047a7f] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg relative overflow-hidden group no-underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#047a7f] to-[#005f69] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Voir tous les évènements
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};