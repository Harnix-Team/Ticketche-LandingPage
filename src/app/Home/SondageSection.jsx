"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle, ChartBar, Users,
  Car, Sparkle, MapPin, Star, Money,
  Calendar, Clock, PaperPlaneTilt,
  User, GenderIntersex, Briefcase, SteeringWheel,
  Path, Timer, Warning, Info, Lightbulb, WarningCircle
} from "@phosphor-icons/react";
import { PHONE_NUMBER } from "@/config/constants";

/* ─── Survey Data ─────────────────────────────────────── */
const SURVEY_STEPS = [
  {
    id: "age",
    section: 1,
    question: "Quel est votre âge ?",
    type: "text",
    placeholder: "Ex: 25",
    icon: User,
  },
  {
    id: "sexe",
    section: 1,
    question: "Quel est votre sexe ?",
    type: "single",
    options: [
      { id: "homme", label: "Homme" },
      { id: "femme", label: "Femme" },
      { id: "autre", label: "Autre" },
    ],
    icon: GenderIntersex,
  },
  {
    id: "profession",
    section: 1,
    question: "Quelle est votre profession / activité principale ?",
    type: "text",
    placeholder: "Ex: Étudiant, Commerçant...",
    icon: Briefcase,
  },
  {
    id: "possede_vehicule",
    section: 1,
    question: "Possédez-vous un véhicule personnel ?",
    type: "single",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    icon: Car,
  },
  // SECTION 2: Conducteurs (si oui à question 4)
  {
    id: "places_libres",
    section: 2,
    condition: { field: "possede_vehicule", value: "oui" },
    question: "Combien de places libres pouvez-vous proposer ?",
    type: "single",
    options: [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
      { id: "4_plus", label: "4 ou plus" },
    ],
    icon: SteeringWheel,
  },
  {
    id: "depense_carburant",
    section: 2,
    condition: { field: "possede_vehicule", value: "oui" },
    question: "En moyenne, combien dépensez-vous en carburant pour ce trajet (aller-retour) ?",
    type: "single",
    options: [
      { id: "moins_1000", label: "Moins de 1 000 FCFA" },
      { id: "1000_2000", label: "1 000 – 2 000 FCFA" },
      { id: "2000_3000", label: "2 000 – 3 000 FCFA" },
      { id: "plus_3000", label: "Plus de 3 000 FCFA" },
    ],
    icon: Money,
  },
  {
    id: "pret_remuneration",
    section: 2,
    condition: { field: "possede_vehicule", value: "oui" },
    question: "Seriez-vous prêt(e) à transporter d’autres personnes contre rémunération ?",
    type: "single",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
      { id: "peut_etre", label: "Peut-être" },
    ],
    icon: Money,
  },
  {
    id: "deja_passagers",
    section: 2,
    condition: { field: "possede_vehicule", value: "oui" },
    question: "Sur votre trajet habituel, transportez-vous déjà des passagers ?",
    type: "single",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    icon: Users,
  },
  // SECTION 3: Habitudes (pour tous)
  {
    id: "zone_residence",
    section: 3,
    question: "Quelle est votre zone de résidence ? :",
    type: "single_with_other",
    options: [
      { id: "akassato", label: "Akassato" },
      { id: "abomey_calavi", label: "Abomey-Calavi" },
      { id: "godomey", label: "Godomey" },
      { id: "cotonou_centre", label: "Cotonou centre" },
      { id: "akpakpa", label: "Akpakpa" },
    ],
    icon: MapPin,
  },
  {
    id: "lieu_activite",
    section: 3,
    question: "Lieu principal d’activité (travail/études) :",
    type: "text",
    placeholder: "Votre lieu d'activité",
    icon: Briefcase,
  },
  {
    id: "itineraire",
    section: 3,
    question: "Quel est votre itinéraire habituel (point de départ → destination) ?",
    type: "text",
    placeholder: "Ex: Calavi Kpota -> Etoile Rouge",
    icon: Path,
  },
  {
    id: "frequence_trajet",
    section: 3,
    question: "À quelle fréquence effectuez-vous ce trajet ?",
    type: "single",
    options: [
      { id: "tous_les_jours", label: "Tous les jours" },
      { id: "3_4_semaine", label: "3–4 fois / semaine" },
      { id: "1_2_semaine", label: "1–2 fois / semaine" },
      { id: "occasionnellement", label: "Occasionnellement" },
    ],
    icon: Calendar,
  },
  {
    id: "moyen_transport",
    section: 3,
    question: "Quel(s) moyen(s) de transport utilisez-vous ?",
    type: "multi_with_other",
    options: [
      { id: "zem_tokpa", label: "Zem / Tokpa-tokpa" },
      { id: "bus_collectif", label: "Bus / transport collectif" },
      { id: "taxi", label: "Taxi" },
    ],
    icon: Car,
  },
  {
    id: "heure_depart",
    section: 3,
    question: "Heure habituelle de départ (aller) :",
    type: "single",
    options: [
      { id: "avant_6h", label: "Avant 6h" },
      { id: "6h_8h", label: "6h – 8h" },
      { id: "8h_10h", label: "8h – 10h" },
      { id: "apres_10h", label: "Après 10h" },
    ],
    icon: Clock,
  },
  {
    id: "heure_retour",
    section: 3,
    question: "Heure habituelle de retour :",
    type: "single",
    options: [
      { id: "avant_16h", label: "Avant 16h" },
      { id: "16h_18h", label: "16h – 18h" },
      { id: "18h_20h", label: "18h - 20h" },
      { id: "apres_20h", label: "Après 20h" },
    ],
    icon: Clock,
  },
  {
    id: "duree_trajet",
    section: 3,
    question: "Durée moyenne du trajet :",
    type: "single",
    options: [
      { id: "moins_30min", label: "Moins de 30 min" },
      { id: "30min_1h", label: "30 min – 1h" },
      { id: "1h_2h", label: "1h – 2h" },
      { id: "plus_2h", label: "Plus de 2h" },
    ],
    icon: Timer,
  },
  {
    id: "depense_trajet",
    section: 3,
    question: "Combien dépensez-vous pour un trajet (aller simple) ?",
    type: "single",
    options: [
      { id: "moins_500", label: "Moins de 500 FCFA" },
      { id: "500_1000", label: "500 – 1 000 FCFA" },
      { id: "1000_1500", label: "1 000 – 1 500 FCFA" },
      { id: "plus_1500", label: "Plus de 1 500 FCFA" },
    ],
    icon: Money,
  },
  // SECTION 4: Difficultés
  {
    id: "difficultes_deplacement",
    section: 4,
    question: "Rencontrez-vous des difficultés dans vos déplacements ?",
    type: "single",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    icon: Warning,
  },
  {
    id: "quelles_difficultes",
    section: 4,
    condition: { field: "difficultes_deplacement", value: "oui" },
    question: "Si oui, lesquelles ?",
    type: "multi_with_other",
    options: [
      { id: "retards", label: "Retards fréquents" },
      { id: "cout_eleve", label: "Coût élevé" },
      { id: "trop_arrets", label: "Trop d’arrêts" },
      { id: "confort_insuffisant", label: "Confort insuffisant" },
      { id: "securite", label: "Problèmes de sécurité" },
    ],
    icon: WarningCircle,
  },
  // SECTION 5: Ticketche
  {
    id: "interet_solution",
    section: 5,
    info: "Ticketche est une solution qui permet de partager un trajet ou de réserver une place dans un transport organisé via une application, afin de faciliter les déplacements.",
    question: "Seriez-vous intéressé(e) par cette solution ?",
    type: "single",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
      { id: "peut_etre", label: "Peut-être" },
    ],
    icon: Info,
  },
  {
    id: "mode_interet",
    section: 5,
    question: "Quel mode vous intéresse le plus ?",
    type: "single",
    options: [
      { id: "covoiturage", label: "Covoiturage" },
      { id: "transport_organise", label: "Transport organisé avec réservation" },
      { id: "les_deux", label: "Les deux" },
    ],
    icon: Sparkle,
  },
  {
    id: "role_covoiturage",
    section: 5,
    condition: { field: "mode_interet", values: ["covoiturage", "les_deux"] },
    question: "Si covoiturage : vous seriez plutôt ?",
    type: "single",
    options: [
      { id: "passager", label: "Passager" },
      { id: "conducteur", label: "Conducteur" },
      { id: "les_deux", label: "Les deux" },
    ],
    icon: Users,
  },
  {
    id: "pret_reserver",
    section: 5,
    question: "Seriez-vous prêt(e) à réserver votre transport à l’avance via une application ?",
    type: "single",
    options: [
      { id: "oui", label: "Oui" },
      { id: "non", label: "Non" },
    ],
    icon: PaperPlaneTilt,
  },
  // SECTION 6: Attentes
  {
    id: "fonctionnalites_attendues",
    section: 6,
    question: "Quelles fonctionnalités attendez-vous ?",
    type: "multi_with_other",
    options: [
      { id: "reservation_facile", label: "Réservation facile" },
      { id: "paiement_en_ligne", label: "Paiement en ligne" },
      { id: "notifications", label: "Notifications des horaires" },
      { id: "carte_arrets", label: "Carte des arrêts" },
    ],
    icon: Lightbulb,
  },
  // SECTION 7: Prix
  {
    id: "pret_payer_type",
    section: 7,
    question: "Seriez-vous prêt(e) à payer pour un transport :",
    type: "single",
    options: [
      { id: "moins_cher", label: "Moins cher que votre transport actuel" },
      { id: "meme_prix_confort", label: "Au même prix mais plus confortable" },
      { id: "plus_cher_rapidite", label: "Un peu plus cher pour plus de rapidité" },
    ],
    icon: Money,
  },
  {
    id: "prix_ticketche",
    section: 7,
    question: "Pour ce même trajet, combien seriez-vous prêt(e) à payer en utilisant Ticketche (trajet simple) ?",
    type: "single",
    options: [
      { id: "moins_500", label: "Moins de 500 FCFA" },
      { id: "500_1000", label: "500 – 1 000 FCFA" },
      { id: "1000_1500", label: "1 000 – 1 500 FCFA" },
      { id: "plus_1500", label: "Plus de 1 500 FCFA" },
    ],
    icon: Money,
  },
  // SECTION 8: Perception
  {
    id: "avantages_percus",
    section: 8,
    question: "Quels avantages voyez-vous ?",
    type: "multi_with_other",
    options: [
      { id: "reduction_couts", label: "Réduction des coûts" },
      { id: "gain_temps", label: "Gain de temps" },
      { id: "plus_confort", label: "Plus de confort" },
      { id: "moins_embouteillages", label: "Moins d’embouteillages / pollution" },
    ],
    icon: Sparkle,
  },
  {
    id: "obstacles_percus",
    section: 8,
    question: "Quels obstacles voyez-vous ?",
    type: "multi_with_other",
    options: [
      { id: "insecurite", label: "Insécurité" },
      { id: "manque_confiance", label: "Manque de confiance" },
      { id: "difficulte_utilisation", label: "Difficulté d’utilisation" },
      { id: "prix_eleve", label: "Prix trop élevé" },
      { id: "zones_non_couvertes", label: "Zones non couvertes" },
    ],
    icon: Warning,
  },
  // SECTION 9: Suggestions
  {
    id: "suggestions",
    section: 9,
    question: "Suggestions ou remarques :",
    type: "textarea",
    placeholder: "Vos suggestions ici...",
    icon: Lightbulb,
  },
];

/* ─── Label helpers ─────────────────────────────────────── */
const STEP_LABELS = SURVEY_STEPS.reduce((acc, step) => {
  acc[step.id] = step.question;
  return acc;
}, {});

/* ─── WhatsApp sender ───────────────────────────────────── */
function buildWhatsAppMessage(answers) {
  const lines = ["*Sondage Ticketche — Amélioration du transport*\n"];
  
  SURVEY_STEPS.forEach(step => {
    const val = answers[step.id];
    if (val !== undefined && val !== null && val !== "") {
      let displayVal = "";
      if (step.type === "single" || step.type === "single_with_other") {
        const opt = step.options?.find(o => o.id === val);
        displayVal = opt ? opt.label : val;
      } else if (step.type === "multi" || step.type === "multi_with_other") {
        displayVal = Array.isArray(val) ? val.map(v => {
          const opt = step.options?.find(o => o.id === v);
          return opt ? opt.label : v;
        }).join(", ") : val;
      } else {
        displayVal = val;
      }
      lines.push(`*${step.question}* : ${displayVal}`);
    }
  });
  
  lines.push("\n_Réponse envoyée depuis ticketche.com_");
  return lines.join("\n");
}

/* ─── Progress Bar ─────────────────────── */
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold text-[#7aaeb4] tracking-[0.08em] uppercase">
          Question {current + 1} / {total}
        </span>
        <span className="text-[11px] font-extrabold text-[#005f69]">{pct}%</span>
      </div>
      <div className="rounded-full h-[5px] overflow-hidden bg-[rgba(0,95,105,0.1)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#005f69] to-[#00b0bf]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─── Option Card ──────────────────────────────────────── */
function OptionCard({ option, selected, onClick }) {
  const isSelected = Array.isArray(selected)
    ? selected.includes(option.id)
    : selected === option.id;

  return (
    <motion.button
      onClick={() => onClick(option.id)}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className={[
        "flex items-center gap-3.5 px-4 py-[13px] rounded-2xl w-full text-left cursor-pointer",
        "backdrop-blur-sm transition-all duration-200",
        isSelected
          ? "border-[1.5px] border-[#005f69] bg-[rgba(0,95,105,0.08)] shadow-[0_0_0_3px_rgba(0,95,105,0.12),0_4px_16px_rgba(0,95,105,0.10)]"
          : "border-[1.5px] border-[rgba(0,95,105,0.13)] bg-white/60 shadow-[0_2px_8px_rgba(0,95,105,0.05)]",
      ].join(" ")}
    >
      <div className="flex-1">
        <div className="text-[13px] font-bold text-[#1f2937]">{option.label}</div>
      </div>

      <div
        className={[
          "w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all duration-200",
          isSelected
            ? "border-2 border-[#005f69] bg-[#005f69]"
            : "border-2 border-[rgba(0,95,105,0.2)] bg-transparent",
        ].join(" ")}
      >
        {isSelected && <CheckCircle size={14} weight="fill" className="text-white" />}
      </div>
    </motion.button>
  );
}

/* ─── Floating Blobs ──────── */
function Blobs() {
  return (
    <>
      <div
        className="absolute -top-[60px] -right-[60px] w-[320px] h-[320px] rounded-full pointer-events-none blur-[40px]"
        style={{ background: "radial-gradient(circle, rgba(0,176,191,0.13) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 -left-[80px] w-[280px] h-[280px] rounded-full pointer-events-none blur-[50px]"
        style={{ background: "radial-gradient(circle, rgba(0,95,105,0.10) 0%, transparent 70%)" }}
      />
    </>
  );
}

/* ─── Étoiles flottantes ─────────── */
const STARS = [
  { top: "8%",  left: "4%",  size: 14, opacity: 0.18, delay: 0 },
  { top: "15%", left: "92%", size: 10, opacity: 0.13, delay: 0.8 },
  { top: "32%", left: "88%", size: 18, opacity: 0.20, delay: 1.4 },
  { top: "55%", left: "96%", size: 9,  opacity: 0.12, delay: 0.3 },
  { top: "72%", left: "3%",  size: 16, opacity: 0.16, delay: 1.1 },
  { top: "85%", left: "90%", size: 11, opacity: 0.14, delay: 0.6 },
];

function FloatingStars() {
  return (
    <>
      {STARS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: s.top, left: s.left }}
          animate={{ y: [0, -8, 0], opacity: [s.opacity, s.opacity * 1.6, s.opacity] }}
          transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <Star size={s.size} weight="fill" style={{ color: `rgba(0,95,105,${s.opacity * 2})` }} />
        </motion.div>
      ))}
    </>
  );
}

/* ─── Bouton principal animé ─────────── */
function PrimaryButton({ onClick, disabled, isLastStep }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      animate={disabled ? {} : { scale: [1, 1.03, 1] }}
      transition={disabled ? {} : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      whileHover={disabled ? {} : { scale: 1.06, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      className={[
        "flex items-center gap-2 px-[26px] py-3 rounded-full",
        "bg-gradient-to-br from-[#005f69] to-[#007d88] text-white",
        "text-[13.5px] font-extrabold border-none cursor-pointer tracking-[0.02em]",
        disabled ? "opacity-50 cursor-not-allowed" : "shadow-[0_4px_20px_rgba(0,95,105,0.35)]",
        "max-sm:w-full max-sm:justify-center",
      ].join(" ")}
    >
      {isLastStep ? (
        <>
          <PaperPlaneTilt size={14} weight="bold" />
          Envoyer
        </>
      ) : (
        <>
          Suivant
          <ArrowRight size={14} weight="bold" />
        </>
      )}
    </motion.button>
  );
}

/* ─── Main Survey Component ─────────────────────────────── */
export default function SondageSection() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [otherValues, setOtherValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  const getActiveSteps = () => {
    return SURVEY_STEPS.filter((s) => {
      if (!s.condition) return true;
      const conditionVal = answers[s.condition.field];
      if (s.condition.values) {
        return s.condition.values.includes(conditionVal);
      }
      return conditionVal === s.condition.value;
    });
  };

  const activeSteps = getActiveSteps();
  const step = activeSteps[currentStepIndex];

  const resetSurvey = () => {
    setSubmitted(false);
    setCurrentStepIndex(0);
    setAnswers({});
    setOtherValues({});
    setRating(0);
  };

  // Détection du retour sur la page pour réinitialiser le sondage
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && submitted) {
        // On attend un court instant pour laisser l'utilisateur voir le message de succès avant de reset
        const timer = setTimeout(() => {
          resetSurvey();
        }, 5000); // Délai de 5 secondes avant réinitialisation automatique
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [submitted]);

  const handleOption = (optId) => {
    if (step.type.startsWith("multi")) {
      setAnswers((prev) => {
        let cur = prev[step.id] || [];
        
        // Si on clique sur une option normale alors que "autre" est coché
        if (optId !== "autre" && cur.includes("autre")) {
          cur = cur.filter(v => v !== "autre");
        }
        // Si on clique sur "autre" alors que d'autres options sont cochées
        else if (optId === "autre" && cur.length > 0) {
          cur = [];
        }

        return {
          ...prev,
          [step.id]: cur.includes(optId)
            ? cur.filter((v) => v !== optId)
            : [...cur, optId],
        };
      });
    } else {
      // Pour les types "single", le changement est déjà automatique par l'écrasement de la valeur
      setAnswers((prev) => ({ ...prev, [step.id]: optId }));
    }
  };

  const handleTextChange = (e) => {
    setAnswers((prev) => ({ ...prev, [step.id]: e.target.value }));
  };

  const handleOtherChange = (e) => {
    setOtherValues((prev) => ({ ...prev, [step.id]: e.target.value }));
  };

  const canProceed = () => {
    const val = answers[step.id];
    if (step.type === "text" || step.type === "textarea") {
      return !!val && val.trim().length > 0;
    }
    if (step.type.startsWith("multi")) {
      const hasOptions = (val || []).length > 0;
      if (step.type === "multi_with_other" && val?.includes("autre")) {
        return !!otherValues[step.id] && otherValues[step.id].trim().length > 0;
      }
      return hasOptions;
    }
    if (step.type === "single_with_other" && val === "autre") {
      return !!otherValues[step.id] && otherValues[step.id].trim().length > 0;
    }
    return !!val;
  };

  const isLastStep = currentStepIndex === activeSteps.length - 1;

  const handleNext = () => {
    // Finalize "other" values if needed
    let finalAnswers = { ...answers };
    if (step.type.endsWith("_with_other")) {
      const val = answers[step.id];
      const otherVal = otherValues[step.id];
      if (step.type === "single_with_other" && val === "autre") {
        finalAnswers[step.id] = otherVal;
      } else if (step.type === "multi_with_other" && val?.includes("autre")) {
        finalAnswers[step.id] = val.map(v => v === "autre" ? otherVal : v);
      }
    }

    if (!isLastStep) {
      setCurrentStepIndex((p) => p + 1);
    } else {
      const msg = buildWhatsAppMessage(finalAnswers);
      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/${PHONE_NUMBER.replace(/[^0-9]/g, '')}?text=${encoded}`, "_blank");
      setSubmitted(true);
    }
  };

  const handleSkip = () => {
    if (!isLastStep) setCurrentStepIndex((p) => p + 1);
    else handleNext();
  };

  const Icon = step?.icon || Info;

  return (
    <section
      id="sondage"
      className="relative overflow-hidden py-24 px-6 max-sm:py-16 max-sm:px-4"
      style={{
        fontFamily: "'Archivo', sans-serif",
        background: "linear-gradient(160deg, #e8f4f5 0%, #f4fbfc 40%, #eef7f5 100%)",
      }}
    >
      <FloatingStars />
      <Blobs />

      <div className="max-w-[660px] mx-auto relative z-[2]">
        <div className="inline-flex items-center gap-[7px] bg-[rgba(0,95,105,0.1)] border border-[rgba(0,95,105,0.2)] text-[#005f69] px-[14px] py-[5px] rounded-full text-[10.5px] font-extrabold tracking-[0.12em] uppercase mb-[18px]">
          <ChartBar size={11} weight="fill" />
          Sondage Amélioration Transport
        </div>

        <h2
          className="font-black text-[#0d1f21] leading-[1.15] tracking-[-0.025em] mb-3"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}
        >
          Votre avis compte pour<br />
          <span className="text-[#005f69]">améliorer vos trajets</span>
        </h2>

        <p className="text-[14.5px] text-[#4d7a80] leading-[1.75] mb-11 max-w-[520px]">
          Nous réalisons cette étude pour recueillir vos besoins et les prendre en compte. 
          Cela ne vous prendra que quelques minutes.
        </p>

        <div
          className={[
            "relative rounded-3xl max-sm:rounded-[18px] overflow-hidden",
            "px-8 py-9 max-sm:px-[18px] max-sm:py-6",
            "border-[1.5px] border-white/[0.85]",
            "backdrop-blur-[20px] backdrop-saturate-[180%] bg-white/[.72]",
            "shadow-[0_8px_32px_rgba(0,95,105,0.09),0_1px_0_rgba(255,255,255,0.9)_inset,0_-1px_0_rgba(0,95,105,0.05)_inset]",
          ].join(" ")}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-transparent via-[#005f69] to-[#00b0bf]" />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center pt-11 pb-9 px-5"
              >
                <div className="w-20 h-20 mx-auto mb-[22px] rounded-full bg-gradient-to-br from-[#005f69] to-[#00b0bf] flex items-center justify-center shadow-[0_8px_28px_rgba(0,95,105,0.35)]">
                  <CheckCircle size={38} weight="fill" className="text-white" />
                </div>
                <h3 className="text-[1.35rem] font-black text-[#0d1f21] mb-[10px] tracking-[-0.02em]">
                  Merci pour votre participation !
                </h3>
                <p className="text-[14px] text-[#4d7a80] leading-[1.7]">
                  Vos réponses ont été transmises. Vos retours nous sont précieux pour bâtir Ticketche.
                </p>

                <div className="flex gap-2 justify-center my-[22px]">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className="bg-transparent border-none p-0 cursor-pointer transition-transform duration-150 hover:scale-[1.3]"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverStar(n)}
                      onMouseLeave={() => setHoverStar(0)}
                    >
                      <Star
                        size={30}
                        weight={n <= (hoverStar || rating) ? "fill" : "regular"}
                        className="transition-colors duration-[120ms]"
                        style={{ color: n <= (hoverStar || rating) ? "#005f69" : "#c4d9db" }}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <ProgressBar current={currentStepIndex} total={activeSteps.length} />

                {step.info && (
                  <div className="mb-4 p-3 bg-[rgba(0,95,105,0.05)] border-l-4 border-[#005f69] rounded-r-lg text-[13px] text-[#4d7a80] leading-relaxed">
                    {step.info}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(0,95,105,0.1)] flex items-center justify-center">
                    <Icon size={20} weight="fill" className="text-[#005f69]" />
                  </div>
                  <div
                    className="font-extrabold text-[#0d1f21] leading-[1.45]"
                    style={{ fontSize: "clamp(1rem, 2.4vw, 1.12rem)" }}
                  >
                    {step.question}
                  </div>
                </div>

                {step.type.startsWith("multi") && (
                  <div className="text-[11.5px] text-[#9ab8bc] mb-[18px] italic">
                    Vous pouvez sélectionner plusieurs réponses.
                  </div>
                )}

                <div className="flex flex-col gap-[9px]">
                  {step.options?.map((opt) => (
                    <OptionCard
                      key={opt.id}
                      option={opt}
                      selected={answers[step.id] || (step.type.startsWith("multi") ? [] : null)}
                      onClick={handleOption}
                    />
                  ))}

                  {step.type.endsWith("_with_other") && (
                    <div className="mt-2">
                      <OptionCard
                        option={{ id: "autre", label: "Autre" }}
                        selected={answers[step.id] || (step.type.startsWith("multi") ? [] : null)}
                        onClick={handleOption}
                      />
                      {(step.type === "single_with_other" ? answers[step.id] === "autre" : answers[step.id]?.includes("autre")) && (
                        <motion.input
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          type="text"
                          placeholder="Précisez ici..."
                          value={otherValues[step.id] || ""}
                          onChange={handleOtherChange}
                          className="mt-2 w-full px-4 py-3 rounded-xl border-[1.5px] border-[rgba(0,95,105,0.2)] focus:border-[#005f69] outline-none text-[13px] bg-white/50"
                        />
                      )}
                    </div>
                  )}

                  {step.type === "text" && (
                    <input
                      type="text"
                      placeholder={step.placeholder}
                      value={answers[step.id] || ""}
                      onChange={handleTextChange}
                      className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[rgba(0,95,105,0.2)] focus:border-[#005f69] outline-none text-[13px] bg-white/50"
                    />
                  )}

                  {step.type === "textarea" && (
                    <textarea
                      placeholder={step.placeholder}
                      value={answers[step.id] || ""}
                      onChange={handleTextChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[rgba(0,95,105,0.2)] focus:border-[#005f69] outline-none text-[13px] bg-white/50 resize-none"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between mt-7 gap-3 flex-wrap max-sm:flex-col-reverse max-sm:items-stretch">
                  <button
                    className="text-[12px] text-[#9ab8bc] cursor-pointer bg-transparent border-none transition-colors duration-150 hover:text-[#7aaeb4]"
                    onClick={handleSkip}
                  >
                    Passer
                  </button>

                  <PrimaryButton
                    onClick={handleNext}
                    disabled={!canProceed()}
                    isLastStep={isLastStep}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 justify-center flex-wrap mt-9">
          {[
            { Icon: Users, label: "100% anonyme" },
            { Icon: Clock, label: "Rapide" },
            { Icon: Info, label: "Vos besoins comptent" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-[7px] bg-white/70 backdrop-blur-[10px] border border-[rgba(0,95,105,0.14)] rounded-full px-4 py-2 text-[12px] font-bold text-[#005f69] shadow-[0_2px_8px_rgba(0,95,105,0.07)]"
            >
              <Icon size={13} weight="fill" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
