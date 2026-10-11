import { CircleHelp, FileText, Mail, MapPin, MessageCircle, Phone, Smartphone } from "@/components/icons";
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/components/shell/nav";
import { PHONE_DISPLAY, PHONE_NUMBER } from "@/config/constants";
import { HOME_FAQ } from "@/data/faq";

/** Mots qu'un visiteur tape pour trouver une page sans connaitre son nom. */
const KEYWORDS = {
  "/events/": "concert festival billet ticket sortie agenda spectacle conference sport",
  "/establishments/": "hotel parking garage lavage culture nature loisirs etablissement emplacement adresse",
  "/restaurants/": "manger maquis menu cuisine plat commander resto",
  "/carte/": "plan carte autour de moi proximite gps itineraire",
  "/a-propos/": "equipe mission histoire harnix qui sommes nous entreprise",
  "/recrutement/": "emploi job carriere stage offre poste travailler",
  "/questionnaires/": "questionnaire enquete avis sondage",
  "/contact/": "joindre ecrire message support aide partenariat organisateur",
  "/politiques/confidentialite/": "donnees personnelles vie privee cookies suivi",
  "/politiques/conditions/": "cgu regles utilisation",
  "/politiques/mentions/": "editeur hebergeur societe",
};

const page = ({ href, label, icon = FileText }) => ({ id: href, title: label, href, icon, keywords: KEYWORDS[href] });

const FAQ_PAGE = { id: "faq", title: "Questions fréquentes", href: "/#questions", icon: CircleHelp, keywords: "faq aide question reponse" };

/** Proposes tant que le champ est vide. */
export const SHORTCUTS = [...PRIMARY_NAV.map(page), FAQ_PAGE, { id: "/contact/", title: "Contact", href: "/contact/", icon: Mail }];

/** Tout ce que la recherche trouve en dehors du catalogue, par rubrique. Les offres d'emploi arrivent par l'API. */
export const SITE_GROUPS = [
  {
    key: "PAGES",
    label: "Sur le site",
    limit: 4,
    entries: [
      ...PRIMARY_NAV.map(page),
      ...SECONDARY_NAV.map(page),
      ...LEGAL_NAV.map(page),
      FAQ_PAGE,
      {
        id: "/download/",
        title: "Télécharger l’application",
        detail: "Android et iPhone",
        href: "/download/",
        icon: Smartphone,
        keywords: "app application android iphone ios play store app store installer telecharger mobile",
      },
    ],
  },
  {
    key: "FAQ",
    label: "Questions fréquentes",
    limit: 3,
    entries: HOME_FAQ.map(({ question, answer }) => ({ id: question, title: question, detail: answer, href: "/#questions", icon: CircleHelp })),
  },
  {
    key: "CONTACT",
    label: "Contact",
    limit: 3,
    entries: [
      { id: "tel", title: "Appeler Ticketché", detail: PHONE_DISPLAY, href: `tel:+${PHONE_NUMBER}`, icon: Phone, keywords: "telephone numero appel joindre contact" },
      { id: "whatsapp", title: "Écrire sur WhatsApp", detail: PHONE_DISPLAY, href: `https://wa.me/${PHONE_NUMBER}`, icon: MessageCircle, keywords: "whatsapp message discuter contact" },
      { id: "mail", title: "Envoyer un e-mail", detail: "support@ticketche.com", href: "mailto:support@ticketche.com", icon: Mail, keywords: "email mail courriel support aide contact" },
      { id: "adresse", title: "Nos bureaux", detail: "Abomey-Calavi, Bénin", href: "/contact/", icon: MapPin, keywords: "adresse localisation bureau siege ou contact" },
    ],
  },
];
