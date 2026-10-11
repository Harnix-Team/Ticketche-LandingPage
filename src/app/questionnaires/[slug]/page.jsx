"use client";

import { ArrowLeft, ArrowRight, CalendarDays, CircleCheck, Clock, Share2, ShieldCheck, TriangleAlert, Users } from "@/components/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchQuestionnaireBySlug } from "@/app/services/questionnairesApi";
import { FormShell, LoadingState, StatePanel, WRAP_BUTTON } from "@/components/survey/Panels";
import { QuestionField } from "@/components/survey/QuestionField";
import { StarRating } from "@/components/survey/StarRating";
import { StepTransition } from "@/components/survey/StepTransition";
import { SurveyProgress } from "@/components/survey/SurveyProgress";
import { Button } from "@/components/ui/Button";
import { PHONE_NUMBER } from "@/config/constants";

const SHARE_TEXT = encodeURIComponent(
  "Ticketché prépare un service de bus et de covoiturage sur Cotonou ↔ Abomey-Calavi. " +
    "Donnez votre avis en 3 min : https://ticketche.com/sondage"
);

const COPY = {
  textPlaceholder: "Votre réponse…",
  multiMax: (max) => `Choisissez jusqu'à ${max} réponses.`,
  multiAny: "Vous pouvez sélectionner plusieurs réponses.",
  reasonPlaceholder: "Votre réponse (optionnel)…",
};

const BACK_LINK = "tk-label inline-flex items-center gap-1.5 text-[0.875rem] text-brand underline-offset-4 hover:underline";

// Le message part tel quel dans WhatsApp : c'est lui qui enregistre les réponses de ce parcours.
function buildWaMessage(questionnaire, answers) {
  const lines = questionnaire.steps.flatMap((step) => {
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

function SuccessScreen() {
  const [rating, setRating] = useState(0);

  return (
    <StatePanel icon={CircleCheck} title="Merci pour votre participation !">
      <p className="text-ink-2">
        Vos réponses ont été envoyées via WhatsApp. Elles contribuent directement à l&apos;évolution de Ticketché.
        Restez connecté : les nouveautés arrivent bientôt !
      </p>
      <Button href={`https://wa.me/?text=${SHARE_TEXT}`} className={WRAP_BUTTON}>
        <Share2 className="size-4 shrink-0" aria-hidden />
        Partager ce sondage à mes proches
      </Button>

      <div className="mt-2 w-full border-t border-line pt-5">
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

      <Link href="/questionnaires" className={BACK_LINK}>
        <ArrowLeft className="size-4" aria-hidden />
        Voir tous les questionnaires
      </Link>
    </StatePanel>
  );
}

export default function QuestionnairePage() {
  const params = useParams();

  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const cardRef = useRef(null);

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

  /* Moteur de branchement :
   *   showIf { questionId, values } : l'étape n'apparaît que si la réponse à questionId est dans values
   *   endIf  { values }             : le questionnaire s'arrête si la réponse à CETTE étape est dans values */
  const getActiveSteps = () => {
    if (!questionnaire) return [];

    const result = [];

    for (const step of questionnaire.steps) {
      if (step.showIf) {
        const { questionId, values } = step.showIf;
        const given = answers[questionId];
        const givenArr = Array.isArray(given) ? given : given ? [given] : [];
        const match = givenArr.some((v) => values.includes(v));
        if (!match) continue;
      }

      result.push(step);

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
  const step = activeSteps[currentStep];
  const isLastStep = currentStep === activeSteps.length - 1;
  const storageKey = questionnaire?.slug || questionnaire?.id;

  const handleAnswer = (key, value) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    // Seuls les choix sont enregistrés à la volée ; le texte libre l'est au passage à l'étape suivante.
    if (key === step.id && step.type !== "text") saveProgress(updated, currentStep, storageKey);
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

  const showStep = () => cardRef.current?.scrollIntoView({ block: "start" });

  const handleNext = () => {
    if (!isLastStep) {
      const next = currentStep + 1;
      setCurrentStep(next);
      saveProgress(answers, next, storageKey);
      showStep();
    } else {
      const message = buildWaMessage(questionnaire, answers);
      const url = `https://wa.me/${PHONE_NUMBER.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      clearProgress(storageKey);
      try { localStorage.setItem("ticketche_sondage_done", "1"); } catch (_) {}
      setSubmitted(true);
    }
  };

  if (loading) return <LoadingState label="Chargement du questionnaire…" />;

  if (notFound || !questionnaire) {
    return (
      <FormShell>
        <StatePanel icon={TriangleAlert} title="Questionnaire introuvable">
          <p className="text-ink-2">Ce questionnaire n&apos;existe pas ou a été supprimé.</p>
          <Button href="/questionnaires" variant="outline">
            <ArrowLeft className="size-4" aria-hidden />
            Retour aux questionnaires
          </Button>
        </StatePanel>
      </FormShell>
    );
  }

  if (submitted) {
    return (
      <FormShell>
        <SuccessScreen />
      </FormShell>
    );
  }

  return (
    <FormShell>
      <header>
        <Link href="/questionnaires" className={BACK_LINK}>
          <ArrowLeft className="size-4" aria-hidden />
          Questionnaires
        </Link>
        <h1 className="tk-display mt-4 text-[clamp(2rem,8vw,3rem)]">{questionnaire.title}</h1>
        <p className="mt-3 text-ink-2">{questionnaire.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.875rem] text-ink-2">
          <li className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-brand" aria-hidden />
            {new Date(questionnaire.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="size-4 text-brand" aria-hidden />
            Durée estimée : ~{questionnaire.estimatedMinutes} min
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4 text-brand" aria-hidden />
            {questionnaire.totalResponses} participants
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-brand" aria-hidden />
            100 % anonyme
          </li>
        </ul>
      </header>

      {step && (
        <section ref={cardRef} aria-label="Questions" className="mt-8 scroll-mt-20">
          <SurveyProgress
            segments={[{ id: "total", fill: ((currentStep + 1) / activeSteps.length) * 100 }]}
            label={`Question ${currentStep + 1} sur ${activeSteps.length}`}
          />

          <StepTransition stepKey={step.id} className="mt-4">
            <QuestionField step={step} answers={answers} onChange={handleAnswer} copy={COPY} />
          </StepTransition>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => setCurrentStep((p) => p - 1)}>
                  <ArrowLeft className="size-4" aria-hidden />
                  Précédent
                </Button>
              )}
              {!isLastStep && (
                <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => setCurrentStep((p) => p + 1)}>
                  Passer
                </Button>
              )}
            </div>
            <Button onClick={handleNext} disabled={!canProceed}>
              {isLastStep ? "Envoyer" : "Suivant"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </section>
      )}

      <aside className="mt-8 rounded-card border border-line bg-surface p-5">
        <h2 className="tk-title text-[1.0625rem]">Confidentialité</h2>
        <p className="mt-1.5 text-[0.9375rem] text-ink-2">
          Vos réponses sont entièrement anonymes et ne sont jamais associées à votre compte ou à votre identité.
        </p>
      </aside>
    </FormShell>
  );
}
