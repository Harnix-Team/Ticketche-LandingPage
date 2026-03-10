"use client";
import {
  MapPin as MapPinIcon,
  DeviceMobile as DeviceMobileIcon,
  CreditCard as CreditCardIcon,
  Money as MoneyIcon,
  Pulse as PulseIcon,
  ChartBar as ChartBarIcon,
  ShieldCheck as ShieldCheckIcon,
  Users as UsersIcon,
  ClipboardText as ClipboardTextIcon,
  Ticket as TicketIcon,
  TrendUp as TrendUpIcon,
} from "@phosphor-icons/react";
import { Archivo } from "next/font/google";
import Features from "./FeaturesSection";
import { AppDownloadButtons } from "../Appdownloadbuttons";
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export const About = () => {
  return (
    <section id="about" className={`${archivo.className} relative md:pt-20 md:py-10 overflow-hidden bg-gradient-to-b from-white via-[#E0F5F7]/30 to-white`}>

      {/* <div className="mb-12 max-w-5xl mx-auto">
        <img src="/images/Hero/hero.jpg" className="md:rounded-4xl" alt="" />
      </div> */}

      <div className="max-w-7xl mx-auto px-4 lg:px-0 relative z-10">
        <Features />

        <div className="">
          {/* First Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-12 md:mb-16 lg:mb-20">

            {/* Image Section */}
            <div className="relative order-1 lg:order-2">
              <div className="relative z-10 bg-white/50 lg:bg-[#047b7f13] backdrop-blur-sm lg:backdrop-blur-none rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-white/60 shadow-xl lg:shadow-none">
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
                  <img
                    src="/images/About/about1.png"
                    alt="Ticketché - Votre guide mobilité"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#005F69]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#005F69]/20 mb-4">
                  <div className="w-2 h-2 bg-[#005F69] rounded-full"></div>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005F69]">
                    Pour les utilisateurs
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Votre compagnon de{" "}
                  <span className="text-[#005F69]">mobilité et de sorties</span>
                </h2>
                <p className="text-black text-base md:text-lg leading-relaxed">
                  Plus besoin de tourner en rond. Plus besoin de deviner.
                  <b> Ticketché</b> vous montre en temps réel les parkings disponibles, les centres de lavage les mieux notés et les garages certifiés près de vous — et vous permet d'acheter vos billets d'événements en quelques secondes.
                </p>
              </div>

              <div className="space-y-5 md:space-y-6">
                {[
                  {
                    icon: MapPinIcon,
                    title: "Trouvez rapidement le service qu'il vous faut",
                    description: "Services à proximité, prix, disponibilités, horaires et gérants les mieux notés — tout en un coup d'œil.",
                  },
                  {
                    icon: DeviceMobileIcon,
                    title: "Ticket numérique sécurisé",
                    description: "Fini les tickets papier qui se perdent. Votre ticket sur votre téléphone, clair, vérifiable à tout moment.",
                  },
                  {
                    icon: CreditCardIcon,
                    title: "Paiement fluide et sécurisé",
                    description: "Payez sans tracas grâce à nos partenaires certifiés. Un simple scan à la sortie et vous êtes libre.",
                  },
                  {
                    icon: TicketIcon,
                    title: "Billets d'événements en ligne",
                    description: "Concerts, soirées, expos — réservez vos tickets depuis l'app, recevez votre QR code et entrez sans attendre.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-[#005F69]/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#005F69] flex items-center justify-center shadow-lg group-hover:animate-[shake_0.4s_ease-in-out]">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 group-hover:text-[#00555e] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pb-6 text-center space-y-4">
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Téléchargez l'app et transformez votre expérience mobilité :
                </p>
                <div className="flex justify-center gap-4">
                  <AppDownloadButtons />
                </div>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center my-10">

            {/* Text Content - Managers */}
            <div className="order-2 space-y-6 md:space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005F69]/10 to-[#047a7f]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#005F69]/20 mb-4">
                  <div className="w-2 h-2 bg-[#005F69] rounded-full"></div>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005F69]">
                    Pour les gérants & organisateurs
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Vous êtes gérant ou organisateur ?
                </h2>
                <p className="text-black text-base md:text-lg leading-relaxed">
                  <b>Ticketché</b> vous aide à digitaliser et rentabiliser votre activité.
                  Que vous gériez un parking, un centre de lavage, un garage ou que vous organisiez des événements — 
                  gagnez en visibilité, en organisation et en efficacité : entrées/sorties, encaissements, billetterie et statistiques en temps réel.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    icon: PulseIcon,
                    title: "Suivi en temps réel",
                    description: "Véhicules en cours, opérations terminées, files d'attente et volumes journaliers.",
                  },
                  {
                    icon: MoneyIcon,
                    title: "Encaissement simplifié",
                    description: "Paiements espèces et mobile money avec traçabilité complète, sans erreurs.",
                  },
                  {
                    icon: ChartBarIcon,
                    title: "Statistiques détaillées",
                    description: "Revenus, heures de pointe, services les plus demandés et progression du CA.",
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: "Réduction de la fraude",
                    description: "Tickets numériques horodatés, impossibles à falsifier. Litiges éliminés.",
                  },
                  {
                    icon: UsersIcon,
                    title: "Gestion du personnel",
                    description: "Performances individuelles, services traités et historique complet des agents.",
                  },
                  {
                    icon: ClipboardTextIcon,
                    title: "Organisation renforcée",
                    description: "Toutes vos opérations centralisées. Plus de papier, plus d'oublis, plus de pertes.",
                  },
                  {
                    icon: TrendUpIcon,
                    title: "Revenus optimisés",
                    description: "Identifiez vos meilleures plages horaires et maximisez votre rentabilité.",
                  },
                  {
                    icon: TicketIcon,
                    title: "Billetterie événements",
                    description: "Créez vos événements, vendez vos tickets en ligne et suivez vos réservations.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 hover:border-[#005F69]/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#005f69] flex items-center justify-center shadow-lg group-hover:animate-[shake_0.4s_ease-in-out]">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#00555e] transition-colors duration-300 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1 leading-snug hidden sm:block">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="relative order-1">
              <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-white/60 shadow-xl">
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
                  <img
                    src="/images/About/about2.png"
                    alt="Ticketché - Tableau de bord gérant"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};