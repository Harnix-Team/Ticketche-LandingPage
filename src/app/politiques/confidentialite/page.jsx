import { Facts, LegalPage, Note, Terms } from "@/components/legal/LegalPage";
import { PHONE_DISPLAY } from "@/config/constants";

export const metadata = {
  title: "Politique de Confidentialité | Ticketché",
  description:
    "Politique de confidentialité de Ticketché. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.",
  alternates: { canonical: "/politiques/confidentialite" },
  robots: { index: true, follow: false },
};

const COLLECTED = [
  { title: "Identification", items: ["Nom et prénom", "Adresse email", "Numéro de téléphone", "Date de naissance"] },
  { title: "Véhicule", items: ["Immatriculation", "Marque et modèle", "Couleur"] },
  { title: "Localisation", items: ["Position GPS (avec consentement)", "Historique des parkings"] },
  { title: "Paiement", items: ["Informations de facturation", "Historique des transactions"] },
];

const SECTIONS = [
  {
    id: "responsable",
    title: "Responsable du traitement des données",
    content: (
      <Facts
        items={[
          { label: "Application", value: "Ticketché" },
          { label: "Email", value: "support@ticketche.com" },
          { label: "Téléphone", value: PHONE_DISPLAY },
          { label: "Adresse", value: "Abomey-Calavi, Bénin" },
        ]}
      />
    ),
  },
  {
    id: "donnees-collectees",
    title: "Données collectées",
    content: (
      <>
        <p>Nous collectons les données suivantes pour assurer le bon fonctionnement de l’application :</p>
        <ol>
          {COLLECTED.map(({ title, items }) => (
            <li key={title}>
              <strong className="block">{title}</strong>
              <ul className="mt-1">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <Note>
          <strong>Note :</strong> Les données de carte bancaire sont traitées uniquement par nos prestataires
          certifiés (Stripe, PayPal) et ne sont jamais stockées sur nos serveurs.
        </Note>
      </>
    ),
  },
  {
    id: "finalites",
    title: "Pourquoi collectons-nous vos données ?",
    content: (
      <Terms
        ordered
        items={[
          { title: "Gestion des réservations", desc: "Traiter vos demandes de parking, garage et lavage" },
          { title: "Traitement des paiements", desc: "Facturation et gestion des transactions" },
          { title: "Communication", desc: "Confirmations, notifications et informations" },
          { title: "Amélioration du service", desc: "Analyse et optimisation de l’application" },
          { title: "Support client", desc: "Répondre à vos questions et problèmes" },
          { title: "Sécurité", desc: "Prévention des fraudes et sécurité" },
        ]}
      />
    ),
  },
  {
    id: "base-legale",
    title: "Base légale du traitement",
    content: (
      <Terms
        items={[
          { title: "Exécution du contrat", desc: "Fourniture des services demandés" },
          { title: "Consentement", desc: "Acceptation explicite du traitement (ex : géolocalisation)" },
          { title: "Intérêt légitime", desc: "Amélioration des services et prévention des fraudes" },
          { title: "Obligation légale", desc: "Respect des obligations fiscales et comptables" },
        ]}
      />
    ),
  },
  {
    id: "destinataires",
    title: "Partage et destinataires des données",
    content: (
      <>
        <p>
          Vos données peuvent être partagées avec les destinataires suivants, uniquement dans le cadre strict de nos
          services :
        </p>
        <Terms
          items={[
            { title: "Gestionnaires de parkings", desc: "Pour traiter vos réservations" },
            { title: "Prestataires de paiement", desc: "Stripe, PayPal pour paiements sécurisés" },
            { title: "Services d’hébergement", desc: "Stockage sécurisé des données" },
            { title: "Services de communication", desc: "Envoi d’emails et notifications" },
          ]}
        />
        <Note>
          <strong>Nous ne vendons jamais vos données personnelles à des tiers.</strong>
        </Note>
      </>
    ),
  },
  {
    id: "conservation",
    title: "Durée de conservation des données",
    content: (
      <Facts
        items={[
          { label: "Données de compte", value: "Jusqu’à suppression + 1 an" },
          { label: "Données de transaction", value: "10 ans" },
          { label: "Données de géolocalisation", value: "6 mois maximum" },
          { label: "Logs de connexion", value: "1 an" },
        ]}
      />
    ),
  },
  {
    id: "vos-droits",
    title: "Vos droits sur vos données",
    content: (
      <>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <Terms
          items={[
            { title: "Droit d’accès", desc: "Consulter vos données" },
            { title: "Droit de rectification", desc: "Corriger vos données" },
            { title: "Droit à l’effacement", desc: "Supprimer vos données" },
            { title: "Droit à la portabilité", desc: "Récupérer vos données" },
            { title: "Droit d’opposition", desc: "Refuser le traitement" },
            { title: "Droit à la limitation", desc: "Limiter le traitement" },
          ]}
        />
        <h3>Pour exercer vos droits :</h3>
        <ul>
          <li>
            <a href="mailto:support@ticketche.com">support@ticketche.com</a>
          </li>
          <li>Depuis les paramètres de l’application</li>
        </ul>
        <Note>Délai de réponse : 30 jours maximum</Note>
      </>
    ),
  },
  {
    id: "securite",
    title: "Sécurité de vos données",
    content: (
      <Terms
        items={[
          { title: "Chiffrement SSL/TLS", desc: "Communications sécurisées" },
          { title: "Serveurs certifiés", desc: "Stockage sécurisé" },
          { title: "Authentification forte", desc: "Gestion des accès" },
          { title: "Sauvegardes régulières", desc: "Plan de reprise d’activité" },
          { title: "Audits de sécurité", desc: "Vérifications régulières" },
          { title: "Monitoring 24/7", desc: "Surveillance continue" },
        ]}
      />
    ),
  },
  {
    id: "cookies",
    title: "Cookies et technologies de suivi",
    content: (
      <>
        <p>L’application utilise des technologies similaires aux cookies pour :</p>
        <ul>
          <li>Maintenir votre session connectée</li>
          <li>Mémoriser vos préférences</li>
          <li>Analyser l’utilisation</li>
          <li>Améliorer les performances</li>
        </ul>
        <Note>Vous pouvez gérer ces préférences depuis les paramètres de l’application.</Note>
      </>
    ),
  },
  {
    id: "modifications",
    title: "Modifications de la politique",
    content: (
      <p>
        Nous pouvons modifier cette politique à tout moment. En cas de modification importante, vous serez informé
        par notification dans l’application ou par email. Nous vous encourageons à consulter régulièrement cette
        page.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          <strong>Délégué à la Protection des Données (DPO)</strong>
        </p>
        <ul>
          <li>
            <a href="mailto:support@ticketche.com">support@ticketche.com</a>
          </li>
          <li>
            <a href="tel:+2290199984345">+229 01 99 98 43 45</a>
          </li>
          <li>Abomey-Calavi, Bénin</li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Votre vie privée est notre priorité."
      updated="Mise à jour : janvier 2025"
      lead={
        <p className="text-[1.0625rem] text-ink">
          Chez <strong>Ticketché</strong>, nous nous engageons à protéger vos données personnelles et à respecter
          votre vie privée. Cette politique explique de manière transparente comment nous collectons, utilisons et
          protégeons vos informations.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
