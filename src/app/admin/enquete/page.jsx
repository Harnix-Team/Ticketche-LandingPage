"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, ArrowLeft, CheckCircle, Warning,
    User, Car, Path, ArrowsClockwise, Sparkle, CreditCard, ChatText,
    Lock, SignOut, WifiSlash, WifiHigh, Clock, MapPin, IdentificationCard,
    ClipboardText, Eye, EyeSlash,
} from "@phosphor-icons/react";
import {
    submitQuestionnaireAnswers,
    fetchQuestionnaireBySlug,
    STATIC_QUESTIONNAIRES,
} from "@/app/services/questionnairesApi";

// ─── Config ──────────────────────────────────────────────────────────────────

const SURVEY_SLUG = "transport-covoiturage-2026";
const OFFLINE_KEY = "tc_enqueteur_offline_queue";

// Zones prédéfinies par login — mappées côté client pour la démo
// En production : renvoyées par le backend à l'authentification
const AGENT_ZONES = {
    "ENQ-A1": { zone: "A", label: "Zone A — Tokpa / Godomey", points: "Échangeur Godomey, arrêts minibus bord RNIE1" },
    "ENQ-A2": { zone: "A", label: "Zone A — Tokpa / Godomey", points: "Échangeur Godomey, arrêts minibus bord RNIE1" },
    "ENQ-B1": { zone: "B", label: "Zone B — Calavi Gare", points: "Gare routière Abomey-Calavi, terminus minibus" },
    "ENQ-B2": { zone: "B", label: "Zone B — Calavi Gare", points: "Gare routière Abomey-Calavi, terminus minibus" },
    "ENQ-C1": { zone: "C", label: "Zone C — Campus UAC", points: "Entrées campus UAC, EPAC, FASEG, FLASH" },
    "ENQ-C2": { zone: "C", label: "Zone C — Campus UAC", points: "Entrées campus UAC, EPAC, FASEG, FLASH" },
    "ENQ-D1": { zone: "D", label: "Zone D — Cadjehoun / Centre", points: "Carrefour Cadjehoun, zone administrative" },
    "ENQ-E1": { zone: "E", label: "Zone E — Glodjigbe / GDIZ", points: "Entrée GDIZ, axe Glodjigbe-Calavi, arrêts informels" },
    "ENQ-F1": { zone: "F", label: "Zone F — Mobile (renforts)", points: "Axes RNIE1 et RNIE2 selon flux du jour" },
    // Mot de passe commun pour la démo : "ticketche2026"
};

const DEMO_PASSWORD = "ticketche2026";

// ─── Sections ────────────────────────────────────────────────────────────────

const SECTION_ICONS = {
    s1: User, s2: Car, s3: Path, s4: ArrowsClockwise,
    s5: Warning, s6: Sparkle, s7: CreditCard, s8: ChatText,
};

const SCREENS = [
    {
        id: "s1", label: "Profil", layout: "2x2",
        questions: ["q1_age", "q2_sexe", "q3_profession", "q4_vehicule"]
    },
    {
        id: "s2", label: "Conducteur", layout: "2+3",
        questions: ["q5_type_vehicule", "q6_places", "q7_carburant", "q8_passagers", "q8b_app"],
        showIf: { questionId: "q4_vehicule", values: ["oui"] }
    },
    {
        id: "s3", label: "Trajet", layout: "1+2",
        questions: ["q9_residence", "q10_lieu_activite", "q11_itineraire"]
    },
    {
        id: "s4", label: "Habitudes", layout: "3x2",
        questions: ["q12_frequence", "q13_transport", "q14_depart", "q15_retour", "q16_duree", "q17_cout"]
    },
    {
        id: "s5", label: "Difficultés", layout: "1x2",
        questions: ["q18_difficultes", "q19_type_difficultes"]
    },
    {
        id: "s6", label: "TicketChé", layout: "2x2",
        questions: ["q20_interet", "q21_service", "q22_role", "q23_reservation"]
    },
    {
        id: "s7", label: "Paiement", layout: "3x2",
        questions: ["q24_mobile_money", "q25_smartphone", "q26_paiement_app", "q27_prix", "q28_abonnement", "q28b_prix_abo"]
    },
    {
        id: "s8", label: "Perception", layout: "2+1",
        questions: ["q29_avantages", "q30_obstacles", "q31_suggestions"]
    },
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

function isVisible(qId, answers) {
    if (!CONDS[qId]) return true;
    const { dep, vals } = CONDS[qId];
    const given = answers[dep];
    const arr = Array.isArray(given) ? given : given ? [given] : [];
    return arr.some(v => vals.includes(v));
}

function getRequired(screen, answers, questionnaire) {
    if (!screen || !questionnaire) return [];
    return screen.questions.filter(qId => {
        if (!isVisible(qId, answers)) return false;
        const step = questionnaire.steps.find(s => s.id === qId);
        if (!step || step.optional) return false;
        if (screen.id === "s6" && answers.q20_interet === "non") return qId === "q20_interet";
        return true;
    });
}

// ─── Offline Queue ────────────────────────────────────────────────────────────

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

// ─── QuestionCard ─────────────────────────────────────────────────────────────

function QuestionCard({ step, answers, onChange, spanClass }) {
    if (!step) return null;
    const val = answers[step.id];
    const Icon = step.icon;
    const isRow = step.options && step.options.length <= 3;
    const isAutreOpt = id => id === "autre" || id?.toLowerCase().includes("autre");

    const handleClick = optId => {
        if (step.type === "multi") {
            const cur = val || [];
            let next;
            if (cur.includes(optId)) {
                next = cur.filter(v => v !== optId);
            } else if (isAutreOpt(optId)) {
                next = [optId];
            } else {
                const withoutAutre = cur.filter(v => !isAutreOpt(v));
                if (step.maxSelect && withoutAutre.length >= step.maxSelect) return;
                next = [...withoutAutre, optId];
            }
            onChange(step.id, next);
        } else {
            onChange(step.id, optId);
        }
    };

    const autreSelected = step.type === "multi"
        ? (Array.isArray(val) && val.some(v => isAutreOpt(v)))
        : (typeof val === "string" && isAutreOpt(val));

    const isAnswered = Array.isArray(val) ? val.length > 0 : !!val;

    return (
        <div className={`snd-qcard ${isAnswered ? "snd-qcard--answered" : ""} ${spanClass || ""}`}>
            <div className="snd-qcard__head">
                {Icon && <span className="snd-qcard__icon"><Icon size={15} weight="fill" /></span>}
                <p className="snd-qcard__label">{step.question}</p>
                {step.type === "multi" && (
                    <span className="snd-qcard__hint">
                        {step.maxSelect ? `max ${step.maxSelect} choix` : "Réponses multiples"}
                    </span>
                )}
            </div>

            {/* Script enquêteur — affiché uniquement en mode enquêteur avant Q20 */}
            {step.enqueteurScript && (
                <div className="enq-script-box">
                    <div className="enq-script-box__label">
                        <ClipboardText size={13} weight="fill" /> Script à lire à voix haute
                    </div>
                    <p className="enq-script-box__text">{step.enqueteurScript}</p>
                </div>
            )}

            {/* Intro visible en mode libre → masquée ici (remplacée par le script) */}

            <div className="snd-qcard__body">
                {step.type === "text" ? (
                    <textarea
                        className="snd-qcard__textarea"
                        placeholder={step.placeholder || "Réponse du répondant…"}
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
                                        <span className="snd-opt__lbl">{opt.label}</span>
                                        {selected && <CheckCircle size={12} weight="fill" className="snd-opt__chk" />}
                                    </button>
                                );
                            })}
                        </div>
                        {autreSelected && (
                            <div className="snd-autre-wrap">
                                <label className="snd-autre-label">Préciser :</label>
                                <textarea
                                    className="snd-qcard__textarea snd-qcard__textarea--sm"
                                    placeholder="Réponse libre du répondant…"
                                    value={answers[`${step.id}_autre`] || ""}
                                    onChange={e => onChange(`${step.id}_autre`, e.target.value)}
                                    rows={2}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {step.endIfLabel && step.endIf?.values?.includes(val) && (
                <textarea
                    className="snd-qcard__textarea snd-qcard__textarea--sm"
                    placeholder="Pourquoi ? (noter la réponse)"
                    value={answers[`${step.id}_reason`] || ""}
                    onChange={e => onChange(`${step.id}_reason`, e.target.value)}
                    rows={2}
                />
            )}
        </div>
    );
}

// ─── ScreenGrid ───────────────────────────────────────────────────────────────

function ScreenGrid({ screen, visibleQIds, questionnaire, answers, onChange }) {
    const gridClass = {
        "2x2": "snd-grid snd-grid--2x2",
        "3x2": "snd-grid snd-grid--3x2",
        "1x2": "snd-grid snd-grid--1col",
        "2+3": "snd-grid snd-grid--6col",
        "2+1": "snd-grid snd-grid--2col",
        "1+2": "snd-grid snd-grid--2col",
    }[screen.layout] || "snd-grid snd-grid--1col";

    function spanClass(idx) {
        if (screen.layout === "2+3") return idx < 2 ? "snd-span3" : "snd-span2";
        if (screen.layout === "2+1") return idx >= 2 ? "snd-spanfull" : "";
        if (screen.layout === "1+2") return idx === 0 ? "snd-spanfull" : "";
        if (screen.layout === "1x2") return "snd-spanfull";
        return "";
    }

    return (
        <div className={gridClass}>
            {visibleQIds.map((qId, idx) => {
                const step = questionnaire.steps.find(s => s.id === qId);
                if (!step) return null;
                // Injecter le script enquêteur sur Q20
                const enriched = qId === "q20_interet" && step.intro
                    ? { ...step, enqueteurScript: step.intro }
                    : step;
                return (
                    <QuestionCard
                        key={qId}
                        step={enriched}
                        answers={answers}
                        onChange={onChange}
                        spanClass={spanClass(idx)}
                    />
                );
            })}
        </div>
    );
}

// ─── LoginScreen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
    const [agentId, setAgentId] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
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
        <div className="enq-login">
            <div className="enq-login__card">
                <div className="enq-login__logo">
                    <Lock size={28} weight="fill" />
                </div>
                <h2 className="enq-login__title">Backoffice Enquêteur</h2>
                <p className="enq-login__sub">Connectez-vous avec votre identifiant terrain</p>

                {error && (
                    <div className="enq-alert enq-alert--error">
                        <Warning size={14} weight="fill" /> {error}
                    </div>
                )}

                <div className="enq-login__field">
                    <label className="enq-login__label">
                        <IdentificationCard size={14} weight="fill" /> Identifiant enquêteur
                    </label>
                    <input
                        className="enq-login__input"
                        type="text"
                        placeholder="Ex : ENQ-A1"
                        value={agentId}
                        onChange={e => setAgentId(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                        autoComplete="username"
                    />
                </div>

                <div className="enq-login__field">
                    <label className="enq-login__label">
                        <Lock size={14} weight="fill" /> Mot de passe
                    </label>
                    <div className="enq-login__pwd-wrap">
                        <input
                            className="enq-login__input enq-login__input--pwd"
                            type={showPwd ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            autoComplete="current-password"
                        />
                        <button
                            className="enq-login__eye"
                            onClick={() => setShowPwd(v => !v)}
                            type="button"
                            aria-label="Afficher/masquer le mot de passe"
                        >
                            {showPwd ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button
                    className="enq-login__btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Connexion…" : "Se connecter"}
                    {!loading && <ArrowRight size={16} weight="bold" />}
                </button>

                <p className="enq-login__hint">
                    Votre zone d&apos;affectation est prédéfinie et non modifiable. <br />
                    En cas de problème, contactez le coordinateur.
                </p>
            </div>
        </div>
    );
}

// ─── EnqueteurHeader ──────────────────────────────────────────────────────────

function EnqueteurHeader({ agent, zoneInfo, lieuPrecis, onLieuChange, heureDebut, onLogout, isOnline, offlineCount }) {
    return (
        <div className="enq-header">
            <div className="enq-header__left">
                <div className="enq-header__agent">
                    <IdentificationCard size={14} weight="fill" />
                    <span className="enq-header__id">{agent}</span>
                </div>
                <div className="enq-header__zone">
                    <MapPin size={13} weight="fill" />
                    <span>{zoneInfo.label}</span>
                </div>
            </div>

            <div className="enq-header__center">
                <div className="enq-header__lieu-wrap">
                    <MapPin size={13} weight="fill" />
                    <input
                        className="enq-header__lieu"
                        type="text"
                        placeholder="Lieu précis d'enquête (QE3)"
                        value={lieuPrecis}
                        onChange={e => onLieuChange(e.target.value)}
                        maxLength={120}
                    />
                </div>
                <div className="enq-header__time">
                    <Clock size={13} weight="fill" />
                    Début : {heureDebut}
                </div>
            </div>

            <div className="enq-header__right">
                <div className={`enq-badge ${isOnline ? "enq-badge--online" : "enq-badge--offline"}`}>
                    {isOnline
                        ? <><WifiHigh size={12} weight="fill" /> En ligne</>
                        : <><WifiSlash size={12} weight="fill" /> Hors ligne {offlineCount > 0 && `(${offlineCount})`}</>
                    }
                </div>
                <button className="enq-logout-btn" onClick={onLogout} title="Se déconnecter">
                    <SignOut size={14} weight="bold" />
                </button>
            </div>
        </div>
    );
}

// ─── SuccessScreen ────────────────────────────────────────────────────────────

function SuccessScreen({ onNew, agentId, offlineCount, isOnline }) {
    return (
        <motion.div
            className="enq-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="enq-success__ring">
                <CheckCircle size={40} weight="fill" />
            </div>
            <h2 className="enq-success__title">Questionnaire enregistré !</h2>
            {!isOnline && (
                <div className="enq-alert enq-alert--warn" style={{ marginBottom: 12 }}>
                    <WifiSlash size={14} weight="fill" />
                    Sauvegardé localement — sera synchronisé à la reconnexion.
                    {offlineCount > 0 && ` (${offlineCount} en attente)`}
                </div>
            )}
            <button className="enq-new-btn" onClick={onNew}>
                Nouveau questionnaire
                <ArrowRight size={15} weight="bold" />
            </button>
        </motion.div>
    );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function BackofficeEnqueteurPage() {
    // Auth
    const [agent, setAgent] = useState(null);
    const [zoneInfo, setZoneInfo] = useState(null);

    // Formulaire
    const [questionnaire, setQuestionnaire] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    // En-tête enquêteur (QE1–QE4)
    const [lieuPrecis, setLieuPrecis] = useState("");
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");

    // Offline
    const [isOnline, setIsOnline] = useState(true);
    const [offlineCount, setOfflineCount] = useState(0);

    const formZoneRef = useRef(null);

    // ── Détection connexion ──────────────────────────────────────────────────
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { setOfflineCount(loadOfflineQueue().length); }, [submitted]);

    // ── Chargement questionnaire ─────────────────────────────────────────────
    useEffect(() => {
        if (!agent) return;
        setLoading(true);
        fetchQuestionnaireBySlug(SURVEY_SLUG)
            .then(q => setQuestionnaire(q || STATIC_QUESTIONNAIRES[0]))
            .catch(() => setQuestionnaire(STATIC_QUESTIONNAIRES[0]))
            .finally(() => setLoading(false));
    }, [agent]);

    // ── Sync offline queue ───────────────────────────────────────────────────
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

    // ── Login ────────────────────────────────────────────────────────────────
    const handleLogin = (agentId, info) => {
        setAgent(agentId);
        setZoneInfo(info);
        const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        setHeureDebut(now);
    };

    const handleLogout = () => {
        setAgent(null); setZoneInfo(null); setAnswers({}); setCurrentScreenIdx(0);
        setSubmitted(false); setLieuPrecis(""); setHeureDebut(""); setHeureFin("");
    };

    // ── Écrans actifs ────────────────────────────────────────────────────────
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
    const visibleQIds = currentScreen && questionnaire
        ? currentScreen.questions.filter(qId => isVisible(qId, answers))
        : [];

    const canProceed = currentScreen && questionnaire
        ? getRequired(currentScreen, answers, questionnaire).every(qId => {
            const step = questionnaire.steps.find(s => s.id === qId);
            if (!step) return true;
            if (step.type === "text") return !!(answers[qId] || "").trim();
            if (step.type === "multi") return (answers[qId] || []).length > 0;
            return !!answers[qId];
        })
        : false;

    const scrollToForm = useCallback(() => {
        if (formZoneRef.current) {
            const top = formZoneRef.current.getBoundingClientRect().top + window.scrollY - 8;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
    }, []);

    const handleChange = useCallback((qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    }, []);

    const handleNext = () => {
        if (answers.q20_interet === "non") { handleSubmit(); return; }
        if (currentScreenIdx < activeScreens.length - 1) {
            setCurrentScreenIdx(i => i + 1);
            scrollToForm();
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentScreenIdx > 0) {
            setCurrentScreenIdx(i => i - 1);
            scrollToForm();
        }
    };

    const handleSubmit = async () => {
        if (!questionnaire || !agent) return;
        setSubmitError(false);
        setSubmitting(true);
        const fin = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        setHeureFin(fin);

        const metadata = {
            mode: "enqueteur",
            source_tag: `enqueteur_${zoneInfo?.zone?.toLowerCase() || "x"}`,
            agent_id: agent,
            zone: zoneInfo?.zone,
            zone_label: zoneInfo?.label,
            lieu_enquete: lieuPrecis.trim() || null,
            heure_debut: heureDebut,
            heure_fin: fin,
            submitted_at: new Date().toISOString(),
        };

        const payload = { questionnaireId: questionnaire.id, answers: { ...answers }, metadata };

        if (!isOnline) {
            addToOfflineQueue(payload);
            setOfflineCount(c => c + 1);
            setSubmitted(true);
            setSubmitting(false);
            return;
        }

        try {
            await submitQuestionnaireAnswers(questionnaire.id, { ...answers }, metadata);
            setSubmitted(true);
        } catch {
            // Fallback offline si la requête échoue
            addToOfflineQueue(payload);
            setOfflineCount(c => c + 1);
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNewQuestionnaire = () => {
        setAnswers({});
        setCurrentScreenIdx(0);
        setSubmitted(false);
        setSubmitError(false);
        const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        setHeureDebut(now);
        setHeureFin("");
        setLieuPrecis("");
        scrollToForm();
    };

    // ── Rendu : pas connecté ─────────────────────────────────────────────────
    if (!agent) return <LoginScreen onLogin={handleLogin} />;

    const SectionIcon = currentScreen ? SECTION_ICONS[currentScreen.id] : null;

    return (
        <div className="enq-page">

            {/* ── En-tête fixe enquêteur ── */}
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

            {/* ── Corps ── */}
            <div className="enq-body" ref={formZoneRef}>

                {loading && (
                    <div className="snd-loading">
                        <div className="snd-loading__spinner" />
                        <p>Chargement du questionnaire…</p>
                    </div>
                )}

                {/* Succès */}
                {!loading && submitted && (
                    <SuccessScreen
                        onNew={handleNewQuestionnaire}
                        agentId={agent}
                        offlineCount={offlineCount}
                        isOnline={isOnline}
                    />
                )}

                {/* Formulaire */}
                {!loading && !submitted && currentScreen && questionnaire && (
                    <>
                        {/* Info zone E — spécifique GDIZ */}
                        {zoneInfo?.zone === "E" && (
                            <div className="enq-alert enq-alert--info" style={{ marginBottom: 16 }}>
                                <Warning size={14} weight="fill" />
                                <span>
                                    <strong>Zone E — Glodjigbe / GDIZ :</strong> aucune offre structurée sur cet axe.
                                    Proposer le QR code aux responsables RH pour diffusion aux équipes.
                                </span>
                            </div>
                        )}

                        {/* Barre de progression (sections) */}
                        <div className="snd-progress">
                            <div className="snd-progress__track">
                                {activeScreens.map((sc, i) => (
                                    <div
                                        key={sc.id}
                                        className={`snd-progress__seg ${i < currentScreenIdx ? "snd-progress__seg--done"
                                                : i === currentScreenIdx ? "snd-progress__seg--active"
                                                    : ""
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="snd-progress__lbl">
                                Section {currentScreenIdx + 1} / {activeScreens.length}
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentScreen.id}
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

                                {/* Grille */}
                                <ScreenGrid
                                    screen={currentScreen}
                                    visibleQIds={visibleQIds}
                                    questionnaire={questionnaire}
                                    answers={answers}
                                    onChange={handleChange}
                                />

                                {/* Navigation */}
                                <div className="snd-nav snd-nav--sticky">
                                    <div>
                                        {currentScreenIdx > 0 && (
                                            <button className="snd-nav__back" onClick={handleBack}>
                                                <ArrowLeft size={14} weight="bold" /> Précédent
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                        {submitError && (
                                            <p style={{ fontSize: 12, color: "#dc2626", margin: 0 }}>
                                                Erreur d&apos;envoi. Questionnaire sauvegardé hors ligne.
                                            </p>
                                        )}
                                        <button
                                            className="snd-nav__next"
                                            onClick={handleNext}
                                            disabled={!canProceed || submitting}
                                        >
                                            {submitting
                                                ? "Envoi en cours…"
                                                : answers.q20_interet === "non"
                                                    ? "Terminer le questionnaire"
                                                    : currentScreenIdx === activeScreens.length - 1
                                                        ? "Enregistrer les réponses"
                                                        : "Section suivante"}
                                            {!submitting && <ArrowRight size={15} weight="bold" />}
                                        </button>
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