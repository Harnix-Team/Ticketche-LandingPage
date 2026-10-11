import { QrCode, Smartphone, Ticket, Wallet } from "@/components/icons";
import { GetApp, StoreButtons } from "@/components/shell/GetApp";

const STEPS = [
  { icon: Ticket, title: "Réservez", text: "Billet de concert, nuit d’hôtel, place de parking : tout se réserve au même endroit." },
  { icon: Wallet, title: "Payez", text: "Par Mobile Money ou avec votre portefeuille Ticketché, en francs CFA." },
  { icon: QrCode, title: "Entrez", text: "Votre ticket est un QR code dans votre téléphone. Montrez-le à l’entrée." },
];

/** Le site fait decouvrir, l'application fait reserver : c'est ici que la page demande l'installation. */
export function AppBand() {
  return (
    <section className="tk-shell" aria-labelledby="application">
      <div className="tk-brand-gradient relative overflow-hidden rounded-panel text-white">
        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
          <div className="flex flex-col items-start gap-6">
            <h2 id="application" className="tk-display text-[clamp(2.25rem,5vw,4rem)]">
              Réservez, payez, entrez.
            </h2>
            <p className="max-w-[46ch] text-[1.0625rem] text-white/85">
              Ce site vous aide à choisir. L’application fait le reste : elle encaisse, garde vos tickets et vous
              guide jusqu’à la porte.
            </p>
            <GetApp size="lg">
              <Smartphone className="size-5" aria-hidden />
              Obtenir l’application
            </GetApp>
            <StoreButtons />
          </div>

          <ol className="flex flex-col justify-center gap-3">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex items-start gap-4 rounded-card bg-white/10 p-4 backdrop-blur-sm sm:p-5">
                <span className="tk-display grid size-11 shrink-0 place-items-center rounded-xl bg-white text-xl text-[#005f69]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="tk-title flex items-center gap-2 text-xl">
                    {title}
                    <Icon className="size-[1.125rem] text-gold" aria-hidden />
                  </h3>
                  <p className="mt-1 text-[0.9375rem] text-white/80">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
