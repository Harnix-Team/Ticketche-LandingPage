"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const images = [
  { src: "/images/mockups/c1.png", alt: "Ticketché utilisateur" },
  { src: "/images/mockups/c2.png", alt: "Ticketché gérant" },
  { src: "/images/mockups/c3.png", alt: "Ticketché organisateur" },
  { src: "/images/mockups/c1.png", alt: "Ticketché accueil" },
  { src: "/images/mockups/c2.png", alt: "Ticketché événement" },
  { src: "/images/mockups/c3.png", alt: "Ticketché parking" },
  { src: "/images/mockups/c2.png", alt: "Ticketché garage" },
  { src: "/images/mockups/c1.png", alt: "Ticketché app" },
];

const VISIBLE = 3;
const GAP = 32;
const TOTAL = images.length;

export default function TicketcheFonction() {
  const [current, setCurrent]       = useState(0);
  const [animDir, setAnimDir]       = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef  = useRef(null);
  const animatingRef = useRef(false); // ref pour éviter la closure stale

  /* ── slide : utilise la ref pour éviter le stale closure ── */
  const slide = useCallback((dir) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    setAnimDir(dir);

    setTimeout(() => {
      setCurrent(prev =>
        dir === "right" ? (prev + 1) % TOTAL : (prev - 1 + TOTAL) % TOTAL
      );
      animatingRef.current = false;
      setIsAnimating(false);
      setAnimDir(null);
    }, 420);
  }, []); // pas de dépendances → stable entre les renders

  /* ── reset intervalle ── */
  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => slide("right"), 3200);
  }, [slide]);

  /* ── auto-slide au mount ── */
  useEffect(() => {
    intervalRef.current = setInterval(() => slide("right"), 3200);
    return () => clearInterval(intervalRef.current);
  }, [slide]);

  const prev = () => { slide("left");  resetInterval(); };
  const next = () => { slide("right"); resetInterval(); };

  const visibleIndices = Array.from({ length: VISIBLE }, (_, i) => (current + i) % TOTAL);

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
              <span style={{ color: "#00c9a7" }}>pour tous</span>
            </h2>
            <p style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: "360px", margin: 0, paddingTop: "6px" }}>
              Payez et encaissez en toute confiance grâce à notre plateforme.
              Transactions instantanées, sans commission cachée et sans mauvaise surprise.
            </p>
          </div>

          {/* ── CARROUSEL ── */}
          <div style={{
            position: "absolute",
            bottom: "-150px",
            left: "clamp(20px, 4vw, 60px)",
            right: "clamp(20px, 4vw, 60px)",
            zIndex: 10,
          }}>

            {/* Track */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${VISIBLE}, 1fr)`,
              gap: `${GAP}px`,
              overflow: "hidden",
            }}>
              {visibleIndices.map((imgIdx, pos) => (
                <div
                  key={`${current}-${pos}`}
                  style={{
                    borderRadius: "clamp(16px, 2vw, 24px)",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    aspectRatio: "3/4",
                    animation: isAnimating
                      ? animDir === "right"
                        ? "slideFromRight 0.42s cubic-bezier(0.4,0,0.2,1) both"
                        : "slideFromLeft 0.42s cubic-bezier(0.4,0,0.2,1) both"
                      : "none",
                  }}
                >
                  <img
                    src={images[imgIdx].src}
                    alt={images[imgIdx].alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ))}
            </div>

            {/* Contrôles */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "16px", marginTop: "24px",
            }}>
              <button
                onClick={prev}
                style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", fontSize: "1.2rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s", flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,201,167,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >‹</button>

              <div style={{ display: "flex", gap: "8px" }}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); resetInterval(); }}
                    style={{
                      width: i === current ? "24px" : "8px",
                      height: "8px", borderRadius: "4px",
                      background: i === current ? "#00c9a7" : "rgba(255,255,255,0.3)",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", fontSize: "1.2rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s", flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,201,167,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >›</button>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideFromRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}