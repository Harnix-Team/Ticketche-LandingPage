import { Facts, LegalPage, Note, Terms } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Conditions Générales d'Utilisation | Ticketché",
  description:
    "Conditions générales d'utilisation de la plateforme Ticketché. Lisez attentivement nos CGU avant d'utiliser nos services au Bénin.",
  alternates: { canonical: "/politiques/conditions" },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    id: "objet",
    title: "Objet",
    content: (
      <p>
        Les présentes Conditions Générales d’Utilisation (CGU) définissent les modalités d’accès et d’utilisation de
        l’application mobile <strong>Ticketché</strong>, ainsi que les droits et obligations des utilisateurs et de
        l’éditeur.
      </p>
    ),
  },
  {
    id: "editeur",
    title: "Éditeur de l’application",
    content: (
      <Facts
        items={[
          { label: "Application", value: "Ticketché" },
          { label: "Email", value: "support@ticketche.com" },
        ]}
      />
    ),
  },
  {
    id: "acces",
    title: "Accès à l’application",
    content: (
      <>
        <p>
          L’application Ticketché est accessible gratuitement via les plateformes Apple App Store et Google Play
          Store.
        </p>
        <Terms
          items={[
            { title: "Prérequis", desc: "Smartphone iOS ou Android compatible" },
            { title: "Connexion", desc: "Internet requis (frais à votre charge)" },
          ]}
        />
      </>
    ),
  },
  {
    id: "compte",
    title: "Inscription et compte utilisateur",
    content: (
      <>
        <p>
          Pour utiliser les services de Ticketché, l’utilisateur doit créer un compte personnel en fournissant des
          informations exactes et à jour.
        </p>
        <ul>
          <li>Fournir des informations exactes (nom, email, téléphone)</li>
          <li>Maintenir la confidentialité de vos identifiants</li>
          <li>Signaler immédiatement toute utilisation frauduleuse</li>
        </ul>
      </>
    ),
  },
  {
    id: "services",
    title: "Services proposés",
    content: (
      <>
        <p>Ticketché met à disposition les services suivants :</p>
        <Terms
          items={[
            { title: "Réservation parking", desc: "Places en temps réel" },
            { title: "Localisation", desc: "Parkings disponibles" },
            { title: "Gestion garages", desc: "Espaces de stationnement" },
            { title: "Lavage automobile", desc: "Services de nettoyage" },
            { title: "Historique", desc: "Suivi des réservations" },
            { title: "Paiements", desc: "Transactions sécurisées" },
          ]}
        />
      </>
    ),
  },
  {
    id: "tarifs",
    title: "Tarifs et paiement",
    content: (
      <>
        <Terms
          items={[
            { title: "Tarifs transparents", desc: "Prix affichés taxes incluses" },
            { title: "Paiements sécurisés", desc: "Partenaires certifiés" },
            { title: "Reçus instantanés", desc: "Envoyés par email" },
          ]}
        />
        <Note>Ticketché ne stocke aucune donnée de carte bancaire sur ses serveurs.</Note>
      </>
    ),
  },
  {
    id: "responsabilites",
    title: "Responsabilités",
    content: (
      <>
        <p>
          <strong className="block">Ticketché agit en tant qu’intermédiaire</strong>
          Entre les utilisateurs et les prestataires de services (parkings, garages, lavages)
        </p>
        <h3>Ticketché ne peut être tenu responsable de :</h3>
        <ul>
          <li>Dommages causés au véhicule pendant le stationnement</li>
          <li>Vol ou détérioration d’objets dans le véhicule</li>
          <li>Indisponibilité temporaire de l’application</li>
        </ul>
        <Note>L’utilisateur doit vérifier que son véhicule est correctement stationné et fermé.</Note>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "Propriété intellectuelle",
    content: (
      <p>
        L’ensemble des éléments de l’application Ticketché (logo, design, code source, textes, images) est protégé
        par les droits de propriété intellectuelle. Toute reproduction, représentation ou exploitation non autorisée
        est <strong>strictement interdite</strong>.
      </p>
    ),
  },
  {
    id: "donnees-personnelles",
    title: "Protection des données personnelles",
    content: (
      <>
        <p>
          Ticketché collecte et traite les données personnelles conformément au RGPD et à notre Politique de
          Confidentialité.
        </p>
        <Terms
          items={[
            { title: "Droit d’accès", desc: "Consulter vos données" },
            { title: "Droit de rectification", desc: "Corriger vos données" },
            { title: "Droit à l’effacement", desc: "Supprimer vos données" },
            { title: "Droit à la portabilité", desc: "Récupérer vos données" },
          ]}
        />
        <p>
          <a href="mailto:support@ticketche.com">support@ticketche.com</a>
        </p>
      </>
    ),
  },
  {
    id: "modifications",
    title: "Modifications des CGU",
    content: (
      <p>
        Ticketché se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés
        de toute modification par notification dans l’application ou par email. L’utilisation continue de
        l’application après modification vaut <strong>acceptation des nouvelles conditions</strong>.
      </p>
    ),
  },
  {
    id: "droit-applicable",
    title: "Droit applicable et litiges",
    content: (
      <>
        <p>
          <strong className="block">Droit applicable</strong>
          Les présentes CGU sont régies par le droit béninois.
        </p>
        <h3>En cas de litige :</h3>
        <ol>
          <li>Recherche d’une solution amiable en priorité</li>
          <li>À défaut, les tribunaux compétents de Cotonou sont seuls compétents</li>
        </ol>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          <strong>Pour toute question concernant ces CGU</strong>
        </p>
        <p>
          <a href="mailto:support@ticketche.com">support@ticketche.com</a>
        </p>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Conditions Générales d’Utilisation"
      intro="Utilisation claire et transparente de Ticketché"
      updated="Dernière mise à jour : 2025"
      prefix="Article"
      lead={
        <p className="text-[1.0625rem] text-ink">
          <strong className="block">Bienvenue sur Ticketché</strong>
          Ticketché est une application mobile de gestion de parkings, garages et services de lavage. En utilisant
          notre application, vous acceptez les présentes conditions générales d’utilisation.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
