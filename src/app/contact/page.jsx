"use client";

import { useState } from "react";
import { MapPin, Envelope, Phone, WhatsappLogo } from "@phosphor-icons/react";

// ─── FAQ DATA ───────────────────────────────────────────────────────────────
const categories = [
  {
    id: "general",
    title: "Général",
    subtitle: "Vous découvrez TicketCHE ?",
    description:
      "TicketCHE est une application mobile tout-en-un qui vous permet de trouver et réserver des emplacements de parking, de lavage auto, de garage, et d'acheter vos billets d'événements au Bénin.",
    faqs: [
      { question: "Qu'est-ce que TicketCHE ?", answer: "TicketCHE est une application mobile tout-en-un qui vous permet de trouver et réserver des emplacements de parking, de lavage auto, de garage, et d'acheter vos billets d'événements (concerts, soirées, expos) au Bénin." },
      { question: "Comment télécharger l'application ?", answer: "Vous pouvez télécharger TicketCHE gratuitement sur Google Play Store (Android) ou App Store (iOS). Recherchez 'TicketCHE' et installez l'application officielle." },
      { question: "L'application est-elle gratuite ?", answer: "Oui, l'application TicketCHE est entièrement gratuite à télécharger et utiliser. Vous ne payez que pour les services que vous réservez." },
      { question: "Comment créer un compte ?", answer: "Ouvrez l'application, cliquez sur 'S'inscrire', renseignez votre numéro de téléphone, email et créez un mot de passe. Vous recevrez un code de vérification par SMS." },
      { question: "TicketCHE est-il disponible dans tout le Bénin ?", answer: "Nous sommes actuellement opérationnels à Cotonou et Abomey-Calavi, et étendons progressivement notre réseau vers d'autres villes." },
    ],
  },
  {
    id: "services",
    title: "Utilisation des services",
    subtitle: "Vous êtes utilisateurs ?",
    description: "Découvrez comment utiliser TicketCHE pour trouver un emplacement, obtenir votre ticket via QR code et bénéficier de tous les services disponibles : parking, lavage, garage et billetterie.",
    faqs: [
      { question: "Comment trouver un emplacement près de moi ?", answer: "À la connexion, vous avez des recommandations d'emplacements dans un rayon de 5km. Utilisez l'onglet 'Carte' pour voir tous les emplacements disponibles, ou la barre de recherche pour chercher par quartier." },
      { question: "Comment utiliser TicketCHE une fois sur place ?", answer: "1. Choisissez le matricule de votre véhicule sur votre profil\n2. Présentez votre QR profil au gérant\n3. Le gérant scanne votre QR et vous recevez votre ticket\n4. Au retour, faites scanner le QR code du ticket\n5. Choisissez votre moyen de paiement et cliquez sur payer" },
      { question: "Pourquoi dois-je enregistrer mes véhicules ?", answer: "Pour utiliser TicketCHE, vous devez enregistrer vos véhicules dans l'onglet 'Informations de Vos véhicules' sur votre profil. Suivez les instructions et attendez que l'enregistrement soit validé." },
      { question: "Quels services sont disponibles sur TicketCHE ?", answer: "L'application couvre quatre catégories : stationnement sécurisé, garage (mécanique, entretien), lavage de véhicules, et billetterie d'événements (concerts, soirées, conférences, expos)." },
      { question: "TicketCHE propose-t-il un système de réservation ?", answer: "Non, nous n'implémentons pas encore de système de réservation. Vous vous rendez directement sur place et utilisez le système de QR code pour obtenir votre ticket." },
    ],
  },
  {
    id: "paiement",
    title: "Paiement & Portefeuille",
    subtitle: "Vos transactions",
    description: "TicketCHE accepte plusieurs moyens de paiement sécurisés : portefeuille intégré, Mobile Money (MTN, Moov), cartes bancaires et espèces. Tous vos paiements sont cryptés avec des standards bancaires.",
    faqs: [
      { question: "Quels moyens de paiement sont acceptés ?", answer: "Nous acceptons : paiement via votre portefeuille TicketCHE (recommandé), Mobile Money (MTN Money, Moov Money), cartes bancaires, et paiement en espèces directement auprès du gestionnaire." },
      { question: "Comment recharger mon portefeuille ?", answer: "Rechargez votre portefeuille via l'application en cliquant sur 'Portefeuille' depuis le profil ou l'accueil. Vous pouvez utiliser Mobile Money ou carte bancaire pour recharger." },
      { question: "Y a-t-il des frais supplémentaires ?", answer: "Non, le prix affiché est le prix final. Aucun frais caché ou commission supplémentaire n'est ajouté lors du paiement." },
      { question: "Le paiement est-il sécurisé ?", answer: "Absolument ! Tous les paiements sont cryptés et sécurisés. Nous utilisons les mêmes standards de sécurité que les banques. Vos informations financières ne sont jamais stockées sur nos serveurs." },
    ],
  },
  {
    id: "evenements",
    title: "Événements & Billets",
    subtitle: "Concerts, soirées, expos",
    description: "Achetez vos billets d'événements directement depuis l'application. Recevez instantanément un QR code à présenter à l'entrée. Organisateurs, créez vos événements facilement.",
    faqs: [
      { question: "Comment acheter un billet d'événement ?", answer: "Allez dans l'onglet Événements, choisissez l'événement, sélectionnez votre type de ticket et payez via portefeuille ou Mobile Money. Vous recevrez instantanément un QR code à présenter à l'entrée." },
      { question: "Est-ce que les billets sont remboursables ?", answer: "Les conditions de remboursement dépendent de l'organisateur. Ces informations sont indiquées sur la page de l'événement avant l'achat. En cas de doute, contactez support@ticketche.com." },
      { question: "Je suis organisateur, comment créer mon événement ?", answer: "Créez un compte gérant, soumettez votre événement pour validation. Une fois validé, configurez vos types de tickets, tarifs et suivez vos réservations en temps réel depuis votre tableau de bord." },
    ],
  },
  {
    id: "support",
    title: "Support & Sécurité",
    subtitle: "Besoin d'aide ?",
    description: "Notre équipe support est disponible 24h/24 via chat sur ticketche.com, par email à support@ticketche.com, et via nos réseaux sociaux @TicketCheBenin. Vos données sont protégées par un chiffrement de niveau bancaire.",
    faqs: [
      { question: "Comment contacter le support client ?", answer: "Plusieurs options : chat sur ticketche.com (24h/24), email support@ticketche.com, ou via nos réseaux sociaux @TicketCheBenin." },
      { question: "Quels sont les horaires du support ?", answer: "Support technique : 24h/24 via chat web. Support téléphonique : Lun-Ven 8h-19h, Sam 9h-17h, Dim 10h-15h. Réponse email sous 2-4h en semaine." },
      { question: "Mes données personnelles sont-elles protégées ?", answer: "Oui ! Nous utilisons un cryptage de niveau bancaire, vos données sont stockées sur des serveurs sécurisés et nous respectons strictement les normes de protection des données. Vos informations ne sont jamais vendues." },
      { question: "L'application ne fonctionne pas, que faire ?", answer: "Vérifiez votre connexion internet, fermez et rouvrez l'app, redémarrez votre téléphone, vérifiez les mises à jour dans le store. Si le problème persiste, contactez le support." },
    ],
  },
];

// ─── ICONS ──────────────────────────────────────────────────────────────────
const DiagonalArrow = ({ white }) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path
      d="M4 14L14 4M14 4H7M14 4V11"
      stroke={white ? "#fff" : "#692C00"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={`faq-chevron${active ? " faq-chevron--open" : ""}`}>
    <path d="M7 4l6 6-6 6" stroke="#692C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── FAQ SECTION ─────────────────────────────────────────────────────────────
function FAQSection() {
  const [activeCat, setActiveCat] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const current = categories[activeCat];

  return (
    <section id="faq" className="faq-section py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3" style={{ color: "#1a1a1a", letterSpacing: "-0.02em" }}>
          Questions fréquentes
        </h2>
        <p className="faq-panel__desc" style={{ fontSize: "1rem" }}>
          Trouvez rapidement les réponses aux questions les plus posées.
        </p>
      </div>

      <div className="faq-grid">
        {/* Left — category cards */}
        <div className="faq-cats">
          {categories.map((cat, idx) => {
            const isActive = idx === activeCat;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCat(idx); setOpenFaq(null); }}
                className={`faq-cat-btn${isActive ? " faq-cat-btn--active" : ""}`}
              >
                <div className="faq-cat-btn__row">
                  <div className="faq-cat-btn__icon">
                    <DiagonalArrow white={isActive} />
                  </div>
                  <div>
                    <div className="faq-cat-btn__title">{cat.title}</div>
                    <div className="faq-cat-btn__sub">
                      {isActive ? cat.description : cat.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right — accordion */}
        <div className="faq-panel">
          <div className="faq-panel__header">
            <div className="faq-panel__header-row">
              <div className="faq-panel__header-icon">
                <DiagonalArrow white={false} />
              </div>
              <span className="faq-panel__title">{current.title}</span>
            </div>
            <p className="faq-panel__desc">{current.description}</p>
          </div>

          {current.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="faq-item">
                <button className="faq-item__btn" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                  <span className={`faq-item__question${isOpen ? " faq-item__question--open" : ""}`}>
                    {faq.question}
                  </span>
                  <div className={`faq-item__chevron-wrap${isOpen ? " faq-item__chevron-wrap--open" : ""}`}>
                    <ChevronRight active={isOpen} />
                  </div>
                </button>
                {isOpen && (
                  <div className="faq-item__answer">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ContactFAQPage() {
  return (
    <>
      {/* ── CONTACT SECTION ── */}
      <section className="bg-[#e6dfd9] py-16 px-4 mt-24 flex items-center justify-center">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Bloc coordonnées */}
          <div className="md:w-1/2 bg-[#692c00] text-white p-10 flex flex-col justify-center gap-6">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#ffffff" }}>Coordonnées</h2>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <MapPin weight="fill" className="w-6 h-6" />
              Abomey-Calavi, Tankpè, Bénin
            </div>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <Envelope weight="fill" className="w-6 h-6" />
              hello@locapay.app
            </div>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <Phone weight="fill" className="w-6 h-6" />
              +229 01 62 60 83 58
            </div>
            <div className="flex items-center gap-3 bg-[#805633] p-4 rounded-lg shadow-md">
              <WhatsappLogo weight="fill" className="w-6 h-6" />
              +229 01 49 80 80 36
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center gap-6">
            <h2 className="text-2xl font-semibold text-[#692c00]">Contactez-nous</h2>
            <p className="text-gray-700">
              Rejoignez l'écosystème TicketCHE et découvrez une expérience de
              réservation sécurisée, flexible et transparente. Une solution qui
              révolutionne la gestion de vos parkings, lavages et événements.
            </p>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Nom" className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
                <input type="text" placeholder="Prénom" className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
              </div>
              <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
              <textarea placeholder="Message" className="border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#692c00]" />
              <button type="submit" className="bg-[#692c00] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#805633] transition-colors">
                Envoyer
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <FAQSection />
    </>
  );
}