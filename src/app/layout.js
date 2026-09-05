import { Archivo } from "next/font/google";
import "./globals.css";
import { HeaderWrapper } from "@/components/Navigation/HeaderWrapper";
import { Footer } from "@/components/Navigation/footer";
import { AppNotificationWrapper } from "@/components/AppNotificationWrapper";
// import SondageBandeau from "@/components/SondageBandeau";
// import SondagePopup from "@/components/SondagePopup";
import Providers from "@/app/providers";
import { SiteStructuredData } from "@/components/StructuredData";

// Audit performance 2026-09-04 (PERF-05) : `preload: false` retardait la
// decouverte de la police jusqu'apres le CSS, ajoutant un aller-retour reseau et
// allongeant le basculement depuis la police de secours.
//
// La graisse 300 est retiree : `font-light` n'apparait nulle part dans `src/`
// (verifie par grep). Les cinq autres sont bien utilisees - notamment 900
// (`font-black`, 56 occurrences), qu'il ne faut surtout pas retirer.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

// Audit SEO 2026-09-04 (SEO-04) : le titre et les mots-clés ne parlaient que de
// parking, garage et lavage. Le produit couvre aussi la billetterie
// événementielle, la livraison, le covoiturage et l'intégration restaurateurs -
// toute la demande de recherche sur « billetterie Bénin » ou « livraison
// Cotonou » était absente de la page la plus forte du site.
export const metadata = {
  title: "Ticketché - Billetterie, livraison et parking au Bénin",
  description:
    "Achetez vos billets d'événements, commandez une livraison et réservez votre place de parking au Bénin, depuis une seule application. Paiement Mobile Money, suivi en temps réel.",

  keywords: [
    "billetterie en ligne Bénin",
    "acheter billet concert Cotonou",
    "événements Cotonou",
    "livraison Cotonou",
    "coursier Bénin",
    "covoiturage Bénin",
    "parking Cotonou",
    "lavage auto Bénin",
    "garage automobile Cotonou",
    "Ticketché",
  ],

  authors: [{ name: "Ticketché" }],
  creator: "Ticketché",
  publisher: "Ticketché",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Audit SEO 2026-09-04 (SEO-01) : `www.ticketche.com` n'a aucun enregistrement
  // DNS. Tous les canonicals, OG urls, le sitemap et robots.txt pointaient donc
  // vers un hote injoignable. Le domaine canonique est l'apex.
  metadataBase: new URL("https://ticketche.com"),

  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
    },
  },

  openGraph: {
    title: "Ticketché - Billetterie, livraison et parking au Bénin",
    description:
      "Billets d'événements, livraison et parking au Bénin, dans une seule application. Paiement Mobile Money, suivi en temps réel.",
    url: "https://ticketche.com",
    siteName: "Ticketché",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ticketché - billetterie, livraison et parking au Bénin",
      },
    ],
    locale: "fr_BJ",
    type: "website",
  },

  // Audit SEO 2026-09-04 (SEO-06) : aucune balise Twitter Card n'etait declaree.
  // Sans elle, un partage sur X affiche un lien nu, sans visuel ni description.
  twitter: {
    card: "summary_large_image",
    title: "Ticketché - Billetterie, livraison et parking au Bénin",
    description:
      "Billets d'événements, livraison et parking au Bénin, dans une seule application.",
    images: ["/images/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/images/logonav.png",
    shortcut: "/images/logonav.png",
    apple: "/images/logonav.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children } ) {
  return (
    <html lang="fr">
      <head>
        <meta
          name="google-site-verification"
          content="KduTih3KqfMa3oOnXKluxcZ9HivlOJ6vOIp2cqH3Lm0"
        />
        {/* Donnees structurees globales : Organization, WebSite, MobileApplication.
            Audit SEO 2026-09-04 (SEO-03) : le site n'en portait aucune. */}
        <SiteStructuredData />
      </head>

      <body className={`${archivo.variable} antialiased bg-[#047b7f13]`}>
        <Providers>
          <HeaderWrapper />
          {children}
          <Footer />
          <AppNotificationWrapper />

          {/* Sondage désactivé temporairement */}
          {/* <SondageBandeau /> */}
          {/* <SondagePopup /> */}
        </Providers>
      </body>
    </html>
  );
}
