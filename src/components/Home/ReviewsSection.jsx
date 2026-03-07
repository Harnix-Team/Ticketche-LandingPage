"use client";

import { useState, useEffect, useRef } from "react";

const reviews = [
  {
    name: "Kofi Mensah",
    role: "Organisateur d'événements",
    photo: "/images/users/user1.png",
    rating: 5,
    text: "Ticketché a révolutionné la gestion de mes événements. La vente de billets est simple, rapide et les paiements arrivent instantanément. Je ne peux plus m'en passer !",
    blobColor: "#00515a",
  },
  {
    name: "Awa Diallo",
    role: "Utilisatrice régulière",
    photo: "/images/users/user2.png",
    rating: 5,
    text: "Une application vraiment pratique ! J'achète mes billets en quelques secondes et je reçois mon ticket directement sur mon téléphone. Zéro stress, zéro file d'attente.",
    blobColor: "#04545d",
    featured: true,
  },
  {
    name: "Jean-Marc Gbeto",
    role: "Gérant de parking",
    photo: "/images/users/user4.png",
    rating: 5,
    text: "La plateforme m'a permis de digitaliser entièrement mon parking. Mes clients adorent et mes recettes ont augmenté de 40% depuis que j'utilise Ticketché.",
    blobColor: "#8daeb1",
  },
  {
    name: "Fatou Traoré",
    role: "Étudiante",
    photo: "/images/users/user1.png",
    rating: 5,
    text: "Je commande mes billets de concert sans me déplacer. L'interface est super intuitive et le paiement via mobile money est un vrai plus pour nous en Afrique.",
    blobColor: "#00515a",
  },
  {
    name: "Olivier Dossou",
    role: "Entrepreneur",
    photo: "/images/users/user2.png",
    rating: 5,
    text: "Grâce à Ticketché, j'ai pu lancer mes événements avec un système de billetterie professionnel dès le premier jour. Le support est réactif et la plateforme fiable.",
    blobColor: "#04545d",
  },
];

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginBottom: "16px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ fontSize: "1.1rem" }}>⭐</span>
      ))}
    </div>
  );
}

function ReviewCard({ review, position, total }) {
  // position: 0 = center, -1 = left, 1 = right, -2/2 = far sides
  const isCenter = position === 0;
  const isAdjacent = Math.abs(position) === 1;
  const isFar = Math.abs(position) >= 2;

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
          fontSize: "1.2rem", zIndex: 5,
          border: "2px solid rgba(0,81,90,0.1)",
        }}>⭐</div>
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
        background: "#ecf5f6",
        fontFamily: "'Archivo', sans-serif",
        padding: "clamp(70px, 9vw, 110px) clamp(24px, 6vw, 80px)",
        overflow: "hidden",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

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
            color: "#94a3b8", lineHeight: 1.7,
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
            color: "#00515a", fontSize: "1.4rem", cursor: "pointer",
            zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,81,90,0.12)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00515a"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#00515a"; }}
          >←</button>

          {/* Bouton suivant */}
          <button onClick={next} style={{
            position: "absolute", right: "clamp(0px, 2vw, 40px)",
            top: "50%", transform: "translateY(-50%)",
            width: "48px", height: "48px", borderRadius: "50%",
            background: "#fff", border: "1px solid rgba(0,81,90,0.2)",
            color: "#00515a", fontSize: "1.4rem", cursor: "pointer",
            zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,81,90,0.12)",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00515a"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#00515a"; }}
          >→</button>
        </div>

        {/* Dots */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "8px", marginTop: "clamp(32px, 4vw, 48px)",
        }}>
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