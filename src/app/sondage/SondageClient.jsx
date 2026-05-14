"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, CheckCircle, ChartBar, Star,
  WhatsappLogo, MapPin, User, Car, Path, ArrowsClockwise,
  Warning, Sparkle, CreditCard, ChatText,
} from "@phosphor-icons/react";
import {
  fetchQuestionnaireBySlug,
  submitQuestionnaireAnswers,
} from "@/app/services/questionnairesApi";

const SURVEY_SLUG = "transport-covoiturage-2026";
const STORAGE_KEY = "ticketche_sondage_progress_v3";
const DONE_KEY    = "ticketche_sondage_done";

/* ── Icônes par section ───────────────────────────────────────────────────── */
const SECTION_ICONS = {
  s1: User,
  s2: Car,
  s3: Path,
  s4: ArrowsClockwise,
  s5: Warning,
  s6: Sparkle,
  s7: CreditCard,
  s8: ChatText,
};

/* ── Écrans ───────────────────────────────────────────────────────────────── */
const SCREENS = [
  { id:"s1", label:"Profil",      layout:"2x2",
    questions:["q1_age","q2_sexe","q3_profession","q4_vehicule"] },
  { id:"s2", label:"Conducteur",  layout:"2+3",
    questions:["q5_type_vehicule","q6_places","q7_carburant","q8_passagers","q8b_app"],
    showIf:{ questionId:"q4_vehicule", values:["oui"] } },
  { id:"s3", label:"Trajet",      layout:"1+2",
    questions:["q9_residence","q10_lieu_activite","q11_itineraire"] },
  { id:"s4", label:"Habitudes",   layout:"3x2",
    questions:["q12_frequence","q13_transport","q14_depart","q15_retour","q16_duree","q17_cout"] },
  { id:"s5", label:"Difficultés", layout:"1x2",
    questions:["q18_difficultes","q19_type_difficultes"] },
  { id:"s6", label:"TicketChé",   layout:"2x2",
    questions:["q20_interet","q21_service","q22_role","q23_reservation"] },
  { id:"s7", label:"Paiement",    layout:"3x2",
    questions:["q24_mobile_money","q25_smartphone","q26_paiement_app","q27_prix","q28_abonnement","q28b_prix_abo"] },
  { id:"s8", label:"Perception",  layout:"2+1",
    questions:["q29_avantages","q30_obstacles","q31_suggestions"] },
];

/* ── Conditions de visibilité ─────────────────────────────────────────────── */
const CONDS = {
  q5_type_vehicule:     { dep:"q4_vehicule",    vals:["oui"] },
  q6_places:            { dep:"q4_vehicule",    vals:["oui"] },
  q7_carburant:         { dep:"q4_vehicule",    vals:["oui"] },
  q8_passagers:         { dep:"q4_vehicule",    vals:["oui"] },
  q8b_app:              { dep:"q4_vehicule",    vals:["oui"] },
  q19_type_difficultes: { dep:"q18_difficultes",vals:["oui"] },
  q22_role:             { dep:"q21_service",    vals:["covoiturage","les_deux"] },
  q28b_prix_abo:        { dep:"q28_abonnement", vals:["oui","peut_etre"] },
};

function isVisible(qId, answers) {
  if (!CONDS[qId]) return true;
  const { dep, vals } = CONDS[qId];
  const given = answers[dep];
  const arr = Array.isArray(given) ? given : given ? [given] : [];
  return arr.some(v => vals.includes(v));
}

function getRequired(screen, answers, questionnaire, isMobile) {
  if (!screen || !questionnaire) return [];
  return screen.questions.filter(qId => {
    if (!isVisible(qId, answers)) return false;
    // Desktop S6 : Q21/Q22/Q23 ne sont requises que si Q20 = oui/peut_etre
    if (!isMobile && screen.id === "s6" && qId !== "q20_interet") {
      const q20 = answers["q20_interet"];
      if (q20 !== "oui" && q20 !== "peut_etre") return false;
    }
    const step = questionnaire.steps.find(s => s.id === qId);
    if (!step || step.optional) return false;
    return true;
  });
}

/* ── UTM ──────────────────────────────────────────────────────────────────── */
function resolveSourceTag(s, m) {
  if (s==="terrain"&&m==="qrcode")  return "qrcode_terrain";
  if (s==="whatsapp"&&m==="social") return "whatsapp_uac";
  if (s==="gdiz"&&m==="interne")    return "gdiz_interne";
  if (s==="site"&&m==="bandeau")    return "bandeau_site";
  if (s==="site"&&m==="popup")      return "popup_site";
  return "organic";
}
function resolveLibreCanal(m) {
  if (m==="qrcode") return "libre_qrcode";
  if (m==="social") return "libre_whatsapp";
  return "libre_web";
}

/* ════════════════════════════════════════════════════════
   QuestionCard — cellule individuelle dans la grille
   ════════════════════════════════════════════════════════ */
function QuestionCard({ step, answers, onChange, spanClass, isMobile }) {
  if (!step) return null;
  const val = answers[step.id];
  const Icon = step.icon;
  /* Sur mobile : toujours en colonne pour respecter min 48px B4 */
  const isRow = !isMobile && step.options && step.options.length <= 3;

  const isAutreOpt = (id) => id === "autre" || id === "other" || id?.toLowerCase().includes("autre");

  const handleClick = (optId) => {
    if (step.type === "multi") {
      const cur = val || [];
      let next;
      if (cur.includes(optId)) {
        // désélectionner
        next = cur.filter(v => v !== optId);
      } else if (isAutreOpt(optId)) {
        // "Autre" sélectionné → effacer tous les autres choix
        next = [optId];
      } else {
        // autre option sélectionnée → retirer "autre" s'il était coché
        const withoutAutre = cur.filter(v => !isAutreOpt(v));
        if (step.maxSelect && withoutAutre.length >= step.maxSelect) return;
        next = [...withoutAutre, optId];
      }
      onChange(step.id, next);
    } else {
      onChange(step.id, optId);
    }
  };

  const autreSelected =
    step.type === "multi"
      ? (Array.isArray(val) && val.some(v => isAutreOpt(v)))
      : (typeof val === "string" && isAutreOpt(val));

  const isAnswered = Array.isArray(val) ? val.length > 0 : !!val;

  return (
    <div className={`snd-qcard ${isAnswered ? "snd-qcard--answered" : ""} ${spanClass || ""}`}>

      {/* En-tête question */}
      <div className="snd-qcard__head">
        {Icon && (
          <span className="snd-qcard__icon">
            <Icon size={15} weight="fill" />
          </span>
        )}
        <p className="snd-qcard__label">{step.question}</p>
        {step.type === "multi" && (
          <span className="snd-qcard__hint">
            {step.maxSelect ? `max ${step.maxSelect} choix` : "Réponses multiples"}
          </span>
        )}
      </div>

      {/* Intro TicketChé */}
      {step.intro && (
        <div className="snd-qcard__intro">{step.intro}</div>
      )}

      {/* Corps */}
      <div className="snd-qcard__body">
        {step.type === "text" ? (
          <textarea
            className="snd-qcard__textarea"
            placeholder={step.placeholder || "Votre réponse…"}
            value={val || ""}
            onChange={e => onChange(step.id, e.target.value)}
            rows={3}
          />
        ) : (
          <>
            <div className={`snd-opts ${isRow ? "snd-opts--row" : ""}`}>
              {step.options?.map(opt => {
                const Ic = opt.icon;
                const selected = Array.isArray(val) ? val.includes(opt.id) : val === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleClick(opt.id)}
                    className={`snd-opt ${selected ? "snd-opt--on" : ""}`}
                  >
                    {Ic && <Ic size={13} weight="fill" className="snd-opt__ic" />}
                    <span className="snd-opt__lbl">
                      {opt.label}
                      {opt.desc && <span className="snd-opt__desc">{opt.desc}</span>}
                    </span>
                    {selected && <CheckCircle size={12} weight="fill" className="snd-opt__chk" />}
                  </button>
                );
              })}
            </div>
            {autreSelected && (
              <div className="snd-autre-wrap">
                <label className="snd-autre-label">Précisez votre réponse :</label>
                <textarea
                  className="snd-qcard__textarea snd-qcard__textarea--sm"
                  placeholder="Écrivez votre réponse ici…"
                  value={answers[`${step.id}_autre`] || ""}
                  onChange={e => onChange(`${step.id}_autre`, e.target.value)}
                  rows={2}
                  autoFocus
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Champ "Pourquoi ?" conditionnel */}
      {step.endIfLabel && step.endIf?.values?.includes(val) && (
        <textarea
          className="snd-qcard__textarea snd-qcard__textarea--sm"
          placeholder="Pourquoi ? (optionnel)"
          value={answers[`${step.id}_reason`] || ""}
          onChange={e => onChange(`${step.id}_reason`, e.target.value)}
          rows={2}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ScreenGrid — grille adaptative par layout
   ════════════════════════════════════════════════════════ */
function ScreenGrid({ screen, visibleQIds, questionnaire, answers, onChange, isMobile }) {
  /* Sur mobile : toujours 1 colonne, quel que soit le layout */
  const gridClass = isMobile
    ? "snd-grid snd-grid--1col"
    : ({
        "2x2":  "snd-grid snd-grid--2x2",
        "3x2":  "snd-grid snd-grid--3x2",
        "1x2":  "snd-grid snd-grid--1col",
        "2+3":  "snd-grid snd-grid--6col",
        "2+1":  "snd-grid snd-grid--2col",
        "1+2":  "snd-grid snd-grid--2col",
      }[screen.layout] || "snd-grid snd-grid--1col");

  /* spanClass inutile sur mobile (grille 1col) */
  function spanClass(idx) {
    if (isMobile) return "";
    if (screen.layout === "2+3") return idx < 2 ? "snd-span3" : "snd-span2";
    if (screen.layout === "2+1") return idx >= 2 ? "snd-spanfull" : "";
    if (screen.layout === "1+2") return idx === 0 ? "snd-spanfull" : "";
    if (screen.layout === "1x2") return "snd-spanfull";
    return "";
  }

  return (
    <div className={gridClass}>
      <AnimatePresence initial={false}>
        {visibleQIds.map((qId, idx) => {
          const step = questionnaire.steps.find(s => s.id === qId);
          if (!step) return null;
          return (
            <motion.div
              key={qId}
              className={spanClass(idx)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, delay: idx > 0 ? (idx - 1) * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuestionCard
                key={qId}
                step={step}
                answers={answers}
                onChange={onChange}
                spanClass=""
                isMobile={isMobile}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SuccessScreen
   ════════════════════════════════════════════════════════ */
function SuccessScreen() {
  const [rating, setRating] = useState(0);
  return (
    <motion.div
      className="snd-success"
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.45 }}
    >
      <div className="snd-success__ring">
        <CheckCircle size={44} weight="fill" />
      </div>
      <h2 className="snd-success__title">Merci ! Vos réponses ont été enregistrées.</h2>

      <p className="snd-success__stars-lbl">Comment évaluez-vous ce questionnaire ?</p>
      <div className="snd-success__stars">
        {[1,2,3,4,5].map(n => (
          <button key={n} className="snd-star-btn" onClick={() => setRating(n)}>
            <Star
              size={28}
              weight={n <= rating ? "fill" : "regular"}
              className={n <= rating ? "text-[#005f69]" : "text-[#c4d9db]"}
            />
          </button>
        ))}
      </div>
      {rating > 0 && <p className="snd-success__rated">Merci ✦</p>}

      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Link href="/download" className="snd-hero-cta">
          <div className="snd-hero-cta__ring" />
          <span style={{ flex: 1, textAlign: "center", paddingRight: "clamp(8px,1.5vw,12px)" }}>
            Téléchargez Ticketché
          </span>
          <div className="snd-hero-cta__circle">
            <ArrowRight weight="bold" className="snd-hero-cta__arrow" style={{ width: 22, height: 22 }} />
          </div>
        </Link>
      </motion.div>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          "TicketChé prépare un service de bus et de covoiturage sur Cotonou ↔ Abomey-Calavi. " +
          "Donnez votre avis en 3 min : https://ticketche.com/sondage"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="snd-wa-btn"
        style={{ marginTop: 12 }}
      >
        <WhatsappLogo size={20} weight="fill" />
        Partagez ce sondage à vos proches
      </a>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ════════════════════════════════════════════════════════ */
export default function SondagePage() {
  const searchParams = useSearchParams();
  const utmSource   = searchParams.get("utm_source")   || "organic";
  const utmMedium   = searchParams.get("utm_medium")   || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;
  const sourceTag   = resolveSourceTag(utmSource, utmMedium);
  const libreCanal  = resolveLibreCanal(utmMedium);

  /* Auto-démarrage si l'utilisateur vient du bandeau ou du popup */
  const autoStart = utmMedium === "bandeau" || utmMedium === "popup";

  const [questionnaire, setQuestionnaire]       = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
  const [answers, setAnswers]                   = useState({});
  const [submitted, setSubmitted]               = useState(false);
  const [showForm, setShowForm]                 = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [commune, setCommune]                   = useState("");
  const [submitError, setSubmitError]           = useState(false);
  const [submitting, setSubmitting]             = useState(false);
  /* B4 — mobile wizard : une question à la fois */
  const [isMobile, setIsMobile]                 = useState(false);
  const [mobileSubIdx, setMobileSubIdx]         = useState(0);

  /* Refs pour éviter les closures stalées dans setTimeout */
  const mobileSubIdxRef     = useRef(0);
  const currentScreenIdxRef = useRef(0);
  const answersRef          = useRef({});
  const autoAdvanceTimer    = useRef(null);

  /* Ref sur la zone formulaire pour le scroll ciblé (évite de scroller le hero) */
  const formZoneRef = useRef(null);

  const scrollToForm = useCallback(() => {
    if (formZoneRef.current) {
      const headerH = document.querySelector(".hdrContainer")?.offsetHeight || 72;
      const top = formZoneRef.current.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    fetchQuestionnaireBySlug(SURVEY_SLUG)
      .then(setQuestionnaire)
      .finally(() => setLoading(false));
  }, []);

  /* Détection mobile — B4 */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Clamp mobileSubIdx si visibleQIds rétrécit suite à un changement de réponse */
  useEffect(() => {
    if (!isMobile) return;
    setMobileSubIdx(prev => {
      const max = Math.max(0, visibleQIds.length - 1);
      const next = prev > max ? max : prev;
      mobileSubIdxRef.current = next;
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreenIdx, answers, isMobile]);

  /* Sync refs avec les états */
  useEffect(() => { mobileSubIdxRef.current = mobileSubIdx; }, [mobileSubIdx]);
  useEffect(() => { currentScreenIdxRef.current = currentScreenIdx; }, [currentScreenIdx]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    if (!questionnaire) return;
    let hasSaved = false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { answers: a, screenIdx, slug, commune: c, mobileSubIdx: msi } = JSON.parse(saved);
        if (slug === SURVEY_SLUG) {
          setAnswers(a || {});
          setCurrentScreenIdx(screenIdx || 0);
          if (msi) setMobileSubIdx(msi);
          if (c) setCommune(c);
          setHasSavedProgress(true);
          hasSaved = true;
        }
      }
    } catch (_) {}

    /* Venant du bandeau ou popup :
       - si pas de progrès sauvegardé → démarrer directement
       - si progrès sauvegardé → afficher les boutons reprendre/recommencer (ne pas setShowForm) */
    if (autoStart && !hasSaved) setShowForm(true);
  }, [questionnaire]);

  const saveProgress = useCallback((ans, idx, com, subIdx = 0) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers: ans, screenIdx: idx, slug: SURVEY_SLUG, commune: com, mobileSubIdx: subIdx,
      }));
    } catch (_) {}
  }, []);

  const clearProgress = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }, []);

  /* Écrans actifs (filtrés par showIf) */
  const activeScreens = questionnaire
    ? SCREENS.filter(sc => {
        if (!sc.showIf) return true;
        const { questionId, values } = sc.showIf;
        const given = answers[questionId];
        const arr = Array.isArray(given) ? given : given ? [given] : [];
        return arr.some(v => values.includes(v));
      })
    : [];

  const currentScreen = activeScreens[currentScreenIdx];

  /* Sur desktop, S6 : afficher Q20 seule jusqu'à ce que l'utilisateur réponde oui/peut_etre.
     Dès que Q20 est répondu (oui/peut_etre), les autres questions apparaissent.
     Sur mobile, on garde le wizard question par question — pas de filtre spécial. */
  const visibleQIds = currentScreen && questionnaire
    ? currentScreen.questions.filter(qId => {
        if (!isVisible(qId, answers)) return false;
        // Desktop uniquement : sur S6, masquer Q21/Q22/Q23 tant que Q20 n'est pas oui/peut_etre
        if (!isMobile && currentScreen.id === "s6" && qId !== "q20_interet") {
          const q20 = answers["q20_interet"];
          if (q20 !== "oui" && q20 !== "peut_etre") return false;
        }
        return true;
      })
    : [];

  /* B4 — sur mobile : la question courante dans la section */
  const mobileVisibleQIds = isMobile ? [visibleQIds[mobileSubIdx]].filter(Boolean) : visibleQIds;
  const currentMobileQId  = isMobile ? visibleQIds[mobileSubIdx] : null;

  /* Calcul question globale pour le label "Question X sur N" — B4 */
  const totalVisibleQuestions = activeScreens.reduce((acc, sc) => {
    const visible = sc.questions.filter(qId => isVisible(qId, answers));
    return acc + visible.length;
  }, 0);
  const questionsBeforeScreen = activeScreens.slice(0, currentScreenIdx).reduce((acc, sc) => {
    return acc + sc.questions.filter(qId => isVisible(qId, answers)).length;
  }, 0);
  const currentQuestionNum = questionsBeforeScreen + (isMobile ? mobileSubIdx + 1 : visibleQIds.length ? 1 : 0);

  const canProceed = currentScreen && questionnaire
    ? (isMobile
        /* mobile : juste la question courante */
        ? (() => {
            const qId = visibleQIds[mobileSubIdx];
            if (!qId) return true;
            const step = questionnaire.steps.find(s => s.id === qId);
            if (!step || step.optional) return true;
            if (step.type === "text") return !!(answers[qId] || "").trim();
            if (step.type === "multi") return (answers[qId] || []).length > 0;
            return !!answers[qId];
          })()
        /* desktop : toutes les questions requises de la section */
        : getRequired(currentScreen, answers, questionnaire, isMobile).every(qId => {
            const step = questionnaire.steps.find(s => s.id === qId);
            if (!step) return true;
            if (step.type === "text") return !!(answers[qId] || "").trim();
            if (step.type === "multi") return (answers[qId] || []).length > 0;
            return !!answers[qId];
          }))
    : false;

  const handleChange = useCallback((qId, value) => {
    setAnswers(prev => {
      const updated = { ...prev, [qId]: value };
      answersRef.current = updated;
      saveProgress(updated, currentScreenIdxRef.current, commune, mobileSubIdxRef.current);
      return updated;
    });

    /* ── Auto-avancement mobile pour les choix uniques ── */
    if (!isMobile) return;
    // Annuler tout timer en cours
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    // Seulement les vraies questions (pas _autre, pas _reason)
    if (qId.endsWith("_autre") || qId.endsWith("_reason")) return;
    // Trouver le step correspondant
    const step = questionnaire?.steps.find(s => s.id === qId);
    if (!step) return;
    // Seulement pour les choix uniques (pas multi, pas text)
    if (step.type === "multi" || step.type === "text") return;
    // Ne pas auto-avancer si l'option "autre" est sélectionnée
    const isAutre = typeof value === "string" && value?.toLowerCase().includes("autre");
    if (isAutre) return;
    // Ne pas auto-avancer si endIf est déclenché (ex: Q20="non" → afficher "Pourquoi ?")
    if (step.endIf?.values?.includes(value)) return;

    // Déclencher l'avancement après un court délai (pour voir la sélection)
    // On utilise les refs pour avoir les valeurs ACTUELLES et éviter les closures stalées
    autoAdvanceTimer.current = setTimeout(() => {
      const subIdx    = mobileSubIdxRef.current;
      const scrIdx    = currentScreenIdxRef.current;
      const currAnswers = { ...answersRef.current, [qId]: value };
      const activeScrs  = SCREENS.filter(sc => {
        if (!sc.showIf) return true;
        const { questionId, values } = sc.showIf;
        const given = currAnswers[questionId];
        const arr = Array.isArray(given) ? given : given ? [given] : [];
        return arr.some(v => values.includes(v));
      });
      const screen = activeScrs[scrIdx];
      if (!screen) return;
      const currentVisibleQIds = screen.questions.filter(q => isVisible(q, currAnswers));

      if (subIdx < currentVisibleQIds.length - 1) {
        // Question suivante dans la même section
        const next = subIdx + 1;
        mobileSubIdxRef.current = next;
        setMobileSubIdx(next);
        scrollToForm();
      } else {
        // Fin de section → section suivante
        const nextScrIdx = scrIdx + 1;
        if (nextScrIdx < activeScrs.length) {
          mobileSubIdxRef.current = 0;
          currentScreenIdxRef.current = nextScrIdx;
          setMobileSubIdx(0);
          setCurrentScreenIdx(nextScrIdx);
          saveProgress(currAnswers, nextScrIdx, commune, 0);
          scrollToForm();
        }
        // Si dernière section → pas de soumission auto, l'user clique "Envoyer"
      }
    }, 380);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, questionnaire, commune, saveProgress, scrollToForm]);

  const handleNext = () => {
    /* ── endIf : si la question courante déclenche une fin anticipée → soumettre ── */
    // Mobile : vérifier la question affichée
    const endIfQId = isMobile ? visibleQIds[mobileSubIdx] : null;
    const endIfStep = endIfQId && questionnaire
      ? questionnaire.steps.find(s => s.id === endIfQId)
      : null;
    const mobileEndIf = !!endIfStep?.endIf?.values?.includes(answers[endIfQId]);

    // Desktop : vérifier toutes les questions visibles de la section courante
    const desktopEndIf = !isMobile && questionnaire && currentScreen
      ? visibleQIds.some(qId => {
          const step = questionnaire.steps.find(s => s.id === qId);
          return step?.endIf?.values?.includes(answers[qId]);
        })
      : false;

    if (mobileEndIf || desktopEndIf) {
      handleSubmit();
      return;
    }

    /* ── Fix B4 : mobile wizard — avancer question par question ── */
    if (isMobile && mobileSubIdx < visibleQIds.length - 1) {
      const next = mobileSubIdx + 1;
      setMobileSubIdx(next);
      scrollToForm();
      return;
    }

    /* ── Avancer à la section suivante (desktop ou fin de section mobile) ── */
    setMobileSubIdx(0);
    if (currentScreenIdx < activeScreens.length - 1) {
      const next = currentScreenIdx + 1;
      setCurrentScreenIdx(next);
      saveProgress(answers, next, commune, 0);
      scrollToForm();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    /* ── Fix B4 : mobile wizard — reculer question par question ── */
    if (isMobile && mobileSubIdx > 0) {
      setMobileSubIdx(mobileSubIdx - 1);
      scrollToForm();
      return;
    }

    if (currentScreenIdx > 0) {
      const prev = currentScreenIdx - 1;
      /* sur mobile, aller à la dernière question de la section précédente */
      if (isMobile && questionnaire) {
        const prevScreen = activeScreens[prev];
        const prevVisible = prevScreen.questions.filter(qId => isVisible(qId, answers));
        setMobileSubIdx(Math.max(0, prevVisible.length - 1));
      } else {
        setMobileSubIdx(0);
      }
      setCurrentScreenIdx(prev);
      saveProgress(answers, prev, commune, isMobile ? Math.max(0, activeScreens[prev]?.questions.filter(q => isVisible(q, answers)).length - 1) : 0);
      scrollToForm();
    }
  };

  const handleSubmit = async () => {
    setSubmitError(false);
    setSubmitting(true);
    // answers = uniquement les réponses Q1-Q31
    const cleanAnswers = { ...answers };
    // metadata = champs doc B1 au même niveau que answers
    const metadata = {
      mode: "libre",
      mode_canal: libreCanal,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      source_tag: sourceTag,
      submitted_at: new Date().toISOString(),
      ...(commune.trim() ? { commune_declaree: commune.trim() } : {}),
    };
    try {
      await submitQuestionnaireAnswers(questionnaire.id, cleanAnswers, metadata);
      clearProgress();
      try { localStorage.setItem(DONE_KEY, "1"); } catch (_) {}
      setSubmitted(true);
      scrollToForm();
    } catch (err) {
      console.error("Erreur soumission sondage :", err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const shareText = encodeURIComponent(
    "TicketChé prépare un service de bus et de covoiturage sur Cotonou ↔ Abomey-Calavi. " +
    "Donnez votre avis en 3 min : https://ticketche.com/sondage"
  );

  /* ── Loading ── */
  if (loading) return (
    <div className="snd-loading">
      <div className="snd-loading__spinner" />
      <p>Chargement du sondage…</p>
    </div>
  );

  /* ── HERO — formulaire intégré directement, pas de redirection ── */
  const SectionIcon = currentScreen ? SECTION_ICONS[currentScreen.id] : null;

  return (
    <div className={`snd-page${!autoStart && !showForm && !submitted ? " snd-page--hero" : ""}`}>

      {/* ════════ HERO (masqué si venant du bandeau/popup, ou dès que le formulaire est actif) ════════ */}
      {!autoStart && !showForm && !submitted && (
      <section className="snd-hero">
        <div className="snd-hero__inner">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="snd-hero__badge">
              <ChartBar size={12} weight="fill" />
              Sondage anonyme · 3 min
            </div>

            {/* Accroche — masquée dès que le formulaire est actif */}
            {!showForm && !submitted && (
              <>
                <h1 className="snd-hero__title">
                  Vos déplacements quotidiens méritent mieux.<br />
                  Dites-nous comment.
                </h1>
                <p className="snd-hero__sub">
                  TicketChé prépare un service de bus et de covoiturage sur
                  Cotonou ↔ Abomey-Calavi. Votre avis compte — anonyme, gratuit.
                </p>
              </>
            )}

            {/* 3 chiffres clés */}
            <div className="snd-stats">
              <div className="snd-stat">
                <span className="snd-stat__val">51 000</span>
                <span className="snd-stat__lbl">étudiants concernés</span>
              </div>
              <div className="snd-stat">
                <span className="snd-stat__val">0</span>
                <span className="snd-stat__lbl">bus organisé aujourd&apos;hui</span>
              </div>
              <div className="snd-stat">
                <span className="snd-stat__val">Votre avis</span>
                <span className="snd-stat__lbl">change ça</span>
              </div>
            </div>

            {/* Commune (optionnel) */}
            {!showForm && !submitted && (
              <div className="snd-commune">
                <MapPin size={15} weight="fill" />
                <input
                  type="text"
                  placeholder="Votre commune (optionnel)"
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  maxLength={80}
                  className="snd-commune__input"
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>
      )}

      {/* ════════ FORMULAIRE INTÉGRÉ ════════ */}
      <div className="snd-form-zone" ref={formZoneRef}>

        {/* CTA initial */}
        {!showForm && !submitted && (
          <motion.div
            className="snd-cta-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <button className="snd-cta-btn" onClick={() => setShowForm(true)}>
              {hasSavedProgress ? "Reprendre le sondage" : "Participer au sondage"}
              <ArrowRight size={16} weight="bold" />
            </button>
            {hasSavedProgress && (
              <button
                className="snd-restart-btn"
                onClick={() => {
                  clearProgress();
                  setAnswers({});
                  setCurrentScreenIdx(0);
                  setHasSavedProgress(false);
                  setShowForm(true);
                }}
              >
                Recommencer depuis le début
              </button>
            )}
          </motion.div>
        )}

        {/* Succès */}
        {submitted && <SuccessScreen />}

        {/* Formulaire actif */}
        {showForm && !submitted && currentScreen && questionnaire && (
          <>
            {/* Barre de progression */}
            <div className="snd-progress">
              {/* Segments par section — mobile et desktop */}
              <div className="snd-progress__track">
                {activeScreens.map((sc, i) => {
                  /* Calcul du remplissage du segment courant */
                  let fillPct = 0;
                  if (i < currentScreenIdx) {
                    fillPct = 100;
                  } else if (i === currentScreenIdx) {
                    if (isMobile) {
                      /* mobile : progression question par question dans la section */
                      fillPct = visibleQIds.length > 0
                        ? Math.round(((mobileSubIdx + 1) / visibleQIds.length) * 100)
                        : 0;
                    } else {
                      /* desktop : nombre de questions répondues / total de la section */
                      const reqIds = getRequired(currentScreen, answers, questionnaire, isMobile);
                      const answeredCount = reqIds.filter(qId => {
                        const step = questionnaire.steps.find(s => s.id === qId);
                        if (!step) return false;
                        if (step.type === "text") return !!(answers[qId] || "").trim();
                        if (step.type === "multi") return (answers[qId] || []).length > 0;
                        return !!answers[qId];
                      }).length;
                      fillPct = reqIds.length > 0
                        ? Math.round((answeredCount / reqIds.length) * 100)
                        : 0;
                    }
                  }
                  return (
                    <div key={sc.id} className="snd-progress__seg">
                      <div
                        className="snd-progress__seg-fill"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <span className="snd-progress__lbl">
                {isMobile
                  ? `${currentScreen.label} · ${mobileSubIdx + 1}/${visibleQIds.length}`
                  : `Section ${currentScreenIdx + 1} / ${activeScreens.length}`}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isMobile ? `${currentScreen.id}-${mobileSubIdx}` : currentScreen.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* En-tête section */}
                <div className="snd-section-head">
                  {SectionIcon && <SectionIcon size={16} weight="fill" className="snd-section-head__icon" />}
                  <span className="snd-section-head__lbl">{currentScreen.label}</span>
                  <div className="snd-section-head__line" />
                </div>

                {/* Grille de cards */}
                <ScreenGrid
                  screen={currentScreen}
                  visibleQIds={isMobile ? mobileVisibleQIds : visibleQIds}
                  questionnaire={questionnaire}
                  answers={answers}
                  onChange={handleChange}
                  isMobile={isMobile}
                />

                {/* Navigation */}
                <div className="snd-nav snd-nav--sticky">
                  <div>
                    {(currentScreenIdx > 0 || (isMobile && mobileSubIdx > 0)) && (
                      <button className="snd-nav__back" onClick={handleBack}>
                        <ArrowLeft size={14} weight="bold" />
                        Précédent
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    {submitError && (
                      <p style={{ fontSize: 12, color: "#dc2626", margin: 0 }}>
                        Une erreur est survenue. Vérifiez votre connexion et réessayez.
                      </p>
                    )}
                    {/* Sur mobile : masquer "Question suivante" si choix unique (auto-avancement) */}
                    {(() => {
                      const currentStep = isMobile && questionnaire
                        ? questionnaire.steps.find(s => s.id === visibleQIds[mobileSubIdx])
                        : null;
                      // Vérifie si l'option "autre" est sélectionnée pour cette question
                      const currentVal = currentStep ? answers[currentStep.id] : null;
                      const autreSelected = currentStep && (
                        currentStep.type === "multi"
                          ? (Array.isArray(currentVal) && currentVal.some(v => v === "autre" || v === "other" || v?.toLowerCase().includes("autre")))
                          : (typeof currentVal === "string" && (currentVal === "autre" || currentVal === "other" || currentVal?.toLowerCase().includes("autre")))
                      );
                      const isAutoAdvance = isMobile
                        && currentStep
                        && currentStep.type !== "multi"   // choix multiples → bouton visible
                        && currentStep.type !== "text"     // texte libre → bouton visible
                        && !autreSelected                  // "autre" sélectionné → bouton visible
                        && !(currentStep.endIf?.values?.includes(currentVal)) // endIf déclenché → bouton visible
                        && mobileSubIdx < visibleQIds.length - 1;
                      if (isAutoAdvance) return null;
                      return (
                        <button
                          className="snd-nav__next"
                          onClick={handleNext}
                          disabled={!canProceed || submitting}
                        >
                          {submitting
                            ? "Envoi en cours…"
                            : (isMobile
                                ? !!questionnaire?.steps.find(s => s.id === visibleQIds[mobileSubIdx])?.endIf?.values?.includes(answers[visibleQIds[mobileSubIdx]])
                                : visibleQIds.some(qId => questionnaire?.steps.find(s => s.id === qId)?.endIf?.values?.includes(answers[qId])))
                              ? "Terminer le sondage"
                              : (isMobile
                                  ? (mobileSubIdx < visibleQIds.length - 1
                                      ? "Question suivante"
                                      : currentScreenIdx === activeScreens.length - 1
                                        ? "Envoyer mes réponses"
                                        : "Section suivante")
                                  : currentScreenIdx === activeScreens.length - 1
                                    ? "Envoyer mes réponses"
                                    : "Section suivante")}
                          {!submitting && <ArrowRight size={15} weight="bold" />}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}


      </div>
    </div>
  );
}