"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Motorcycle, Package, ArrowRight, CheckCircle, ChartBar, Users,
  Truck, Car, Sparkle, MapPin, Star, Money, Globe,
  Calendar, CalendarBlank, Clock,
  ArrowsLeftRight, MapTrifold, TrendUp, Ticket,
} from "@phosphor-icons/react";

/* ─── Survey Data ─────────────────────────────────────── */
const SURVEY_STEPS = [
  {
    id: "interest",
    service: null,
    question: "Quels nouveaux services Ticketché vous intéresseraient ?",
    type: "multi",
    options: [
      { id: "delivery", icon: Truck, label: "Livraison à domicile", desc: "Recevez vos colis où vous êtes" },
      { id: "covoiturage", icon: Car, label: "Covoiturage", desc: "Partagez les trajets en ville" },
      { id: "both", icon: Sparkle, label: "Les deux", desc: "Je suis intéressé par les deux services" },
    ],
  },
  {
    id: "delivery_use",
    service: "delivery",
    question: "Pour la livraison à domicile, comment l'utiliseriez-vous ?",
    type: "single",
    options: [
      { id: "food", icon: Ticket, label: "Nourriture & repas", desc: "Livraison de restaurants et traiteurs" },
      { id: "shopping", icon: Package, label: "Courses & shopping", desc: "Produits du marché, supermarché" },
      { id: "pharmacy", icon: Globe, label: "Pharmacie & santé", desc: "Médicaments et produits de santé" },
      { id: "documents", icon: Package, label: "Colis & documents", desc: "Envoi et réception de colis" },
    ],
  },
  {
    id: "delivery_freq",
    service: "delivery",
    question: "À quelle fréquence pensez-vous utiliser la livraison ?",
    type: "single",
    options: [
      { id: "daily", icon: CalendarBlank, label: "Quotidiennement", desc: "Presque tous les jours" },
      { id: "weekly", icon: Calendar, label: "1 à 3 fois par semaine", desc: "Usage régulier" },
      { id: "monthly", icon: CalendarBlank, label: "Quelques fois par mois", desc: "Usage occasionnel" },
      { id: "rarely", icon: Clock, label: "Rarement", desc: "En cas de besoin ponctuel" },
    ],
  },
  {
    id: "covoiturage_use",
    service: "covoiturage",
    question: "Comment souhaiteriez-vous utiliser le covoiturage ?",
    type: "single",
    options: [
      { id: "driver", icon: Car, label: "Comme conducteur", desc: "Je partage mes trajets et économise" },
      { id: "passenger", icon: Users, label: "Comme passager", desc: "Je rejoins des conducteurs" },
      { id: "both_role", icon: ArrowsLeftRight, label: "Les deux rôles", desc: "Je peux être conducteur ou passager" },
    ],
  },
  {
    id: "covoiturage_route",
    service: "covoiturage",
    question: "Quel type de trajet vous intéresse ?",
    type: "multi",
    options: [
      { id: "work", icon: MapPin, label: "Domicile — Travail", desc: "Trajets quotidiens pendulaires" },
      { id: "city", icon: MapPin, label: "En ville", desc: "Déplacements dans Cotonou" },
      { id: "interurban", icon: MapTrifold, label: "Intercités", desc: "Cotonou, Porto-Novo, Calavi…" },
    ],
  },
  {
    id: "priority",
    service: null,
    question: "Qu'est-ce qui est le plus important pour vous ?",
    type: "rank",
    options: [
      { id: "price", icon: Money, label: "Prix abordable", desc: "Tarifs compétitifs" },
      { id: "speed", icon: TrendUp, label: "Rapidité", desc: "Délais courts et fiables" },
      { id: "safety", icon: CheckCircle, label: "Sécurité", desc: "Conducteurs vérifiés, paiement sécurisé" },
      { id: "tracking", icon: MapPin, label: "Suivi en temps réel", desc: "Savoir où est ma livraison / mon trajet" },
    ],
  },
];

/* ─── Progress Bar ──────────────────────────────────────── */
function ProgressBar({ current, total }) {
  return (
    <div style={{ background: "rgba(0,95,105,0.1)", borderRadius: 100, height: 4, marginBottom: 28, overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(90deg, #005f69, #00949f)", height: "100%", borderRadius: 100, width: `${((current + 1) / total) * 100}%`, transition: "width 0.4s ease" }} />
    </div>
  );
}

/* ─── Option Card ──────────────────────────────────────── */
function OptionCard({ option, selected, onClick, type }) {
  const isSelected = Array.isArray(selected) ? selected.includes(option.id) : selected === option.id;
  const Icon = option.icon;
  return (
    <button onClick={() => onClick(option.id)} className={`survey-option${isSelected ? " selected" : ""}`}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: isSelected ? "rgba(0,95,105,0.15)" : "rgba(0,95,105,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
        <Icon size={18} weight="fill" style={{ color: "#005f69" }} />
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div className="survey-option-label">{option.label}</div>
        <div className="survey-option-desc">{option.desc}</div>
      </div>
      <div className={`survey-option-check${isSelected ? " checked" : ""}`}>
        {isSelected && <CheckCircle size={18} weight="fill" style={{ color: "#005f69" }} />}
      </div>
    </button>
  );
}

/* ─── Main Survey Component ─────────────────────────────── */
export default function SondageSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  /* Filter steps based on interests selected */
  const getActiveSteps = () => {
    const interest = answers["interest"];
    if (!interest) return [SURVEY_STEPS[0]];

    const wantsDelivery = Array.isArray(interest)
      ? interest.some((v) => v === "delivery" || v === "both")
      : interest === "delivery" || interest === "both";

    const wantsCovoiturage = Array.isArray(interest)
      ? interest.some((v) => v === "covoiturage" || v === "both")
      : interest === "covoiturage" || interest === "both";

    return SURVEY_STEPS.filter((s) => {
      if (!s.service) return true;
      if (s.service === "delivery" && wantsDelivery) return true;
      if (s.service === "covoiturage" && wantsCovoiturage) return true;
      return false;
    });
  };

  const activeSteps = getActiveSteps();
  const step = activeSteps[currentStep];

  const handleOption = (optId) => {
    if (step.type === "multi") {
      setAnswers((prev) => {
        const cur = prev[step.id] || [];
        return { ...prev, [step.id]: cur.includes(optId) ? cur.filter((v) => v !== optId) : [...cur, optId] };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [step.id]: optId }));
    }
  };

  const canProceed = step.type === "multi"
    ? (answers[step.id] || []).length > 0
    : !!answers[step.id];

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setSubmitted(true);
      console.log("Survey submitted (mock):", { ...answers, rating });
    }
  };

  return (
    <>
      <style>{`
        .survey-section {
          font-family: 'Archivo', sans-serif;
          padding: 80px 24px;
          background: linear-gradient(180deg, #eef7f8 0%, #f9fffe 100%);
          position: relative; overflow: hidden;
        }
        .survey-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,95,105,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .survey-inner { max-width: 680px; margin: 0 auto; }
        
        .survey-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(0,95,105,0.1);
          border: 1px solid rgba(0,95,105,0.2);
          color: #005f69; padding: 5px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .survey-heading {
          font-size: clamp(1.5rem, 3.5vw, 2.2rem);
          font-weight: 900; color: #111827;
          line-height: 1.2; letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .survey-subheading { font-size: 14px; color: #5a7a80; line-height: 1.7; margin-bottom: 40px; }

        .survey-card {
          background: #fff; border-radius: 20px;
          border: 1.5px solid rgba(0,95,105,0.1);
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0,95,105,0.07);
        }

        .survey-step-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #7aaeb4;
          margin-bottom: 10px;
        }
        .survey-question {
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          font-weight: 800; color: #111827; line-height: 1.4;
          margin-bottom: 24px;
        }
        .survey-hint {
          font-size: 11px; color: #a0bfc3;
          margin-bottom: 16px; font-style: italic;
        }

        .survey-options { display: flex; flex-direction: column; gap: 10px; }

        .survey-option {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 12px;
          border: 1.5px solid rgba(0,95,105,0.12);
          background: #fafeff; cursor: pointer;
          transition: all 0.2s ease; text-align: left;
          font-family: 'Archivo', sans-serif; width: 100%;
        }
        .survey-option:hover {
          border-color: rgba(0,95,105,0.3);
          background: rgba(0,95,105,0.04);
        }
        .survey-option.selected {
          border-color: #005f69;
          background: rgba(0,95,105,0.07);
          box-shadow: 0 0 0 3px rgba(0,95,105,0.1);
        }
        .survey-option-label { font-size: 13px; font-weight: 700; color: #1f2937; margin-bottom: 2px; }
        .survey-option-desc { font-size: 12px; color: #7aaeb4; }
        .survey-option-check {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid rgba(0,95,105,0.2);
          flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s;
        }
        .survey-option-check.checked { border-color: transparent; }

        .survey-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 24px; gap: 12px;
        }
        .survey-next-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 100px;
          background: linear-gradient(135deg, #005f69, #007d88);
          color: #fff; font-size: 14px; font-weight: 700;
          border: none; cursor: pointer;
          font-family: 'Archivo', sans-serif;
          transition: opacity 0.2s, transform 0.2s;
        }
        .survey-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .survey-next-btn:not(:disabled):hover { opacity: 0.9; transform: translateY(-2px); }
        .survey-skip { font-size: 12px; color: #a0bfc3; cursor: pointer; background: none; border: none; font-family: 'Archivo', sans-serif; }
        .survey-skip:hover { color: #7aaeb4; }

        /* ── Success state ── */
        .survey-success {
          text-align: center; padding: 40px 20px;
        }
        .survey-success-icon {
          width: 72px; height: 72px; margin: 0 auto 20px;
          background: linear-gradient(135deg, #005f69, #00949f);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .survey-success h3 { font-size: 1.3rem; font-weight: 900; color: #111827; margin-bottom: 10px; }
        .survey-success p { font-size: 14px; color: #5a7a80; line-height: 1.7; }

        .survey-rating { display: flex; gap: 8px; justify-content: center; margin: 20px 0; }
        .survey-star {
          font-size: 28px; cursor: pointer; transition: transform 0.15s;
          background: none; border: none; padding: 0; line-height: 1;
        }
        .survey-star:hover { transform: scale(1.3); }

        /* ── Stats bar ── */
        .survey-stats {
          display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;
          margin-top: 40px; padding-top: 40px;
          border-top: 1px solid rgba(0,95,105,0.1);
        }
        .survey-stat-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(0,95,105,0.07);
          border: 1px solid rgba(0,95,105,0.12);
          border-radius: 100px; padding: 8px 16px;
          font-size: 12px; font-weight: 600; color: #005f69;
        }

        @media (max-width: 480px) {
          .survey-card { padding: 22px 18px; }
          .survey-section { padding: 60px 16px; }
        }
      `}</style>

      <section className="survey-section" id="sondage">
        <div className="survey-inner">
          <div className="survey-badge">
            <ChartBar size={12} weight="fill" />
            Sondage anonyme
          </div>
          <h2 className="survey-heading">
            Aidez-nous à construire<br />
            les services de demain
          </h2>
          <p className="survey-subheading">
            Nous préparons de nouveaux services — livraison à domicile et covoiturage. Vos réponses anonymes nous aident à les concevoir selon vos vrais besoins. Cela prend moins de 2 minutes.
          </p>

          <div className="survey-card">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="survey-success"
                >
                  <div className="survey-success-icon">
                    <CheckCircle size={36} weight="fill" style={{ color: "#fff" }} />
                  </div>
                  <h3>Merci pour votre participation !</h3>
                  <p>Vos réponses anonymes contribuent directement à la conception de nos prochains services. Restez connecté  les nouveautés arrivent bientôt sur Ticketché !</p>
                  
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginTop: 24, marginBottom: 8 }}>
                    Comment évaluez-vous votre expérience sur ce sondage ?
                  </p>
                  <div className="survey-rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} className="survey-star" onClick={() => setRating(n)}>
                        <Star size={28} weight={n <= rating ? "fill" : "regular"} style={{ color: n <= rating ? "#005f69" : "#c4d9db", transition: "color 0.15s" }} />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && <p style={{ fontSize: 12, color: "#a0bfc3" }}>Merci pour votre note !</p>}
                </motion.div>
              ) : (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProgressBar current={currentStep} total={activeSteps.length} />

                  <div className="survey-step-label">
                    Question {currentStep + 1} sur {activeSteps.length}
                  </div>
                  <div className="survey-question">{step.question}</div>
                  {step.type === "multi" && (
                    <div className="survey-hint">Vous pouvez sélectionner plusieurs réponses.</div>
                  )}

                  <div className="survey-options">
                    {step.options.map((opt) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={answers[step.id] || (step.type === "multi" ? [] : null)}
                        onClick={handleOption}
                        type={step.type}
                      />
                    ))}
                  </div>

                  <div className="survey-footer">
                    <button className="survey-skip" onClick={() => setCurrentStep((p) => Math.min(p + 1, activeSteps.length - 1))}>
                      Passer cette question
                    </button>
                    <button onClick={handleNext} disabled={!canProceed} className="survey-next-btn">
                      {currentStep === activeSteps.length - 1 ? "Envoyer" : "Suivant"}
                      <ArrowRight size={15} weight="bold" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Stats ── */}
          <div className="survey-stats">
            <div className="survey-stat-pill">
              <Users size={14} weight="fill" />
              Sondage 100% anonyme
            </div>
            <div className="survey-stat-pill">
              <Package size={14} weight="fill" />
              Livraison à domicile bientôt
            </div>
            <div className="survey-stat-pill">
              <Motorcycle size={14} weight="fill" />
              Covoiturage bientôt
            </div>
          </div>
        </div>
      </section>
    </>
  );
}