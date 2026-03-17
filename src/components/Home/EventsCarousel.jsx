"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Ticket, ArrowRight, Users, Star, MusicNote, FilmSlate, SoccerBall, Confetti, DeviceMobile } from "@phosphor-icons/react";
import { getDownloadLink } from "@/utils/deviceDetection";
import { fetchAllEvents } from "@/app/services/api";

/* ─── helpers ─────────────────────────────────── */
const getEventImage = (e) =>
  e.images?.length > 0 ? e.images[0].url : "/images/logo.png";

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
};

const getMinPrice = (tickets) => {
  const prices = (tickets ?? []).map((t) => t.price).filter((p) => p > 0);
  return prices.length === 0 ? "Gratuit" : Math.min(...prices).toLocaleString() + " FCFA";
};

/* ─── Star Clusters ─────────────────────────────── */
const CLUSTERS = [
  { cx: "3%",  cy: "10%", stars: [{ x: 0,   y: 0,   size: 13, opacity: 0.50, anim: 0, delay: "0s",   dur: "3.2s", color: "#04797e" }, { x: 16, y: -10, size: 9, opacity: 0.30, anim: 1, delay: "0.3s", dur: "2.8s", color: "#025f63" }] },
  { cx: "92%", cy: "8%",  stars: [{ x: 0,   y: 0,   size: 14, opacity: 0.45, anim: 1, delay: "0.2s", dur: "3.0s", color: "#04797e" }, { x: -13, y: 12, size: 9, opacity: 0.30, anim: 2, delay: "0.5s", dur: "3.4s", color: "#025f63" }] },
  { cx: "1%",  cy: "50%", stars: [{ x: 0,   y: 0,   size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#025f63" }] },
  { cx: "95%", cy: "45%", stars: [{ x: 0,   y: 0,   size: 11, opacity: 0.40, anim: 0, delay: "0.3s", dur: "3.3s", color: "#04797e" }] },
  { cx: "5%",  cy: "82%", stars: [{ x: 0,   y: 0,   size: 9,  opacity: 0.30, anim: 1, delay: "0.2s", dur: "2.9s", color: "#04797e" }] },
  { cx: "88%", cy: "78%", stars: [{ x: 0,   y: 0,   size: 10, opacity: 0.35, anim: 2, delay: "0.4s", dur: "3.1s", color: "#025f63" }] },
  { cx: "48%", cy: "3%",  stars: [{ x: 0,   y: 0,   size: 8,  opacity: 0.28, anim: 0, delay: "0.1s", dur: "3.0s", color: "#04797e" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `evStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════
   EventCard — même design que PlaceCard
══════════════════════════════════════════════ */
function EventCard({ event }) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedEvent", JSON.stringify(event));
      window.open(`/events/${event.id}`, "_blank");
    }
  };

  const price    = getMinPrice(event.tickets);
  const isFree   = price === "Gratuit";
  const dateStr  = formatDate(event.start_date);

  return (
    <motion.article
      onClick={handleClick}
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
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* ── Image ── */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <Image
          src={getEventImage(event)}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.82) 100%)",
          zIndex: 1,
        }} />
      </div>

      {/* ── Badge top-left : date (même style que rating dans PlaceCard) ── */}
      {dateStr && (
        <div style={{
          position: "absolute", top: "14px", left: "14px", zIndex: 3,
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
          border: "2px solid rgba(255,255,255,0.7)", borderRadius: "999px",
          padding: "4px 14px", fontSize: "11px", fontWeight: 700, color: "#ffffff",
          letterSpacing: "0.04em", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <Calendar style={{ width: 11, height: 11 }} />
          {dateStr}
        </div>
      )}

      {/* ── Badge top-right : ville / lieu (même style que badgeCity) ── */}
      {event.location_name && (
        <div style={{
          position: "absolute", top: "14px", right: "14px", zIndex: 3,
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: "999px",
          padding: "4px 10px", fontSize: "10px", fontWeight: 600, color: "#fff",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <MapPin weight="fill" style={{ width: 10, height: 10 }} />
          {event.location_name.length > 18 ? event.location_name.slice(0, 18) + "…" : event.location_name}
        </div>
      )}

      {/* ── Body bas ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "16px 16px 18px",
        display: "flex", flexDirection: "column", gap: "8px",
        zIndex: 2,
      }}>

        {/* Tags (catégorie + featured — même style que service tags) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {event.is_featured && (
            <span style={{
              background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.45)",
              borderRadius: "999px", padding: "2px 10px",
              fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "0.03em",
            }}>✦ À la une</span>
          )}
          {event.category && (
            <span style={{
              background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.45)",
              borderRadius: "999px", padding: "2px 10px",
              fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "0.03em",
            }}>{event.category.title}</span>
          )}
        </div>

        {/* Titre (même style que place name) */}
        <h3 style={{
          margin: 0, fontSize: "17px", fontWeight: 800, color: "#ffffff",
          lineHeight: 1.25, letterSpacing: "-0.01em",
          textShadow: "0 1px 6px rgba(0,0,0,0.4)",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {event.title}
          {event.is_featured && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "16px", height: "16px", background: "#04797e", borderRadius: "50%",
              marginLeft: "6px", verticalAlign: "middle",
            }}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </h3>

        {/* Footer (même structure que PlaceCard footer) */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "8px", borderTop: "1.5px solid rgba(255,255,255,0.22)",
        }}>
          {/* Stats gauche */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Réservations */}
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              <Users style={{ width: 13, height: 13 }} />
              {event.reservations_count ?? 0}
            </span>
            {/* Prix */}
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              <Ticket style={{ width: 13, height: 13 }} />
              {isFree ? "Gratuit" : price}
            </span>
          </div>

          {/* Bouton (même style exact que "Itinéraire" dans PlaceCard) */}
          <button
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "#ffffff", color: "#04797e",
              border: "none", borderRadius: "999px",
              padding: "6px 14px", fontSize: "11px", fontWeight: 800,
              cursor: "pointer", letterSpacing: "0.02em",
              transition: "background 0.15s, transform 0.15s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={e => { e.currentTarget.style.background = "#e6f7f8"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <ArrowRight style={{ width: 12, height: 12 }} />
            Réserver
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── EventsPromo ─────────────────────────────── */
function EventsPromo() {
  const [downloadLink, setDownloadLink] = useState("");
  useEffect(() => { setDownloadLink(getDownloadLink()); }, []);

  const features = [
    { icon: MusicNote, label: "Concerts & Soirées" },
    { icon: FilmSlate, label: "Expos & Culture" },
    { icon: SoccerBall, label: "Sports & Shows" },
    { icon: Confetti, label: "Festivals" },
  ];

  return (
    <>
      <style>{`
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(30px,-40px) scale(1.1);} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-25px,35px) scale(0.92);} }
        @keyframes shimmerTag { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(4,121,126,0.5);} 50%{box-shadow:0 0 0 8px rgba(4,121,126,0);} }
        @keyframes btnGlowPromo { 0%,100%{box-shadow:0 8px 28px rgba(4,121,126,0.35);} 50%{box-shadow:0 12px 40px rgba(4,121,126,0.55),0 0 0 4px rgba(4,121,126,0.12);} }
        @keyframes iconBounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }
        .promo-feature-tag:hover { background:rgba(4,121,126,0.1) !important; border-color:rgba(4,121,126,0.35) !important; color:#04797e !important; }
        .promo-feature-tag:hover svg { color:#04797e !important; }
        @media (max-width: 768px) {
  .promo-images   { display: none !important; }
  .promo-buttons  { justify-content: center !important; }
}
      `}</style>

      <div style={{
        position: "relative", borderRadius: "28px", overflow: "hidden",
padding: "clamp(20px,3vw,40px) clamp(32px,5vw,72px)",
        background: "linear-gradient(145deg, #f4fbfb 0%, #eaf5f5 50%, #fdfaf6 100%)",
        border: "1.5px solid rgba(4,121,126,0.1)",
        display: "flex", alignItems: "center",
        gap: "clamp(32px,5vw,80px)", flexWrap: "wrap",
        minHeight: "320px", boxShadow: "0 4px 32px rgba(4,121,126,0.06)",
      }}>
        <div style={{ position:"absolute", top:"-80px", right:"8%", width:"360px", height:"360px", borderRadius:"50%", background:"radial-gradient(circle, rgba(4,121,126,0.10) 0%, transparent 70%)", animation:"floatOrb1 8s ease-in-out infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-100px", right:"30%", width:"280px", height:"280px", borderRadius:"50%", background:"radial-gradient(circle, rgba(106,45,2,0.07) 0%, transparent 70%)", animation:"floatOrb2 10s ease-in-out infinite", pointerEvents:"none" }} />

        <div style={{ flex:"1 1 300px", position:"relative", zIndex:2 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(4,121,126,0.08)", border:"1.5px solid rgba(4,121,126,0.2)", borderRadius:"999px", padding:"7px 18px", marginBottom:"20px" }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#04797e", animation:"pulseDot 2.5s ease-in-out infinite", flexShrink:0 }} />
            <Ticket weight="fill" style={{ width:13, height:13, color:"#04797e" }} />
            <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#04797e" }}>Billetterie en ligne</span>
          </div>

          <h2 style={{ fontSize:"clamp(1.7rem,3.2vw,2.6rem)", fontWeight:900, color:"#0a1a1c", lineHeight:1.1, letterSpacing:"-0.03em", margin:"0 0 14px" }}>
            Vos événements,<br />
            <span style={{ background:"linear-gradient(90deg,#04797e,#02b8be,#04797e)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmerTag 3s linear infinite" }}>
              à portée de doigt.
            </span>
          </h2>

          <p style={{ fontSize:"clamp(0.88rem,1.2vw,1rem)", color:"#4b6367", lineHeight:1.75, margin:"0 0 18px", maxWidth:"400px" }}>
            Concerts, soirées, expos, festivals — achetez vos billets en quelques secondes et recevez votre QR code instantanément.
          </p>

          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"24px" }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <span key={i} className="promo-feature-tag" style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(8px)", border:"1.5px solid rgba(4,121,126,0.14)", borderRadius:"999px", padding:"7px 14px", fontSize:"12px", fontWeight:600, color:"#1a3a3c", cursor:"default", transition:"all 0.2s" }}>
                  <Icon weight="fill" style={{ width:13, height:13, color:"#04797e", animation:`iconBounce ${2.2+i*0.3}s ease-in-out infinite` }} />
                  {f.label}
                </span>
              );
            })}
          </div>

<div className="promo-buttons" style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>            <motion.a
              href={downloadLink} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:"10px", background:"linear-gradient(135deg,#04797e,#025f63)", color:"#fff", borderRadius:"999px", padding:"13px 26px", fontSize:"13px", fontWeight:800, textDecoration:"none", animation:"btnGlowPromo 3s ease-in-out infinite" }}
              whileHover={{ y:-3, scale:1.03 }} whileTap={{ scale:0.97 }}
            >
              Télécharger l'application
              <DeviceMobile weight="fill" style={{ width:16, height:16 }} />
            </motion.a>
            <motion.a
              href="/events"
              style={{ display:"inline-flex", alignItems:"center", gap:"7px", color:"#04797e", borderRadius:"999px", padding:"12px 22px", fontSize:"13px", fontWeight:700, textDecoration:"none", border:"2px solid rgba(4,121,126,0.35)" }}
              whileHover={{ y:-3, scale:1.03, borderColor:"#04797e", background:"rgba(4,121,126,0.05)" }} whileTap={{ scale:0.97 }}
            >
              En savoir plus
            </motion.a>
          </div>
        </div>

        {/* Illustration droite */}
<div className="promo-images" style={{ flex:"0 0 auto", position:"relative", zIndex:2, display:"flex", gap:"8px", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <div style={{ width:"clamp(140px,15vw,210px)", height:"clamp(130px,14vw,190px)", borderRadius:"14px", overflow:"hidden", boxShadow:"0 10px 28px rgba(0,0,0,0.15)", marginTop:"-16px" }}>
              <img src="/images/Events/1.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div style={{ width:"clamp(175px,19vw,260px)", height:"clamp(160px,18vw,235px)", borderRadius:"14px", overflow:"hidden", boxShadow:"0 12px 32px rgba(0,0,0,0.18)", marginBottom:"-16px" }}>
              <img src="/images/Events/2.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          </div>
          <div style={{ width:"clamp(155px,17vw,230px)", height:"clamp(250px,27vw,350px)", borderRadius:"18px", overflow:"hidden", boxShadow:"0 20px 48px rgba(0,0,0,0.20)", alignSelf:"center" }}>
            <img src="/images/Events/3.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        </div>
      </div>
    </>
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
export const EventsCarousel = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [gridCols, setGridCols]   = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setGridCols(1);
      else if (w < 1024) setGridCols(2);
      else setGridCols(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
  fetchAllEvents()
  .then((result) => {
    if (!result) return;
    const { success, data } = result;
    if (!success) return;
    const events = data ?? [];
    const feat = events.filter((e) => e.is_featured);
    setAllEvents(feat.length > 0 ? feat.sort((a, b) => (a.featured_order ?? 99) - (b.featured_order ?? 99)) : events);
  })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  const displayed = useMemo(() => allEvents.slice(0, 8), [allEvents]);

  return (
    <section id="events" style={{ padding: "60px 0 80px", background: "#ecf5f5", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes evStar0 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1);}33%{transform:translateY(-8px) rotate(15deg) scale(1.10);}66%{transform:translateY(-3px) rotate(-8deg) scale(0.95);} }
        @keyframes evStar1 { 0%,100%{transform:translateY(0px) rotate(0deg);}50%{transform:translateY(-11px) rotate(20deg) scale(1.07);} }
        @keyframes evStar2 { 0%,100%{transform:translateY(0px) scale(1);}40%{transform:translateY(-7px) rotate(-12deg) scale(1.12);}80%{transform:translateY(-2px) rotate(6deg) scale(0.92);} }
      `}</style>

      <StarClusters />

<div style={{ maxWidth: "96vw", margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <motion.div
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px", gap:"16px", flexWrap:"wrap" }}
          initial={{ opacity:0, y:-20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
        >
          <div>
            <h2 style={{ margin:"0 0 6px", fontSize:"clamp(1.6rem,2.8vw,2.4rem)", fontWeight:900, color:"#0a1628", letterSpacing:"-0.02em" }}>
              Événements <span style={{ color:"#04797e" }}>à la une</span>
            </h2>
            <p style={{ margin:0, fontSize:"15px", color:"#6b7280", lineHeight:1.6 }}>
              Les incontournables du moment, sélectionnés pour vous
            </p>
          </div>
          <motion.a
            href="/events"
            style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#04797e,#025f63)", color:"#fff", borderRadius:"999px", padding:"10px 22px", fontSize:"13px", fontWeight:700, textDecoration:"none", boxShadow:"0 4px 16px rgba(4,121,126,0.3)", whiteSpace:"nowrap" }}
            whileHover={{ scale:1.04, boxShadow:"0 6px 24px rgba(4,121,126,0.4)" }} whileTap={{ scale:0.97 }}
          >
            Tout voir
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </motion.a>
        </motion.div>

        {/* Contenu */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true, amount:0.05 }} transition={{ duration:0.6, delay:0.1 }}
        >
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", gap:"10px", padding:"48px 0" }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div key={i}
                  style={{ width:10, height:10, borderRadius:"50%", background: i%2===0 ? "#04797e" : "#6a2d02" }}
                  animate={{ scale:[1,1.5,1], opacity:[1,0.4,1] }}
                  transition={{ duration:1, repeat:Infinity, delay }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"40px" }}>
              <EventsPromo />
              {displayed.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="events-grid"
                    style={{ display:"grid", gridTemplateColumns:`repeat(${gridCols}, 1fr)`, gap:"28px" }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {displayed.map((ev) => (
                      <motion.div key={ev.id} variants={itemVariants} layout>
                        <EventCard event={ev} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};