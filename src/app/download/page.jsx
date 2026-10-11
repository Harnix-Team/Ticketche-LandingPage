import { CalendarDays, MapPin, QrCode, UtensilsCrossed, Wallet } from "@/components/icons";
import { StoreButtons } from "@/components/shell/GetApp";
import { ScanCode } from "@/components/shell/ScanCode";
import { StoreRedirect } from "@/components/shell/StoreRedirect";

export const metadata = {
  title: "Télécharger Ticketché | Application Android et iPhone",
  description:
    "Téléchargez gratuitement l’application Ticketché sur Google Play et l’App Store : billets d’événements, lieux, restaurants et paiement Mobile Money au Bénin.",
  alternates: { canonical: "/download/" },
  openGraph: {
    title: "Télécharger Ticketché | Application Android et iPhone",
    description: "L’application Ticketché, gratuite sur Google Play et l’App Store.",
    url: "https://ticketche.com/download/",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Télécharger l’application Ticketché" }],
  },
};

const FEATURES = [
  { icon: CalendarDays, title: "Billetterie", text: "Concerts, festivals, conférences : prenez votre ticket en quelques gestes." },
  { icon: MapPin, title: "Lieux", text: "Hôtels, culture, nature, sorties, parkings et garages, avec horaires et tarifs." },
  { icon: UtensilsCrossed, title: "Restaurants", text: "Le menu complet avant de vous déplacer, et la commande quand elle est proposée." },
  { icon: Wallet, title: "Paiement", text: "Mobile Money ou portefeuille Ticketché, en francs CFA." },
  { icon: QrCode, title: "Tickets", text: "Chaque ticket est un QR code, toujours dans votre téléphone." },
];

export default function DownloadPage() {
  return (
    <div className="tk-shell pt-8 pb-8 lg:pt-14">
      <StoreRedirect />
      <div className="tk-brand-gradient grid gap-10 overflow-hidden rounded-panel p-7 text-white sm:p-10 lg:grid-cols-[1.3fr_auto] lg:items-center lg:gap-16 lg:p-16">
        <div className="tk-enter flex flex-col items-start gap-6">
          <h1 className="tk-display tk-stretch text-[clamp(2.5rem,6.5vw,5rem)]" style={{ "--i": 0 }}>
            Ticketché dans votre poche
          </h1>
          <p className="max-w-[48ch] text-[1.0625rem] text-white/85" style={{ "--i": 1 }}>
            L’application est gratuite. Elle réserve, encaisse par Mobile Money et garde tous vos tickets au même
            endroit.
          </p>
          <div style={{ "--i": 2 }}>
            <StoreButtons />
          </div>
        </div>
        <div className="hidden flex-col items-center gap-3 lg:flex">
          <ScanCode value="https://ticketche.com/download/" className="size-52" />
          <p className="tk-label text-[0.875rem] text-white/85">Scannez avec votre téléphone</p>
        </div>
      </div>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-card border border-line bg-surface p-5">
            <Icon className="size-6 text-brand" aria-hidden />
            <h2 className="tk-title mt-4 text-lg">{title}</h2>
            <p className="mt-1.5 text-[0.9375rem] text-ink-2">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
