"use client";

// src/app/services/questionnairesApi.js

import {
  User, GenderMale, GenderFemale, Briefcase, Car, Seat, GasPump,
  CurrencyDollar, MapPin, ArrowsLeftRight, Clock,
  Warning, DeviceMobile, CreditCard, Money, Tag,
  ThumbsUp, List, Question, Sparkle, Bus, ArrowRight,
  Path, PencilLine, Check, X, Motorcycle, Student,
  Buildings, Baby, PersonSimpleRun, Wrench, ShoppingCart,
  SunHorizon, Sun, Moon, SunDim, Hourglass, Timer,
  CalendarCheck, CalendarX, Lightning,
  HandCoins, Wallet, Coins,
  ShieldCheck, ShieldSlash,
  ThumbsDown, ArrowsClockwise,
  UsersThree,
  RoadHorizon, Barricade,
} from "@phosphor-icons/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";

/**
 * Le rendu du sondage utilise toujours la définition statique côté front
 * parce que les icônes sont des composants React Phosphor (non sérialisables).
 * Le backend persiste les réponses ; il n'a pas besoin d'être consommé ici.
 */
export async function fetchQuestionnaires() {
  return STATIC_QUESTIONNAIRES;
}

export async function fetchQuestionnaireBySlug(slug) {
  const questionnaires = await fetchQuestionnaires();
  return questionnaires.find((q) => q.slug === slug || q.id === String(slug)) ?? null;
}

export async function submitQuestionnaireAnswers(questionnaireId, answers, metadata = {}) {
  const res = await fetch(`${API_URL}/questionnaires/${questionnaireId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, ...metadata }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Erreur serveur : ${res.status}`);
  }
  return json;
}

// ─── Données statiques de fallback ──────────────────────────────────────────
//
// Data model — champs d'un step :
//   id        : identifiant unique
//   icon      : composant Phosphor Icons (weight="fill")
//   question  : texte de la question
//   type      : "single" | "multi" | "text"
//   options   : [{ id, icon, label, desc }]  — absent pour type "text"
//   placeholder : texte indicatif pour type "text"
//   intro     : texte affiché dans un bloc avant la question (ex. script enquêteur)
//   maxSelect : pour "multi" — nombre max de choix autorisés
//   optional  : true → la question peut être passée sans répondre
//
//   Branchements :
//   showIf  { questionId, values }  → step visible SEULEMENT si answers[questionId] ∈ values
//   endIf   { values }              → fin du questionnaire si answers[CE step] ∈ values
//                                     (+ champ texte "Pourquoi ?" si endIfLabel défini)
//   endIfLabel : libellé du champ complémentaire affiché quand endIf est déclenché
//
//   Logique du document (v2.0) :
//     Q4  = "non"               → sauter Q5–Q8b    (showIf q4=oui)
//     Q13                       → showIf q4=non (conducteurs exclus)
//     Q17                       → showIf q4=non (conducteurs exclus)
//     Q18 = "non"               → sauter Q19       (showIf q18=oui)
//     Q20 = "non"               → fin + "Pourquoi ?" (endIf + endIfLabel)
//     Q21 = "bus"               → Q22a (réservation bus) ; sauter Q22/Q23
//     Q21 = "covoiturage"|"les_deux" → Q22 (rôle) puis Q23 (showIf q22=passager|les_deux)
//     Section 6 (Q24–Q28b)      → showIf q22_role=passager|les_deux
//     Q28 = "non"               → sauter Q28b      (showIf q28=oui|peut_etre)

export const ITINERAIRE_LABELS = {
  iti_1: "Akassato → Calavi → Godomey → Stade → Étoile Rouge → Tokpa → Akpakpa",
  iti_2: "Akassato → Calavi → Godomey → Stade → Agla → Fidjrossè → Cadjehoun",
  iti_3: "Akassato → Calavi → Godomey → Stade → Vèdoko → Cadjehoun",
  iti_4: "Akassato → Calavi → Godomey → Stade → Agla → Fidjrossè → Cadjehoun → Ganhi",
  iti_5: "Akassato → Calavi → Godomey → Stade → Agla → Fidjrossè → Cadjehoun → Ganhi → Akpakpa",
  autre: "Autre itinéraire",
};

export const STATIC_QUESTIONNAIRES = [
  {
    id: "1",
    slug: "transport-covoiturage-2026",
    title: "Transport en commun & Covoiturage",
    description:
      "Aidez TicketChé à préparer ses prochains services de bus organisé et de covoiturage sur les corridors Cotonou / Abomey-Calavi / Glodjigbe. 8 à 10 minutes, 100 % anonyme.",
    estimatedMinutes: 10,
    createdAt: "2026-04-01T08:00:00Z",
    status: "active",
    totalResponses: 0,
    steps: [

      // ── Section 1 — Profil ─────────────────────────────────────────────
      {
        id: "q1_age",
        icon: User,
        question: "Quel est votre âge ?",
        type: "single",
        options: [
          { id: "lt18",  icon: Baby,            label: "Moins de 18 ans", desc: "" },
          { id: "18_25", icon: Student,          label: "18 – 25 ans",     desc: "" },
          { id: "26_35", icon: PersonSimpleRun,  label: "26 – 35 ans",     desc: "" },
          { id: "36_45", icon: Briefcase,        label: "36 – 45 ans",     desc: "" },
          { id: "gt45",  icon: User,             label: "Plus de 45 ans",  desc: "" },
        ],
      },
      {
        id: "q2_sexe",
        icon: User,
        question: "Quel est votre sexe ?",
        type: "single",
        options: [
          { id: "homme", icon: GenderMale,   label: "Homme", desc: "" },
          { id: "femme", icon: GenderFemale, label: "Femme", desc: "" },
        ],
      },
      {
        id: "q3_profession",
        icon: Briefcase,
        question: "Quelle est votre profession / activité principale ?",
        type: "single",
        options: [
          { id: "etudiant",      icon: Student,          label: "Étudiant(e)",                  desc: "" },
          { id: "fonctionnaire", icon: Buildings,         label: "Fonctionnaire",                desc: "" },
          { id: "salarie_prive", icon: Briefcase,         label: "Salarié(e) privé(e)",         desc: "" },
          { id: "commercant",    icon: ShoppingCart,      label: "Commerçant(e)",                desc: "" },
          { id: "ouvrier",       icon: Wrench,            label: "Ouvrier(e) / Technicien(ne)", desc: "" },
          { id: "artisan",       icon: Wrench,            label: "Artisan(e)",                   desc: "" },
          { id: "sans_emploi",   icon: X,                 label: "Sans emploi",                  desc: "" },
          { id: "autre_prof",    icon: List,              label: "Autre",                        desc: "" },
        ],
      },
      {
        id: "q4_vehicule",
        icon: Car,
        question: "Possédez-vous un véhicule personnel ?",
        type: "single",
        options: [
          { id: "oui", icon: Car, label: "Oui", desc: "Je possède un véhicule" },
          { id: "non", icon: X,   label: "Non", desc: "Je n'ai pas de véhicule personnel" },
        ],
      },

      // ── Section 2 — Conducteurs (showIf q4 = "oui") ───────────────────
      {
        id: "q5_type_vehicule",
        icon: Car,
        question: "Quel type de véhicule possédez-vous ?",
        type: "single",
        showIf: { questionId: "q4_vehicule", values: ["oui"] },
        options: [
          { id: "moto",      icon: Motorcycle, label: "Moto",                          desc: "" },
          { id: "voiture_s", icon: Car,        label: "Voiture (2 à 4 places libres)", desc: "" },
          { id: "voiture_l", icon: Car,        label: "Voiture (5 places ou plus)",    desc: "" },
        ],
      },
      {
        id: "q6_places",
        icon: Seat,
        question: "Combien de places libres pouvez-vous proposer ?",
        type: "single",
        showIf: { questionId: "q4_vehicule", values: ["oui"] },
        options: [
          { id: "1",     icon: User,       label: "1 place",          desc: "" },
          { id: "2",     icon: Seat,       label: "2 places",         desc: "" },
          { id: "3",     icon: Seat,       label: "3 places",         desc: "" },
          { id: "4plus", icon: UsersThree, label: "4 places ou plus", desc: "" },
        ],
      },
      {
        id: "q7_carburant",
        icon: GasPump,
        question: "Quelle est votre dépense carburant aller-retour sur ce trajet ?",
        type: "single",
        showIf: { questionId: "q4_vehicule", values: ["oui"] },
        options: [
          { id: "lt1000",    icon: Coins,          label: "Moins de 1 000 FCFA", desc: "" },
          { id: "1000_2000", icon: GasPump,        label: "1 000 – 2 000 FCFA",  desc: "" },
          { id: "2000_3000", icon: GasPump,        label: "2 000 – 3 000 FCFA",  desc: "" },
          { id: "gt3000",    icon: CurrencyDollar, label: "Plus de 3 000 FCFA",  desc: "" },
        ],
      },
      {
        id: "q8_passagers",
        icon: ArrowsLeftRight,
        question: "Transportez-vous déjà des passagers contre rémunération ?",
        type: "single",
        showIf: { questionId: "q4_vehicule", values: ["oui"] },
        options: [
          { id: "oui_reg", icon: CalendarCheck, label: "Oui, régulièrement",    desc: "" },
          { id: "oui_occ", icon: Lightning,     label: "Oui, occasionnellement",desc: "" },
          { id: "non",     icon: X,             label: "Non",                    desc: "" },
        ],
      },
      {
        id: "q8b_app",
        icon: DeviceMobile,
        question: "Seriez-vous prêt(e) à proposer vos places via une application ?",
        type: "single",
        showIf: { questionId: "q4_vehicule", values: ["oui"] },
        options: [
          { id: "oui",       icon: Check,        label: "Oui",       desc: "" },
          { id: "non",       icon: X,            label: "Non",       desc: "" },
          { id: "peut_etre", icon: Question,     label: "Peut-être", desc: "" },
        ],
      },

      // ── Section 3 — Habitudes de déplacement (tous) ───────────────────
      {
        id: "q9_residence",
        icon: MapPin,
        question: "Dans quelle zone résidez-vous ?",
        type: "single",
        options: [
          { id: "calavi_centre",  icon: MapPin, label: "Abomey-Calavi centre", desc: "" },
          { id: "godomey",        icon: MapPin, label: "Godomey",              desc: "" },
          { id: "akassato",       icon: MapPin, label: "Akassato",             desc: "" },
          { id: "glodjigbe",      icon: MapPin, label: "Glodjigbe",            desc: "" },
          { id: "cotonou_centre", icon: MapPin, label: "Cotonou centre",       desc: "" },
          { id: "akpakpa",        icon: MapPin, label: "Akpakpa",              desc: "" },
          { id: "cadjehoun",      icon: MapPin, label: "Cadjehoun",            desc: "" },
          { id: "autre_zone",     icon: MapPin, label: "Autre",                desc: "" },
        ],
      },
      {
        id: "q10_lieu_activite",
        icon: Path,
        question: "Quel est votre lieu principal d'activité (travail / études) ?",
        type: "text",
        placeholder: "Ex : Université d'Abomey-Calavi, Ministère des Finances, GDIZ…",
      },
      {
        id: "q11_itineraire",
        icon: Path,
        question: "Précisez votre itinéraire habituel : départ → destination",
        type: "single",
        options: [
          {
            id: "iti_1",
            icon: RoadHorizon,
            label: "Akassato → Calavi → Godomey → Stade → Étoile Rouge → Tokpa → Akpakpa",
            desc:  "via Arconville, Kpota, Zogbadjè, UAC",
          },
          {
            id: "iti_2",
            icon: RoadHorizon,
            label: "Akassato → Calavi → Godomey → Stade → Agla → Fidjrossè → Cadjehoun",
            desc:  "via Arconville, Kpota, Zogbadjè, UAC",
          },
          {
            id: "iti_3",
            icon: RoadHorizon,
            label: "Akassato → Calavi → Godomey → Stade → Vèdoko → Cadjehoun",
            desc:  "via Arconville, Kpota, Zogbadjè, UAC",
          },
          {
            id: "iti_4",
            icon: RoadHorizon,
            label: "Akassato → Calavi → Godomey → Stade → Agla → Fidjrossè → Cadjehoun → Ganhi",
            desc:  "via Arconville, Kpota, Zogbadjè, UAC",
          },
          {
            id: "iti_5",
            icon: RoadHorizon,
            label: "Akassato → Calavi → Godomey → Stade → Agla → Fidjrossè → Cadjehoun → Ganhi → Akpakpa",
            desc:  "via Arconville, Kpota, Zogbadjè, UAC",
          },
          {
            id: "autre",
            icon: PencilLine,
            label: "Autre itinéraire",
            desc:  "Précisez carrefour ou quartier",
          },
        ],
      },
      {
        id: "q12_frequence",
        icon: Clock,
        question: "À quelle fréquence effectuez-vous ce trajet ?",
        type: "single",
        options: [
          { id: "5j_plus", icon: CalendarCheck,   label: "5 jours / semaine ou plus", desc: "Quotidien" },
          { id: "3_4j",    icon: ArrowsClockwise, label: "3 – 4 fois / semaine",      desc: "Régulier" },
          { id: "1_2j",    icon: Lightning,       label: "1 – 2 fois / semaine",      desc: "Semi-régulier" },
          { id: "occ",     icon: CalendarX,       label: "Occasionnellement",         desc: "Selon les besoins" },
        ],
      },
      {
        id: "q13_transport",
        icon: ArrowsLeftRight,
        question: "Quel(s) moyen(s) de transport utilisez-vous actuellement ?",
        type: "multi",
        showIf: { questionId: "q4_vehicule", values: ["non"] },
        options: [
          { id: "zemi",      icon: Motorcycle,     label: "Zémidjan",              desc: "Moto-taxi" },
          { id: "minibus",   icon: Bus,            label: "Tokpa-Tokpa / minibus", desc: "Transport informel" },
          { id: "taxi",      icon: Car,            label: "Taxi-ville",            desc: "" },
          { id: "autostop",  icon: RoadHorizon,    label: "Autostop",              desc: "" },
          { id: "autre_tsp", icon: List,           label: "Autre",                 desc: "" },
        ],
      },
      {
        id: "q14_depart",
        icon: Clock,
        question: "À quelle heure partez-vous habituellement le matin ?",
        type: "single",
        options: [
          { id: "avant6h",  icon: Moon,        label: "Avant 6h",  desc: "" },
          { id: "6h_8h",    icon: SunHorizon,  label: "6h – 8h",   desc: "Pointe matin" },
          { id: "8h_10h",   icon: Sun,         label: "8h – 10h",  desc: "" },
          { id: "apres10h", icon: SunDim,      label: "Après 10h", desc: "" },
        ],
      },
      {
        id: "q15_retour",
        icon: Clock,
        question: "À quelle heure rentrez-vous habituellement ?",
        type: "single",
        options: [
          { id: "avant16h", icon: Sun,        label: "Avant 16h",  desc: "" },
          { id: "16h_18h",  icon: SunHorizon, label: "16h – 18h",  desc: "Pointe soir" },
          { id: "18h_20h",  icon: SunDim,     label: "18h – 20h",  desc: "" },
          { id: "apres20h", icon: Moon,       label: "Après 20h",  desc: "" },
        ],
      },
      {
        id: "q16_duree",
        icon: Clock,
        question: "Quelle est la durée moyenne de votre trajet ?",
        type: "single",
        options: [
          { id: "lt30",  icon: Lightning, label: "Moins de 30 min", desc: "" },
          { id: "30_1h", icon: Timer,     label: "30 min – 1h",     desc: "" },
          { id: "1h_2h", icon: Hourglass, label: "1h – 2h",         desc: "" },
          { id: "gt2h",  icon: Clock,     label: "Plus de 2h",      desc: "" },
        ],
      },
      {
        id: "q17_cout",
        icon: CurrencyDollar,
        question: "Quel est votre coût actuel pour un trajet aller simple ?",
        type: "single",
        showIf: { questionId: "q4_vehicule", values: ["non"] },
        options: [
          { id: "lt200",       icon: Coins,          label: "Moins de 200 FCFA",  desc: "" },
          { id: "200_500",     icon: Wallet,         label: "200 – 500 FCFA",     desc: "" },
          { id: "500_1000",    icon: Money,          label: "500 – 1 000 FCFA",   desc: "" },
          { id: "autre_cout",  icon: CurrencyDollar, label: "Plus de 1 000 FCFA (préciser)", desc: "" },
        ],
      },

      // ── Section 4 — Difficultés ────────────────────────────────────────
      {
        id: "q18_difficultes",
        icon: Warning,
        question: "Rencontrez-vous des difficultés dans vos déplacements ?",
        type: "single",
        options: [
          { id: "oui", icon: Warning, label: "Oui", desc: "J'ai des problèmes réguliers" },
          { id: "non", icon: Check,   label: "Non", desc: "Mes déplacements se passent bien" },
        ],
      },
      {
        id: "q19_type_difficultes",
        icon: Warning,
        question: "Quelles difficultés rencontrez-vous ?",
        type: "multi",
        showIf: { questionId: "q18_difficultes", values: ["oui"] },
        options: [
          { id: "retards",        icon: Clock,          label: "Retards fréquents",               desc: "" },
          { id: "cout_eleve",     icon: CurrencyDollar, label: "Coût élevé",                      desc: "" },
          { id: "trop_arrets",    icon: Barricade,      label: "Trop d'arrêts",                   desc: "" },
          { id: "confort",        icon: ThumbsDown,     label: "Confort insuffisant",             desc: "" },
          { id: "insecurite",     icon: ShieldSlash,    label: "Insécurité",                      desc: "" },
          { id: "manque_tsp",     icon: Bus,            label: "Manque de transport disponible",  desc: "" },
          { id: "heures_creuses", icon: Moon,           label: "Difficultés aux heures creuses",  desc: "" },
          { id: "autre_diff",     icon: List,           label: "Autre",                           desc: "" },
        ],
      },

      // ── Section 5 — Présentation TicketChé + intérêt ──────────────────
      {
        id: "q20_interet",
        icon: Sparkle,
        intro: "TicketChé est une application qui vous permet soit de réserver une place dans un bus organisé avec des horaires fixes, soit de partager un trajet avec un conducteur qui fait le même chemin que vous. L'objectif est de rendre vos déplacements plus fiables, plus confortables et plus accessibles.",
        question: "Seriez-vous intéressé(e) par cette solution ?",
        type: "single",
        // Si "non" → champ "Pourquoi ?" affiché puis fin du questionnaire
        endIf: { values: ["non"] },
        endIfLabel: "Pourquoi ?",
        options: [
          { id: "oui",       icon: ThumbsUp,   label: "Oui",       desc: "Je suis intéressé(e)" },
          { id: "peut_etre", icon: Question,   label: "Peut-être", desc: "Sous certaines conditions" },
          { id: "non",       icon: ThumbsDown, label: "Non",       desc: "" },
        ],
      },
      {
        id: "q21_service",
        icon: Bus,
        question: "Quel service vous intéresse le plus ?",
        type: "single",
        options: [
          { id: "bus",         icon: Bus,             label: "Bus organisé avec horaires fixes", desc: "Réservation à l'avance" },
          { id: "covoiturage", icon: Car,             label: "Covoiturage avec un conducteur",   desc: "Partage de trajet" },
          { id: "les_deux",    icon: ArrowsLeftRight, label: "Les deux selon le moment",         desc: "" },
        ],
      },
      // Q22a — Si bus organisé uniquement
      {
        id: "q22a_reservation_bus",
        icon: CalendarCheck,
        question: "Seriez-vous prêt(e) à réserver votre trajet à l'avance ?",
        type: "single",
        showIf: { questionId: "q21_service", values: ["bus"] },
        options: [
          { id: "veille",  icon: CalendarCheck, label: "Oui, la veille",     desc: "" },
          { id: "matin",   icon: SunHorizon,    label: "Oui, le matin même", desc: "" },
          { id: "non",     icon: X,             label: "Non",                desc: "" },
        ],
      },
      {
        id: "q22_role",
        icon: ArrowRight,
        question: "Dans le covoiturage, vous seriez plutôt :",
        type: "single",
        showIf: { questionId: "q21_service", values: ["covoiturage", "les_deux"] },
        options: [
          { id: "passager",   icon: ArrowRight,      label: "Passager",   desc: "Je cherche un conducteur" },
          { id: "conducteur", icon: Car,             label: "Conducteur", desc: "Je propose mes places" },
          { id: "les_deux",   icon: ArrowsLeftRight, label: "Les deux",   desc: "" },
        ],
      },
      {
        id: "q23_reservation",
        icon: Clock,
        question: "Seriez-vous prêt(e) à réserver votre trajet à l'avance ?",
        type: "single",
        showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
        options: [
          { id: "veille",  icon: CalendarCheck,   label: "Oui, la veille",               desc: "" },
          { id: "matin",   icon: SunHorizon,      label: "Oui, le matin même",           desc: "" },
          { id: "demande", icon: Lightning,       label: "Non, je préfère à la demande", desc: "" },
        ],
      },

      // ── Section 6 — Paiement & adoption digitale ──────────────────────
      // ⚠️ Ne s'affiche QUE si Q22_role = passager ou les_deux
      {
        id: "q24_mobile_money",
        icon: DeviceMobile,
        question: "Utilisez-vous le Mobile Money (MTN MoMo, Moov Money) ?",
        type: "single",
        showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
        options: [
          { id: "oui_reg", icon: CalendarCheck, label: "Oui, régulièrement",    desc: "" },
          { id: "oui_occ", icon: Lightning,     label: "Oui, occasionnellement",desc: "" },
          { id: "non",     icon: X,             label: "Non",                    desc: "" },
        ],
      },
      {
        id: "q25_smartphone",
        icon: DeviceMobile,
        question: "Disposez-vous d'un smartphone avec accès internet ?",
        type: "single",
        showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
        options: [
          { id: "oui", icon: DeviceMobile, label: "Oui", desc: "" },
          { id: "non", icon: X,            label: "Non", desc: "" },
        ],
      },
      {
        id: "q26_paiement_app",
        icon: CreditCard,
        question: "Seriez-vous prêt(e) à payer via une application ?",
        type: "single",
        showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
        options: [
          { id: "oui",     icon: Check,      label: "Oui",                         desc: "" },
          { id: "non",     icon: X,          label: "Non",                         desc: "" },
          { id: "especes", icon: HandCoins,  label: "Je préfère payer en espèces", desc: "Au départ" },
        ],
      },
      {
        id: "q27_prix",
        icon: CurrencyDollar,
        question: "Combien seriez-vous prêt(e) à payer via TicketChé pour un trajet aller simple ?",
        type: "single",
        showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
        options: [
          { id: "lt300",   icon: Coins,          label: "Moins de 300 FCFA", desc: "" },
          { id: "300_500", icon: Wallet,         label: "300 – 500 FCFA",    desc: "" },
          { id: "500_800", icon: Money,          label: "500 – 800 FCFA",    desc: "" },
          { id: "gt800",   icon: CurrencyDollar, label: "Plus de 800 FCFA",  desc: "" },
        ],
      },
      {
        id: "q28_abonnement",
        icon: Tag,
        question: "Un abonnement mensuel illimité sur ce trajet vous intéresserait-il ?",
        type: "single",
        showIf: { questionId: "q22_role", values: ["passager", "les_deux"] },
        options: [
          { id: "oui",       icon: ThumbsUp,   label: "Oui",       desc: "" },
          { id: "non",       icon: ThumbsDown, label: "Non",       desc: "" },
          { id: "peut_etre", icon: Question,   label: "Peut-être", desc: "" },
        ],
      },
      {
        id: "q28b_prix_abo",
        icon: Money,
        question: "À quel prix mensuel seriez-vous prêt(e) à souscrire ?",
        type: "single",
        showIf: { questionId: "q28_abonnement", values: ["oui", "peut_etre"] },
        options: [
          { id: "lt5000",     icon: Coins,          label: "Moins de 5 000 FCFA",  desc: "" },
          { id: "5000_8000",  icon: Wallet,         label: "5 000 – 8 000 FCFA",   desc: "" },
          { id: "8000_12000", icon: Money,          label: "8 000 – 12 000 FCFA",  desc: "" },
          { id: "gt12000",    icon: CurrencyDollar, label: "Plus de 12 000 FCFA",  desc: "" },
        ],
      },

      // ── Section 7 — Perception ─────────────────────────────────────────
      {
        id: "q29_avantages",
        icon: ThumbsUp,
        question: "Quels avantages voyez-vous dans ce service ?",
        type: "multi",
        maxSelect: 2,
        options: [
          { id: "couts",    icon: Coins,         label: "Réduction des coûts",  desc: "" },
          { id: "temps",    icon: Lightning,     label: "Gain de temps",        desc: "" },
          { id: "confort",  icon: Seat,          label: "Plus de confort",      desc: "" },
          { id: "stress",   icon: Sparkle,       label: "Moins de stress",      desc: "" },
          { id: "securite", icon: ShieldCheck,   label: "Sécurité améliorée",   desc: "" },
          { id: "autre_av", icon: List,          label: "Autre",                desc: "" },
        ],
      },
      {
        id: "q30_obstacles",
        icon: Warning,
        question: "Quels obstacles voyez-vous ?",
        type: "multi",
        maxSelect: 2,
        options: [
          { id: "confiance",  icon: ShieldSlash,    label: "Insécurité / manque de confiance", desc: "" },
          { id: "app_diff",   icon: DeviceMobile,   label: "Difficulté à utiliser une app",    desc: "" },
          { id: "prix_eleve", icon: CurrencyDollar, label: "Prix potentiellement élevé",       desc: "" },
          { id: "horaires",   icon: Clock,          label: "Horaires non adaptés",             desc: "" },
          { id: "zones",      icon: MapPin,         label: "Zones non couvertes",              desc: "" },
          { id: "autre_obs",  icon: List,           label: "Autre",                            desc: "" },
        ],
      },

      // ── Section 8 — Suggestions libres ────────────────────────────────
      {
        id: "q31_suggestions",
        icon: PencilLine,
        question: "Avez-vous des suggestions ou remarques à nous partager ?",
        type: "text",
        placeholder: "Vos suggestions, remarques ou idées pour améliorer les transports…",
        optional: true,
      },
    ],
  },
];