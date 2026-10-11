"use client";

import {
  ArrowLeft, ArrowRight, Car, ChartColumn, Check, CircleCheck, CreditCard, MessageSquareText,
  Repeat, Route, Share2, Sparkles, TriangleAlert, User,
} from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchQuestionnaireBySlug, submitQuestionnaireAnswers } from "@/app/services/questionnairesApi";
import { FormShell, LoadingState, Notice, StatePanel, WRAP_BUTTON } from "@/components/survey/Panels";
import { QuestionField, hasAnswer, isOtherOption } from "@/components/survey/QuestionField";
import { StarRating } from "@/components/survey/StarRating";
import { StepTransition } from "@/components/survey/StepTransition";
import { SurveyProgress } from "@/components/survey/SurveyProgress";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

const SURVEY_SLUG = "transport-covoiturage-2026";
const STORAGE_KEY = "ticketche_sondage_progress_v4";
const DONE_KEY = "ticketche_sondage_done";

const SHARE_URL = `https://wa.me/?text=${encodeURIComponent(
  "Ticketché prépare un service de bus et de covoiturage sur Cotonou ↔ Abomey-Calavi. " +
    "Donnez votre avis en 3 min : https://ticketche.com/sondage"
)}`;

const SECTION_ICONS = {
  s1: User,
  s2: Car,
  s3: Route,
  s4: Repeat,
  s5: TriangleAlert,
  s6: Sparkles,
  s7: CreditCard,
  s8: MessageSquareText,
};

const SCREENS = [
  { id: "s1", label: "Profil", questions: ["q1_age", "q2_sexe", "q3_profession", "q4_vehicule"] },
  {
    id: "s2", label: "Conducteur",
    questions: ["q5_type_vehicule", "q6_places", "q7_carburant", "q8_passagers", "q8b_app"],
    showIf: { questionId: "q4_vehicule", values: ["oui"] },
  },
  { id: "s3", label: "Trajet", questions: ["q9_residence", "q10_lieu_activite", "q11_itineraire"] },
  {
    id: "s4", label: "Habitudes",
    questions: ["q12_frequence", "q13_transport", "q14_depart", "q15_retour", "q16_duree", "q17_cout"],
  },
  { id: "s5", label: "Difficultés", questions: ["q18_difficultes", "q19_type_difficultes"] },
  {
    id: "s6", label: "Ticketché",
    questions: ["q20_interet", "q21_service", "q22a_reservation_bus", "q22_role", "q23_reservation"],
  },
  {
    id: "s7", label: "Paiement",
    questions: ["q24_mobile_money", "q25_smartphone", "q26_paiement_app", "q27_prix", "q28_abonnement", "q28b_prix_abo"],
    showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
  },
  { id: "s8", label: "Perception", questions: ["q29_avantages", "q30_obstacles", "q31_suggestions"] },
];

/* Conditions de visibilité : la question n'apparaît que si la réponse à `dep` est dans `vals`. */
const CONDS = {
  q5_type_vehicule: { dep: "q4_vehicule", vals: ["oui"] },
  q6_places: { dep: "q4_vehicule", vals: ["oui"] },
  q7_carburant: { dep: "q4_vehicule", vals: ["oui"] },
  q8_passagers: { dep: "q4_vehicule", vals: ["oui"] },
  q8b_app: { dep: "q4_vehicule", vals: ["oui"] },
  q13_transport: { dep: "q4_vehicule", vals: ["non"] },
  q17_cout: { dep: "q4_vehicule", vals: ["non"] },
  q19_type_difficultes: { dep: "q18_difficultes", vals: ["oui"] },
  q22a_reservation_bus: { dep: "q21_service", vals: ["bus"] },
  q22_role: { dep: "q21_service", vals: ["covoiturage", "les_deux"] },
  q23_reservation: { dep: "q22_role", vals: ["passager", "les_deux"] },
  q24_mobile_money: { dep: "q22_role", vals: ["passager", "les_deux"] },
  q25_smartphone: { dep: "q22_role", vals: ["passager", "les_deux"] },
  q26_paiement_app: { dep: "q22_role", vals: ["passager", "les_deux"] },
  q27_prix: { dep: "q22_role", vals: ["passager", "les_deux"] },
  q28_abonnement: { dep: "q22_role", vals: ["passager", "les_deux"] },
  q28b_prix_abo: { dep: "q28_abonnement", vals: ["oui", "peut_etre"] },
};

const COPY = {
  textPlaceholder: "Votre réponse…",
  multiMax: (max) => `Max ${max} choix`,
  multiAny: "Réponses multiples",
  reasonPlaceholder: "Votre réponse (optionnel)…",
  other: { label: "Précisez votre réponse :", placeholder: "Écrivez votre réponse ici…", autoFocus: true },
};

const STATS = [
  { value: "51 000", label: "étudiants concernés" },
  { value: "0", label: "bus organisé aujourd'hui" },
  { value: "Votre avis", label: "change ça" },
];

function isVisible(qId, answers) {
  if (!CONDS[qId]) return true;
  const { dep, vals } = CONDS[qId];
  // Une question dont la question parente est masquée l'est aussi.
  if (!isVisible(dep, answers)) return false;
  const given = answers[dep];
  const arr = Array.isArray(given) ? given : given ? [given] : [];
  return arr.some((v) => vals.includes(v));
}

function getActiveScreens(answers) {
  return SCREENS.filter((sc) => {
    if (!sc.showIf) return true;
    const { questionId, values } = sc.showIf;
    if (!isVisible(questionId, answers)) return false;
    const given = answers[questionId];
    const arr = Array.isArray(given) ? given : given ? [given] : [];
    return arr.some((v) => values.includes(v));
  });
}

// Sur grand écran, la section 6 n'affiche que Q20 tant que la réponse n'est ni « oui » ni « peut-être ».
function isHeldBack(screen, qId, answers, isMobile) {
  if (isMobile || screen.id !== "s6" || qId === "q20_interet") return false;
  const q20 = answers["q20_interet"];
  return q20 !== "oui" && q20 !== "peut_etre";
}

function getRequired(screen, answers, questionnaire, isMobile) {
  if (!screen || !questionnaire) return [];
  return screen.questions.filter((qId) => {
    if (!isVisible(qId, answers)) return false;
    if (isHeldBack(screen, qId, answers, isMobile)) return false;
    const step = questionnaire.steps.find((s) => s.id === qId);
    if (!step || step.optional) return false;
    return true;
  });
}

function resolveSourceTag(s, m) {
  if (s === "terrain" && m === "qrcode") return "qrcode_terrain";
  if (s === "whatsapp" && m === "social") return "whatsapp_uac";
  if (s === "gdiz" && m === "interne") return "gdiz_interne";
  if (s === "site" && m === "bandeau") return "bandeau_site";
  if (s === "site" && m === "popup") return "popup_site";
  return "organic";
}

function resolveLibreCanal(m) {
  if (m === "qrcode") return "libre_qrcode";
  if (m === "social") return "libre_whatsapp";
  return "libre_web";
}

function SuccessScreen() {
  const [rating, setRating] = useState(0);

  return (
    <StatePanel icon={CircleCheck} title="Merci ! Vos réponses ont été enregistrées.">
      <div className="w-full">
        <StarRating
          legend="Comment évaluez-vous ce questionnaire ?"
          legendClassName="tk-label mb-2 w-full text-center text-[0.9375rem] text-ink"
          value={rating}
          onChange={setRating}
        />
        <p aria-live="polite" className="tk-label mt-1 min-h-6 text-[0.875rem] text-brand">
          {rating > 0 && "Merci pour votre note !"}
        </p>
      </div>

      <Button href="/download" variant="gold" size="lg" className="w-full">
        Téléchargez Ticketché
        <ArrowRight className="size-5" aria-hidden />
      </Button>
      <Button href={SHARE_URL} variant="outline" className={`w-full ${WRAP_BUTTON}`}>
        <Share2 className="size-4 shrink-0" aria-hidden />
        Partagez ce sondage à vos proches
      </Button>
    </StatePanel>
  );
}

function ResumeCard({ screens, currentIdx, onResume, onRestart }) {
  return (
    <section className="rounded-panel border border-line bg-surface p-5 sm:p-7">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-media bg-brand-soft text-brand">
          <ChartColumn className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="tk-title text-[1.375rem]">Sondage en cours</h1>
          <p className="mt-0.5 text-[0.9375rem] text-ink-2">
            Vous vous étiez arrêté(e) ici : <span className="tk-label text-ink">{screens[currentIdx]?.label || "En cours"}</span>
          </p>
        </div>
      </div>

      <SurveyProgress
        className="mt-5"
        segments={screens.map((sc, i) => ({ id: sc.id, fill: i < currentIdx ? 100 : 0, current: i === currentIdx }))}
        label={`Progression : ${currentIdx} / ${screens.length} sections`}
      />

      <ol className="mt-4 flex flex-wrap gap-2">
        {screens.map((sc, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          const Icon = done ? Check : SECTION_ICONS[sc.id];
          const state = done
            ? "border-transparent bg-brand-soft text-brand"
            : current
              ? "border-brand bg-surface text-ink"
              : "border-transparent bg-sunken text-ink-2";

          return (
            <li
              key={sc.id}
              aria-current={current ? "step" : undefined}
              className={`tk-label flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8125rem] ${state}`}
            >
              {Icon && <Icon className="size-3.5" aria-hidden />}
              {sc.label}
              {done && <span className="sr-only"> (terminée)</span>}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-2">
        <Button onClick={onResume} className="w-full">
          Reprendre le sondage
          <ArrowRight className="size-4" aria-hidden />
        </Button>
        <Button variant="ghost" onClick={onRestart} className={`w-full ${WRAP_BUTTON}`}>
          Recommencer depuis le début
        </Button>
      </div>
    </section>
  );
}

export default function SondageClient() {
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source") || "organic";
  const utmMedium = searchParams.get("utm_medium") || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;
  const sourceTag = resolveSourceTag(utmSource, utmMedium);
  const libreCanal = resolveLibreCanal(utmMedium);

  // Depuis le bandeau ou la fenêtre du site, le sondage démarre sans passer par la page d'accueil.
  const autoStart = utmMedium === "bandeau" || utmMedium === "popup";

  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [commune, setCommune] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Sur téléphone, une seule question à la fois.
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSubIdx, setMobileSubIdx] = useState(0);

  // Le minuteur d'avancement automatique lit ces valeurs après coup : il lui faut les plus récentes.
  const mobileSubIdxRef = useRef(0);
  const currentScreenIdxRef = useRef(0);
  const answersRef = useRef({});
  const autoAdvanceTimer = useRef(null);

  const formZoneRef = useRef(null);

  const scrollToForm = useCallback(() => {
    formZoneRef.current?.scrollIntoView({ block: "start" });
  }, []);

  useEffect(() => {
    fetchQuestionnaireBySlug(SURVEY_SLUG)
      .then(setQuestionnaire)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeScreens = questionnaire ? getActiveScreens(answers) : [];
  const currentScreen = activeScreens[currentScreenIdx];

  const visibleQIds = currentScreen && questionnaire
    ? currentScreen.questions.filter((qId) => isVisible(qId, answers) && !isHeldBack(currentScreen, qId, answers, isMobile))
    : [];

  // La liste des questions visibles peut raccourcir quand une réponse change.
  useEffect(() => {
    if (!isMobile) return;
    setMobileSubIdx((prev) => {
      const max = Math.max(0, visibleQIds.length - 1);
      const next = prev > max ? max : prev;
      mobileSubIdxRef.current = next;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreenIdx, answers, isMobile]);

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

    // Avec une progression enregistrée, on propose de reprendre ou de recommencer au lieu de démarrer d'office.
    if (autoStart && !hasSaved) setShowForm(true);
  }, [questionnaire, autoStart]);

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

  const shownQIds = isMobile ? [visibleQIds[mobileSubIdx]].filter(Boolean) : visibleQIds;

  const mobileStep = isMobile && questionnaire
    ? questionnaire.steps.find((s) => s.id === visibleQIds[mobileSubIdx])
    : null;
  const mobileValue = mobileStep ? answers[mobileStep.id] : null;

  const canProceed = currentScreen && questionnaire
    ? (isMobile
        ? !mobileStep || mobileStep.optional || hasAnswer(mobileStep, answers)
        : getRequired(currentScreen, answers, questionnaire, isMobile).every((qId) => {
            const step = questionnaire.steps.find((s) => s.id === qId);
            return !step || hasAnswer(step, answers);
          }))
    : false;

  // Une réponse qui met fin au sondage (ex. Q20 = « non ») transforme le bouton en envoi.
  const endsSurvey = isMobile
    ? !!mobileStep?.endIf?.values?.includes(mobileValue)
    : visibleQIds.some((qId) => questionnaire?.steps.find((s) => s.id === qId)?.endIf?.values?.includes(answers[qId]));

  const handleChange = useCallback((qId, value) => {
    setAnswers((prev) => {
      const updated = { ...prev, [qId]: value };
      answersRef.current = updated;
      saveProgress(updated, currentScreenIdxRef.current, commune, mobileSubIdxRef.current);
      return updated;
    });

    /* Avancement automatique sur téléphone, pour les choix uniques seulement. */
    if (!isMobile) return;
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    if (qId.endsWith("_autre") || qId.endsWith("_reason")) return;
    const step = questionnaire?.steps.find((s) => s.id === qId);
    if (!step) return;
    if (step.type === "multi" || step.type === "text") return;
    if (typeof value === "string" && isOtherOption(value)) return;
    if (step.endIf?.values?.includes(value)) return;

    // Court délai : le temps de voir sa sélection avant de passer à la suite.
    autoAdvanceTimer.current = setTimeout(() => {
      const subIdx = mobileSubIdxRef.current;
      const scrIdx = currentScreenIdxRef.current;
      const currAnswers = { ...answersRef.current, [qId]: value };
      const activeScrs = getActiveScreens(currAnswers);
      const screen = activeScrs[scrIdx];
      if (!screen) return;
      const currentVisibleQIds = screen.questions.filter((q) => isVisible(q, currAnswers));

      if (subIdx < currentVisibleQIds.length - 1) {
        const next = subIdx + 1;
        mobileSubIdxRef.current = next;
        setMobileSubIdx(next);
        scrollToForm();
      } else {
        // À la dernière section, pas d'envoi automatique : c'est à la personne de valider.
        const nextScrIdx = scrIdx + 1;
        if (nextScrIdx < activeScrs.length) {
          mobileSubIdxRef.current = 0;
          currentScreenIdxRef.current = nextScrIdx;
          setMobileSubIdx(0);
          setCurrentScreenIdx(nextScrIdx);
          saveProgress(currAnswers, nextScrIdx, commune, 0);
          scrollToForm();
        }
      }
    }, 380);
  }, [isMobile, questionnaire, commune, saveProgress, scrollToForm]);

  const handleSubmit = async () => {
    setSubmitError(false);
    setSubmitting(true);

    // On n'envoie que les réponses des questions encore visibles, avec leurs champs _autre et _reason :
    // une réponse devenue orpheline après un changement de Q4 ne doit pas partir.
    const allAnswers = { ...answers };
    const visibleIds = new Set(
      questionnaire.steps
        .filter((step) => isVisible(step.id, allAnswers))
        .map((step) => step.id)
    );
    const cleanAnswers = Object.fromEntries(
      Object.entries(allAnswers).filter(([key]) => {
        if (key.endsWith("_autre") || key.endsWith("_reason")) {
          const parentId = key.replace(/_autre$/, "").replace(/_reason$/, "");
          return visibleIds.has(parentId);
        }
        return visibleIds.has(key);
      })
    );

    // Le backend attend la réservation du parcours « bus » dans q23_reservation.
    if (cleanAnswers.q22a_reservation_bus && !cleanAnswers.q23_reservation) {
      cleanAnswers.q23_reservation = cleanAnswers.q22a_reservation_bus;
    }
    delete cleanAnswers.q22a_reservation_bus;

    // Le backend attend « gt1000 » pour la dernière tranche de Q17.
    if (cleanAnswers.q17_cout === "autre_cout") {
      cleanAnswers.q17_cout = "gt1000";
    }

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
      await submitQuestionnaireAnswers(questionnaire.slug || questionnaire.id, cleanAnswers, metadata);
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

  const handleNext = () => {
    if (endsSurvey) {
      handleSubmit();
      return;
    }

    if (isMobile && mobileSubIdx < visibleQIds.length - 1) {
      setMobileSubIdx(mobileSubIdx + 1);
      scrollToForm();
      return;
    }

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
    if (isMobile && mobileSubIdx > 0) {
      setMobileSubIdx(mobileSubIdx - 1);
      scrollToForm();
      return;
    }

    if (currentScreenIdx > 0) {
      const prev = currentScreenIdx - 1;
      // Sur téléphone, on revient à la dernière question de la section précédente.
      const prevSubIdx = isMobile
        ? Math.max(0, activeScreens[prev].questions.filter((qId) => isVisible(qId, answers)).length - 1)
        : 0;
      setMobileSubIdx(prevSubIdx);
      setCurrentScreenIdx(prev);
      saveProgress(answers, prev, commune, prevSubIdx);
      scrollToForm();
    }
  };

  const handleRestart = () => {
    clearProgress();
    setAnswers({});
    setCurrentScreenIdx(0);
    setHasSavedProgress(false);
    setShowForm(true);
  };

  if (loading) return <LoadingState label="Chargement du sondage…" />;

  if (submitted) {
    return (
      <FormShell>
        <div ref={formZoneRef} className="scroll-mt-20">
          <SuccessScreen />
        </div>
      </FormShell>
    );
  }

  const showHero = !autoStart && !showForm;
  const showResume = autoStart && hasSavedProgress && !showForm;
  const showStart = (!autoStart || !hasSavedProgress) && !showForm;
  const SectionIcon = currentScreen ? SECTION_ICONS[currentScreen.id] : null;

  // Sur téléphone, un choix unique fait avancer tout seul : le bouton « suivant » n'a alors pas lieu d'être.
  const mobileOtherSelected = mobileStep && (
    mobileStep.type === "multi"
      ? Array.isArray(mobileValue) && mobileValue.some(isOtherOption)
      : typeof mobileValue === "string" && isOtherOption(mobileValue)
  );
  const isAutoAdvance = isMobile
    && mobileStep
    && mobileStep.type !== "multi"
    && mobileStep.type !== "text"
    && !mobileOtherSelected
    && !mobileStep.endIf?.values?.includes(mobileValue)
    && mobileSubIdx < visibleQIds.length - 1;

  const nextLabel = submitting
    ? "Envoi en cours…"
    : endsSurvey
      ? "Terminer le sondage"
      : isMobile && mobileSubIdx < visibleQIds.length - 1
        ? "Question suivante"
        : currentScreenIdx === activeScreens.length - 1
          ? "Envoyer mes réponses"
          : "Section suivante";

  const segments = activeScreens.map((sc, i) => {
    let fill = 0;
    if (i < currentScreenIdx) {
      fill = 100;
    } else if (i === currentScreenIdx) {
      if (isMobile) {
        fill = visibleQIds.length > 0 ? Math.round(((mobileSubIdx + 1) / visibleQIds.length) * 100) : 0;
      } else {
        const required = getRequired(currentScreen, answers, questionnaire, isMobile);
        const answered = required.filter((qId) => {
          const step = questionnaire.steps.find((s) => s.id === qId);
          return !!step && hasAnswer(step, answers);
        }).length;
        fill = required.length > 0 ? Math.round((answered / required.length) * 100) : 0;
      }
    }
    return { id: sc.id, fill };
  });

  return (
    <FormShell>
      {showHero && (
        <header className="mb-6">
          <h1 className="tk-display text-[clamp(2rem,9vw,3.25rem)]">
            Vos déplacements quotidiens méritent mieux. <span className="whitespace-nowrap">Dites-nous</span> comment.
          </h1>
          <p className="mt-4 text-[1.0625rem] text-ink-2">
            Ticketché prépare un service de bus et de covoiturage sur Cotonou ↔ Abomey-Calavi. Votre avis compte :
            anonyme, gratuit.
          </p>
          <p className="tk-label mt-3 flex items-center gap-1.5 text-[0.875rem] text-brand">
            <ChartColumn className="size-4" aria-hidden />
            Sondage anonyme, 3 min
          </p>

          <ul className="mt-6 grid gap-2 xs:grid-cols-3">
            {STATS.map(({ value, label }) => (
              <li key={label} className="rounded-card border border-line bg-surface px-4 py-3 text-[0.8125rem] text-ink-2">
                <span className="tk-title block text-xl text-brand">{value}</span>
                {label}
              </li>
            ))}
          </ul>

          <Field label="Votre commune (optionnel)" className="mt-6">
            {(props) => (
              <Input
                {...props}
                type="text"
                autoComplete="address-level2"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                maxLength={80}
              />
            )}
          </Field>
        </header>
      )}

      {!showHero && !showResume && questionnaire && (
        <h1 className="tk-title mb-5 text-[1.375rem]">{questionnaire.title}</h1>
      )}

      <div ref={formZoneRef} className="scroll-mt-20">
        {showResume && (
          <ResumeCard
            screens={activeScreens}
            currentIdx={currentScreenIdx}
            onResume={() => setShowForm(true)}
            onRestart={handleRestart}
          />
        )}

        {showStart && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => setShowForm(true)}>
              {hasSavedProgress ? "Reprendre le sondage" : "Participer au sondage"}
              <ArrowRight className="size-5" aria-hidden />
            </Button>
            {hasSavedProgress && (
              <Button variant="ghost" size="lg" onClick={handleRestart} className={WRAP_BUTTON}>
                Recommencer depuis le début
              </Button>
            )}
          </div>
        )}

        {showForm && currentScreen && questionnaire && (
          <>
            <SurveyProgress
              segments={segments}
              label={isMobile
                ? `${currentScreen.label}, question ${mobileSubIdx + 1} sur ${visibleQIds.length}`
                : `Section ${currentScreenIdx + 1} sur ${activeScreens.length}`}
            />

            <StepTransition stepKey={isMobile ? `${currentScreen.id}-${mobileSubIdx}` : currentScreen.id} className="mt-6">
              <h2 className="tk-title flex items-center gap-2.5 text-xl">
                {SectionIcon && (
                  <span className="grid size-9 shrink-0 place-items-center rounded-media bg-brand-soft text-brand">
                    <SectionIcon className="size-[1.125rem]" aria-hidden />
                  </span>
                )}
                {currentScreen.label}
              </h2>

              <div className="mt-4 grid gap-3">
                {shownQIds.map((qId) => {
                  const step = questionnaire.steps.find((s) => s.id === qId);
                  if (!step) return null;
                  return (
                    <QuestionField key={qId} step={step} answers={answers} onChange={handleChange} copy={COPY} markAnswered />
                  );
                })}
              </div>
            </StepTransition>

            {submitError && (
              <Notice role="alert" tone="error" icon={TriangleAlert} className="mt-5">
                Une erreur est survenue. Vérifiez votre connexion et réessayez.
              </Notice>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              {(currentScreenIdx > 0 || (isMobile && mobileSubIdx > 0)) && (
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="size-4" aria-hidden />
                  Précédent
                </Button>
              )}
              {!isAutoAdvance && (
                <Button className="sm:ml-auto" onClick={handleNext} disabled={!canProceed || submitting}>
                  {nextLabel}
                  {!submitting && <ArrowRight className="size-4" aria-hidden />}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </FormShell>
  );
}
