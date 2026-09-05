import DownloadClient from "./DownloadClient";

export const metadata = {
  title: "Télécharger Ticketché | Application iOS & Android",
  description:
    "Téléchargez l'application Ticketché gratuitement sur App Store et Google Play. Gérez vos parkings, trouvez des garages, réservez des lavages et achetez vos billets d'événements au Bénin.",
  keywords: [
    "télécharger Ticketché",
    "application parking Bénin",
    "app iOS Android",
    "Ticketché App Store",
    "Ticketché Google Play",
    "application mobilité Cotonou",
  ],
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Télécharger Ticketché | Application iOS & Android",
    description:
      "Téléchargez Ticketché gratuitement sur App Store et Google Play. Parkings, garages, lavages et billetterie au Bénin.",
    url: "https://ticketche.com/download",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Télécharger l'application Ticketché" }],
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}