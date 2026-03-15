"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

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
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section style={{
      padding: "clamp(48px, 7vw, 90px) clamp(20px, 5vw, 72px)",
      paddingBottom: "clamp(80px, 10vw, 120px)",
      position: "relative",
background: "#ffffff",    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>

        {/* ── GRANDE CARTE SOMBRE ── */}
        <div style={{
          border: "1px solid #001e22",
          borderRadius: "clamp(24px, 3vw, 36px)",
          padding: "clamp(36px, 5vw, 60px) clamp(28px, 5vw, 80px)",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Halos déco */}
          <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "0", left: "15%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* EN-TÊTE */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "clamp(20px, 4vw, 60px)", flexWrap: "wrap", position: "relative", zIndex: 1, marginBottom: "clamp(32px, 4vw, 52px)" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#001e22", maxWidth: "460px", margin: 0 }}>
              Trouvez facilement un service proche
            </h2>
            <p style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "#001e22", lineHeight: 1.75, maxWidth: "360px", margin: 0, paddingTop: "6px" }}>
              Ne perdez plus de temps à chercher.
Avec Ticketché, localisez rapidement un parking, garage, lavage ou évènements, disponible près de vous et accédez au service en quelques secondes. 
            </p>
          </div>

          {/* ── CARROUSEL (inline dans la carte) ── */}
          <div style={{ position: "relative", zIndex: 2 }}>

            {/* Bouton précédent */}
            <button
              onClick={scrollLeft}
              style={{
                position: "absolute",
                left: "-16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid rgba(0,81,90,0.3)",
                color: "#00515a",
                cursor: "pointer",
                zIndex: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f8f9";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,81,90,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              aria-label="Précédent"
            >
              <ArrowLeft weight="bold" style={{ width: 18, height: 18 }} />
            </button>

            {/* Bouton suivant */}
            <button
              onClick={scrollRight}
              style={{
                position: "absolute",
                right: "-16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid rgba(0,81,90,0.3)",
                color: "#00515a",
                cursor: "pointer",
                zIndex: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f8f9";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,81,90,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              aria-label="Suivant"
            >
              <ArrowRight weight="bold" style={{ width: 18, height: 18 }} />
            </button>

            {/* Conteneur scrollable */}
            <div
              ref={scrollRef}
              style={{
                display: "flex",
                gap: "clamp(12px, 1.5vw, 20px)",
                overflowX: "auto",
                scrollBehavior: "smooth",
                padding: "12px 4px 20px",
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
                    width: "clamp(180px, 22vw, 260px)",
                    scrollSnapAlign: "start",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
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

            <style jsx>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>
          </div>

        </div>
      </div>
    </section>
  );
}