"use client";

import { useState, useEffect } from "react";

const faqs = [
  {
    question: "Qu'est-ce que Ticketché ?",
    answer:
      "Ticketché est une plateforme de billetterie en ligne qui permet aux organisateurs d'événements de vendre des billets et aux utilisateurs de les acheter en toute sécurité, sans commission cachée.",
  },
  {
    question: "Comment activer les services Ticketché ?",
    answer:
      "Pour activer vos services, créez un compte sur notre plateforme, complétez votre profil organisateur et suivez les étapes de validation. Une fois validé, vous pouvez immédiatement créer et publier vos événements en toute simplicité.",
  },
  {
    question: "Quels sont les avantages d'utiliser Ticketché ?",
    answer:
      "Ticketché offre des transactions instantanées, une sécurité renforcée, aucune commission cachée, un tableau de bord intuitif et un support client disponible 24h/24 pour accompagner organisateurs et participants.",
  },
  {
    question: "Comment effectuer une transaction sur Ticketché ?",
    answer:
      "Sélectionnez votre événement, choisissez le nombre de billets souhaités, puis procédez au paiement via nos moyens sécurisés (carte bancaire, mobile money). Votre billet est envoyé instantanément par e-mail ou SMS.",
  },
  {
    question: "Qui peut ouvrir un compte Ticketché ?",
    answer:
      "Toute personne physique ou morale résidant dans notre zone de couverture peut créer un compte. Organisateurs professionnels, associations ou particuliers sont les bienvenus sur notre plateforme.",
  },
];

const images = [
  "/images/faq/faq1.jpg",
  "/images/faq/faq2.jpg",
  "/images/faq/faq3.jpg",
  "/images/faq/faq1.jpg",
  "/images/faq/faq2.jpg",
  "/images/faq/faq3.jpg",
];

// SliderSlot : affiche une image qui se remplace par glissement bas→haut
function SliderSlot({ current, next, animating }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "inherit" }}>
      {/* Image courante : sort vers le haut */}
      <img
        src={current}
        alt=""
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", borderRadius: "inherit",
          transform: animating ? "translateY(-108%)" : "translateY(0)",
          transition: animating ? "transform 0.7s cubic-bezier(0.76,0,0.24,1)" : "none",
          zIndex: 2,
        }}
      />
      {/* Image suivante : entre par le bas */}
      <img
        src={next}
        alt=""
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", borderRadius: "inherit",
          transform: animating ? "translateY(0)" : "translateY(108%)",
          transition: animating ? "transform 0.7s cubic-bezier(0.76,0,0.24,1)" : "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(1);
  const [step, setStep] = useState(0);           // index de paire actuelle
  const [animating, setAnimating] = useState(false);
  const pairCount = Math.ceil(images.length / 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setStep((prev) => (prev + 1) % pairCount);
        setAnimating(false);
      }, 750);
    }, 3400);
    return () => clearInterval(interval);
  }, [pairCount]);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  // Images courantes et suivantes (par paires)
  const curTop    = images[(step * 2) % images.length];
  const curBottom = images[(step * 2 + 1) % images.length];
  const nxtStep   = (step + 1) % pairCount;
  const nxtTop    = images[(nxtStep * 2) % images.length];
  const nxtBottom = images[(nxtStep * 2 + 1) % images.length];

  const BORDER_R = "clamp(14px, 2vw, 22px)";
  const OVERFLOW = "clamp(20px, 2.5vw, 30px)";  // combien les images débordent

  return (
    <section style={{
      background: "#8daeb1",
      padding: `clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)`,
      fontFamily: "'Archivo', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&display=swap" rel="stylesheet" />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "clamp(40px, 5vw, 80px)",
        alignItems: "center",
      }}>

        {/* ── FAQ ── */}
        <div>
          <h2 style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: "clamp(1.8rem, 2.8vw, 2.8rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "#001e22",
            margin: "0 0 clamp(32px, 4vw, 48px) 0",
          }}>
            Vous avez des questions<br />sur Ticketché ?
          </h2>

          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(0,30,34,0.15)" }}>
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "clamp(14px,2vw,20px) 0",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "16px",
                }}
              >
                <span style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.2rem)",
                  fontWeight: openIndex === i ? 700 : 500,
                  color: openIndex === i ? "#001e22" : "#2a4a4d",
                  transition: "all 0.2s", lineHeight: 1.4,
                }}>
                  {faq.question}
                </span>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: openIndex === i ? "#04545d" : "rgba(0,30,34,0.1)",
                  color: openIndex === i ? "#fff" : "#2a4a4d",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", fontWeight: 300, flexShrink: 0, transition: "all 0.25s ease",
                }}>
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <div style={{ maxHeight: openIndex === i ? "200px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
                <p style={{
                  fontSize: "clamp(0.95rem,1.3vw,1.1rem)", color: "rgba(0,30,34,0.65)",
                  lineHeight: 1.75, paddingBottom: "clamp(14px,2vw,20px)", margin: 0,
                }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CARTE + 2 IMAGES ── */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/*
            Le wrapper a un padding vertical = OVERFLOW
            pour que les images qui débordent ne soient pas clippées par le parent.
          */}
          <div style={{
            position: "relative",
            width: "clamp(460px, 62vw, 720px)",
            paddingTop: OVERFLOW,
            paddingBottom: OVERFLOW,
          }}>

            {/* Carte verte — overflow: visible pour laisser déborder */}
            <div style={{
              background: "#04545d",
              borderRadius: "clamp(24px, 3vw, 40px)",
              width: "100%",
              height: "clamp(420px, 54vw, 620px)",
              position: "relative",
              overflow: "visible",
              boxShadow: "0 30px 80px rgba(0,30,34,0.35)",
            }}>

              {/* Halo déco */}
              <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "180px", height: "180px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* ── IMAGE HAUT : déborde vers le haut ── */}
              <div style={{
                position: "absolute",
                top: `calc(-1 * ${OVERFLOW})`,      /* déborde au-dessus */
                left: "clamp(20px, 3vw, 32px)",
                right: "clamp(20px, 3vw, 32px)",
                bottom: "calc(50% + 8px)",
                borderRadius: BORDER_R,
                overflow: "hidden",
                border: "6px solid #ffffff",
                boxShadow: "0 16px 48px rgba(0,30,34,0.32)",
                zIndex: 5,
              }}>
                <SliderSlot current={curTop} next={nxtTop} animating={animating} />
              </div>

              {/* ── IMAGE BAS : déborde vers le bas ── */}
              <div style={{
                position: "absolute",
                top: "calc(50% + 8px)",
                left: "clamp(20px, 3vw, 32px)",
                right: "clamp(20px, 3vw, 32px)",
                bottom: `calc(-1 * ${OVERFLOW})`,    /* déborde en dessous */
                borderRadius: BORDER_R,
                overflow: "hidden",
                border: "6px solid #ffffff",
                boxShadow: "0 16px 48px rgba(0,30,34,0.32)",
                zIndex: 5,
              }}>
                <SliderSlot current={curBottom} next={nxtBottom} animating={animating} />
              </div>

            </div>

            {/* Indicateurs */}
            <div style={{
              position: "absolute",
              bottom: "4px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              zIndex: 10,
            }}>
              {Array.from({ length: pairCount }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: step === i ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: step === i ? "#001e22" : "rgba(0,30,34,0.25)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}