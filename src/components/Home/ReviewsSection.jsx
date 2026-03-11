"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ArrowLeft, ArrowRight } from "@phosphor-icons/react";

const reviews = [
  {
    name: "Kofi Mensah",
    role: "Organisateur d'événements",
    photo: "/images/users/user1.png",
    rating: 5,
    text: "Ticketché a transformé la gestion de mes événements. Je crée mon événement, vends mes billets en ligne avec QR code et suis mes réservations en direct. Incroyablement efficace !",
    blobColor: "#00515a",
  },
  {
    name: "Awa Diallo",
    role: "Utilisatrice régulière",
    photo: "/images/users/user2.png",
    rating: 5,
    text: "J'utilise Ticketché pour tout : je trouve un parking en 30 secondes, je réserve mon lavage auto le week-end et j'achète mes billets de concert sans bouger de chez moi. Une app indispensable !",
    blobColor: "#04545d",
    featured: true,
  },
  {
    name: "Jean-Marc Gbeto",
    role: "Gérant de parking",
    photo: "/images/users/user4.png",
    rating: 5,
    text: "Depuis que j'utilise Ticketché, mon parking est 100% digitalisé. Entrées, sorties, paiements mobile money — tout est tracé. Mes recettes ont augmenté de 40% en 3 mois.",
    blobColor: "#8daeb1",
  },
  {
    name: "Fatou Traoré",
    role: "Responsable centre de lavage",
    photo: "/images/users/user1.png",
    rating: 5,
    text: "Mes clients adorent pouvoir réserver leur lavage à l'avance et payer via mobile money. Ticketché m'a apporté plus de visibilité et a simplifié toute ma gestion quotidienne.",
    blobColor: "#00515a",
  },
  {
    name: "Olivier Dossou",
    role: "Gérant de garage automobile",
    photo: "/images/users/user2.png",
    rating: 5,
    text: "Grâce à Ticketché, mes clients suivent leurs réparations en temps réel et reçoivent leurs factures numériques. La transparence a boosté ma crédibilité et fidélisé ma clientèle.",
    blobColor: "#04545d",
  },
];

/* ─── Star Clusters ─────────────────────────────── */
const CLUSTERS = [
  { cx: "3%",  cy: "10%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.50, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 9, opacity: 0.30, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "92%", cy: "8%",  stars: [{ x: 0, y: 0, size: 14, opacity: 0.45, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -13, y: 12, size: 9, opacity: 0.30, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "50%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }, { x: 14, y: -8, size: 7, opacity: 0.25, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "95%", cy: "45%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.40, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }, { x: -12, y: 10, size: 7, opacity: 0.25, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "5%",  cy: "82%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.30, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }, { x: 11, y: -7, size: 6, opacity: 0.22, anim: 2, delay: "0.5s", dur: "3.6s", color: "#00515a" }] },
  { cx: "88%", cy: "78%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }, { x: -10, y: -9, size: 7, opacity: 0.22, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "48%", cy: "3%",  stars: [{ x: 0, y: 0, size: 8,  opacity: 0.28, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "95%", stars: [{ x: 0, y: 0, size: 8,  opacity: 0.25, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }] },
  { cx: "20%", cy: "6%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 2, delay: "0.2s", dur: "2.8s", color: "#00818f" }] },
  { cx: "75%", cy: "90%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `rvStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── Stars rating ──────────────────────────────── */
function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "16px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} weight="fill" style={{ width: 18, height: 18, color: "#f59e0b" }} />
      ))}
    </div>
  );
}

function ReviewCard({ review, position, total }) {
  const isCenter = position === 0;
  const isAdjacent = Math.abs(position) === 1;

  const scale = isCenter ? 1 : isAdjacent ? 0.88 : 0.76;
  const opacity = isCenter ? 1 : isAdjacent ? 0.7 : 0;
  const translateX = position * 340;
  const translateY = isCenter ? 0 : isAdjacent ? 24 : 40;
  const zIndex = isCenter ? 10 : isAdjacent ? 5 : 1;

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: 0,
      transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) scale(${scale})`,
      opacity,
      transition: "all 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex,
      width: "clamp(280px, 32vw, 360px)",
      pointerEvents: isCenter ? "auto" : "none",
    }}>
      {/* Blob */}
      <div style={{
        position: "absolute",
        top: "18px", left: "-10px", right: "-10px", bottom: "-14px",
        background: review.blobColor,
        borderRadius: "28px",
        transform: "rotate(-3deg)",
        zIndex: 0,
        opacity: 0.85,
      }} />

      {/* Card */}
      <div style={{
        position: "relative",
        zIndex: 2,
        background: "#ffffff",
        borderRadius: "24px",
        padding: "clamp(52px, 6vw, 68px) clamp(24px, 3vw, 36px) clamp(28px, 3vw, 36px)",
        boxShadow: isCenter
          ? "0 20px 60px rgba(0,81,90,0.18), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 8px 32px rgba(0,0,0,0.08)",
        textAlign: "center",
        transition: "box-shadow 0.65s ease",
      }}>
        {/* Photo */}
        <div style={{
          position: "absolute",
          top: "-36px", left: "50%",
          transform: "translateX(-50%)",
          width: "72px", height: "72px",
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid #fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          background: "#e8f0f1",
          zIndex: 3,
        }}>
          <img src={review.photo} alt={review.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <h3 style={{
          fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
          fontWeight: 700, color: "#0a1a1c",
          margin: "0 0 4px 0", letterSpacing: "-0.01em",
        }}>{review.name}</h3>

        <p style={{
          fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
          fontStyle: "italic", color: "#94a3b8",
          margin: "0 0 16px 0",
        }}>{review.role}</p>

        <Stars count={review.rating} />

        <p style={{
          fontSize: "clamp(0.82rem, 1.1vw, 0.92rem)",
          color: "#64748b", lineHeight: 1.75, margin: 0,
        }}>{review.text}</p>
      </div>

      {/* Featured star */}
      {review.featured && isCenter && (
        <div style={{
          position: "absolute", bottom: "-24px", left: "50%",
          transform: "translateX(-50%)",
          width: "40px", height: "40px", borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 5,
          border: "2px solid rgba(0,81,90,0.1)",
        }}><Star weight="fill" style={{ width: 22, height: 22, color: "#f59e0b" }} /></div>
      )}
    </div>
  );
}

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const total = reviews.length;

  const next = () => setCurrent(c => (c + 1) % total);
  const prev = () => setCurrent(c => (c - 1 + total) % total);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [paused, total]);

  const getPosition = (i) => {
    let pos = i - current;
    if (pos > total / 2) pos -= total;
    if (pos < -total / 2) pos += total;
    return pos;
  };

  return (
    <section
      style={{
        fontFamily: "'Archivo', sans-serif",
        overflow: "hidden",
        background: "#ffffff",
        position: "relative",
      }}
      className="py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes rvStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes rvStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes rvStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      <StarClusters />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(50px, 7vw, 90px)" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 900, letterSpacing: "-0.02em",
            color: "#0a1a1c", margin: "0 0 12px 0",
            textTransform: "uppercase",
          }}>Avis Clients</h2>
          <div style={{
            width: "60px", height: "3px",
            background: "#00515a", borderRadius: "2px",
            margin: "0 auto 20px",
          }} />
          <p style={{
            fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
            color: "#000", lineHeight: 1.7,
            maxWidth: "560px", margin: "0 auto",
          }}>
            Des milliers d'utilisateurs font confiance à Ticketché chaque jour.
            Voici ce qu'ils pensent de notre plateforme.
          </p>
        </div>

        {/* Carousel */}
        <div style={{ position: "relative", height: "clamp(380px, 50vw, 480px)" }}>
          {reviews.map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              position={getPosition(i)}
              total={total}
            />
          ))}

          {/* Bouton précédent */}
          <button onClick={prev} style={{
            position: "absolute", left: "clamp(0px, 2vw, 40px)",
            top: "50%", transform: "translateY(-50%)",
            width: "48px", height: "48px", borderRadius: "50%",
            background: "#fff", border: "1px solid rgba(0,81,90,0.2)",
            color: "#00515a", cursor: "pointer",
            zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,81,90,0.12)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00515a"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#00515a"; }}
          ><ArrowLeft weight="bold" style={{ width: 20, height: 20 }} /></button>

          {/* Bouton suivant */}
          <button onClick={next} style={{
            position: "absolute", right: "clamp(0px, 2vw, 40px)",
            top: "50%", transform: "translateY(-50%)",
            width: "48px", height: "48px", borderRadius: "50%",
            background: "#fff", border: "1px solid rgba(0,81,90,0.2)",
            color: "#00515a", cursor: "pointer",
            zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,81,90,0.12)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00515a"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#00515a"; }}
          ><ArrowRight weight="bold" style={{ width: 20, height: 20 }} /></button>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: current === i ? "28px" : "8px",
              height: "8px", borderRadius: "4px",
              background: current === i ? "#00515a" : "rgba(0,81,90,0.25)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

      </div>
    </section>
  );
}