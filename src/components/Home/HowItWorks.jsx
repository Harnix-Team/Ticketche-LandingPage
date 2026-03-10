"use client";

import { useEffect, useRef, useState } from "react";
import {
  Park,
  Car,
  Wrench,
  Ticket,
  Star,
} from "@phosphor-icons/react";

const steps = [
  {
    title: "Téléchargez l'App",
    description: "Disponible sur App Store et Google Play. Installez Ticketché en quelques secondes, créez votre compte et enregistrez vos véhicules.",
  },
  {
    title: "Choisissez un Service",
    description: "Parking, lavage auto, garage & mécanique, billetterie d'événement ou gestion d'emplacement — sélectionnez ce dont vous avez besoin.",
  },
  {
    title: "Payez en Mobile Money",
    description: "Réglez via Mobile Money, carte bancaire ou votre portefeuille Ticketché. Appliquez un code promo pour bénéficier d'une réduction instantanée.",
  },
  {
    title: "Profitez & Notez",
    description: "Votre QR code est généré instantanément. Présentez-le à l'entrée, profitez du service sans attente et laissez un avis pour la communauté.",
  },
];

const services = [
  {
    Icon: Park,
    label: "Parking",
    sub: "Réservez en temps réel",
    color: "#00c9a7",
    bg: "rgba(0,201,167,0.12)",
    border: "rgba(0,201,167,0.25)",
  },
  {
    Icon: Car,
    label: "Lavage Auto",
    sub: "Centres notés près de vous",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.25)",
  },
  {
    Icon: Wrench,
    label: "Garage",
    sub: "Garages certifiés",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.25)",
  },
  {
    Icon: Ticket,
    label: "Billetterie",
    sub: "Concerts, soirées, expos",
    color: "#f0b429",
    bg: "rgba(240,180,41,0.12)",
    border: "rgba(240,180,41,0.25)",
  },
];

const STEP_DURATION = 2600;
const CLUSTERS_HIW = [
  {
    cx: "4%", cy: "10%", stars: [
      { x: 0, y: 0, size: 13, opacity: 0.70, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" },
      { x: 15, y: -9, size: 9, opacity: 0.45, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" },
      { x: -10, y: 13, size: 7, opacity: 0.30, anim: 2, delay: "0.6s", dur: "3.6s", color: "#00d4e0" },
    ]
  },
  {
    cx: "88%", cy: "8%", stars: [
      { x: 0, y: 0, size: 14, opacity: 0.65, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" },
      { x: -13, y: 11, size: 9, opacity: 0.42, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" },
      { x: 14, y: -7, size: 7, opacity: 0.30, anim: 2, delay: "0.8s", dur: "2.9s", color: "#00d4e0" },
    ]
  },
  {
    cx: "2%", cy: "50%", stars: [
      { x: 0, y: 0, size: 10, opacity: 0.55, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" },
      { x: 13, y: -6, size: 7, opacity: 0.38, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" },
    ]
  },
  {
    cx: "93%", cy: "45%", stars: [
      { x: 0, y: 0, size: 11, opacity: 0.60, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" },
      { x: -14, y: 8, size: 7, opacity: 0.38, anim: 2, delay: "0.6s", dur: "2.6s", color: "#00515a" },
    ]
  },
  {
    cx: "8%", cy: "82%", stars: [
      { x: 0, y: 0, size: 10, opacity: 0.48, anim: 1, delay: "0s", dur: "3.1s", color: "#00d4e0" },
      { x: 11, y: -8, size: 7, opacity: 0.32, anim: 2, delay: "0.4s", dur: "3.7s", color: "#00818f" },
    ]
  },
  {
    cx: "90%", cy: "78%", stars: [
      { x: 0, y: 0, size: 11, opacity: 0.50, anim: 2, delay: "0.2s", dur: "3.4s", color: "#00515a" },
      { x: -11, y: -9, size: 7, opacity: 0.34, anim: 0, delay: "0.5s", dur: "2.9s", color: "#00818f" },
    ]
  },
];

function StarClustersHIW() {
  return (
    <>
      {CLUSTERS_HIW.map((cluster, ci) => (
        <div key={ci} style={{
          position: "absolute",
          left: cluster.cx, top: cluster.cy,
          width: 0, height: 0,
          zIndex: 0, pointerEvents: "none",
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

export default function HowItWorks() {
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activeService, setActiveService] = useState(null);
  const stepsRef = useRef([]);
  const [dotTop, setDotTop] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // auto-cycle active service tile
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setActiveService(i % services.length);
      i++;
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let frame, a1 = 0, a2 = 0, a3 = 0;
    const animate = () => {
      a1 += 0.003; a2 -= 0.002; a3 += 0.0015;
      if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${a1}rad)`;
      if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${a2}rad)`;
      if (ring3Ref.current) ring3Ref.current.style.transform = `rotate(${a3}rad)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const el = stepsRef.current[activeStep];
      if (el) setDotTop(el.offsetTop + el.offsetHeight / 2 - 7);
    }, 50);
    return () => clearTimeout(t);
  }, [activeStep]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
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
@keyframes phoneFloat {
  0%,100% { transform: scale(1.45) translateY(0px); }
  50%      { transform: scale(1.45) translateY(-10px); }
}
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0px rgba(0,201,167,0.5), 0 0 14px rgba(0,201,167,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
          100% { box-shadow: 0 0 0 0px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
        }
        @keyframes cardFloat {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-7px) rotate(0.4deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes iconBounce {
          0%,100% { transform: scale(1) rotate(0deg); }
          30%     { transform: scale(1.25) rotate(-8deg); }
          60%     { transform: scale(1.15) rotate(5deg); }
        }
        @keyframes iconPulseRing {
          0%   { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes tileSlideIn {
          from { opacity:0; transform: translateY(14px) scale(0.96); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes statCount {
          from { opacity:0; transform: translateY(6px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .animate-phoneFloat { animation: phoneFloat 4s ease-in-out infinite; }
        .animate-phoneFloat:hover { animation-play-state: paused; }
        .animate-pulse-dot { animation: pulse 1.8s ease-out infinite; }

        /* ═══════════════════════════════════
           MOBILE PREVIEW CARD
        ═══════════════════════════════════ */
        .hiw-card {
          position: relative;
          width: 100%;
          border-radius: 32px;
          background: linear-gradient(150deg, #022a2f 0%, #03454e 50%, #04545d 100%);
          padding: 26px 20px 22px;
          overflow: hidden;
          box-shadow:
            0 40px 80px rgba(0,30,34,0.40),
            0 0 0 1px rgba(255,255,255,0.07) inset,
            0 1px 0 rgba(255,255,255,0.12) inset;
          animation: cardFloat 5s ease-in-out infinite;
        }

        /* subtle shimmer sweep */
        .hiw-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.045) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 5s linear infinite;
          border-radius: inherit;
          pointer-events: none;
          z-index: 0;
        }

        /* decorative rings */
        .hiw-card-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px dashed rgba(255,255,255,0.08);
          pointer-events: none;
          z-index: 0;
        }
        .hiw-card-ring-1 { width: 340px; height: 340px; top: -110px; right: -100px; }
        .hiw-card-ring-2 { width: 180px; height: 180px; bottom: -50px; left: -30px; border-style: solid; opacity: 0.05; }

        /* top accent bar */
        .hiw-card-accent {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,201,167,0.7), transparent);
          border-radius: 999px;
          z-index: 1;
        }

        /* header */
        .hiw-card-header {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .hiw-card-brand {
          font-family: 'Archivo', sans-serif;
        }
        .hiw-card-brand-eyebrow {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(0,201,167,0.75);
          display: block;
          margin-bottom: 3px;
        }
        .hiw-card-brand-name {
          font-size: 1.3rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .hiw-card-badge {
          background: rgba(240,180,41,0.15);
          border: 1px solid rgba(240,180,41,0.30);
          color: #f0b429;
          font-family: 'Archivo', sans-serif;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 999px;
          margin-top: 2px;
        }

        /* grid */
        .hiw-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 14px;
        }

        .hiw-tile {
          position: relative;
          border-radius: 18px;
          padding: 15px 14px 14px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
          overflow: hidden;
          animation: tileSlideIn 0.5s ease both;
        }
        .hiw-tile:nth-child(1) { animation-delay: 0.05s; }
        .hiw-tile:nth-child(2) { animation-delay: 0.12s; }
        .hiw-tile:nth-child(3) { animation-delay: 0.19s; }
        .hiw-tile:nth-child(4) { animation-delay: 0.26s; }

        /* active tile */
        .hiw-tile.active {
          transform: translateY(-3px) scale(1.03);
        }

        /* icon wrapper */
        .hiw-tile-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          position: relative;
          transition: transform 0.2s ease;
        }
        .hiw-tile.active .hiw-tile-icon svg {
          animation: iconBounce 0.55s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }

        /* pulse ring on active */
        .hiw-tile-icon::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 2px solid currentColor;
          opacity: 0;
          transform: scale(0.8);
        }
        .hiw-tile.active .hiw-tile-icon::after {
          animation: iconPulseRing 0.6s ease-out forwards;
        }

        .hiw-tile-label {
          font-family: 'Archivo', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
          display: block;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        .hiw-tile-sub {
          font-family: 'Archivo', sans-serif;
          font-size: 0.68rem;
          font-weight: 400;
          color: rgba(255,255,255,0.42);
          display: block;
          line-height: 1.3;
        }

        /* bottom stats */
        .hiw-stats {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 13px 18px;
          animation: statCount 0.6s ease 0.4s both;
        }
        .hiw-stat { text-align: center; }
        .hiw-stat-value {
          font-family: 'Archivo', sans-serif;
          font-size: 1.15rem;
          font-weight: 900;
          color: #f0b429;
          display: block;
          line-height: 1;
        }
        .hiw-stat-label {
          font-family: 'Archivo', sans-serif;
          font-size: 0.58rem;
          font-weight: 600;
          color: rgba(255,255,255,0.38);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
          display: block;
        }
        .hiw-divider {
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.09);
        }
      `}</style>

      <section className="bg-[#f8fafb] overflow-visible box-border"
        style={{ fontFamily: "'Archivo', sans-serif", padding: "clamp(50px,7vw,90px) clamp(16px,4vw,80px)", marginBottom: "80px", position: "relative" }}
      >
        <StarClustersHIW />
        <div className="max-w-[1100px] mx-auto grid gap-[clamp(32px,5vw,64px)] items-center overflow-visible box-border grid-cols-1 md:grid-cols-2">

          {/* ── LEFT ── */}
          <div className="order-2 md:order-1">

            {isMobile ? (
              /* ══ MOBILE CARD ══ */
              <div className="hiw-card">
                <div className="hiw-card-accent" />
                <div className="hiw-card-ring hiw-card-ring-1" />
                <div className="hiw-card-ring hiw-card-ring-2" />

                {/* header */}
                <div className="hiw-card-header">
                  <div className="hiw-card-brand">
                    <span className="hiw-card-brand-eyebrow">Super-app · Bénin</span>
                    <span className="hiw-card-brand-name">Ticketché</span>
                  </div>
                  <div className="hiw-card-badge">5 services</div>
                </div>

                {/* 2×2 grid */}
                <div className="hiw-grid">
                  {services.map((s, i) => {
                    const isActive = activeService === i;
                    return (
                      <div
                        key={i}
                        className={`hiw-tile${isActive ? " active" : ""}`}
                        style={{
                          background: isActive ? s.bg : "rgba(255,255,255,0.055)",
                          borderColor: isActive ? s.border : "rgba(255,255,255,0.08)",
                        }}
                        onClick={() => setActiveService(i)}
                      >
                        <div
                          className="hiw-tile-icon"
                          style={{
                            background: s.bg,
                            border: `1px solid ${s.border}`,
                            color: s.color,
                          }}
                        >
                          <s.Icon size={22} weight={isActive ? "fill" : "regular"} color={s.color} />
                        </div>
                        <span className="hiw-tile-label">{s.label}</span>
                        <span className="hiw-tile-sub">{s.sub}</span>
                      </div>
                    );
                  })}
                </div>

                {/* stats */}
                <div className="hiw-stats">
                  <div className="hiw-stat">
                    <span className="hiw-stat-value">5</span>
                    <span className="hiw-stat-label">Services</span>
                  </div>
                  <div className="hiw-divider" />
                  <div className="hiw-stat">
                    <span className="hiw-stat-value">100%</span>
                    <span className="hiw-stat-label">Digital</span>
                  </div>
                  <div className="hiw-divider" />
                  <div className="hiw-stat">
                    <span className="hiw-stat-value">24/7</span>
                    <span className="hiw-stat-label">Disponible</span>
                  </div>
                </div>
              </div>

            ) : (
              /* ══ DESKTOP (inchangé) ══ */
              <div className="hiw-left-col relative flex items-center justify-center overflow-visible box-border h-[420px] md:h-[460px] w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div ref={ring3Ref} className="absolute rounded-full border-[2.5px] border-dashed border-[#367e86] opacity-75" style={{ width: 390, height: 390 }} />
                  <div ref={ring1Ref} className="absolute rounded-full border-[3.5px] border-dashed border-[#367e86] opacity-90" style={{ width: 310, height: 310 }}>
                    <div className="absolute w-[11px] h-[11px] rounded-full bg-[#367e86] top-1/2 left-[-5.5px] -translate-y-1/2 shadow-[0_0_16px_rgba(54,126,134,0.9)]" />
                    <div className="absolute w-[11px] h-[11px] rounded-full bg-[#367e86] top-[-5.5px] left-1/2 -translate-x-1/2 shadow-[0_0_16px_rgba(54,126,134,0.9)]" />
                    <div className="absolute w-[8px] h-[8px] rounded-full bg-[#367e86] top-1/2 right-[-4px] -translate-y-1/2 shadow-[0_0_12px_rgba(54,126,134,0.8)]" />
                  </div>
                  <div ref={ring2Ref} className="absolute rounded-full border-[3px] border-dashed border-[#367e86] opacity-85" style={{ width: 235, height: 235 }} />
                </div>
                <div className="absolute w-[240px] h-[240px] rounded-full z-[5] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)" }} />
                <div className="absolute w-[190px] h-[190px] rounded-full z-[8]" style={{
                  background: "radial-gradient(ellipse at 40% 30%, rgba(0,201,167,0.22) 0%, rgba(0,95,105,0.1) 45%, transparent 75%)",
                  border: "1.5px solid rgba(0,201,167,0.35)",
                  boxShadow: "0 24px 48px rgba(0,30,34,0.2), inset 0 -6px 20px rgba(0,201,167,0.1), 0 0 0 10px rgba(0,201,167,0.04)",
                  transform: "perspective(500px) rotateX(22deg)",
                }} />
                <div className="absolute z-[7] blur-[10px]" style={{ width: 150, height: 20, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,30,34,0.2) 0%, transparent 70%)", bottom: 68 }} />
                <div className="absolute z-[10] animate-phoneFloat [filter:drop-shadow(0_32px_64px_rgba(0,30,34,0.35))]" style={{ width: "clamp(200px,60vw,800px)" }}>
                  <img src="/images/Hero/etapes.png" alt="Ticketché app mockup" className="w-full h-auto block" style={{ borderRadius: "clamp(24px,3vw,44px)" }} />
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — Steps ── */}
          <div className="box-border order-1 md:order-2">
            <h2 className="font-black text-[#0a1a1c] leading-[1.12] tracking-[-0.03em] mb-[clamp(22px,3.5vw,40px)] m-0" style={{ fontSize: "clamp(1.5rem,3vw,2.4rem)" }}>
              4 Étapes rapides pour utiliser<span className="text-[#00515a]"> ticketché</span>
            </h2>
            <div className="relative">
              <div className="absolute left-[6px] top-[10px] bottom-[10px] w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(0,201,167,0.2), rgba(0,201,167,0.04))" }} />
              <div className="absolute left-0 w-[14px] h-[14px] rounded-full bg-[#001e22] border-[3px] border-[#00515a] z-[2] animate-pulse-dot transition-[top] duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ top: `${dotTop}px` }} />
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (stepsRef.current[i] = el)}
                  className={`flex pl-[34px] pr-[14px] py-[10px] rounded-xl cursor-pointer transition-colors duration-300 ${i === activeStep ? "bg-[rgba(0,201,167,0.04)]" : "hover:bg-[rgba(0,201,167,0.04)]"}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div>
                    <h3 className={`font-extrabold m-0 tracking-[-0.01em] transition-all duration-400 ${i === activeStep ? "text-[#00515a] font-black translate-x-[6px]" : "text-black"}`} style={{ fontSize: "clamp(1rem,1.6vw,1.2rem)" }}>
                      {step.title}
                    </h3>
                    <p className={`leading-[1.7] mt-[5px] m-0 transition-all duration-400 ${i === activeStep ? "text-[#6b7280] translate-x-[4px]" : "text-[#c4c9cc]"}`} style={{ fontSize: "clamp(0.85rem,1.2vw,1rem)" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}