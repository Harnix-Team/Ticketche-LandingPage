"use client";
import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   CANVAS — feu réaliste sous la fusée
───────────────────────────────────────────── */
function RocketFire() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = (canvas.width = 100);
    const H = (canvas.height = 140);
    const mk = () => ({
      x: W / 2 + (Math.random() - 0.5) * 18,
      y: 8,
      vx: (Math.random() - 0.5) * 1.1,
vy: Math.random() * 1.2 + 0.8,      life: Math.random() * 0.4 + 0.6,
      decay: Math.random() * 0.022 + 0.016,
r: Math.random() * 11 + 2,
    });
const ps = Array.from({ length: 30 }, mk);
    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255,252,190,${p.life})`);
        g.addColorStop(0.28, `rgba(255,140,0,${p.life * 0.92})`);
        g.addColorStop(0.6, `rgba(210,38,0,${p.life * 0.55})`);
        g.addColorStop(1, `rgba(80,0,0,0)`);
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.r *= 0.968;
        if (p.life <= 0) Object.assign(p, mk());
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={ref} style={{
      position: "absolute", top: "93%", left: "50%",
      transform: "translateX(-50%)", pointerEvents: "none", zIndex: -1,
    }} />
  );
}

function Rocket() {
  return (
    <div style={{
      position: "absolute",
      top: "-8%",
      right: "-14%",
      zIndex: 8,
      transform: "rotate(45deg)",
      animation: "rocketFloat 3.8s ease-in-out infinite",
      transformOrigin: "center center",
    }}>
      <div style={{
        position: "relative",
        width: "clamp(28px,3vw,42px)",
        height: "clamp(68px,7vw,100px)",
      }}>
        <div style={{
          position: "absolute", inset: "-25%",
          background: "radial-gradient(circle, rgba(0,210,230,0.22) 0%, transparent 68%)",
          filter: "blur(22px)",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)", width: "54%", height: "33%",
          background: "linear-gradient(150deg, #00cce0 0%, #00818f 32%, #00515a 68%, #00343c 100%)",
          borderRadius: "50% 50% 16% 16% / 80% 80% 20% 20%",
          boxShadow: "inset -5px 0 10px rgba(0,0,0,0.38), inset 3px 0 8px rgba(255,255,255,0.18)",
        }} />
        <div style={{
          position: "absolute", top: "2%", left: "54%",
          width: "9%", height: "14%",
          background: "rgba(255,255,255,0.55)", borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", top: "28%", left: "50%",
          transform: "translateX(-50%)", width: "100%", height: "54%",
          background: "linear-gradient(150deg, #00d8ec 0%, #00949f 16%, #00515a 54%, #00353d 100%)",
          borderRadius: "10px",
          boxShadow: "inset -8px 0 14px rgba(0,0,0,0.42), inset 4px 0 10px rgba(255,255,255,0.14)",
        }} />
        <div style={{
          position: "absolute", top: "30%", left: "57%",
          width: "6%", height: "46%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.1) 55%, transparent 100%)",
          borderRadius: "3px",
        }} />
        <div style={{
          position: "absolute", top: "38%", left: "50%",
          transform: "translateX(-50%)", width: "37%", height: "15%",
          background: "radial-gradient(circle at 36% 36%, #b8f6ff, #00ccdf 42%, #005f6d 100%)",
          borderRadius: "50%",
          border: "2.5px solid rgba(0,215,235,0.75)",
          animation: "windowGlow 2.2s ease-in-out infinite",
          zIndex: 2,
        }} />
        <div style={{
          position: "absolute", top: "38.5%", left: "53%",
          width: "9%", height: "5.5%",
          background: "rgba(255,255,255,0.72)", borderRadius: "50%", zIndex: 3,
        }} />
        <div style={{
          position: "absolute", bottom: "7%", left: "-21%",
          width: "28%", height: "27%",
          background: "linear-gradient(138deg, #00869a 0%, #003a42 100%)",
          clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: "7%", right: "-21%",
          width: "28%", height: "27%",
          background: "linear-gradient(222deg, #00869a 0%, #003a42 100%)",
          clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)", width: "50%", height: "9%",
          background: "linear-gradient(180deg, #003a42 0%, #001c22 100%)",
          borderRadius: "0 0 8px 8px",
          border: "1px solid rgba(0,155,170,0.5)",
        }} />
        <RocketFire />
      </div>
    </div>
  );
}

function DashedArc() {
  const R = 100;
  const size = R * 2 + 60;
  const cx = R + 30;
  const cy = R + 30;
  const startAngle = -40 * (Math.PI / 180);
  const endAngle = -650 * (Math.PI / 180);
  const startX = cx + R * Math.cos(startAngle);
  const startY = cy + R * Math.sin(startAngle);
  const endX = cx + R * Math.cos(endAngle);
  const endY = cy + R * Math.sin(endAngle);
  const arcDeg = 210;
  const arcLen = R * (arcDeg * Math.PI / 180);

  return (
    <div style={{
      position: "absolute",
      top: "30%",
      transform: "translate(-50%, -50%)",
      width: size,
      height: size,
      pointerEvents: "none",
      zIndex: 5,
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ overflow: "visible" }}>
        <path
          d={`M ${startX} ${startY} A ${R} ${R} 0 1 0 ${endX} ${endY}`}
          stroke="#367e86"
          strokeWidth="2.5"
          strokeDasharray="14 10"
          strokeLinecap="round"
          fill="none"
          style={{ animation: "dashScroll 8s linear infinite" }}
        />
        <path
          d={`M ${startX} ${startY} A ${R} ${R} 0 1 0 ${endX} ${endY}`}
          stroke="rgba(54,126,134,0.45)"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${arcLen} ${arcLen}`}
          style={{ animation: "dashDraw 6s ease-in-out infinite" }}
        />
        <g transform={`translate(${endX}, ${endY}) rotate(20)`}>
          <path d="M 0 0 L -8 -16 M 0 0 L 8 -16" stroke="#367e86" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      </svg>
      <div style={{
        position: "absolute",
        left: `${endX - 30}px`,
        top: `${endY - 30}px`,
        fontSize: "clamp(26px, 3.2vw, 36px)",
        color: "#367e86",
        animation: "miniRocketFly 2.8s ease-in-out infinite",
        filter: "drop-shadow(0 4px 12px rgba(54,126,134,0.7))",
        transform: "rotate(25deg)",
        transformOrigin: "center bottom",
      }}>
        🚀
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
export const Hero = () => {
  return (
    <>
      <style>{`
        @keyframes rocketFloat {
          0%,100% { transform: rotate(45deg) translateY(0px); }
          50%      { transform: rotate(45deg) translateY(-8px); }
        }
        @keyframes windowGlow {
          0%,100% { box-shadow: 0 0 8px rgba(0,200,222,0.7); }
          50%      { box-shadow: 0 0 20px rgba(0,218,242,1), 0 0 36px rgba(0,188,215,0.5); }
        }
        @keyframes dashScroll {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -533; }
        }
        @keyframes dashDraw {
          0%    { stroke-dashoffset: 533; opacity: 0; }
          10%   { opacity: 1; }
          65%   { stroke-dashoffset: 0; opacity: 1; }
          80%   { stroke-dashoffset: 0; opacity: 0.7; }
          100%  { stroke-dashoffset: -533; opacity: 0; }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,81,90,0.28); }
          50%     { box-shadow: 0 0 0 8px rgba(0,81,90,0); }
        }
        @keyframes btnShine {
          0%       { left: -100%; }
          50%,100% { left: 200%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#ffffff",
        fontFamily: "'Archivo', sans-serif",
      }}>
        {/* ══ BACKGROUNDS ══ */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse 65% 55% at -5% 0%, rgba(0,81,90,0.55) 0%, rgba(0,81,90,0.20) 45%, transparent 75%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse 65% 55% at 105% 0%, rgba(0,81,90,0.55) 0%, rgba(0,81,90,0.20) 45%, transparent 75%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(ellipse 40% 50% at -2% 55%, rgba(0,81,90,0.30) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(ellipse 40% 50% at 102% 55%, rgba(0,81,90,0.30) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, background: "radial-gradient(ellipse 110% 75% at 50% 110%, rgba(0,42,48,0.82) 0%, rgba(0,63,72,0.65) 25%, rgba(0,81,90,0.38) 52%, rgba(0,101,116,0.15) 70%, transparent 88%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 4, background: "radial-gradient(ellipse 90% 70% at 50% 5%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 35%, rgba(255,255,255,0.55) 58%, rgba(255,255,255,0.10) 75%, transparent 88%)" }} />

        {/* ══ CONTENU PRINCIPAL ══ */}
        <div style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "clamp(100px, 14vh, 160px) clamp(0px, 1vw, 8px) 20px",
          gap: "clamp(16px, 2.4vw, 26px)",
        }}>

          {/* ── Badge ── */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "clamp(10px, 1.5vw, 14px) clamp(22px, 3vw, 32px)",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(18px) saturate(160%)",
            border: "1px solid rgba(0, 81, 90, 0.22)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
            animation: "badgePulse 3.5s ease-in-out infinite, fadeUp 0.8s ease 0.1s both",
          }}>
            <div style={{
              width: "clamp(8px, 1vw, 10px)",
              height: "clamp(8px, 1vw, 10px)",
              borderRadius: "50%",
              background: "#00515a",
              boxShadow: "0 0 10px rgba(0, 81, 90, 0.5)",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: "clamp(0.78rem, 1.4vw, 0.92rem)",
              fontWeight: 700,
              letterSpacing: "0.3px",
            }}>
              <span style={{ color: "#000000" }}>Gérez Mieux</span>{" "}
              <span style={{ color: "#00515a" }}>Avec Ticketché</span>
            </span>
          </div>

          {/* ── Titre ── */}
          <div style={{
            position: "relative",
            display: "inline-block",
            textAlign: "center",
            animation: "fadeUp 0.7s ease 0.25s both",
          }}>
            <DashedArc />
            <Rocket />

            {/* h1 réduit de -20% : clamp(2.6→2.08, 6.2→4.96vw, 5→4rem) */}
            <h1 style={{
              position: "relative", zIndex: 2,
              fontSize: "clamp(2.08rem, 4.96vw, 4rem)",
              fontWeight: 900,
              color: "#0a0a0a",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              margin: 0,
            }}>
              Parking, Lavage &amp; Événements
              <br />
              <span style={{ display: "inline-flex", alignItems: "center", gap: "14px" }}>
                Dans Votre Poche
                <span style={{ display: "inline-flex", gap: "8px", marginLeft: "6px" }}>
                  <span style={{
                    width: "clamp(26px,3vw,42px)", height: "clamp(26px,3vw,42px)",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00818f, #00515a)",
                    display: "inline-block", flexShrink: 0,
                    boxShadow: "0 4px 14px rgba(0,81,90,0.45)",
                  }} />
                  <span style={{
                    width: "clamp(26px,3vw,42px)", height: "clamp(26px,3vw,42px)",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1a1a1a, #3a3a3a)",
                    display: "inline-block", flexShrink: 0,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.30)",
                  }} />
                </span>
              </span>
            </h1>
          </div>

          {/* ── Sous-titre ── */}
          <p style={{
            fontSize: "clamp(0.875rem, 1.7vw, 1rem)",
            color: "#4b5563",
            maxWidth: "500px",
            textAlign: "center",
            lineHeight: 1.8,
            fontWeight: 400,
            margin: 0,
            animation: "fadeUp 0.7s ease 0.45s both",
          }}>
            Réservez votre parking, planifiez un lavage, gérez votre garage ou
            achetez vos billets d'événements — le tout en quelques secondes.
          </p>

          {/* ── Bouton ── */}
          <button
            style={{
              position: "relative",
              overflow: "hidden",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "clamp(5px, 0.2vw, 2px) clamp(2px, 3vw, 32px) clamp(1px, 1.2vw, 3px) clamp(36px, 5vw, 48px)",
              background: "#00515a",
              color: "white",
              border: "none",
              borderRadius: "999px",
              fontSize: "clamp(0.92rem, 1.45vw, 1.05rem)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0,81,90,0.3)",
              transition: "all 0.28s ease",
              minWidth: "clamp(220px, 32vw, 300px)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,81,90,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,81,90,0.3)";
            }}
          >
            <span style={{ flex: 1, textAlign: "center", paddingRight: "clamp(8px, 1.5vw, 12px)" }}>
              Télécharger l'Application
            </span>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "clamp(52px, 7vw, 64px)",
              height: "clamp(52px, 7vw, 64px)",
              background: "#ffffff",
              borderRadius: "50%",
              marginRight: "-28px",
              color: "#00515a",
              fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)",
              fontWeight: 900,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease",
            }}>
              →
            </div>
          </button>

          {/* ══ MOCKUP MOBILE ══ */}
          <div style={{
            width: "100%",
            maxWidth: "900px",
            margin: "clamp(40px, 5vw, 64px) auto 0",
            position: "relative",
            height: "clamp(320px, 44vw, 540px)",
            animation: "fadeUp 0.9s ease 0.9s both",
          }}>
            <div style={{
              position: "absolute",
              inset: "10% 5%",
              background: "radial-gradient(ellipse 75% 65% at 50% 55%, rgba(0,81,90,0.12) 0%, transparent 72%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />

            {/* TÉLÉPHONE CENTRAL */}
            <div style={{
              position: "absolute",
              left: "55%", top: "-100%",
              transform: "translateX(-50%)",
              width: "clamp(340px, 42vw, 560px)",
              height: "clamp(700px, 90vw, 1100px)",
              zIndex: 4,
            }}>
              <img src="/images/Hero/img11.png" alt="App Ticketché" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>

            {/* CARTE GAUCHE */}
            <div style={{
              position: "absolute",
              left: "-12%", top: "30%",
              width: "clamp(200px, 35vw, 400px)",
              borderRadius: "clamp(14px, 1.8vw, 22px)",
              overflow: "hidden",
              boxShadow: "0 20px 56px rgba(0,0,0,0.15), 0 4px 16px rgba(0,81,90,0.12)",
              zIndex: 6,
            }}>
              <img src="/images/Hero/img3.jpg" alt="Parking Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            {/* CARTE DROITE HAUT */}
            <div style={{
              position: "absolute",
              right: "-9%", top: "20%",
              width: "clamp(200px, 250vw, 350px)",
              borderRadius: "clamp(14px, 1.8vw, 20px)",
              overflow: "hidden",
              boxShadow: "0 16px 44px rgba(0,0,0,0.13), 0 4px 14px rgba(0,81,90,0.11)",
              zIndex: 5,
            }}>
              <img src="/images/Hero/img2.png" alt="Événements Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            {/* CARTE DROITE BAS */}
            <div style={{
              position: "absolute",
              right: "-12%", bottom: "5%",
              width: "clamp(400px, 19vw, 300px)",
              borderRadius: "clamp(14px, 1.8vw, 20px)",
              overflow: "hidden",
              boxShadow: "0 16px 44px rgba(0,0,0,0.13), 0 4px 14px rgba(0,81,90,0.11)",
              zIndex: 5,
            }}>
              <img src="/images/Hero/img44.jpg" alt="Garage Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>

        </div>
      </section>
    </>
  );
};