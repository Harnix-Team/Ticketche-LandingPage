"use client";
import { ArrowRight, Star } from "@phosphor-icons/react";

/* ─────────────────────────────────────────────
   Micro-clusters éparpillés sur toute la hero
   Chaque cluster = 2-4 petites étoiles groupées
───────────────────────────────────────────── */
const CLUSTERS = [
  // haut gauche
  {
    cx: "7%", cy: "10%", stars: [
      { x: 0, y: 0, size: 14, opacity: 0.80, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" },
      { x: 16, y: -10, size: 10, opacity: 0.55, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" },
      { x: -12, y: 14, size: 8, opacity: 0.40, anim: 2, delay: "0.6s", dur: "3.6s", color: "#00d4e0" },
      { x: 20, y: 12, size: 6, opacity: 0.30, anim: 0, delay: "0.9s", dur: "4.0s", color: "#00515a" },
    ]
  },
  // haut droite
  {
    cx: "87%", cy: "7%", stars: [
      { x: 0, y: 0, size: 15, opacity: 0.75, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" },
      { x: -14, y: 12, size: 10, opacity: 0.50, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" },
      { x: 16, y: -8, size: 8, opacity: 0.38, anim: 2, delay: "0.8s", dur: "2.9s", color: "#00d4e0" },
      { x: -6, y: -16, size: 6, opacity: 0.28, anim: 1, delay: "1.1s", dur: "3.8s", color: "#00818f" },
    ]
  },
  // milieu gauche
  {
    cx: "3%", cy: "40%", stars: [
      { x: 0, y: 0, size: 11, opacity: 0.60, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" },
      { x: 14, y: -7, size: 8, opacity: 0.42, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" },
      { x: -9, y: 12, size: 6, opacity: 0.32, anim: 1, delay: "0.7s", dur: "4.1s", color: "#00d4e0" },
    ]
  },
  // milieu droite
  {
    cx: "92%", cy: "36%", stars: [
      { x: 0, y: 0, size: 12, opacity: 0.65, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" },
      { x: -16, y: 9, size: 8, opacity: 0.42, anim: 2, delay: "0.6s", dur: "2.6s", color: "#00515a" },
      { x: 11, y: 14, size: 6, opacity: 0.30, anim: 1, delay: "0.9s", dur: "3.9s", color: "#00d4e0" },
    ]
  },
  // bas gauche
  {
    cx: "9%", cy: "70%", stars: [
      { x: 0, y: 0, size: 10, opacity: 0.50, anim: 1, delay: "0s", dur: "3.1s", color: "#00d4e0" },
      { x: 12, y: -9, size: 7, opacity: 0.36, anim: 2, delay: "0.4s", dur: "3.7s", color: "#00818f" },
      { x: -10, y: 10, size: 5, opacity: 0.26, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00515a" },
    ]
  },
  // bas droite
  {
    cx: "89%", cy: "66%", stars: [
      { x: 0, y: 0, size: 11, opacity: 0.55, anim: 2, delay: "0.2s", dur: "3.4s", color: "#00515a" },
      { x: -12, y: -10, size: 8, opacity: 0.38, anim: 0, delay: "0.5s", dur: "2.9s", color: "#00818f" },
      { x: 14, y: 8, size: 6, opacity: 0.28, anim: 1, delay: "0.8s", dur: "4.0s", color: "#00d4e0" },
    ]
  },
  // haut centre-gauche
  {
    cx: "26%", cy: "4%", stars: [
      { x: 0, y: 0, size: 8, opacity: 0.45, anim: 0, delay: "0.15s", dur: "3.6s", color: "#00818f" },
      { x: 10, y: 9, size: 5, opacity: 0.28, anim: 1, delay: "0.5s", dur: "2.8s", color: "#00515a" },
    ]
  },
  // haut centre-droite
  {
    cx: "71%", cy: "5%", stars: [
      { x: 0, y: 0, size: 9, opacity: 0.50, anim: 1, delay: "0.25s", dur: "3.2s", color: "#00515a" },
      { x: -9, y: 11, size: 6, opacity: 0.32, anim: 2, delay: "0.6s", dur: "3.8s", color: "#00d4e0" },
    ]
  },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{
          position: "absolute",
          left: cluster.cx, top: cluster.cy,
          width: 0, height: 0,
          zIndex: 8, pointerEvents: "none",
        }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{
              position: "absolute",
              left: s.x, top: s.y,
              transform: "translate(-50%,-50%)",
              opacity: s.opacity,
              animation: `starFloat${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`,
              filter: `drop-shadow(0 0 3px ${s.color}88)`,
            }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* Arc inchangé — position et contenu identiques à l'original */
// function DashedArc() {
//   const R = 100;
//   const size = R * 2 + 60;
//   const cx = R + 30;
//   const cy = R + 30;
//   const startAngle = -40 * (Math.PI / 180);
//   const endAngle = -650 * (Math.PI / 180);
//   const startX = cx + R * Math.cos(startAngle);
//   const startY = cy + R * Math.sin(startAngle);
//   const endX = cx + R * Math.cos(endAngle);
//   const endY = cy + R * Math.sin(endAngle);
//   const arcLen = R * (210 * Math.PI / 180);

//   return (
//     <div style={{
//       position: "absolute",
//       top: "30%",
//       transform: "translate(-50%, -50%)",
//       width: size, height: size,
//       pointerEvents: "none", zIndex: 5,
//     }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ overflow: "visible" }}>
//         <path
//           d={`M ${startX} ${startY} A ${R} ${R} 0 1 0 ${endX} ${endY}`}
//           stroke="#367e86" strokeWidth="2.5" strokeDasharray="14 10"
//           strokeLinecap="round" fill="none"
//           style={{ animation: "dashScroll 8s linear infinite" }}
//         />
//         <path
//           d={`M ${startX} ${startY} A ${R} ${R} 0 1 0 ${endX} ${endY}`}
//           stroke="rgba(54,126,134,0.45)" strokeWidth="1.7"
//           strokeLinecap="round" fill="none"
//           strokeDasharray={`${arcLen} ${arcLen}`}
//           style={{ animation: "dashDraw 6s ease-in-out infinite" }}
//         />
//         <g transform={`translate(${endX}, ${endY}) rotate(20)`}>
//           <path d="M 0 0 L -8 -16 M 0 0 L 8 -16" stroke="#367e86" strokeWidth="2.4" strokeLinecap="round" fill="none" />
//         </g>
//       </svg>

//       {/* 3 étoiles flottantes positionnées à l'extrémité de l'arc */}
//       {[
//         { dx: -2, dy: -36, size: 26, color: "#00818f", anim: "arcStar0", dur: "2.6s", delay: "0s" },
//         { dx: 28, dy: -14, size: 17, color: "#00d4e0", anim: "arcStar1", dur: "3.1s", delay: "0.4s" },
//         { dx: -24, dy: 12, size: 13, color: "#00515a", anim: "arcStar2", dur: "2.3s", delay: "0.7s" },
//       ].map((s, i) => (
//         <div key={i} style={{
//           position: "absolute",
//           left: endX + s.dx,
//           top: endY + s.dy,
//           transform: "translate(-50%,-50%)",
//           animation: `${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`,
//           filter: `drop-shadow(0 0 6px ${s.color}cc)`,
//         }}>
//           <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
//         </div>
//       ))}
//     </div>
//   );
// }

export const HeroV2 = () => {

  return (
    <>
      <style>{`
        @keyframes starFloat0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes starFloat1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes starFloat2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        @keyframes arcStar0 {
          0%,100% { transform: translate(-50%,-50%) translateY(0px) rotate(0deg) scale(1); }
          35%     { transform: translate(-50%,-50%) translateY(-10px) rotate(18deg) scale(1.18); }
          70%     { transform: translate(-50%,-50%) translateY(-4px) rotate(-8deg) scale(0.92); }
        }
        @keyframes arcStar1 {
          0%,100% { transform: translate(-50%,-50%) translateY(0px) rotate(0deg); }
          50%     { transform: translate(-50%,-50%) translateY(-8px) rotate(22deg) scale(1.12); }
        }
        @keyframes arcStar2 {
          0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          40%     { transform: translate(-50%,-50%) translateY(-6px) scale(1.22) rotate(-14deg); }
          75%     { transform: translate(-50%,-50%) scale(0.88) rotate(7deg); }
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
        @keyframes miniRocketFly {
          0%,100% { transform: rotate(25deg) translateY(0px) scale(1); }
          50%      { transform: rotate(25deg) translateY(-6px) scale(1.1); }
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,81,90,0.28); }
          50%     { box-shadow: 0 0 0 8px rgba(0,81,90,0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Bouton : shimmer + pulse ring + arrow bounce + glow ── */
        @keyframes btnShimmer {
          0%       { transform: translateX(-130%) skewX(-18deg); }
          100%     { transform: translateX(350%) skewX(-18deg); }
        }
        @keyframes btnPulseRing {
          0%   { transform: scale(1);    opacity: 0.6; }
          100% { transform: scale(1.16); opacity: 0; }
        }
        @keyframes btnGlow {
          0%,100% { box-shadow: 0 6px 20px rgba(0,81,90,0.32), 0 0 0   0   rgba(0,129,143,0); }
          50%      { box-shadow: 0 8px 28px rgba(0,81,90,0.44), 0 0 20px 4px rgba(0,129,143,0.18); }
        }
        @keyframes arrowBounce {
          0%,100% { transform: translateX(0); }
          45%     { transform: translateX(5px); }
          72%     { transform: translateX(-2px); }
        }

        .btn-hero {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          background: #00515a;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-family: 'Archivo', sans-serif;
          font-size: clamp(0.92rem, 1.45vw, 1.05rem);
          font-weight: 700;
          cursor: pointer;
          padding: 8px 8px 8px clamp(28px, 4vw, 42px);
          min-width: clamp(230px, 32vw, 310px);
          white-space: nowrap;
          animation: fadeUp 0.7s ease 0.6s both, btnGlow 3s ease-in-out 2s infinite;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        /* shimmer sweep continu */
        .btn-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          width: 38%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
          transform: translateX(-130%) skewX(-18deg);
          animation: btnShimmer 3.2s ease-in-out 1.5s infinite;
          pointer-events: none;
        }

        /* pulse ring autour */
        .btn-ring {
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          border: 2px solid rgba(0,168,140,0.50);
          animation: btnPulseRing 2s ease-out 1s infinite;
          pointer-events: none;
        }

        .btn-hero:hover {
          transform: translateY(-3px) scale(1.025);
          box-shadow: 0 14px 36px rgba(0,81,90,0.50), 0 0 24px 6px rgba(0,129,143,0.18);
        }
        .btn-hero:active {
          transform: scale(0.975);
          box-shadow: 0 4px 12px rgba(0,81,90,0.28);
        }

        .btn-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(50px, 6.5vw, 62px);
          height: clamp(50px, 6.5vw, 62px);
          background: #fff;
          border-radius: 50%;
          color: #00515a;
          box-shadow: 0 4px 14px rgba(0,0,0,0.14);
          flex-shrink: 0;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .btn-arrow {
          animation: arrowBounce 1.9s ease-in-out 2s infinite;
        }
        .btn-hero:hover .btn-circle {
          background: #e0f7f4;
          transform: scale(1.08);
        }
        .btn-hero:hover .btn-arrow {
          animation: arrowBounce 0.55s ease infinite;
        }

        @media (max-width: 767px) {
          .hero-stars { display: none; }
          .hero-orbe-mobile { display: block; }
          .hero-mockup-desktop { display: none !important; }
        }
        @media (min-width: 768px) {
          .hero-orbe-mobile { display: none; }
          .hero-mockup-desktop { display: block; }
        }
          @media (max-width: 800px) {
 
}
          .hero-stars,
.hero-mockup-desktop,
.hero-orbe-mobile,
.hero-mockup-desktop img,
.hero-orbe-mobile img {
  pointer-events: none !important;
}

.btn-hero {
  z-index: 1000 !important;
  position: relative !important;
}
      `}</style>

      <section style={{
        position: "relative", minHeight: "100vh",
        overflow: "hidden", background: "#ffffff",
        fontFamily: "'Archivo', sans-serif",
      }}>
        {/* ══ BACKGROUNDS (identiques à l'original) ══ */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse 65% 55% at -5% 0%, rgba(0,81,90,0.55) 0%, rgba(0,81,90,0.20) 45%, transparent 75%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse 65% 55% at 105% 0%, rgba(0,81,90,0.55) 0%, rgba(0,81,90,0.20) 45%, transparent 75%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(ellipse 40% 50% at -2% 55%, rgba(0,81,90,0.30) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(ellipse 40% 50% at 102% 55%, rgba(0,81,90,0.30) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, background: "radial-gradient(ellipse 110% 75% at 50% 110%, rgba(0,42,48,0.82) 0%, rgba(0,63,72,0.65) 25%, rgba(0,81,90,0.38) 52%, rgba(0,101,116,0.15) 70%, transparent 88%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 4, background: "radial-gradient(ellipse 90% 70% at 50% 5%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 35%, rgba(255,255,255,0.55) 58%, rgba(255,255,255,0.10) 75%, transparent 88%)" }} />

        {/* ══ ÉTOILES éparpillées (masquées sur mobile) ══ */}
        <div className="hero-stars" style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none" }}>
          <StarClusters />
        </div>

        {/* ══ CONTENU PRINCIPAL (identique à l'original) ══ */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          minHeight: "100vh",
          padding: "clamp(14px, 14vh, 160px) clamp(0px, 1vw, 8px) 20px",
          gap: "clamp(16px, 2.4vw, 26px)",
        }}>

          {/* Badge — identique à l'original */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "clamp(10px, 1.5vw, 14px) clamp(22px, 3vw, 32px)",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(18px) saturate(160%)",
            border: "1px solid rgba(0,81,90,0.22)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginTop: "clamp(0px, 1vw, 16px)",
            animation: "badgePulse 3.5s ease-in-out infinite, fadeUp 0.8s ease 0.1s both",
          }}>
            <div style={{
              width: "clamp(8px,1vw,10px)", height: "clamp(8px,1vw,10px)",
              borderRadius: "50%", background: "#00515a",
              boxShadow: "0 0 10px rgba(0,81,90,0.5)", flexShrink: 0,
            }} />
            <span style={{ fontSize: "clamp(0.78rem,1.4vw,0.92rem)", fontWeight: 700, letterSpacing: "0.3px" }}>
              <span style={{ color: "#000000" }}> Réservez, Payez, Profitez</span>{" "}
              <span style={{ color: "#00515a" }}>Avec Ticketché</span>
            </span>
          </div>

          {/* Titre — identique à l'original */}
          <div style={{
            position: "relative", display: "inline-block",
            textAlign: "center", animation: "fadeUp 0.7s ease 0.25s both",
          }}>


            <h1 style={{
              position: "relative", zIndex: 2,
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              fontWeight: 900, color: "#0a0a0a",
              lineHeight: 1.06, letterSpacing: "0.02em", margin: 0,
              maxWidth: "64rem",
            }}>
              Votre business mérite mieux qu'un carnet. <br /> Passez à{" "}             <span style={{ display: "inline-flex", alignItems: "center", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ color: "#00818f" }}>Ticketché</span>
                <span style={{ display: "inline-flex", gap: "8px", marginLeft: "2px" }}>
                  <span style={{ width: "clamp(16px,2vw,26px)", height: "clamp(16px,2vw,26px)", borderRadius: "50%", background: "linear-gradient(135deg,#00818f,#00515a)", display: "inline-block", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,81,90,0.45)" }} />
                  <span style={{ width: "clamp(16px,2vw,26px)", height: "clamp(16px,2vw,26px)", borderRadius: "50%", background: "linear-gradient(135deg,#1a1a1a,#3a3a3a)", display: "inline-block", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,0,0,0.30)" }} />
                </span>
              </span>
            </h1>
          </div>

          {/* Sous-titre — identique à l'original */}
          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
            color: "#4b5563", maxWidth: "880px",
            textAlign: "center", lineHeight: 1.8,
            fontWeight: 400, margin: 0,
            animation: "fadeUp 0.7s ease 0.45s both",
          }}>
            Ticketché aide les <strong style={{ color: "#00515a", fontWeight: 800 }}>gérants</strong> de parkings, lavages, garages et événements
            à gérer leurs activités, <strong style={{ color: "#00515a", fontWeight: 800 }}>encaisser</strong> les paiements et <strong style={{ color: "#00515a", fontWeight: 800 }}>suivre</strong> leurs performances simplement depuis leur smartphone.          </p>

          {/* ── Bouton animé ── */}
          <a
            href="https://app.ticketche.com/" target="_blank"
            rel="noopener noreferrer"
            className="btn-hero"
            style={{
              zIndex: 1000,
              position: "relative",
              textDecoration: "none",
            }}
          >
            <div className="btn-ring" style={{ pointerEvents: "none" }} />
            <span style={{ flex: 1, textAlign: "center", paddingRight: "clamp(8px,1.5vw,12px)", pointerEvents: "none" }}>
              Installer Ticketché
            </span>
            <div className="btn-circle" style={{ pointerEvents: "none" }}>
              <ArrowRight weight="bold" className="btn-arrow" style={{ width: "clamp(22px,2.4vw,26px)", height: "clamp(22px,2.4vw,26px)", pointerEvents: "none" }} />
            </div>
          </a>


          {/* — Mobile : orbe uniquement — */}
          <div className="hero-orbe-mobile" style={{
            width: "200vw", maxWidth: "300vw",
            margin: "32px auto 0",
            marginLeft: "calc(-100vw + 50%)",
            animation: "fadeUp 0.9s ease 0.9s both",
          }}>
            <img src="/images/Hero/orbe.png" alt="Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>

          {/* — Desktop : mockup complet — */}
          <div className="hero-mockup-desktop" style={{
            width: "100%", maxWidth: "900px",
            margin: "clamp(40px,5vw,64px) auto 0",
            position: "relative",
            height: "clamp(320px,44vw,540px)",
            animation: "fadeUp 0.9s ease 0.9s both",
          }}>
            <div style={{ position: "absolute", inset: "10% 5%", background: "radial-gradient(ellipse 75% 65% at 50% 55%, rgba(0,81,90,0.12) 0%, transparent 72%)", filter: "blur(40px)", pointerEvents: "none" }} />
            {/* téléphone central */}
            <div style={{ position: "absolute", left: "55%", top: "-100%", transform: "translateX(-50%)", width: "clamp(340px,42vw,560px)", height: "clamp(700px,90vw,1100px)", zIndex: 4 }}>
              <img src="/images/Hero/img11.png" alt="App Ticketché" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* carte gauche */}
            <div style={{ position: "absolute", left: "-12%", top: "30%", width: "clamp(200px,35vw,400px)", borderRadius: "clamp(14px,1.8vw,22px)", overflow: "hidden", boxShadow: "0 20px 56px rgba(0,0,0,0.15),0 4px 16px rgba(0,81,90,0.12)", zIndex: 6 }}>
              <img src="/images/Hero/img3.jpg" alt="Parking Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            {/* carte droite haut */}
            <div style={{ position: "absolute", right: "-9%", top: "20%", width: "clamp(200px,250vw,350px)", borderRadius: "clamp(14px,1.8vw,20px)", overflow: "hidden", boxShadow: "0 16px 44px rgba(0,0,0,0.13),0 4px 14px rgba(0,81,90,0.11)", zIndex: 5 }}>
              <img src="/images/Hero/img2.png" alt="Événements Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            {/* carte droite bas */}
            <div style={{ position: "absolute", right: "-12%", bottom: "5%", width: "clamp(400px,19vw,300px)", borderRadius: "clamp(14px,1.8vw,20px)", overflow: "hidden", boxShadow: "0 16px 44px rgba(0,0,0,0.13),0 4px 14px rgba(0,81,90,0.11)", zIndex: 5 }}>
              <img src="/images/Hero/img44.jpg" alt="Garage Ticketché" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>

        </div>
      </section >
    </>
  );
};

export default HeroV2;