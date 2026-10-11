"use client";

import {
  ArrowLeft, ArrowRight, Car, CircleCheck, Clock, CreditCard, Eye, EyeOff, IdCard, Lock, LogOut, MapPin,
  MessageSquareText, Repeat, Route, Sparkles, TriangleAlert, User, Wifi, WifiOff,
} from "@/components/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  STATIC_QUESTIONNAIRES,
  fetchQuestionnaireBySlug,
  submitQuestionnaireAnswers,
} from "@/app/services/questionnairesApi";
import { FormShell, LoadingState, Notice, StatePanel } from "@/components/survey/Panels";
import { QuestionField, hasAnswer } from "@/components/survey/QuestionField";
import { StepTransition } from "@/components/survey/StepTransition";
import { SurveyProgress } from "@/components/survey/SurveyProgress";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

const SURVEY_SLUG = "transport-covoiturage-2026";
const OFFLINE_KEY = "tc_enqueteur_offline_queue";

// Zones par identifiant, côté client pour la démonstration : en production, le backend les renvoie à la connexion.
const AGENT_ZONES = {
  "ENQ-A1": { zone: "A", label: "Zone A - Tokpa / Godomey", points: "Échangeur Godomey, arrêts minibus bord RNIE1" },
  "ENQ-A2": { zone: "A", label: "Zone A - Tokpa / Godomey", points: "Échangeur Godomey, arrêts minibus bord RNIE1" },
  "ENQ-B1": { zone: "B", label: "Zone B - Calavi Gare", points: "Gare routière Abomey-Calavi, terminus minibus" },
  "ENQ-B2": { zone: "B", label: "Zone B - Calavi Gare", points: "Gare routière Abomey-Calavi, terminus minibus" },
  "ENQ-C1": { zone: "C", label: "Zone C - Campus UAC", points: "Entrées campus UAC, EPAC, FASEG, FLASH" },
  "ENQ-C2": { zone: "C", label: "Zone C - Campus UAC", points: "Entrées campus UAC, EPAC, FASEG, FLASH" },
  "ENQ-D1": { zone: "D", label: "Zone D - Cadjehoun / Centre", points: "Carrefour Cadjehoun, zone administrative" },
  "ENQ-E1": { zone: "E", label: "Zone E - Glodjigbe / GDIZ", points: "Entrée GDIZ, axe Glodjigbe-Calavi, arrêts informels" },
  "ENQ-F1": { zone: "F", label: "Zone F - Mobile (renforts)", points: "Axes RNIE1 et RNIE2 selon flux du jour" },
};

const DEMO_PASSWORD = "ticketche2026";

const SECTION_ICONS = {
  s1: User, s2: Car, s3: Route, s4: Repeat,
  s5: TriangleAlert, s6: Sparkles, s7: CreditCard, s8: MessageSquareText,
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
  { id: "s6", label: "Ticketché", questions: ["q20_interet", "q21_service", "q22_role", "q23_reservation"] },
  {
    id: "s7", label: "Paiement",
    questions: ["q24_mobile_money", "q25_smartphone", "q26_paiement_app", "q27_prix", "q28_abonnement", "q28b_prix_abo"],
  },
  { id: "s8", label: "Perception", questions: ["q29_avantages", "q30_obstacles", "q31_suggestions"] },
];

const CONDS = {
  q5_type_vehicule: { dep: "q4_vehicule", vals: ["oui"] },
  q6_places: { dep: "q4_vehicule", vals: ["oui"] },
  q7_carburant: { dep: "q4_vehicule", vals: ["oui"] },
  q8_passagers: { dep: "q4_vehicule", vals: ["oui"] },
  q8b_app: { dep: "q4_vehicule", vals: ["oui"] },
  q19_type_difficultes: { dep: "q18_difficultes", vals: ["oui"] },
  q22_role: { dep: "q21_service", vals: ["covoiturage", "les_deux"] },
  q28b_prix_abo: { dep: "q28_abonnement", vals: ["oui", "peut_etre"] },
};

const COPY = {
  textPlaceholder: "Réponse du répondant…",
  multiMax: (max) => `Max ${max} choix`,
  multiAny: "Réponses multiples",
  reasonPlaceholder: "Noter la réponse…",
  other: { label: "Préciser :", placeholder: "Réponse libre du répondant…" },
};

function isVisible(qId, answers) {
  if (!CONDS[qId]) return true;
  const { dep, vals } = CONDS[qId];
  const given = answers[dep];
  const arr = Array.isArray(given) ? given : given ? [given] : [];
  return arr.some((v) => vals.includes(v));
}

function getRequired(screen, answers, questionnaire) {
  if (!screen || !questionnaire) return [];
  return screen.questions.filter((qId) => {
    if (!isVisible(qId, answers)) return false;
    const step = questionnaire.steps.find((s) => s.id === qId);
    if (!step || step.optional) return false;
    if (screen.id === "s6" && answers.q20_interet === "non") return qId === "q20_interet";
    return true;
  });
}

function currentTime() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function loadOfflineQueue() {
  try { return JSON.parse(localStorage.getItem(OFFLINE_KEY) || "[]"); } catch { return []; }
}

function saveOfflineQueue(q) {
  try { localStorage.setItem(OFFLINE_KEY, JSON.stringify(q)); } catch { }
}

function addToOfflineQueue(payload) {
  const q = loadOfflineQueue();
  q.push({ ...payload, queued_at: new Date().toISOString() });
  saveOfflineQueue(q);
}

function LoginScreen({ onLogin }) {
  const [agentId, setAgentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!agentId.trim() || !password.trim()) {
      setError("Veuillez renseigner votre identifiant et votre mot de passe.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const normalized = agentId.trim().toUpperCase();
      if (!AGENT_ZONES[normalized] || password !== DEMO_PASSWORD) {
        setError("Identifiant ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
      onLogin(normalized, AGENT_ZONES[normalized]);
      setLoading(false);
    }, 600);
  };

  return (
    <FormShell narrow>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-6 sm:p-8">
        <div>
          <span className="grid size-12 place-items-center rounded-media bg-brand-soft text-brand">
            <Lock className="size-6" aria-hidden />
          </span>
          <h1 className="tk-title mt-4 text-[1.625rem]">Back-office enquêteur</h1>
          <p className="mt-1.5 text-[0.9375rem] text-ink-2">Connectez-vous avec votre identifiant terrain</p>
        </div>

        {error && (
          <Notice role="alert" tone="error" icon={TriangleAlert}>
            {error}
          </Notice>
        )}

        <Field label="Identifiant enquêteur">
          {(props) => (
            <Input
              {...props}
              type="text"
              placeholder="Ex : ENQ-A1"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              autoComplete="username"
              autoCapitalize="characters"
            />
          )}
        </Field>

        <Field label="Mot de passe">
          {(props) => (
            <div className="relative">
              <Input
                {...props}
                className="pr-12"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
              >
                {showPwd ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </div>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
          {!loading && <ArrowRight className="size-4" aria-hidden />}
        </Button>

        <p className="text-[0.8125rem] text-ink-3">
          Votre zone d&apos;affectation est prédéfinie et non modifiable. En cas de problème, contactez le
          coordinateur.
        </p>
      </form>
    </FormShell>
  );
}

function EnqueteurHeader({ agent, zoneInfo, lieuPrecis, onLieuChange, heureDebut, onLogout, isOnline, offlineCount }) {
  return (
    <header className="rounded-card border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h1 className="tk-title text-[1.375rem]">Back-office enquêteur</h1>
        <Button variant="outline" size="icon" className="shrink-0" onClick={onLogout} aria-label="Se déconnecter" title="Se déconnecter">
          <LogOut className="size-4" aria-hidden />
        </Button>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.875rem] text-ink-2">
        <li className="flex items-center gap-1.5">
          <IdCard className="size-4 text-brand" aria-hidden />
          <span className="tk-label text-ink">{agent}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin className="size-4 text-brand" aria-hidden />
          {zoneInfo.label}
        </li>
        <li className="flex items-center gap-1.5">
          <Clock className="size-4 text-brand" aria-hidden />
          Début : {heureDebut}
        </li>
      </ul>

      <p role="status" className="tk-label mt-3 flex items-center gap-1.5 text-[0.875rem] text-ink">
        {isOnline ? (
          <>
            <Wifi className="size-4 text-ok" aria-hidden />
            En ligne
          </>
        ) : (
          <>
            <WifiOff className="size-4 text-danger" aria-hidden />
            Hors ligne {offlineCount > 0 && `(${offlineCount})`}
          </>
        )}
      </p>

      <Field label="Lieu précis d'enquête (QE3)" className="mt-4">
        {(props) => (
          <Input {...props} type="text" value={lieuPrecis} onChange={(e) => onLieuChange(e.target.value)} maxLength={120} />
        )}
      </Field>
    </header>
  );
}

function SuccessScreen({ onNew, offlineCount, isOnline }) {
  return (
    <StatePanel as="h2" icon={CircleCheck} title="Questionnaire enregistré !">
      {!isOnline && (
        <Notice tone="warn" icon={WifiOff} className="text-left">
          Sauvegardé localement : sera synchronisé à la reconnexion.
          {offlineCount > 0 && ` (${offlineCount} en attente)`}
        </Notice>
      )}
      <Button onClick={onNew}>
        Nouveau questionnaire
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </StatePanel>
  );
}

export default function BackofficeEnqueteurPage() {
  const [agent, setAgent] = useState(null);
  const [zoneInfo, setZoneInfo] = useState(null);

  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // En-tête enquêteur (QE1 à QE4)
  const [lieuPrecis, setLieuPrecis] = useState("");
  const [heureDebut, setHeureDebut] = useState("");

  const [isOnline, setIsOnline] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  const formZoneRef = useRef(null);

  const syncOfflineQueue = useCallback(async () => {
    const queue = loadOfflineQueue();
    if (!queue.length) return;
    const remaining = [];
    for (const item of queue) {
      try {
        await submitQuestionnaireAnswers(item.questionnaireId, item.answers, item.metadata);
      } catch {
        remaining.push(item);
      }
    }
    saveOfflineQueue(remaining);
    setOfflineCount(remaining.length);
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => { setIsOnline(true); syncOfflineQueue(); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncOfflineQueue]);

  useEffect(() => { setOfflineCount(loadOfflineQueue().length); }, [submitted]);

  useEffect(() => {
    if (!agent) return;
    setLoading(true);
    fetchQuestionnaireBySlug(SURVEY_SLUG)
      .then((q) => setQuestionnaire(q || STATIC_QUESTIONNAIRES[0]))
      .catch(() => setQuestionnaire(STATIC_QUESTIONNAIRES[0]))
      .finally(() => setLoading(false));
  }, [agent]);

  const handleLogin = (agentId, info) => {
    setAgent(agentId);
    setZoneInfo(info);
    setHeureDebut(currentTime());
  };

  const handleLogout = () => {
    setAgent(null); setZoneInfo(null); setAnswers({}); setCurrentScreenIdx(0);
    setSubmitted(false); setLieuPrecis(""); setHeureDebut("");
  };

  const activeScreens = questionnaire
    ? SCREENS.filter((sc) => {
        if (!sc.showIf) return true;
        const { questionId, values } = sc.showIf;
        const given = answers[questionId];
        const arr = Array.isArray(given) ? given : given ? [given] : [];
        return arr.some((v) => values.includes(v));
      })
    : [];

  const currentScreen = activeScreens[currentScreenIdx];
  const visibleQIds = currentScreen && questionnaire
    ? currentScreen.questions.filter((qId) => isVisible(qId, answers))
    : [];

  const canProceed = currentScreen && questionnaire
    ? getRequired(currentScreen, answers, questionnaire).every((qId) => {
        const step = questionnaire.steps.find((s) => s.id === qId);
        return !step || hasAnswer(step, answers);
      })
    : false;

  const scrollToForm = useCallback(() => {
    formZoneRef.current?.scrollIntoView({ block: "start" });
  }, []);

  const handleChange = useCallback((qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!questionnaire || !agent) return;
    setSubmitting(true);

    const metadata = {
      mode: "enqueteur",
      source_tag: `enqueteur_${zoneInfo?.zone?.toLowerCase() || "x"}`,
      agent_id: agent,
      zone: zoneInfo?.zone,
      zone_label: zoneInfo?.label,
      lieu_enquete: lieuPrecis.trim() || null,
      heure_debut: heureDebut,
      heure_fin: currentTime(),
      submitted_at: new Date().toISOString(),
    };

    const payload = { questionnaireId: questionnaire.slug || questionnaire.id, answers: { ...answers }, metadata };

    if (!isOnline) {
      addToOfflineQueue(payload);
      setOfflineCount((c) => c + 1);
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    try {
      await submitQuestionnaireAnswers(questionnaire.slug || questionnaire.id, { ...answers }, metadata);
      setSubmitted(true);
    } catch {
      // Envoi impossible : le questionnaire rejoint la file hors ligne plutôt que d'être perdu.
      addToOfflineQueue(payload);
      setOfflineCount((c) => c + 1);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (answers.q20_interet === "non") { handleSubmit(); return; }
    if (currentScreenIdx < activeScreens.length - 1) {
      setCurrentScreenIdx((i) => i + 1);
      scrollToForm();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentScreenIdx > 0) {
      setCurrentScreenIdx((i) => i - 1);
      scrollToForm();
    }
  };

  const handleNewQuestionnaire = () => {
    setAnswers({});
    setCurrentScreenIdx(0);
    setSubmitted(false);
    setHeureDebut(currentTime());
    setLieuPrecis("");
    scrollToForm();
  };

  if (!agent) return <LoginScreen onLogin={handleLogin} />;

  const SectionIcon = currentScreen ? SECTION_ICONS[currentScreen.id] : null;

  return (
    <FormShell>
      <EnqueteurHeader
        agent={agent}
        zoneInfo={zoneInfo}
        lieuPrecis={lieuPrecis}
        onLieuChange={setLieuPrecis}
        heureDebut={heureDebut}
        onLogout={handleLogout}
        isOnline={isOnline}
        offlineCount={offlineCount}
      />

      <div ref={formZoneRef} className="mt-6 scroll-mt-20">
        {loading && <LoadingState label="Chargement du questionnaire…" />}

        {!loading && submitted && (
          <SuccessScreen onNew={handleNewQuestionnaire} offlineCount={offlineCount} isOnline={isOnline} />
        )}

        {!loading && !submitted && currentScreen && questionnaire && (
          <>
            {zoneInfo?.zone === "E" && (
              <Notice icon={TriangleAlert} className="mb-5">
                <strong className="tk-label">Zone E, Glodjigbe / GDIZ :</strong> aucune offre structurée sur cet axe.
                Proposer le QR code aux responsables RH pour diffusion aux équipes.
              </Notice>
            )}

            <SurveyProgress
              segments={activeScreens.map((sc, i) => ({
                id: sc.id,
                fill: i < currentScreenIdx ? 100 : 0,
                current: i === currentScreenIdx,
              }))}
              label={`Section ${currentScreenIdx + 1} sur ${activeScreens.length}`}
            />

            <StepTransition stepKey={currentScreen.id} className="mt-6">
              <h2 className="tk-title flex items-center gap-2.5 text-xl">
                {SectionIcon && (
                  <span className="grid size-9 shrink-0 place-items-center rounded-media bg-brand-soft text-brand">
                    <SectionIcon className="size-[1.125rem]" aria-hidden />
                  </span>
                )}
                {currentScreen.label}
              </h2>

              <div className="mt-4 grid gap-3">
                {visibleQIds.map((qId) => {
                  const step = questionnaire.steps.find((s) => s.id === qId);
                  if (!step) return null;
                  return (
                    <QuestionField
                      key={qId}
                      step={step}
                      answers={answers}
                      onChange={handleChange}
                      copy={COPY}
                      // À Q20, la présentation du service devient le script que l'enquêteur lit au répondant.
                      script={qId === "q20_interet" ? step.intro : undefined}
                      showIntro={false}
                      showDescriptions={false}
                      markAnswered
                    />
                  );
                })}
              </div>
            </StepTransition>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              {currentScreenIdx > 0 && (
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="size-4" aria-hidden />
                  Précédent
                </Button>
              )}
              <Button className="sm:ml-auto" onClick={handleNext} disabled={!canProceed || submitting}>
                {submitting
                  ? "Envoi en cours…"
                  : answers.q20_interet === "non"
                    ? "Terminer le questionnaire"
                    : currentScreenIdx === activeScreens.length - 1
                      ? "Enregistrer les réponses"
                      : "Section suivante"}
                {!submitting && <ArrowRight className="size-4" aria-hidden />}
              </Button>
            </div>
          </>
        )}
      </div>
    </FormShell>
  );
}
