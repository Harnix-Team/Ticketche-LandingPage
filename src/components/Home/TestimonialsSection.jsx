"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
  { name: "Stéphane TOGBANOU", rating: 5, quote: "Depuis que j'utilise ticketché, la gestion de mes parkings est devenue un jeu d'enfant. L'application est intuitive et m'a fait gagner un temps précieux!", avatar: "/images/users/user1.png" },
  { name: "Fatoumata DIALLO", rating: 5, quote: "ticketché a complètement transformé ma façon de gérer mes véhicules professionnels. Gain de temps, traçabilité, simplicité - tout ce dont j'avais besoin !", avatar: "/images/users/user2.png" },
  { name: "Romuald SANNI", rating: 4, quote: "Je ne peux plus me passer de ticketché. Suivre mes entretiens, trouver un parking, programmer un lavage - tout est devenu tellement simple.", avatar: "/images/users/user3.png" },
  { name: "Patrick HOUNDJANTO", rating: 5, quote: "En tant que professionnelle mobile, ticketché est mon assistant indispensable. Je gère mes déplacements avec une efficacité incroyable.", avatar: "/images/users/user4.png" },
  { name: "Adjoua MENSAH", rating: 5, quote: "Une application vraiment bien pensée. Je recommande à tous les gérants de parking qui veulent moderniser leur activité.", avatar: "/images/users/user1.png" },
  { name: "Kofi AGBODOSSOU", rating: 4, quote: "Très pratique pour organiser mes événements. La vente de billets en ligne a boosté ma visibilité et mes ventes considérablement.", avatar: "/images/users/user2.png" },
  { name: "Bernadette DOSSOU", rating: 5, quote: "L'assistance 24h/24 est vraiment un plus. J'ai eu un problème un soir, résolu en moins de 10 minutes. Bravo à toute l'équipe !", avatar: "/images/users/user3.png" },
  { name: "Yao HOUETO", rating: 5, quote: "Le portefeuille électronique intégré simplifie tout. Plus besoin de jongler entre plusieurs applications pour gérer mes paiements.", avatar: "/images/users/user4.png" },
];

/* ─── StarRating ─────────────────────────────── */
function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="13" height="13" viewBox="0 0 24 24"
          fill={star <= rating ? "#F59E0B" : "none"}
          stroke={star <= rating ? "#F59E0B" : "rgba(255,255,255,0.3)"}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Animated Testimonial Card ──────────────── */
function AnimatedTestimonialCard({ item }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "3px solid rgba(255,255,255,0.5)",
      borderRadius: "16px",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)",
      width: "100%",
    }}>
      {/* Avatar + nom + stars */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          overflow: "hidden", flexShrink: 0,
          border: "2px solid rgba(255,255,255,0.4)",
          position: "relative",
        }}>
          <Image src={item.avatar} alt={item.name} fill style={{ objectFit: "cover" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#fff", lineHeight: 1.3 }}>{item.name}</p>
          <StarRating rating={item.rating} />
        </div>
      </div>
      {/* Quote */}
      <p style={{
        margin: 0,
        fontSize: "12px",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.85)",
        fontStyle: "italic",
      }}>
        "{item.quote}"
      </p>
    </div>
  );
}

/* ─── Big Card with sliding testimonials ─────── */
function TestimonialsBigCard() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ background: hovered ? "#b0cdd0" : "#d1e0e2" }}
      transition={{ duration: 0.35 }}
      style={{
        borderRadius: "32px",
        padding: "48px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        overflow: "hidden",
        position: "relative",
        minHeight: "420px",
        justifyContent: "center",
      }}
    >
      {/* Déco cercles en fond */}
      <div style={{
        position: "absolute", width: "320px", height: "320px", borderRadius: "50%",
        background: "rgba(0,95,105,0.08)", top: "-80px", right: "-80px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "200px", height: "200px", borderRadius: "50%",
        background: "rgba(0,95,105,0.06)", bottom: "-60px", left: "-40px", pointerEvents: "none",
      }} />

      {/* Header texte */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <h2 style={{
          margin: "0 0 8px",
          fontSize: "clamp(22px, 3vw, 32px)",
          fontWeight: 900,
          color: "#0a2e32",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}>
          Ils parlent de leur expérience
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#3a6a70", lineHeight: 1.6, maxWidth: "420px" }}>
          Découvrez comment ticketché simplifie le quotidien de nos utilisateurs.
        </p>
      </div>

      {/* Zone animée */}
      <div style={{
        width: "100%",
        maxWidth: "460px",
        position: "relative",
        height: "160px",
        overflow: "hidden",
        zIndex: 1,
      }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", width: "100%" }}
          >
            <AnimatedTestimonialCard item={testimonials[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicateurs */}
      <div style={{ display: "flex", gap: "8px", zIndex: 1 }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? "24px" : "8px",
              height: "8px",
              borderRadius: "999px",
              border: "none",
              background: i === index ? "#005f69" : "rgba(0,95,105,0.25)",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── MAIN ───────────────────────────────────── */
export const TestimonialsSection = () => {
  return (
    <section
      id="reviews"
      style={{
        padding: "80px 0",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "75vw", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TestimonialsBigCard />
        </motion.div>
      </div>
    </section>
  );
};