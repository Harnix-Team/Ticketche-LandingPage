"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import { Navigation, Search, X, Car, Droplets, Wrench, SlidersHorizontal } from "lucide-react";

// Mapping des filtres avec icônes et labels
const FILTER_OPTIONS = [
  { key: "all", label: "Tous", icon: SlidersHorizontal },
  { key: "parking", label: "Parking", icon: Car },
  { key: "lavage", label: "Lavage", icon: Droplets },
  { key: "garage", label: "Garage", icon: Wrench },
];

export const EstablishmentsSection = () => {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // États pour la recherche et le filtrage
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const response = await fetchAllPlaces();
        if (response.success) {
          setEstablishments(response.data);
        }
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();

  }, []);

  const formatTicketcheImage = (img) => {
    if (!img) return "/images/logo.png";
    return img.replace("/storage/app/public", "/storage");
  };

  const getPlaceImage = (place) => {
    if (place.images && place.images.length > 0) {
      return formatTicketcheImage(place.images[0].link);
    }
    return "/images/Space/recom1.png";
  };

  const getServiceTags = (place) => {
    const activeServices = place.services
      .filter((service) => service.pivot.status === "ON")
      .map((service) => service.name);
    return [...new Set(activeServices)].slice(0, 3);
  };

  const getMinimumPrice = (place) => {
    if (place.minimum_price) return `${place.minimum_price} FCFA`;
    const activePrices = place.services
      .filter((service) => service.pivot.status === "ON")
      .map((service) => service.pivot.price);
    if (activePrices.length > 0) return `${Math.min(...activePrices)} FCFA`;
    return "Sur demande";
  };

  const getPlaceRating = (place) => {
    if (place.noteUsers && place.noteUsers.length > 0) {
      const total = place.noteUsers.reduce((sum, note) => sum + parseFloat(note.star), 0);
      return (total / place.noteUsers.length).toFixed(1);
    }
    return null;
  };

  const handlePlaceClick = (place) => {
    localStorage.setItem("selectedPlace", JSON.stringify(place));
    window.open(`/places/${place.id}`, "_blank");
  };

  const handleItineraryClick = (e, placeId) => {
    e.stopPropagation();
    window.open(`https://app.ticketche.com/places/itinerary?placeId=${placeId}`, "_blank");
  };

  // ─── Logique de filtrage et recherche ───────────────────────────────────────
  const filteredEstablishments = useMemo(() => {
    let result = [...establishments];

    // 1. Filtre par catégorie de service
    if (activeFilter !== "all") {
      result = result.filter((place) =>
        place.services.some(
          (service) =>
            service.pivot.status === "ON" &&
            service.name.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );
    }

    // 2. Filtre par recherche textuelle (nom, ville, services)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((place) => {
        const inName = place.name?.toLowerCase().includes(q);
        const inCity = place.city?.toLowerCase().includes(q);
        const inServices = place.services.some((s) =>
          s.name.toLowerCase().includes(q)
        );
        return inName || inCity || inServices;
      });
    }

    return result;
  }, [establishments, searchQuery, activeFilter]);

  // Afficher les 6 derniers après filtrage
  const displayedEstablishments = filteredEstablishments.slice(-6).reverse();

  // ─── Animations ─────────────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <section className="pt-10 lg:pt-30 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-600">Chargement des établissements...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-10 lg:pt-30 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (establishments.length === 0) return null;

  return (
    <section id="locations" className="pb-20 relative overflow-hidden">
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
            Quelques établissements disponibles sur ticketché
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez un réseau croissant de partenaires professionnels sélectionnés
            pour leur qualité de service et leur expertise.
          </p>
        </motion.div>

        {/* ── Barre de recherche + Filtres ── */}
        <motion.div
          className="mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Champ de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un établissement, une ville..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f69]/40 focus:border-[#005f69] transition-all duration-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Boutons de filtre */}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {FILTER_OPTIONS.map(({ key, label, icon: Icon }) => {
              const isActive = activeFilter === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-[#005f69] text-white border-[#005f69] shadow-md shadow-[#005f69]/20"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#005f69] hover:text-[#005f69]"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Compteur de résultats ── */}
        <AnimatePresence mode="wait">
          {(searchQuery || activeFilter !== "all") && (
            <motion.p
              key="result-count"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-500 mb-4"
            >
              {displayedEstablishments.length === 0
                ? "Aucun résultat trouvé"
                : `${displayedEstablishments.length} établissement${displayedEstablishments.length > 1 ? "s" : ""} trouvé${displayedEstablishments.length > 1 ? "s" : ""}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Grille des établissements ── */}
        <AnimatePresence mode="wait">
          {displayedEstablishments.length === 0 ? (
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
              <p className="text-gray-500 text-lg font-medium">Aucun établissement trouvé</p>
              <p className="text-gray-400 text-sm mt-1">
                Essayez d'autres mots-clés ou retirez les filtres
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                className="mt-4 text-[#005f69] text-sm font-semibold hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeFilter}-${searchQuery}`}
              className="grid md:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedEstablishments.map((place) => (
                <motion.div
                  key={place.id}
                  variants={itemVariants}
                  layout
                  onClick={() => handlePlaceClick(place)}
                  className="bg-gray-50 border border-gray-200 p-3 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image + badge rating */}
                  <div className="relative w-full pt-[56%] overflow-hidden rounded-2xl">
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={getPlaceImage(place)}
                        alt={place.name}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      />
                    </motion.div>

                    {getPlaceRating(place) && (
                      <motion.div
                        className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.span
                          className="text-yellow-500 text-lg"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          ★
                        </motion.span>
                        <span className="font-semibold text-gray-800">{getPlaceRating(place)}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="py-4 px-2">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {getServiceTags(place).map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="px-3 py-1 text-sm font-medium text-[#692C00] bg-white border border-[#692C00] rounded-full"
                          whileHover={{ scale: 1.05, backgroundColor: "#692C00", color: "#ffffff" }}
                          transition={{ duration: 0.2 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>

                    <motion.h3
                      className="text-md font-bold text-gray-900 mb-2"
                      whileHover={{ color: "#0f766e" }}
                      transition={{ duration: 0.2 }}
                    >
                      {place.name}
                    </motion.h3>

                    <div className="flex justify-between items-center">
                      <motion.div
                        className="flex items-center text-[#688AA2]"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-teal-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          whileHover={{ rotate: 15 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                        <span className="font-semibold text-sm">Tarif min. : {getMinimumPrice(place)}</span>
                      </motion.div>

                      <motion.button
                        onClick={(e) => handleItineraryClick(e, place.id)}
                        className="flex items-center gap-1.5 text-[#005f69] hover:text-[#047a7f] bg-[#005f69]/10 hover:bg-[#005f69]/20 px-3 py-1.5 rounded-lg transition-all duration-300 group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                        <span className="text-sm font-semibold">Itinéraire</span>
                      </motion.button>
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
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 95, 105, 0.3), 0 10px 10px -5px rgba(0, 95, 105, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#047a7f] to-[#005f69] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Profitez de nos services maintenant
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