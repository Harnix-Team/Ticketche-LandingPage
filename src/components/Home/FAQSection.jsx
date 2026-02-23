"use client";
import { useState } from "react";

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const faqData = [
    {
      question: "Qu'est-ce que TicketCHE ?",
      answer:
        "TicketCHE est une application mobile qui vous permet de réserver et payer facilement des emplacements de parking, de lavage et de garage au Bénin. Plus besoin de chercher une place ou de faire la queue !",
    },
    {
      question: "Comment télécharger l'application ?",
      answer:
        "Vous pouvez télécharger TicketCHE gratuitement sur Google Play Store (Android) ou App Store (iOS). Recherchez 'TicketCHE' et installez l'application officielle.",
    },
    {
      question: "L'application est-elle gratuite ?",
      answer:
        "Oui, l'application TicketCHE est entièrement gratuite à télécharger et utiliser. Vous ne payez que pour les services que vous réservez.",
    },
    {
      question: "Comment créer un compte ?",
      answer:
        "Ouvrez l'application, cliquez sur 'S'inscrire', renseignez votre numéro de téléphone, email et créez un mot de passe. Vous recevrez un code de vérification par SMS.",
    },
    {
      question: "J'ai oublié mon mot de passe, que faire ?",
      answer:
        "Sur l'écran de connexion, cliquez sur 'Mot de passe oublié', entrez votre numéro de téléphone ou email, et suivez les instructions pour réinitialiser votre mot de passe.",
    },
    {
      question: "ticketché est-il disponible dans tout le Bénin ?",
      answer:
        "Nous sommes actuellement opérationnels à Cotonou et Abomey-Calavi, et étendons progressivement notre réseau vers d'autres villes.",
    },

    // 🔍 UTILISATION DES SERVICES
    {
      question: "Comment trouver un emplacement près de moi ?",
      answer:
        "À la connexion, vous avez des recommandations d'emplacements dans un rayon de 5km de vous. Vous pouvez aussi utiliser l'onglet 'Carte' pour voir tous les emplacements disponibles autour de vous, ou utiliser la barre de recherche pour chercher par quartier.",
    },
    {
      question: "Comment utiliser les filtres par service ?",
      answer:
        "Cliquez sur le service pour lequel vous voulez un emplacement (parking, lavage, garage) et un filtre s'effectue, vous affichant sur une carte tous les emplacements correspondants, avec l'itinéraire pour vous y rendre.",
    },
    {
      question: "Comment utiliser TicketCHE une fois sur place ?",
      answer:
        "1. Choisissez/changez le matricule de votre véhicule sur votre profil\n2. Présentez votre QR profil au gérant\n3. Le gérant scanne votre QR et vous recevez directement votre ticket\n4. Au retour, faites scanner le QR code du ticket\n5. Choisissez votre moyen de paiement et cliquez sur payer\n6. Vous recevrez la confirmation",
    },
    {
      question: "Pourquoi dois-je enregistrer mes véhicules ?",
      answer:
        "Pour utiliser TicketCHE, vous devez enregistrer vos véhicules pour plus de sécurité dans l'onglet 'Informations de Vos véhicules' sur votre profil. Suivez les instructions et attendez que l'enregistrement soit validé.",
    },
    {
      question: "Comment changer de véhicule avant de scanner ?",
      answer:
        "Avant de faire scanner un QR code, allez dans votre profil, sélectionnez le matricule de le véhicule (véhicule) que vous utilisez, puis faites scanner votre QR profil au gérant.",
    },
    {
      question: "TicketCHE propose-t-il un système de réservation ?",
      answer:
        "Non, nous n'implémentons pas encore de système de réservation. Vous vous rendez directement sur place et utilisez le système de QR code pour obtenir votre ticket.",
    },
    {
      question: "Comment fonctionne le ticket numérique ?",
      answer:
        "Chaque opération génère un ticket horodaté, sécurisé et scannable. Vous pouvez suivre en temps réel votre véhicule et garder une preuve de chaque service effectué.",
    },

    // 💰 PAIEMENT ET PORTEFEUILLE
    {
      question: "Quels moyens de paiement sont acceptés ?",
      answer:
        "Nous acceptons : paiement via votre portefeuille TicketCHE (recommandé), Mobile Money (MTN Money, Moov Money), cartes bancaires, et paiement en espèces directement auprès du gestionnaire.",
    },
    {
      question: "Comment recharger mon portefeuille ?",
      answer:
        "Pour payer électroniquement, rechargez votre portefeuille via l'application en cliquant sur 'Portefeuille' depuis le profil ou l'accueil. Vous pouvez utiliser Mobile Money ou carte bancaire pour recharger.",
    },
    {
      question: "Le paiement est-il sécurisé ?",
      answer:
        "Absolument ! Tous les paiements sont cryptés et sécurisés. Nous utilisons les mêmes standards de sécurité que les banques. Vos informations financières ne sont jamais stockées sur nos serveurs.",
    },
    {
      question: "Comment se déroule le paiement sur place ?",
      answer:
        "Au retour, faites scanner le QR code de votre ticket, choisissez votre moyen de paiement (portefeuille, Mobile Money, espèces), cliquez sur 'Payer', et faites scanner le QR code qui s'affiche au gérant, vous recevrez la confirmation de paiement.",
    },
    {
      question: "Y a-t-il des frais supplémentaires ?",
      answer:
        "Non, le prix affiché est le prix final. Aucun frais caché ou commission supplémentaire n'est ajouté lors du paiement.",
    },

    // 📋 GESTION DES TICKETS
    {
      question: "Comment voir mes tickets ?",
      answer:
        "Allez dans l'onglet 'Profil' puis 'Mes tickets'. Vous y trouverez tous vos tickets passés et en cours avec tous les détails et QR codes.",
    },
    {
      question: "Que faire si je perds mon ticket ?",
      answer:
        "Pas de panique ! Votre ticket est sauvegardé dans l'application. Allez dans 'Mes tickets' pour retrouver le QR code de votre ticket et le montrer au gérant.",
    },
    {
      question: "Combien de temps ai-je pour récupérer mon véhicule ?",
      answer:
        "La durée dépend du service utilisé et des conditions de l'emplacement. Cette information est affichée sur votre ticket. En cas de dépassement, des frais supplémentaires peuvent s'appliquer.",
    },
    {
      question: "Comment fonctionne le système de QR code ?",
      answer:
        "Vous avez 2 QR codes : votre QR profil (pour obtenir un ticket) et le QR code de votre ticket (pour payer et sortir). Le gérant scanne ces codes pour valider votre entrée et sortie.",
    },

    // 🚗 SERVICES SPÉCIFIQUES
    {
      question: "Quels types de véhicules sont acceptés ?",
      answer:
        "Nous acceptons : motos, scooters, voitures particulières, 4x4, véhicules utilitaires légers. Pour les poids lourds, vérifiez les restrictions spécifiques de chaque emplacement.",
    },
    {
      question: "Qu'est-ce qui est inclus dans le service parking ?",
      answer:
        "Le service parking inclut : emplacement sécurisé, surveillance (si mentionnée), accès pendant les heures d'ouverture. Certains emplacements offrent des services premium (couvert, gardien 24h/24).",
    },
    {
      question: "Quels services de lavage sont disponibles ?",
      answer:
        "Services proposés : lavage extérieur simple, lavage complet (extérieur + intérieur), lavage de luxe avec cire, nettoyage moteur. Les détails et prix sont spécifiés pour chaque prestataire.",
    },
    {
      question: "Quels services sont disponibles sur ticketché ?",
      answer:
        "L'application couvre trois catégories principales : stationnement sécurisé, services de garage (mécanique, entretien) et lavage de véhicules.",
    },

    // 📞 SUPPORT ET SIGNALEMENT
    {
      question: "Comment signaler un problème ?",
      answer:
        "Pour signaler un problème, allez sur le site web de TicketCHE (ticketche.com) et laissez-nous un message directement via la bulle de messagerie. Notre équipe vous répondra rapidement.",
    },
    {
      question: "Comment contacter le support client ?",
      answer:
        "Plusieurs options : chat sur notre site web ticketche.com (24h/24), email support@ticketche.com, ou via nos réseaux sociaux @TicketCheBenin.",
    },
    {
      question: "Quels sont les horaires du support ?",
      answer:
        "Support technique : 24h/24 via chat web. Support téléphonique : Lundi-Vendredi 8h-19h, Samedi 9h-17h, Dimanche 10h-15h. Réponse email sous 2-4h en semaine.",
    },
    {
      question: "L'application ne fonctionne pas, que faire ?",
      answer:
        "Solutions : vérifiez votre connexion internet, fermez et rouvrez l'app, redémarrez votre téléphone, vérifiez les mises à jour dans le store. Si le problème persiste, contactez le support.",
    },

    // 🔒 SÉCURITÉ ET CONFIDENTIALITÉ
    {
      question: "Mes données personnelles sont-elles protégées ?",
      answer:
        "Oui, absolument ! Nous utilisons un cryptage de niveau bancaire, vos données sont stockées sur des serveurs sécurisés, et nous respectons strictement les normes de protection des données. Vos informations ne sont jamais vendues.",
    },
    {
      question: "Comment sont sécurisés mes paiements ?",
      answer:
        "Tous les paiements passent par des plateformes certifiées. Vos données bancaires sont cryptées et nous ne stockons jamais vos numéros de carte ou codes PIN.",
    },
    {
      question: "Est-ce que mes données sont sécurisées ?",
      answer:
        "Oui. ticketché utilise des mécanismes de chiffrement et des protocoles de sécurité avancés pour protéger vos informations personnelles et vos transactions.",
    },

    // 👨‍💼 POUR LES GÉRANTS
    {
      question: "Je suis gérant, comment rejoindre ticketché ?",
      answer:
        "Les gérants peuvent créer un compte, enregistrer leurs emplacements et passer par une vérification rapide effectuée par l'équipe ticketché. Une fois validés, ils accèdent à un espace complet pour digitaliser leurs opérations, gérer les tickets, encaisser les paiements et suivre leurs performances en temps réel.",
    },
  ];

  // Nombre de questions à afficher initialement (divisible par 2 pour le grid)
  const INITIAL_DISPLAY = 8;
  const displayedFAQs = showAll ? faqData : faqData.slice(0, INITIAL_DISPLAY);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="max-w-7xl mx-auto lg:rounded-3xl py-16 md:mt-10 bg-[#692C00]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vous avez des questions ?
          </h2>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Trouvez rapidement les réponses aux questions les plus fréquemment
            posées.
          </p>
        </div>

        {/* Grid 2 colonnes */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {displayedFAQs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="border border-white/20 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-5 flex justify-between items-center gap-4"
              >
                <span className="font-semibold text-white flex-1">
                  {faq.question}
                </span>
                <span className="text-white text-xl font-bold flex-shrink-0">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <div className="p-5 pt-0 text-white/90 text-sm leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bouton "Voir plus / Voir moins" */}
        {faqData.length > INITIAL_DISPLAY && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="
                px-8 py-3 
                bg-white 
                text-[#692C00] 
                font-semibold 
                rounded-lg 
                hover:bg-white/90 
                transition-all 
                duration-300
                shadow-lg
                hover:shadow-xl
                hover:scale-105
              "
            >
              {showAll ? (
                <>
                  Voir moins
                  <span className="ml-2">↑</span>
                </>
              ) : (
                <>
                  Voir plus de questions ({faqData.length - INITIAL_DISPLAY}{" "}
                  restantes)
                  <span className="ml-2">↓</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
