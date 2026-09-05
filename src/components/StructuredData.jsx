/**
 * Donnees structurees JSON-LD du site (audit SEO 2026-09-04, SEO-03 et GEO).
 *
 * Constat de l'audit : `grep "application/ld+json"` ne renvoyait aucun resultat
 * sur l'ensemble du site, confirme sur le HTML servi en production. Sans elles :
 * - aucun resultat enrichi possible dans Google (le schema `Event` est ce qui
 *   affiche date et prix directement dans les resultats de recherche, le levier
 *   le plus rentable pour une billetterie) ;
 * - rien de structure a extraire pour un moteur generatif (ChatGPT Search,
 *   Perplexity, AI Overviews), qui cite en priorite des faits verifiables.
 *
 * Les informations legales reprennent celles publiees sur /politiques/mentions.
 */

const SITE_URL = "https://ticketche.com";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Ticketché",
  legalName: "Harnix-Team",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.png`,
  },
  image: `${SITE_URL}/images/og-image.png`,
  description:
    "Ticketché est une application béninoise de billetterie d'événements, de livraison et de gestion de parkings, garages et centres de lavage.",
  email: "support@ticketche.com",
  telephone: "+229 01 40 51 21 33",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abomey-Calavi",
    addressCountry: "BJ",
  },
  areaServed: {
    "@type": "Country",
    name: "Bénin",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@ticketche.com",
    telephone: "+229 01 40 51 21 33",
    availableLanguage: ["fr"],
  },
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Ticketché",
  inLanguage: "fr-BJ",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/events/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const mobileApp = {
  "@type": "MobileApplication",
  "@id": `${SITE_URL}/#app`,
  name: "Ticketché",
  operatingSystem: "Android, iOS",
  applicationCategory: "TravelApplication",
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "XOF",
  },
};

/** Bloc JSON-LD global, monte une seule fois depuis le layout racine. */
export function SiteStructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, mobileApp],
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique construit ci-dessus, jamais alimente par une entree externe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Fil d'Ariane d'une page profonde.
 *
 * @param {{ items: Array<{ name: string, path: string }> }} props
 */
export function BreadcrumbStructuredData({ items }) {
  if (!items || items.length === 0) return null;

  const graph = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Questions/reponses d'une page. Repris tel quel par les moteurs generatifs,
 * qui privilegient les pages repondant explicitement a une question.
 *
 * @param {{ questions: Array<{ question: string, answer: string }> }} props
 */
export function FaqStructuredData({ questions }) {
  if (!questions || questions.length === 0) return null;

  const graph = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export { SITE_URL };
