"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Téléchargez l'App",
    description: "Disponible sur App Store et Google Play. Installez Ticketché en quelques secondes et créez votre compte gratuitement.",
  },
  {
    title: "Choisissez un Service",
    description: "Parking, lavage, garage ou événement — sélectionnez le service dont vous avez besoin directement depuis l'application.",
  },
  {
    title: "Effectuez le Paiement",
    description: "Payez en toute sécurité via Mobile Money ou carte bancaire. Rapide, sans commission cachée.",
  },
  {
    title: "Profitez du Service",
    description: "Votre ticket est généré instantanément. Présentez-le et profitez du service sans attente ni stress.",
  },
];

const STEP_DURATION = 2600;

export default function HowItWorks() {
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef([]);
  const [dotTop, setDotTop] = useState(10);

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

        .hiw-section {
          font-family: 'Archivo', sans-serif;
          background: #f8fafb;
padding: clamp(90px, 100vw, 500px) clamp(20px, 5vw, 100px);  /* ← AJOUT DE MARGE HAUTE */ 
overflow: visible;
          box-sizing: border-box;
        }

        .hiw-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: center;
          box-sizing: border-box;
          overflow: visible;
        }

        @media (max-width: 768px) {
          .hiw-inner { grid-template-columns: 1fr; }
          .hiw-left { order: 2; }
          .hiw-right { order: 1; }
        }

        /* ── LEFT ── */
        .hiw-left {
          position: relative;
          width: 100%;
          height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          box-sizing: border-box;
        }

        .hiw-rings {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

       .hiw-ring {
  position: absolute;
  border-radius: 50%;
  box-sizing: border-box;
}

/* Anneau 1 – pointillés, épais, couleur principale */
.hiw-ring-1 {
  width: 420px;
  height: 420px;
  border: 4px dashed #367e86;          /* ← POINTILLÉS + ÉPAIS + TA COULEUR */
  opacity: 0.9;                         /* plus visible */
}

/* Anneau 2 – pointillés, un peu plus fin mais visible */
.hiw-ring-2 {
  width: 320px;
  height: 320px;
  border: 3.2px dashed #367e86;        /* ← POINTILLÉS + TA COULEUR */
  opacity: 0.85;
}

/* Anneau 3 – pointillés, fond plus subtil */
.hiw-ring-3 {
  width: 520px;
  height: 520px;
  border: 2.8px dashed #367e86;        /* ← POINTILLÉS + TA COULEUR */
  opacity: 0.75;
}

/* Points sur les anneaux – adaptés à la nouvelle couleur */
.hiw-ring-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #367e86;
  top: 50%;
  left: -6px;
  margin-top: -6px;
  box-shadow: 0 0 16px rgba(54, 126, 134, 0.9);
}

.hiw-ring-dot-2 {
  top: -6px;
  left: 50%;
  margin-left: -6px;
  background: #367e86;
  box-shadow: 0 0 16px rgba(54, 126, 134, 0.9);
}

.hiw-ring-dot-3 {
  top: 50%;
  right: -6px;
  margin-top: -6px;
  background: #367e86;
  width: 8px;
  height: 8px;
  box-shadow: 0 0 12px rgba(54, 126, 134, 0.8);
}
        .hiw-platform {
          position: absolute;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(ellipse at 40% 30%, rgba(0,201,167,0.22) 0%, rgba(0,95,105,0.1) 45%, transparent 75%);
          border: 1.5px solid rgba(0,201,167,0.35);
          box-shadow: 0 32px 64px rgba(0,30,34,0.2), inset 0 -6px 20px rgba(0,201,167,0.1), 0 0 0 10px rgba(0,201,167,0.04);
          z-index: 8;
          transform: perspective(500px) rotateX(22deg);
        }

        .hiw-platform-shadow {
          position: absolute;
          width: 180px; height: 24px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,30,34,0.2) 0%, transparent 70%);
          bottom: 70px; z-index: 7; filter: blur(10px);
        }

        .hiw-glow {
          position: absolute;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%);
          z-index: 5; pointer-events: none;
        }

        /* Phone — fixed pixel size, position absolute centered */
       .hiw-phone-wrap {
  position: absolute;
  z-index: 10;
  width: clamp(480px, 90vw, 1400px);  /* ← TAILLE TRÈS AUGMENTÉE : jusqu'à 1400px sur desktop */
  max-width: 90vw;                    /* évite qu'elle dépasse trop sur très grand écran */
  animation: phoneFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 50px 100px rgba(0,30,34,0.4));  /* ombre plus forte pour matcher la taille */
}
        .hiw-phone-wrap:hover { animation-play-state: paused; }

        @keyframes phoneFloat {
          0%,100% { transform: perspective(900px) rotateX(6deg) rotateY(-6deg) rotateZ(1deg) translateY(0px); }
          50%      { transform: perspective(900px) rotateX(6deg) rotateY(-6deg) rotateZ(1deg) translateY(-12px); }
        }

        .hiw-phone-img {
          width: 5500px;
          height: auto;
          display: block;
          border-radius: 32px;
        }

        /* ── RIGHT ── */
        .hiw-right { box-sizing: border-box; }

        .hiw-heading {
          font-size: clamp(1.7rem, 3.5vw, 2.8rem);
          font-weight: 900; color: #0a1a1c;
          line-height: 1.12; letter-spacing: -0.03em;
          margin: 0 0 clamp(28px, 4vw, 48px) 0;
        }
        .hiw-heading span { color: #00515a; }

        .hiw-steps-wrap { position: relative; }

        .hiw-track {
          position: absolute;
          left: 6px; top: 10px; bottom: 10px;
          width: 2px;
          background: linear-gradient(to bottom, rgba(0,201,167,0.2), rgba(0,201,167,0.04));
        }

        .hiw-moving-dot {
          position: absolute;
          left: 0;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #001e22;
          border: 3px solid #00515a;
          transition: top 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
          animation: pulse 1.8s ease-out infinite;
        }

        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0px rgba(0,201,167,0.5), 0 0 14px rgba(0,201,167,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
          100% { box-shadow: 0 0 0 0px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
        }

        .hiw-step {
          display: flex;
          padding: 12px 14px 12px 34px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .hiw-step:hover { background: rgba(0,201,167,0.04); }

   .hiw-step-title {
  font-size: clamp(1.15rem, 1.8vw, 1.35rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.01em;
  color: #000000;               /* ← NOIR par défaut (quand inactif) */
  transition: color 0.4s ease, transform 0.4s ease, font-weight 0.3s ease;
}

.hiw-step.active .hiw-step-title {
  color: #00515a;               /* ← couleur thème quand actif (ou mets #00c9a7 si tu préfères le vert vif) */
  font-weight: 900;
  transform: translateX(6px);
}

.hiw-step-desc {
  font-size: clamp(0.95rem, 1.4vw, 1.1rem);   /* ← AUGMENTÉ */
  color: #c4c9cc;
  line-height: 1.7;
  margin-top: 6px;
  transition: color 0.4s ease, transform 0.4s ease;
}
.hiw-step.active .hiw-step-desc {
  color: #6b7280;
  transform: translateX(4px);
}
      `}</style>

      <section className="hiw-section">
        <div className="hiw-inner">

         {/* LEFT – partie avec l’image très grande */}
<div className="hiw-left">
  <div className="hiw-rings">
    <div ref={ring3Ref} className="hiw-ring hiw-ring-3" />
    <div ref={ring1Ref} className="hiw-ring hiw-ring-1">
      <div className="hiw-ring-dot" />
      <div className="hiw-ring-dot hiw-ring-dot-2" />
      <div className="hiw-ring-dot hiw-ring-dot-3" />
    </div>
    <div ref={ring2Ref} className="hiw-ring hiw-ring-2" />
  </div>

  <div className="hiw-glow" />
  <div className="hiw-platform" />
  <div className="hiw-platform-shadow" />

  {/* Mockup téléphone – TAILLE TRÈS AUGMENTÉE */}
  <div className="hiw-phone-wrap" style={{
    width: "clamp(480px, 85vw, 1100px)",      // ← très large sur desktop (1100px max)
    transform: "scale(1.4)",                   // ← grossit de 40% supplémentaire
    transformOrigin: "center center",
    animation: "phoneFloat 4s ease-in-out infinite",
    filter: "drop-shadow(0 40px 80px rgba(0,30,34,0.35))", // ombre plus forte
  }}>
    <img
      src="/images/Hero/accueil.png"
      alt="Ticketché app mockup"
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: "clamp(32px, 4vw, 56px)", // coins plus arrondis pour grand format
      }}
    />
  </div>
</div>

          {/* RIGHT */}
          <div className="hiw-right">
            <h2 className="hiw-heading">
              4 Étapes Rapides<br />
              Pour Utiliser<br />
              <span>Nos Services</span>
            </h2>

            <div className="hiw-steps-wrap">
              <div className="hiw-track" />
              <div className="hiw-moving-dot" style={{ top: `${dotTop}px` }} />
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (stepsRef.current[i] = el)}
                  className={`hiw-step ${i === activeStep ? "active" : ""}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div>
                    <h3 className="hiw-step-title">{step.title}</h3>
                    <p className="hiw-step-desc">{step.description}</p>
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