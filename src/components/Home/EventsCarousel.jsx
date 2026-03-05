"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, ArrowRight, Users, CaretLeft, CaretRight } from "@phosphor-icons/react";

const API_BASE_URL = "https://api.ticketche.com/api/v2";

/* ─── helpers ─────────────────────────────────── */
const getEventImage = (e) =>
  e.images?.length > 0 ? e.images[0].url : "/images/logo.png";

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const getMinPrice = (tickets) => {
  const prices = (tickets ?? []).map((t) => t.price).filter((p) => p > 0);
  return prices.length === 0 ? "Gratuit" : Math.min(...prices).toLocaleString() + " FCFA";
};

/* ─── styles ────────────────────────────────────── */
const S = {
  card: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    border: "4px solid #ffffff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
    cursor: "pointer",
    height: "520px",
    display: "flex",
    flexDirection: "column",
  },
  imageWrapper: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.82) 100%)",
    zIndex: 1,
  },
  badgeTopLeft: {
    position: "absolute",
    top: "14px",
    left: "14px",
    zIndex: 3,
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  badge: {
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255,255,255,0.7)",
    borderRadius: "999px",
    padding: "4px 12px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  badgeFeatured: {
    background: "rgba(4,121,126,0.55)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255,255,255,0.7)",
    borderRadius: "999px",
    padding: "4px 12px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  body: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    zIndex: 2,
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    textShadow: "0 1px 6px rgba(0,0,0,0.4)",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.85)",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "8px",
    borderTop: "1.5px solid rgba(255,255,255,0.22)",
    marginTop: "2px",
  },
  stats: {
    display: "flex",
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
  ctaBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "#ffffff",
    color: "#04797e",
    border: "none",
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "11px",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: "0.02em",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    transition: "background 0.15s, transform 0.15s",
  },
  /* section */
  section: {
    padding: "60px 0 80px",
    background: "transparent",
  },
  inner: {
    maxWidth: "75vw",
    margin: "0 auto",
    padding: "0 24px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    gap: "16px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: "0 0 4px",
    fontSize: "28px",
    fontWeight: 900,
    color: "#0a1628",
    letterSpacing: "-0.02em",
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  viewAllBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #04797e, #025f63)",
    color: "#fff",
    borderRadius: "999px",
    padding: "10px 22px",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 4px 16px rgba(4,121,126,0.3)",
    whiteSpace: "nowrap",
  },
  /* carousel */
  carouselWrapper: {
    position: "relative",
  },
  track: {
    display: "flex",
    gap: "22px",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    cursor: "grab",
    WebkitOverflowScrolling: "touch",
    paddingBottom: "4px",
  },
  slide: {
    scrollSnapAlign: "start",
    flexShrink: 0,
    width: "clamp(400px, 70vw, 900px)",
  },
  indicators: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "18px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    border: "none",
    background: "rgba(0,0,0,0.15)",
    cursor: "pointer",
    transition: "all 0.2s",
    padding: 0,
  },
  dotActive: {
    width: "24px",
    height: "8px",
    borderRadius: "999px",
    border: "none",
    background: "#04797e",
    cursor: "pointer",
    transition: "all 0.2s",
    padding: 0,
  },
};

/* ─── EventCard ─────────────────────────────────── */
function EventCard({ event }) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedEvent", JSON.stringify(event));
      window.open(`/events/${event.id}`, "_blank");
    }
  };

  return (
    <motion.article
      onClick={handleClick}
      whileHover={{ y: -8, boxShadow: "0 0 0 4px #ffffff, 0 24px 56px rgba(0,0,0,0.35)" }}
      style={S.card}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Image full card */}
      <div style={S.imageWrapper}>
        <Image
          src={getEventImage(event)}
          alt={event.title}
          fill
          sizes="(max-width: 430px) 80vw, (max-width: 768px) 65vw, 380px"
          style={{ objectFit: "cover" }}
        />
        <div style={S.overlay} />
      </div>

      {/* Badges haut gauche */}
      <div style={S.badgeTopLeft}>
        {event.is_featured && (
          <span style={S.badgeFeatured}>✦ À la une</span>
        )}
        {event.category && (
          <span style={S.badge}>{event.category.title}</span>
        )}
      </div>

      {/* Body en bas par-dessus l'image */}
      <div style={S.body}>
        <h3 style={S.title}>{event.title}</h3>

        <div style={S.meta}>
          {event.start_date && (
            <span style={S.metaItem}>
              <Calendar style={{ width: 12, height: 12 }} />
              {formatDate(event.start_date)}
            </span>
          )}
          {event.location_name && (
            <span style={S.metaItem}>
              <MapPin style={{ width: 12, height: 12 }} />
              {event.location_name}
            </span>
          )}
        </div>

        <div style={S.footer}>
          <div style={S.stats}>
            <span style={S.statItem}>
              <Users style={{ width: 13, height: 13 }} />
              {event.reservations_count ?? 0}
            </span>
            <span style={S.statItem}>
              <Ticket style={{ width: 13, height: 13 }} />
              {getMinPrice(event.tickets)}
            </span>
          </div>
          <button
            style={S.ctaBtn}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={e => { e.currentTarget.style.background = "#e6f7f8"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Réserver
            <ArrowRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Carousel ──────────────────────────────────── */
function Carousel({ events }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoRef = useRef(null);
  const userInteracted = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const getCardWidth = useCallback(() => {
    if (!trackRef.current) return 0;
    const slide = trackRef.current.querySelector("[data-slide]");
    return slide ? slide.offsetWidth + 22 : 0;
  }, []);

  const updateIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = getCardWidth();
    if (cardWidth > 0) {
      setActiveIndex(Math.min(Math.round(el.scrollLeft / cardWidth), events.length - 1));
    }
  }, [getCardWidth, events.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateIndex);
  }, [updateIndex]);

  const startAutoSwipe = useCallback(() => {
    clearInterval(autoRef.current);
    if (events.length <= 1) return;
    autoRef.current = setInterval(() => {
      if (userInteracted.current || isDragging.current) return;
      setActiveIndex((prev) => {
        const next = prev >= events.length - 1 ? 0 : prev + 1;
        trackRef.current?.scrollTo({ left: next * getCardWidth(), behavior: "smooth" });
        return next;
      });
    }, 3500);
  }, [events.length, getCardWidth]);

  useEffect(() => {
    startAutoSwipe();
    return () => clearInterval(autoRef.current);
  }, [startAutoSwipe]);

  const pauseAndResume = useCallback(() => {
    userInteracted.current = true;
    clearInterval(autoRef.current);
    setTimeout(() => { userInteracted.current = false; startAutoSwipe(); }, 6000);
  }, [startAutoSwipe]);

  const goToSlide = (index) => {
    pauseAndResume();
    trackRef.current?.scrollTo({ left: index * getCardWidth(), behavior: "smooth" });
    setActiveIndex(index);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    trackRef.current.style.scrollSnapType = "none";
    pauseAndResume();
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    trackRef.current.scrollTo({ left: scrollLeft.current + (startX.current - e.pageX) * 1.2, behavior: "auto" });
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = "grab";
    trackRef.current.style.scrollSnapType = "x mandatory";
    const newIndex = Math.round(trackRef.current.scrollLeft / getCardWidth());
    trackRef.current.scrollTo({ left: newIndex * getCardWidth(), behavior: "smooth" });
    setActiveIndex(newIndex);
    setTimeout(() => startAutoSwipe(), 200);
  };

  const onTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollSnapType = "none";
    pauseAndResume();
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };

  const onTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    trackRef.current.style.scrollSnapType = "x mandatory";
    const newIndex = Math.round(trackRef.current.scrollLeft / getCardWidth());
    trackRef.current.scrollTo({ left: newIndex * getCardWidth(), behavior: "smooth" });
    setTimeout(() => startAutoSwipe(), 200);
  };

  return (
    <div style={S.carouselWrapper}>
      <div
        ref={trackRef}
        style={S.track}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {events.map((ev) => (
          <div key={ev.id} data-slide style={S.slide}>
            <EventCard event={ev} />
          </div>
        ))}
      </div>

      {events.length > 1 && (
        <div style={S.indicators}>
          {events.map((_, i) => (
            <button
              key={i}
              style={i === activeIndex ? S.dotActive : S.dot}
              onClick={() => goToSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ─────────────────────────────────────── */
export const EventsCarousel = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/events`)
      .then((r) => r.json())
      .then(({ success, data }) => {
        if (!success) return;
        const feat = (data ?? [])
          .filter((e) => e.is_featured)
          .sort((a, b) => (a.featured_order ?? 99) - (b.featured_order ?? 99));
        setFeatured(feat);
      })
      .catch((err) => console.error("Erreur fetch events:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="events" style={S.section}>
      <div style={S.inner}>
        <div style={{ marginBottom: "48px" }}>

          {/* Header */}
          <motion.div
            style={S.headerRow}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 style={S.sectionTitle}>Événements à la une</h2>
              <p style={S.sectionSubtitle}>Les incontournables du moment, sélectionnés pour vous</p>
            </div>
            <motion.a
              href="/events"
              style={S.viewAllBtn}
              whileHover={{ scale: 1.04, boxShadow: "0 6px 24px rgba(4,121,126,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              Tout voir
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </motion.a>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {loading
              ? (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "40px 0" }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      style={{ width: 10, height: 10, borderRadius: "50%", background: i % 2 === 0 ? "#04797e" : "#6a2d02" }}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              )
              : featured.length === 0
                ? <p style={{ color: "#9ca3af", fontSize: "14px", paddingLeft: "4px" }}>Aucun événement à la une pour le moment.</p>
                : <Carousel events={featured} />
            }
          </motion.div>

        </div>
      </div>
    </section>
  );
};