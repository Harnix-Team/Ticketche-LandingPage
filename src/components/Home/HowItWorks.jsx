"use client";

import { useEffect, useRef, useState } from "react";
import { Star, DownloadSimple, GridFour, CreditCard, SmileyWink } from "@phosphor-icons/react";

const steps = [
  {
    Icon: DownloadSimple,
    title: "Téléchargez l'App",
    description: "Disponible sur App Store et Google Play. Installez Ticketché en quelques secondes, créez votre compte et enregistrez vos véhicules.",
    color: "#005f69",
    bg: "rgba(0,95,105,0.10)",
    border: "rgba(0,95,105,0.22)",
  },
  {
    Icon: GridFour,
    title: "Choisissez un Service",
    description: "Parking, lavage auto, garage & mécanique ou billetterie — sélectionnez le service dont vous avez besoin en quelques secondes.",
    color: "#005f69",
    bg: "rgba(0,95,105,0.10)",
    border: "rgba(0,95,105,0.22)",
  },
  {
    Icon: CreditCard,
    title: "Payez en Mobile Money",
    description: "Réglez via Mobile Money, carte bancaire ou votre portefeuille Ticketché. Appliquez un code promo pour une réduction instantanée.",
    color: "#005f69",
    bg: "rgba(0,95,105,0.10)",
    border: "rgba(0,95,105,0.22)",
  },
  {
    Icon: SmileyWink,
    title: "Profitez & Notez",
    description: "Votre QR code est généré instantanément. Présentez-le à l'entrée, profitez sans attente et laissez un avis pour la communauté.",
    color: "#005f69",
    bg: "rgba(0,95,105,0.10)",
    border: "rgba(0,95,105,0.22)",
  },
];

const CLUSTERS_HIW = [
  { cx: "3%", cy: "8%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.50, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" }, { x: 15, y: -9, size: 9, opacity: 0.30, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "88%", cy: "6%", stars: [{ x: 0, y: 0, size: 14, opacity: 0.45, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }] },
  { cx: "1%", cy: "70%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "94%", cy: "65%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.40, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
];

function StarClustersHIW() {
  return (
    <>
      {CLUSTERS_HIW.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `hiwStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function StepCard({ step }) {
  const [hovered, setHovered] = useState(false);
  const { Icon, title, description, color, bg, border } = step;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        gap: "10px",
        padding: "22px 20px",
        borderRadius: "20px",
        background: hovered ? bg : "transparent",
        border: `1.5px solid ${hovered ? border : "transparent"}`,
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      <div style={{
        width: "54px",
        height: "54px",
        borderRadius: "16px",
        background: bg,
        border: `1.5px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: hovered ? `0 8px 24px ${color}33` : "none",
        transition: "box-shadow 0.3s ease",
      }}>
        <Icon weight="fill" style={{ width: 28, height: 28, color }} />
      </div>

      <div>
        <h3 style={{ margin: "0 0 7px", fontSize: "19px", fontWeight: 800, color: "#0a1a1c", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: "15px", color: "#6b7280", lineHeight: 1.75 }}>          {description}
        </p>
      </div>

    </div>
  );
}

export default function HowItWorks() {
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);

  useEffect(() => {
    let frame, a1 = 0, a2 = 0;
    const animate = () => {
      a1 += 0.003; a2 -= 0.002;
      if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${a1}rad)`;
      if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${a2}rad)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <style>{`
        @keyframes hiwStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes hiwStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes hiwStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        @media (max-width: 900px) {
          .hiw-main { flex-direction: column !important; }
          .hiw-side { flex-direction: row !important; flex-wrap: wrap !important; justify-content: center !important; max-width: 100% !important; }
          .hiw-center-col { width: 260px !important; height: 260px !important; }
        }
      `}</style>

      <section style={{
        fontFamily: "'Archivo', sans-serif",
        padding: "clamp(60px,8vw,100px) clamp(16px,4vw,60px)",
background: "#ecf5f5",
        position: "relative",
        overflow: "hidden",
        marginBottom: "80px",
      }}>
        <StarClustersHIW />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px,5vw,64px)", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3.2vw,2.5rem)", fontWeight: 900, color: "#0a1a1c", letterSpacing: "-0.03em", margin: "0 0 14px", lineHeight: 1.12 }}>
            4 Étapes rapides pour utiliser <span style={{ color: "#005f69" }}>ticketché</span>
          </h2>
          <p style={{ fontSize: "clamp(0.9rem,1.3vw,1rem)", color: "#6b7280", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
            Une expérience simple, rapide et entièrement digitale pour accéder à tous vos services du quotidien.
          </p>
        </div>

        {/* 3-column layout */}
        <div className="hiw-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(12px,2vw,28px)", position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto" }}>

          {/* LEFT: steps 1 & 3 */}
          <div className="hiw-side" style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 260px", maxWidth: "300px" }}>
            <StepCard step={steps[0]} />
            <StepCard step={steps[2]} />
          </div>

          {/* CENTER */}
          <div className="hiw-center-col"
            style={{ position: "relative", width: "clamp(300px,28vw,400px)", height: "clamp(300px,28vw,400px)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }}
          >

            {/* Solid circle */}
            <div style={{
              position: "absolute",
              width: "75%",
              height: "75%",
              borderRadius: "50%",
              background: "#005f69",
              zIndex: 0,
            }} />

            {/* Dashed outer ring 1 */}
            <div ref={ring1Ref} style={{
              position: "absolute",
              width: "92%",
              height: "92%",
              borderRadius: "50%",
              border: "2px dashed rgba(0,95,105,0.40)",
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* Dashed outer ring 2 */}
            <div ref={ring2Ref} style={{
              position: "absolute",
              width: "106%",
              height: "106%",
              borderRadius: "50%",
              border: "1.5px dashed rgba(0,95,105,0.22)",
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* Phone mockup */}
            <div style={{ position: "absolute", zIndex: 2, width: "900px" }}>
              <img
                src="/images/Hero/etapes.png"
                alt="Ticketché app mockup"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "clamp(20px,2vw,34px)",
                  filter: "drop-shadow(0 24px 40px rgba(0,20,24,0.35))",
                }}
              />
            </div>
          </div>

          {/* RIGHT: steps 2 & 4 */}
          <div className="hiw-side" style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 260px", maxWidth: "300px" }}>
            <StepCard step={steps[1]} />
            <StepCard step={steps[3]} />
          </div>

        </div>

      </section>
    </>
  );
}