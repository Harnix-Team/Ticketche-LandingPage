"use client";

import { useEffect, useRef, useState } from "react";

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

        @keyframes phoneFloat {
          0%,100% { transform: scale(1.2) perspective(900px) rotateX(6deg) rotateY(-6deg) rotateZ(1deg) translateY(0px); }
          50%      { transform: scale(1.2) perspective(900px) rotateX(6deg) rotateY(-6deg) rotateZ(1deg) translateY(-10px); }
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0px rgba(0,201,167,0.5), 0 0 14px rgba(0,201,167,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
          100% { box-shadow: 0 0 0 0px rgba(0,201,167,0), 0 0 14px rgba(0,201,167,0.4); }
        }
        .animate-phoneFloat {
          animation: phoneFloat 4s ease-in-out infinite;
        }
        .animate-phoneFloat:hover {
          animation-play-state: paused;
        }
        .animate-pulse-dot {
          animation: pulse 1.8s ease-out infinite;
        }
      `}</style>

      <section
        className="bg-[#f8fafb] overflow-visible box-border"
        style={{
          fontFamily: "'Archivo', sans-serif",
          padding: "clamp(50px,7vw,90px) clamp(16px,4vw,80px)",
        }}
      >
        <div
          className="max-w-[1100px] mx-auto grid gap-[clamp(32px,5vw,64px)] items-center overflow-visible box-border
            grid-cols-1 md:grid-cols-2"
        >
          {/* ── LEFT — Rings + Phone ── */}
          <div className="hiw-left-col relative flex items-center justify-center overflow-visible box-border order-2 md:order-1 h-[420px] md:h-[460px] w-full">

            {/* Rings */}
          <div className="hiw-rings-wrapper absolute inset-0 flex items-center justify-center">
              {/* Ring 3 — outer */}
              <div
                ref={ring3Ref}
                className="hiw-ring-outer absolute rounded-full box-border border-[2.5px] border-dashed border-[#367e86] opacity-75"
                style={{ width: 390, height: 390 }}
              />
              {/* Ring 1 — mid with dots */}
              <div
                ref={ring1Ref}
                className="hiw-ring-mid absolute rounded-full box-border border-[3.5px] border-dashed border-[#367e86] opacity-90"
                style={{ width: 310, height: 310 }}
              >
                {/* dot left */}
                <div className="absolute w-[11px] h-[11px] rounded-full bg-[#367e86] top-1/2 left-[-5.5px] -translate-y-1/2 shadow-[0_0_16px_rgba(54,126,134,0.9)]" />
                {/* dot top */}
                <div className="absolute w-[11px] h-[11px] rounded-full bg-[#367e86] top-[-5.5px] left-1/2 -translate-x-1/2 shadow-[0_0_16px_rgba(54,126,134,0.9)]" />
                {/* dot right */}
                <div className="absolute w-[8px] h-[8px] rounded-full bg-[#367e86] top-1/2 right-[-4px] -translate-y-1/2 shadow-[0_0_12px_rgba(54,126,134,0.8)]" />
              </div>
              {/* Ring 2 — inner */}
              <div
                ref={ring2Ref}
                className="hiw-ring-inner absolute rounded-full box-border border-[3px] border-dashed border-[#367e86] opacity-85"
                style={{ width: 235, height: 235 }}
              />
            </div>

            {/* Glow */}
            <div
              className="absolute w-[240px] h-[240px] rounded-full z-[5] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)" }}
            />

            {/* Platform */}
            <div
              className="absolute w-[190px] h-[190px] rounded-full z-[8]"
              style={{
                background: "radial-gradient(ellipse at 40% 30%, rgba(0,201,167,0.22) 0%, rgba(0,95,105,0.1) 45%, transparent 75%)",
                border: "1.5px solid rgba(0,201,167,0.35)",
                boxShadow: "0 24px 48px rgba(0,30,34,0.2), inset 0 -6px 20px rgba(0,201,167,0.1), 0 0 0 10px rgba(0,201,167,0.04)",
                transform: "perspective(500px) rotateX(22deg)",
              }}
            />

            {/* Platform shadow */}
            <div
              className="absolute z-[7] blur-[10px]"
              style={{
                width: 150,
                height: 20,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(0,30,34,0.2) 0%, transparent 70%)",
                bottom: 68,
              }}
            />

            {/* Phone */}
            <div
              className="absolute z-[10] animate-phoneFloat [filter:drop-shadow(0_32px_64px_rgba(0,30,34,0.35))]"
              style={{ width: "clamp(200px,60vw,800px)" }}
            >
              <img
                src="/images/Hero/orbe.png"
                alt="Ticketché app mockup"
                className="w-full h-auto block"
                style={{ borderRadius: "clamp(24px,3vw,44px)" }}
              />
            </div>
          </div>

          {/* ── RIGHT — Steps ── */}
          <div className="box-border order-1 md:order-2">
            <h2
              className="font-black text-[#0a1a1c] leading-[1.12] tracking-[-0.03em] mb-[clamp(22px,3.5vw,40px)] m-0"
              style={{ fontSize: "clamp(1.5rem,3vw,2.4rem)" }}
            >
              4 Étapes rapides
              pour utiliser
              <span className="text-[#00515a]"> ticketché</span>
            </h2>

            <div className="relative">
              {/* Track */}
              <div
                className="absolute left-[6px] top-[10px] bottom-[10px] w-[2px]"
                style={{ background: "linear-gradient(to bottom, rgba(0,201,167,0.2), rgba(0,201,167,0.04))" }}
              />

              {/* Moving dot */}
              <div
                className="absolute left-0 w-[14px] h-[14px] rounded-full bg-[#001e22] border-[3px] border-[#00515a] z-[2] animate-pulse-dot transition-[top] duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ top: `${dotTop}px` }}
              />

              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => (stepsRef.current[i] = el)}
                  className={`flex pl-[34px] pr-[14px] py-[10px] rounded-xl cursor-pointer transition-colors duration-300
                    ${i === activeStep ? "bg-[rgba(0,201,167,0.04)]" : "hover:bg-[rgba(0,201,167,0.04)]"}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div>
                    <h3
                      className={`font-extrabold m-0 tracking-[-0.01em] transition-all duration-400
                        ${i === activeStep
                          ? "text-[#00515a] font-black translate-x-[6px]"
                          : "text-black"
                        }`}
                      style={{ fontSize: "clamp(1rem,1.6vw,1.2rem)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`leading-[1.7] mt-[5px] m-0 transition-all duration-400
                        ${i === activeStep
                          ? "text-[#6b7280] translate-x-[4px]"
                          : "text-[#c4c9cc]"
                        }`}
                      style={{ fontSize: "clamp(0.85rem,1.2vw,1rem)" }}
                    >
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