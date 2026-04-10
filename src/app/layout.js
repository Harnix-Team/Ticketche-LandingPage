import { Archivo } from "next/font/google";
import "./globals.css";
import { HeaderWrapper } from "@/components/Navigation/HeaderWrapper";
import { Footer } from "@/components/Navigation/footer";
import { AppNotificationWrapper } from "@/components/AppNotificationWrapper";
import Providers from "@/app/providers";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "Ticketché - Gérez vos véhicules facilement",
  description:
    "La solution digitale qui simplifie la supervision de vos parkings, garages et centres de lavage au Bénin. ✓Gestion centralisée et fluide; ✓Suivi en temps réel de vos véhicules;",

  keywords: [
    "parking Bénin",
    "gestion véhicules",
    "parking Cotonou",
    "lavage auto Bénin",
    "garage automobile",
    "stationnement Cotonou",
    "ticketing parking",
    "gestion parking",
    "application parking",
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

  metadataBase: new URL("https://www.ticketche.com"),

  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
    },
  },

  openGraph: {
    title: "Ticketché - Gérez vos véhicules facilement",
    description:
      "La solution digitale qui simplifie la supervision de vos parkings, garages et centres de lavage au Bénin. Gestion centralisée et suivi en temps réel.",
    url: "https://www.ticketche.com",
    siteName: "Ticketché",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ticketché",
      },
    ],
    locale: "fr_BJ",
    type: "website",
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

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta
          name="google-site-verification"
          content="KduTih3KqfMa3oOnXKluxcZ9HivlOJ6vOIp2cqH3Lm0"
        />
      </head>
      <body className={`${archivo.variable} antialiased bg-[#047b7f13]`}>
        <Providers>
          <HeaderWrapper />
          {children}
          <Footer />
          <AppNotificationWrapper />
        </Providers>
      </body>
    </html>
  );
}