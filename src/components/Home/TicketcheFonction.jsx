"use client";

import { useRef } from "react";

const images = [
  { src: "/images/mockups/1.png", alt: "Ticketché utilisateur" },
  { src: "/images/mockups/2.png", alt: "Ticketché gérant" },
  { src: "/images/mockups/3.png", alt: "Ticketché organisateur" },
  { src: "/images/mockups/4.png", alt: "Ticketché accueil" },
  { src: "/images/mockups/5.png", alt: "Ticketché événement" },
  { src: "/images/mockups/6.png", alt: "Ticketché parking" },
  { src: "/images/mockups/7.png", alt: "Ticketché garage" },
  { src: "/images/mockups/8.png", alt: "Ticketché app" },
];

export default function TicketcheFonction() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section style={{
      padding: "clamp(48px, 7vw, 90px) clamp(20px, 5vw, 72px)",
      paddingBottom: "clamp(140px, 18vw, 220px)",
      position: "relative",
      background: "#ecf5f6",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>

        {/* ── GRANDE CARTE SOMBRE ── */}
        <div style={{
          background: "#001e22",
          borderRadius: "clamp(24px, 3vw, 36px)",
          padding: "clamp(36px, 5vw, 60px) clamp(28px, 5vw, 80px)",
          paddingBottom: "clamp(280px, 32vw, 400px)",
          position: "relative",
          overflow: "visible",
        }}>

          {/* Halos déco */}
          <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "0", left: "15%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* EN-TÊTE */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "clamp(20px, 4vw, 60px)", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#ffffff", maxWidth: "460px", margin: 0 }}>
              Sécurisé &amp; Pratique{" "}
              <span style={{ color: "#00515a" }}>pour tous</span>
            </h2>
            <p style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: "360px", margin: 0, paddingTop: "6px" }}>
              Payez et encaissez en toute confiance grâce à notre plateforme.
              Transactions instantanées, sans commission cachée et sans mauvaise surprise.
            </p>
          </div>

          {/* ── CARROUSEL ── */}
          <div style={{
            position: "absolute",
            bottom: "-550px",
            left: "clamp(20px, 4vw, 60px)",
            right: "clamp(20px, 4vw, 60px)",
            zIndex: 10,
          }}>

            {/* Bouton précédent */}
            <button
              onClick={scrollLeft}
              style={{
                position: "absolute",
                left: "-20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid rgba(0,81,90,0.3)",
                color: "#00515a",
                fontSize: "1.8rem",
                cursor: "pointer",
                zIndex: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f8f9";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,81,90,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }}
              aria-label="Précédent"
            >
              ←
            </button>

            {/* Bouton suivant */}
            <button
              onClick={scrollRight}
              style={{
                position: "absolute",
                right: "-20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid rgba(0,81,90,0.3)",
                color: "#00515a",
                fontSize: "1.8rem",
                cursor: "pointer",
                zIndex: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f8f9";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,81,90,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }}
              aria-label="Suivant"
            >
              →
            </button>

            {/* Conteneur scrollable */}
            <div
              ref={scrollRef}
              style={{
                display: "flex",
                gap: "clamp(16px, 2vw, 32px)",
                overflowX: "auto",
                scrollBehavior: "smooth",
                padding: "1rem 0",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{
                    flex: "0 0 auto",
                    width: "clamp(280px, 70vw, 420px)",
                    scrollSnapAlign: "start",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Masque scrollbar sur Webkit */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

        </div>
      </div>
    </section>
  );
}