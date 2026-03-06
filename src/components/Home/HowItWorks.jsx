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

  // Animate rings
  useEffect(() => {
    let frame;
    let a1 = 0, a2 = 0, a3 = 0;
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

  // Auto-cycle steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, []);

  // Compute dot Y position based on active step row
  const getDotTop = () => {
    const el = stepsRef.current[activeStep];
    if (!el) return 0;
    const parent = el.offsetParent;
    let top = el.offsetTop + 10; // center vertically in row
    return top;
  };

  const [dotTop, setDotTop] = useState(10);

  useEffect(() => {
    const update = () => {
      const el = stepsRef.current[activeStep];
      if (el) setDotTop(el.offsetTop + el.offsetHeight / 2 - 7);
    };
    // small delay to let layout settle
    const t = setTimeout(update, 50);
    return () => clearTimeout(t);
  }, [activeStep]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        .hiw-section * { box-sizing: border-box; }
        .hiw-section {
          font-family: 'Archivo', sans-serif;
          background: #f8fafb;
          padding: clamp(60px, 8vw, 110px) clamp(20px, 5vw, 72px);
          overflow: hidden;
        }
        .hiw-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 100px);
          align-items: center;
        }
        @media (max-width: 768px) {
          .hiw-inner { grid-template-columns: 1fr; }
          .hiw-left { order: 2; }
          .hiw-right { order: 1; }
        }

        /* ── LEFT ── */
        .hiw-left {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: clamp(460px, 100vw, 620px);
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
          border: 1.5px dashed rgba(0,95,105,0.2);
        }
        .hiw-ring-1 { width: clamp(300px,42vw,480px); height: clamp(300px,42vw,480px); }
        .hiw-ring-2 {
          width: clamp(220px,30vw,350px); height: clamp(220px,30vw,350px);
          border-color: rgba(0,201,167,0.25); border-style: solid; border-width: 1px;
        }
        .hiw-ring-3 {
          width: clamp(380px,52vw,600px); height: clamp(380px,52vw,600px);
          border-color: rgba(0,30,34,0.08); border-width: 1px;
        }
        .hiw-ring-dot {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: #00c9a7; top: 50%; left: -4px; margin-top: -4px;
          box-shadow: 0 0 10px rgba(0,201,167,0.6);
        }
        .hiw-ring-dot-2 {
          top: -4px; left: 50%; margin-left: -4px;
          background: #005f69; box-shadow: 0 0 10px rgba(0,95,105,0.5);
        }
        .hiw-ring-dot-3 {
          top: 50%; left: auto; right: -4px; margin-top: -4px;
          background: #00c9a7; width: 5px; height: 5px;
        }
        .hiw-platform {
          position: absolute;
          width: clamp(300px,80vw,100px); height: clamp(20px,23vw,270px);
          border-radius: 50%;
          background: radial-gradient(ellipse at 40% 30%, rgba(0,201,167,0.22) 0%, rgba(0,95,105,0.1) 45%, transparent 75%);
          border: 1.5px solid rgba(0,201,167,0.35);
          box-shadow: 0 32px 64px rgba(0,30,34,0.2), inset 0 -6px 20px rgba(0,201,167,0.1), 0 0 0 10px rgba(0,201,167,0.04);
          z-index: 8;
          transform: perspective(500px) rotateX(22deg);
        }
        .hiw-platform-shadow {
          position: absolute;
          width: clamp(140px,18vw,210px); height: clamp(20px,2.5vw,30px);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,30,34,0.2) 0%, transparent 70%);
          bottom: clamp(62px,8vw,92px); z-index: 7; filter: blur(10px);
        }
        .hiw-phone-wrap {
          position: relative; z-index: 10;
          filter: drop-shadow(0 48px 36px rgba(0,30,34,0.25)) drop-shadow(0 6px 12px rgba(0,30,34,0.12));
          animation: phoneFloat 4s ease-in-out infinite;
          transition: transform 0.6s ease;
        }
        .hiw-phone-wrap:hover { animation-play-state: paused; }
        @keyframes phoneFloat {
          0%,100% { transform: perspective(900px) rotateX(6deg) rotateY(-6deg) rotateZ(1deg) translateY(0px); }
          50%      { transform: perspective(900px) rotateX(6deg) rotateY(-6deg) rotateZ(1deg) translateY(-12px); }
        }
        .hiw-phone-img {
          width: clamp(800px,900vw,5000px); 
          display: block; border-radius: 36px;
        }
        .hiw-glow {
          position: absolute;
          width: clamp(220px,30vw,340px); height: clamp(220px,30vw,340px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%);
          z-index: 5; pointer-events: none;
        }

        /* ── RIGHT ── */
        .hiw-heading {
          font-size: clamp(1.7rem,3.5vw,2.8rem);
          font-weight: 900; color: #0a1a1c;
          line-height: 1.12; letter-spacing: -0.03em;
          margin: 0 0 clamp(28px,4vw,48px) 0;
        }
        .hiw-heading span { color: #00c9a7; }

        /* Steps container — relative for the moving dot */
        .hiw-steps-wrap { position: relative; }

        /* The single vertical line */
        .hiw-track {
          position: absolute;
          left: 6px; top: 10px; bottom: 10px;
          width: 2px;
          background: linear-gradient(to bottom, rgba(0,201,167,0.15), rgba(0,201,167,0.05));
        }

        /* The moving dot */
        .hiw-moving-dot {
          position: absolute;
          left: 0px;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #001e22;
          border: 3px solid #00c9a7;
          box-shadow: 0 0 0 5px rgba(0,201,167,0.18), 0 0 14px rgba(0,201,167,0.4);
          transition: top 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }

        /* Pulse on dot */
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0px rgba(0,201,167,0.5), 0 0 14px rgba(0,201,167,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
          100% { box-shadow: 0 0 0 0px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
        }
        .hiw-moving-dot { animation: pulse 1.8s ease-out infinite; }

        /* Each step row */
        .hiw-step {
          display: flex;
          padding: clamp(10px,1.4vw,16px) clamp(10px,1.4vw,16px);
          padding-left: 34px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .hiw-step:hover { background: rgba(0,201,167,0.04); }

        /* titre — toujours visible, s'intensifie au passage */
.hiw-step-title {
  font-size: clamp(0.9rem,1.3vw,1.05rem);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
  transition: color 0.4s ease, transform 0.4s ease;
  color: #9ca3af;
}
.hiw-step.active .hiw-step-title {
  color: #0a1a1c;
  transform: translateX(4px);
}

/* description — toujours visible */
.hiw-step-desc {
  font-size: clamp(0.76rem,1vw,0.86rem);
  color: #9ca3af;
  line-height: 1.65;
  margin-top: 4px;
  transition: color 0.4s ease, transform 0.4s ease;
}
.hiw-step.active .hiw-step-desc {
  color: #6b7280;
  transform: translateX(4px);
}
      `}</style>

      <section className="hiw-section">
        <div className="hiw-inner">

          {/* LEFT */}
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
            <div className="hiw-phone-wrap">
              <img src="/images/Hero/accueil.png" alt="Ticketché app mockup" className="hiw-phone-img" />
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
              {/* Vertical track */}
              <div className="hiw-track" />

              {/* Single moving dot */}
              <div className="hiw-moving-dot" style={{ top: `${dotTop}px` }} />

              {/* Steps */}
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