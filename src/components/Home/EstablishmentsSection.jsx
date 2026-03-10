"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import { NavigationArrow, MagnifyingGlass, MapPin } from "@phosphor-icons/react";

/* ─── helpers ─────────────────────────────────── */
const formatTicketcheImage = (img) =>
  img ? img.replace("/storage/app/public", "/storage") : "/images/logo.png";

const getPlaceImage = (place) =>
  place.images?.length > 0
    ? formatTicketcheImage(place.images[0].link)
    : "/images/Space/recom1.png";

const getServiceTags = (place) =>
  [...new Set(
    place.services
      .filter((s) => s.pivot.status === "ON")
      .map((s) => s.name),
  )].slice(0, 3);

const getMinimumPrice = (place) => {
  if (place.minimum_price) return `${place.minimum_price} FCFA`;
  const prices = place.services
    .filter((s) => s.pivot.status === "ON")
    .map((s) => s.pivot.price);
  return prices.length > 0 ? `${Math.min(...prices)} FCFA` : "Sur demande";
};

const getPlaceRating = (place) => {
  if (!place.noteUsers?.length) return null;
  const total = place.noteUsers.reduce((s, n) => s + parseFloat(n.star), 0);
  return (total / place.noteUsers.length).toFixed(1);
};

/* ─── styles inline ────────────────────────────── */
const styles = {
  card: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    border: "4px solid #ffffff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
    cursor: "pointer",
    height: "320px",
    display: "flex",
    flexDirection: "column",
  },
  imageWrapper: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.82) 100%)",
    zIndex: 1,
  },
  badgeTop: {
    position: "absolute",
    top: "14px",
    left: "14px",
    zIndex: 3,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255,255,255,0.7)",
    borderRadius: "999px",
    padding: "4px 14px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  badgeCity: {
    position: "absolute",
    top: "14px",
    right: "14px",
    zIndex: 3,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "10px",
    fontWeight: 600,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  body: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    zIndex: 2,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  tag: {
    background: "rgba(255,255,255,0.18)",
    border: "1.5px solid rgba(255,255,255,0.45)",
    borderRadius: "999px",
    padding: "2px 10px",
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.95)",
    letterSpacing: "0.03em",
  },
  name: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    textShadow: "0 1px 6px rgba(0,0,0,0.4)",
  },
  checkIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "16px",
    height: "16px",
    background: "#00c8a0",
    borderRadius: "50%",
    marginLeft: "6px",
    verticalAlign: "middle",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "8px",
    borderTop: "1.5px solid rgba(255,255,255,0.22)",
  },
  price: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#ffffff",
  },
  priceIcon: {
    width: "14px",
    height: "14px",
    opacity: 0.85,
  },
  stats: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
  },
  itineraryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "#ffffff",
    color: "#005f69",
    border: "none",
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "11px",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "background 0.15s, transform 0.15s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  /* section */
  section: {
    padding: "20px 0 80px",
  },
 inner: {
  maxWidth: "90vw",
  margin: "0 auto",
  padding: "0 24px",
},
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "36px",
    gap: "16px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "40px",
    fontWeight: 900,
    color: "#0a1628",
    letterSpacing: "-0.02em",
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: "17px",
    color: "#6b7280",
    maxWidth: "540px",
    lineHeight: 1.7,
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #005f69, #00404a)",
    color: "#fff",
    borderRadius: "999px",
    padding: "10px 22px",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 4px 16px rgba(0,95,105,0.3)",
    transition: "transform 0.15s, box-shadow 0.15s",
    whiteSpace: "nowrap",
  },
  grid: {
    display: "grid",
    gap: "28px",
    width: "100%",
  },
  emptyWrapper: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#9ca3af",
  },
};

/* ─── PlaceCard ─────────────────────────────────── */
function PlaceCard({ place, onItinerary }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    localStorage.setItem("selectedPlace", JSON.stringify(place));
    window.open(`/places/${place.id}`, "_blank");
  };

  const rating = getPlaceRating(place);

  return (
    <motion.article
      onClick={handleClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, boxShadow: "0 0 0 4px #ffffff, 0 24px 56px rgba(0,0,0,0.35)" }}
      style={styles.card}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Image full card */}
      <div style={styles.imageWrapper}>
        <Image
          src={getPlaceImage(place)}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        <div style={styles.imageGradient} />
      </div>

      {/* Badge rating */}
      {rating && (
        <div style={styles.badgeTop}>
          <span>★</span>
          <span>{rating}</span>
        </div>
      )}

      {/* Badge ville */}
      {place.city && (
        <div style={styles.badgeCity}>
          <MapPin weight="fill" style={{ width: 10, height: 10 }} />
          {place.city}
        </div>
      )}

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.tags}>
          {getServiceTags(place).map((tag, i) => (
            <span key={i} style={styles.tag}>{tag}</span>
          ))}
        </div>

        <h3 style={styles.name}>
          {place.name}
          {rating && (
            <span style={styles.checkIcon}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </h3>

        <div style={styles.footer}>
          <div style={styles.stats}>
            {place.noteUsers?.length > 0 && (
              <span style={styles.statItem}>
                <svg width="13" height="13" viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {place.noteUsers.length}
              </span>
            )}
            <span style={styles.statItem}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              {getMinimumPrice(place)}
            </span>
          </div>

          <button
            style={styles.itineraryBtn}
            onClick={(e) => { e.stopPropagation(); onItinerary(place.id); }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e6f7f8"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <NavigationArrow style={{ width: 12, height: 12 }} />
            Itinéraire
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── variants ─────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

/* ─── MAIN ─────────────────────────────────────── */
export const EstablishmentsSection = () => {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeFilter, setActiveFilter]     = useState("all");
  const [gridCols, setGridCols]             = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640)       setGridCols(1);
      else if (w < 1024) setGridCols(2);
      else               setGridCols(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const response = await fetchAllPlaces();
        if (response.success) setEstablishments(response.data);
      } catch (_) { }
      finally { setLoading(false); }
    };
    loadPlaces();
  }, []);

  const handleItineraryClick = (placeId) => {
    window.open(`https://app.ticketche.com/places/itinerary?placeId=${placeId}`, "_blank");
  };

  const filteredEstablishments = useMemo(() => {
    let result = [...establishments];
    if (activeFilter !== "all")
      result = result.filter((p) =>
        p.services.some(
          (s) => s.pivot.status === "ON" &&
            s.name.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );
    if (searchQuery.trim())
      result = result.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.services.some((s) => s.name.toLowerCase().includes(q))
        );
      });
    return result;
  }, [establishments, searchQuery, activeFilter]);

  const displayedEstablishments = filteredEstablishments.slice(-4).reverse();

  /* ── Loading ── */
  if (loading)
    return (
      <section style={styles.section}>
        <div style={{ ...styles.inner, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: i % 2 === 0 ? "#005f69" : "#6a2d02",
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay }}
              />
            ))}
          </div>
          <p style={{ color: "#9ca3af", marginTop: "14px", fontSize: "13px", fontWeight: 500 }}>
            Chargement des établissements...
          </p>
        </div>
      </section>
    );

  if (!establishments.length) return null;

  return (
    <section id="emplacements" style={styles.section}>
      <div style={styles.inner}>

        {/* ── Header ── */}
        <div style={styles.headerRow}>
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 style={styles.sectionTitle}>
              Établissements <span style={{ color: "#005f69" }}>disponibles</span>
            </h3>
            <p style={styles.sectionSubtitle}>
              Découvrez un réseau croissant de partenaires professionnels sélectionnés
              pour leur qualité de service et leur expertise.
            </p>
          </motion.div>

          <motion.a
            href="/establishments"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ctaBtn}
            whileHover={{ scale: 1.04, boxShadow: "0 6px 24px rgba(0,95,105,0.4)" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Tout voir
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </div>

        {/* ── Compteur résultats ── */}
        <AnimatePresence mode="wait">
          {(searchQuery || activeFilter !== "all") && (
            <motion.p
              key="result-count"
              style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {displayedEstablishments.length === 0
                ? "Aucun résultat trouvé"
                : `${displayedEstablishments.length} établissement${displayedEstablishments.length > 1 ? "s" : ""} trouvé${displayedEstablishments.length > 1 ? "s" : ""}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {displayedEstablishments.length === 0 ? (
            <motion.div
              key="empty"
              style={styles.emptyWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <MagnifyingGlass style={{ width: 32, height: 32, color: "#d1d5db", marginBottom: 12 }} />
              <p style={{ fontWeight: 700, color: "#374151", marginBottom: 4 }}>Aucun établissement trouvé</p>
              <p style={{ fontSize: "13px", marginBottom: 16 }}>Essayez d'autres mots-clés ou retirez les filtres</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                style={{
                  background: "#005f69", color: "#fff", border: "none",
                  borderRadius: "999px", padding: "8px 20px", fontSize: "13px",
                  fontWeight: 700, cursor: "pointer",
                }}
              >
                Réinitialiser la recherche
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeFilter}-${searchQuery}`}
              style={{ ...styles.grid, gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedEstablishments.map((place) => (
                <motion.div key={place.id} variants={itemVariants} layout>
                  <PlaceCard place={place} onItinerary={handleItineraryClick} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};