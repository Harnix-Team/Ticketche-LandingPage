import Link from "next/link";
import { Facts, LegalPage, Note, Terms } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Mentions Légales | Ticketché",
  description:
    "Mentions légales de Ticketché : informations sur l'éditeur, l'hébergeur et les conditions d'utilisation de la plateforme.",
  alternates: { canonical: "/politiques/mentions" },
  robots: { index: true, follow: false },
};

const SECTIONS = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <Facts
        items={[
          { label: "Raison sociale", value: "Harnix-Team" },
          { label: "Application", value: "Ticketché" },
          { label: "Siège social", value: "Abomey-Calavi, Bénin" },
          { label: "Email", value: "support@ticketche.com", href: "mailto:support@ticketche.com" },
          { label: "Téléphone", value: "+229 01 40 51 21 33", href: "tel:+2290140512133" },
          { label: "Site web", value: "ticketche.com", href: "https://ticketche.com" },
        ]}
      />
    ),
  },
  {
    id: "hebergement",
    title: "Hébergement",
    content: (
      <>
        <p>
          Le site et l’application Ticketché sont hébergés par des prestataires tiers certifiés garantissant la
          sécurité, la disponibilité et l’intégrité des données.
        </p>
        <Note>
          Les serveurs d’hébergement sont soumis à des audits de sécurité réguliers et respectent les normes en
          vigueur en matière de protection des données personnelles.
        </Note>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          L’ensemble des contenus présents sur le site et l’application Ticketché (incluant, sans s’y limiter, les
          textes, graphismes, logos, icônes, images, sons et logiciels) sont la propriété exclusive de{" "}
          <strong>Harnix-Team</strong> ou de ses partenaires, et sont protégés par les lois en vigueur relatives à la
          propriété intellectuelle.
        </p>
        <Terms
          items={[
            {
              title: "Marque et logo",
              desc: "Le nom « Ticketché » et son logo sont des marques déposées. Toute reproduction est interdite sans autorisation préalable.",
            },
            {
              title: "Contenus éditoriaux",
              desc: "Textes, visuels et données publiés sur la plateforme ne peuvent être reproduits sans accord écrit.",
            },
            {
              title: "Code source",
              desc: "Le code source de l’application est protégé. Toute ingénierie inverse est strictement interdite.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    content: (
      <>
        <p>
          Ticketché s’efforce de fournir des informations exactes et à jour sur sa plateforme. Cependant, nous ne
          pouvons garantir l’exactitude, l’exhaustivité ou l’actualité de ces informations.
        </p>
        <Terms
          items={[
            {
              title: "Disponibilité du service",
              desc: "Nous ne saurions être tenus responsables d’une interruption de service due à des opérations de maintenance ou à des incidents techniques.",
            },
            {
              title: "Liens externes",
              desc: "Ticketché ne peut être tenu responsable du contenu des sites tiers vers lesquels des liens sont proposés.",
            },
            {
              title: "Exactitude des informations",
              desc: "Les informations publiées sont données à titre indicatif et peuvent être modifiées à tout moment sans préavis.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "liens-hypertextes",
    title: "Liens hypertextes",
    content: (
      <>
        <p>
          La création de liens hypertextes vers le site Ticketché est autorisée sous réserve de ne pas porter
          atteinte à l’image de la marque. En revanche, les liens en profondeur (<em>deep linking</em>) ainsi que
          les techniques de <em>framing</em> sont formellement interdits sans accord préalable écrit de Harnix-Team.
        </p>
        <Note>
          Tout lien non autorisé sera considéré comme une violation des présentes mentions légales et pourra faire
          l’objet de poursuites.
        </Note>
      </>
    ),
  },
  {
    id: "donnees-personnelles",
    title: "Protection des données personnelles",
    content: (
      <>
        <p>
          La collecte et le traitement des données personnelles des utilisateurs sont encadrés par notre{" "}
          <Link href="/politiques/confidentialite/">Politique de confidentialité</Link>, disponible sur notre
          plateforme. Ticketché s’engage à respecter la réglementation applicable en matière de protection des
          données personnelles.
        </p>
        <Note>
          Pour toute demande relative à vos données :{" "}
          <strong>
            <a href="mailto:support@ticketche.com">support@ticketche.com</a>
          </strong>
        </Note>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          L’application Ticketché utilise des technologies de traçage fonctionnel (équivalentes aux cookies) pour
          assurer le bon fonctionnement du service, mémoriser vos préférences et améliorer votre expérience
          utilisateur.
        </p>
        <p>
          Aucun cookie publicitaire ou de profilage tiers n’est utilisé sans votre consentement explicite. Vous
          pouvez gérer vos préférences directement depuis les paramètres de l’application.
        </p>
      </>
    ),
  },
  {
    id: "droit-applicable",
    title: "Droit applicable et juridiction",
    content: (
      <>
        <p>
          Les présentes mentions légales sont régies par le droit béninois. En cas de litige relatif à
          l’utilisation du site ou de l’application Ticketché, et à défaut de résolution amiable, les tribunaux
          compétents du Bénin seront seuls compétents.
        </p>
        <Terms
          items={[
            { title: "Droit applicable", desc: "Droit de la République du Bénin" },
            { title: "Juridiction compétente", desc: "Tribunaux compétents d’Abomey-Calavi, Bénin" },
            {
              title: "Résolution amiable",
              desc: "Tout différend sera d’abord soumis à une tentative de résolution amiable avant toute action judiciaire.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "mise-a-jour",
    title: "Mise à jour des mentions légales",
    content: (
      <p>
        Harnix-Team se réserve le droit de modifier les présentes mentions légales à tout moment, notamment pour se
        conformer à toute évolution légale, jurisprudentielle ou technique. La version en vigueur est celle
        accessible sur la plateforme. Nous vous encourageons à la consulter régulièrement.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          <strong>Pour toute question relative aux présentes mentions légales :</strong>
        </p>
        <ul>
          <li>
            <a href="mailto:support@ticketche.com">support@ticketche.com</a>
          </li>
          <li>
            <a href="tel:+2290140512133">+229 01 40 51 21 33</a>
          </li>
          <li>Abomey-Calavi, Bénin</li>
        </ul>
      </>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Informations légales relatives à la plateforme Ticketché."
      updated="Mise à jour : janvier 2025"
      lead={
        <p className="text-[1.0625rem] text-ink">
          Conformément aux dispositions légales en vigueur, les présentes mentions légales définissent les
          conditions d’utilisation du site et de l’application <strong>Ticketché</strong>, éditée par{" "}
          <strong>Harnix-Team</strong>. En accédant à notre plateforme, vous acceptez sans réserve ces mentions
          légales.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
