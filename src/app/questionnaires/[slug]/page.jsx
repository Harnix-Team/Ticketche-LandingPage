"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChartBar,
  Clock,
  Users,
  CalendarBlank,
  Star,
  Warning,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { fetchQuestionnaireBySlug } from "@/app/services/questionnairesApi";
import { PHONE_NUMBER } from "@/config/constants";

/* ─── Star Clusters ─────────────────────────────────────── */
const CLUSTERS = [
  { cx: "2%",  cy: "6%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }] },
  { cx: "91%", cy: "5%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }] },
  { cx: "1%",  cy: "45%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.32, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "94%", cy: "42%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.35, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
  { cx: "48%", cy: "2%",  stars: [{ x: 0, y: 0, size: 8,  opacity: 0.22, anim: 1, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "5%",  cy: "78%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.28, anim: 2, delay: "0.2s", dur: "2.9s", color: "#00818f" }] },
  { cx: "88%", cy: "75%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 0, delay: "0.4s", dur: "3.1s", color: "#00515a" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div
          key={ci}
          style={{ position:"absolute", left:cluster.cx, top:cluster.cy, width:0, height:0, zIndex:0, pointerEvents:"none" }}
        >
          {cluster.stars.map((s, si) => (
            <div
              key={si}
              style={{
                position:"absolute", left:s.x, top:s.y,
                transform:"translate(-50%,-50%)", opacity:s.opacity,
                animation:`qStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`,
                filter:`drop-shadow(0 0 3px ${s.color}88)`,
              }}
            >
              <Star weight="fill" style={{ width:s.size, height:s.size, color:s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── Build WhatsApp message from answers ─────────────────── */
function buildWaMessage(questionnaire, answers) {
  const lines = questionnaire.steps
    .flatMap((step) => {
      const answer = answers[step.id];
      if (!answer && answer !== 0) return [];

      let label;
      if (step.type === "text") {
        label = String(answer).trim();
        if (!label) return [];
      } else {
        const selected = Array.isArray(answer) ? answer : [answer];
        label = selected
          .map((id) => {
            const opt = step.options?.find((o) => o.id === id);
            return opt ? opt.label : id;
          })
          .join(", ");
      }

      const lines = [`• ${step.question}\n  → ${label}`];

      // champ "Pourquoi ?" lié au endIf
      if (step.endIfLabel) {
        const reason = answers[`${step.id}_reason`];
        if (reason) lines.push(`  Raison : ${reason}`);
      }

      return lines;
    });

  return (
    `Bonjour,\n\n` +
    `J'ai complété le questionnaire :\n📋 *${questionnaire.title}*\n\n` +
    `Mes réponses :\n${lines.join("\n\n")}\n\n` +
    `Cordialement`
  );
}

/* ─── Progress Bar ────────────────────────────────────────── */
function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="qpage-progress">
      <div className="qpage-progress__track">
        <div className="qpage-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="qpage-progress__label">
        {current + 1} / {total}
      </span>
    </div>
  );
}

/* ─── Option Card ─────────────────────────────────────────── */
function OptionCard({ option, selected, onClick }) {
  const isSelected = Array.isArray(selected)
    ? selected.includes(option.id)
    : selected === option.id;

  const Icon = option.icon;

  return (
    <button
      onClick={() => onClick(option.id)}
      className={`qpage-option${isSelected ? " qpage-option--selected" : ""}`}
    >
      <div className="qpage-option__icon">
        <Icon size={18} weight="fill" />
      </div>
      <div className="qpage-option__body">
        <div className="qpage-option__label">{option.label}</div>
        <div className="qpage-option__desc">{option.desc}</div>
      </div>
      <div className="qpage-option__check">
        {isSelected && <CheckCircle size={16} weight="fill" />}
      </div>
    </button>
  );
}

/* ─── Success Screen ──────────────────────────────────────── */
function SuccessScreen() {
  const [rating, setRating] = useState(0);
  const shareText = encodeURIComponent(
    "TicketChé prépare un service de bus et de covoiturage sur Cotonou ↔ Abomey-Calavi. " +
    "Donnez votre avis en 3 min 👉 https://ticketche.com/sondage"
  );

  return (
    <motion.div
      className="qpage-success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="qpage-success__icon">
        <CheckCircle size={40} weight="fill" />
      </div>
      <h2 className="qpage-success__title">Merci pour votre participation !</h2>
      <p className="qpage-success__text">
        Vos réponses ont été envoyées via WhatsApp. Elles contribuent directement
        à l&apos;évolution de Ticketché. Restez connecté — les nouveautés arrivent bientôt !
      </p>
      <a
        href={`https://wa.me/?text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#25D366", color: "#fff",
          fontSize: 14, fontWeight: 700, fontFamily: "'Archivo', sans-serif",
          padding: "12px 24px", borderRadius: 12, textDecoration: "none",
          marginBottom: 24, minHeight: 48,
        }}
      >
        <WhatsappLogo size={20} weight="fill" />
        Partager ce sondage à mes proches
      </a>

      <div className="qpage-success__rating-label">
        Comment évaluez-vous ce questionnaire ?
      </div>
      <div className="qpage-success__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} className="qpage-star" onClick={() => setRating(n)}>
            <Star
              size={30}
              weight={n <= rating ? "fill" : "regular"}
              style={{ color: n <= rating ? "#005f69" : "#c4d9db", transition: "color 0.15s" }}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="qpage-success__rated">Merci pour votre note !</p>
      )}

      <Link href="/questionnaires" className="qpage-success__back">
        <ArrowLeft size={15} weight="bold" />
        Voir tous les questionnaires
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function QuestionnairePage() {
  const params = useParams();
  const router = useRouter();

  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [notFound, setNotFound]           = useState(false);

  const searchParams = useSearchParams();
  const utmSource   = searchParams.get("utm_source")   || "organic";
  const utmMedium   = searchParams.get("utm_medium")   || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers]         = useState({});
  const [submitted, setSubmitted]     = useState(false);

  const saveProgress = useCallback((ans, step, key) => {
    try { localStorage.setItem(`tc_q_${key}`, JSON.stringify({ answers: ans, step })); } catch (_) {}
  }, []);
  const clearProgress = useCallback((key) => {
    try { localStorage.removeItem(`tc_q_${key}`); } catch (_) {}
  }, []);

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) return;
    fetchQuestionnaireBySlug(slug)
      .then((q) => {
        if (!q) { setNotFound(true); return; }
        setQuestionnaire(q);
        try {
          const saved = JSON.parse(localStorage.getItem(`tc_q_${q.slug || q.id}`) || "null");
          if (saved) { setAnswers(saved.answers || {}); setCurrentStep(saved.step || 0); }
        } catch (_) {}
      })
      .finally(() => setLoading(false));
  }, [params?.slug]);

  /* ── Active steps — moteur de branchement ──────────────────────────────
   *  Règles supportées par step :
   *    showIf  { questionId, values }  → masqué si la réponse n'est pas dans values
   *    endIf   { values }              → stoppe la liste si la réponse à CE step ∈ values
   *                                      (endIf est évalué sur le step lui-même)
   * ─────────────────────────────────────────────────────────────────────── */
  const getActiveSteps = () => {
    if (!questionnaire) return [];

    const result = [];

    for (const step of questionnaire.steps) {
      // 1. showIf : inclure seulement si la condition est remplie
      if (step.showIf) {
        const { questionId, values } = step.showIf;
        const given = answers[questionId];
        const givenArr = Array.isArray(given) ? given : given ? [given] : [];
        const match = givenArr.some((v) => values.includes(v));
        if (!match) continue;
      }

      result.push(step);

      // 2. endIf : si la réponse à CE step correspond, arrêter ici
      if (step.endIf) {
        const { values } = step.endIf;
        const given = answers[step.id];
        const givenArr = Array.isArray(given) ? given : given ? [given] : [];
        if (givenArr.some((v) => values.includes(v))) break;
      }
    }

    return result;
  };

  const activeSteps = getActiveSteps();
  const step        = activeSteps[currentStep];

  const handleOption = (optId) => {
    if (!step) return;
    setAnswers((prev) => {
      let updated;
      if (step.type === "multi") {
        const cur = prev[step.id] || [];
        if (cur.includes(optId)) {
          updated = { ...prev, [step.id]: cur.filter((v) => v !== optId) };
        } else {
          if (step.maxSelect && cur.length >= step.maxSelect) return prev;
          updated = { ...prev, [step.id]: [...cur, optId] };
        }
      } else {
        updated = { ...prev, [step.id]: optId };
      }
      saveProgress(updated, currentStep, questionnaire?.slug || questionnaire?.id);
      return updated;
    });
  };

  const canProceed = step
    ? step.optional
      ? true
      : step.type === "text"
        ? !!(answers[step.id] || "").trim()
        : step.type === "multi"
          ? (answers[step.id] || []).length > 0
          : !!answers[step.id]
    : false;

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      saveProgress(answers, next, questionnaire?.slug || questionnaire?.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const message = buildWaMessage(questionnaire, answers);
      const url     = `https://wa.me/${PHONE_NUMBER.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      clearProgress(questionnaire?.slug || questionnaire?.id);
      try { localStorage.setItem("ticketche_sondage_done", "1"); } catch (_) {}
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
    else router.push("/questionnaires");
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="qpage-loading">
        <div className="qpage-loading__spinner" />
        <p>Chargement du questionnaire…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !questionnaire) {
    return (
      <div className="qpage-notfound">
        <Warning size={48} weight="fill" style={{ color: "#005f69" }} />
        <h2>Questionnaire introuvable</h2>
        <p>Ce questionnaire n&apos;existe pas ou a été supprimé.</p>
        <Link href="/questionnaires" className="qpage-notfound__link">
          <ArrowLeft size={15} weight="bold" />
          Retour aux questionnaires
        </Link>
      </div>
    );
  }

  return (
    <div className="qpage-root">

      <style>{`
        .qpage-hero {
          position: relative;
          overflow: hidden;
          background: #9dcccc;
          padding: 120px 24px 80px;
          text-align: center;
        }
        .qpage-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,95,105,0.05) 0%, transparent 70%);
        }
        .qpage-hero__inner {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
        }
        .qpage-hero__breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }
        .qpage-hero__breadcrumb-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #005f69;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .qpage-hero__breadcrumb-link:hover { color: #003f46; }
        .qpage-hero__breadcrumb-sep { color: rgba(0,63,70,0.30); font-weight: 400; font-size: 13px; }
        .qpage-hero__breadcrumb-current {
          color: #638284;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }
        .qpage-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,95,105,0.10);
          border: 1px solid rgba(0,95,105,0.20);
          color: #005f69;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }
        .qpage-hero__title {
          font-size: clamp(24px, 4vw, 48px);
          font-weight: 900;
          color: #003f46;
          line-height: 1.1;
          letter-spacing: -1px;
          margin: 0 0 16px;
        }
        .qpage-hero__desc {
          color: #638284;
          font-size: clamp(14px, 2vw, 17px);
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto 20px;
        }
        .qpage-hero__meta {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 13px;
          color: #638284;
          font-weight: 600;
        }
        .qpage-hero__meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>
      {/* Hero — identique à questionnaires/page.jsx */}
      {!submitted && (
        <div className="qpage-hero">
          <StarClusters />
          <div className="qpage-hero__inner">
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>

            {/* Breadcrumb inside hero */}
            <div className="qpage-hero__breadcrumb">
              <Link href="/questionnaires" className="qpage-hero__breadcrumb-link">
                <ArrowLeft size={13} weight="bold" />
                Questionnaires
              </Link>
              <span className="qpage-hero__breadcrumb-sep">/</span>
              <span className="qpage-hero__breadcrumb-current">{questionnaire.title}</span>
            </div>

            <div className="qpage-hero__badge">
              <ChartBar size={12} weight="fill" />
              Sondage anonyme
            </div>
            <h1 className="qpage-hero__title">{questionnaire.title}</h1>
            <p className="qpage-hero__desc">{questionnaire.description}</p>

            <div className="qpage-hero__meta">
              <span>
                <CalendarBlank size={13} weight="fill" />
                {new Date(questionnaire.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
              <span>
                <Clock size={13} weight="fill" />~{questionnaire.estimatedMinutes} min
              </span>
              <span>
                <Users size={13} weight="fill" />
                {questionnaire.totalResponses} participants
              </span>
            </div>

            </motion.div>
          </div>
        </div>
      )}

      {/* Survey card */}
      <div className="qpage-body">
        <div className="qpage-card-wrap">
          <div className="qpage-card">
            <AnimatePresence mode="wait">
              {submitted ? (
                <SuccessScreen key="success" />
              ) : step ? (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProgressBar current={currentStep} total={activeSteps.length} />

                  <div className="qpage-step-num">
                    Question {currentStep + 1} sur {activeSteps.length}
                  </div>

                  {step.intro && (
                    <div className="qpage-intro">{step.intro}</div>
                  )}

                  <div className="qpage-question-header">
                    <div className="qpage-question">{step.question}</div>
                  </div>

                  {step.type === "multi" && (
                    <div className="qpage-hint">
                      {step.maxSelect
                        ? `Choisissez jusqu'à ${step.maxSelect} réponses.`
                        : "Vous pouvez sélectionner plusieurs réponses."}
                    </div>
                  )}

                  <div className="qpage-options">
                    {step.type === "text" ? (
                      <textarea
                        className="qpage-textarea"
                        placeholder={step.placeholder || "Votre réponse…"}
                        value={answers[step.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [step.id]: e.target.value }))
                        }
                        rows={4}
                      />
                    ) : (
                      step.options.map((opt) => (
                        <OptionCard
                          key={opt.id}
                          option={opt}
                          selected={answers[step.id] || (step.type === "multi" ? [] : null)}
                          onClick={handleOption}
                        />
                      ))
                    )}
                  </div>

                  {/* Champ "Pourquoi ?" si endIfLabel et réponse déclenchante sélectionnée */}
                  {step.endIfLabel && step.endIf?.values?.includes(answers[step.id]) && (
                    <div className="qpage-endifreason">
                      <label className="qpage-endifreason__label">{step.endIfLabel}</label>
                      <textarea
                        className="qpage-textarea qpage-textarea--sm"
                        placeholder="Votre réponse (optionnel)…"
                        value={answers[`${step.id}_reason`] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [`${step.id}_reason`]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="qpage-footer">
                    <div className="qpage-footer__left">
                      {currentStep > 0 && (
                        <button className="qpage-prev-btn" onClick={() => setCurrentStep((p) => p - 1)}>
                          <ArrowLeft size={14} weight="bold" />
                          Précédent
                        </button>
                      )}
                      <button
                        className="qpage-skip"
                        onClick={() =>
                          setCurrentStep((p) => Math.min(p + 1, activeSteps.length - 1))
                        }
                      >
                        Passer
                      </button>
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="qpage-next-btn"
                    >
                      {currentStep === activeSteps.length - 1 ? "Envoyer" : "Suivant"}
                      <ArrowRight size={15} weight="bold" />
                    </button>
                    </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          {!submitted && (
            <div className="qpage-sidebar">
              <div className="qpage-sidebar__block">
                <div className="qpage-sidebar__title">À propos</div>
                <div className="qpage-sidebar__row">
                  <Clock size={14} weight="fill" />
                  <span>Durée estimée : ~{questionnaire.estimatedMinutes} min</span>
                </div>
                <div className="qpage-sidebar__row">
                  <Users size={14} weight="fill" />
                  <span>{questionnaire.totalResponses} participants</span>
                </div>
                <div className="qpage-sidebar__row">
                  <CheckCircle size={14} weight="fill" />
                  <span>100% anonyme</span>
                </div>
              </div>
              <div className="qpage-sidebar__block qpage-sidebar__block--note">
                <div className="qpage-sidebar__title">Confidentialité</div>
                <p className="qpage-sidebar__note">
                  Vos réponses sont entièrement anonymes et ne sont jamais associées
                  à votre compte ou à votre identité.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}