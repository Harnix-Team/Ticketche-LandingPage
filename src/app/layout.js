import { Archivo } from "next/font/google";
import "./globals.css";
import { Chatbot } from "@/components/Chatbot";
import { Footer } from "@/components/shell/Footer";
import { Header } from "@/components/shell/Header";
import { MotionProvider } from "@/components/shell/MotionProvider";
import { THEME_SCRIPT } from "@/components/shell/theme";
import { SiteStructuredData } from "@/components/StructuredData";

// Une seule famille, variable en graisse et en largeur : la largeur (axe `wdth`) distingue les titres du texte.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const TITLE = "Ticketché - Événements, lieux et restaurants au Bénin";
const DESCRIPTION =
  "Concerts, hôtels, plages, musées, maquis : trouvez où sortir au Bénin, puis réservez et payez par Mobile Money depuis l’application Ticketché.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,

  keywords: [
    "que faire à Cotonou",
    "sorties Bénin",
    "billetterie en ligne Bénin",
    "acheter billet concert Cotonou",
    "événements Cotonou",
    "hôtels Bénin",
    "restaurants Cotonou",
    "lieux touristiques Bénin",
    "parking Cotonou",
    "Ticketché",
  ],

  authors: [{ name: "Ticketché" }],
  creator: "Ticketché",
  publisher: "Ticketché",

  formatDetection: { email: false, address: false, telephone: false },

  // Audit SEO 2026-09-04 (SEO-01) : le domaine canonique est l'apex, `www` n'a aucun enregistrement DNS.
  metadataBase: new URL("https://ticketche.com"),

  alternates: { canonical: "/", languages: { fr: "/" } },

  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://ticketche.com",
    siteName: "Ticketché",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Ticketché, événements, lieux et restaurants au Bénin" }],
    locale: "fr_BJ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },

  icons: { icon: "/images/logonav.png", shortcut: "/images/logonav.png", apple: "/images/logonav.png" },

  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b191b" },
  ],
};

export default function RootLayout({ children }) {
  return (
    // `data-scroll-behavior` : Next 16 ne neutralise plus le defilement doux (globals.css) pendant un changement de
    // page ; sans cet attribut, le retour en haut s'anime et s'arrete avant d'y arriver.
    <html lang="fr" className={archivo.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <meta name="google-site-verification" content="KduTih3KqfMa3oOnXKluxcZ9HivlOJ6vOIp2cqH3Lm0" />
        <SiteStructuredData />
      </head>

      <body className="antialiased">
        <a
          href="#contenu"
          className="tk-label sr-only z-50 rounded-full bg-brand-fill px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu
        </a>
        <MotionProvider>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </MotionProvider>
        <Chatbot />
      </body>
    </html>
  );
}
