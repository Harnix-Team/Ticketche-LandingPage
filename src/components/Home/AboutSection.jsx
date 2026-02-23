"use client";
import { motion } from "framer-motion";
import {
  MapPin,
  Smartphone,
  CreditCard,
  DollarSign,
  Activity,
  BarChart3,
  ShieldCheck,
  Users,
  ClipboardList,
} from "lucide-react";
import Features from "./FeaturesSection";
import { getDownloadLink } from "@/utils/deviceDetection";
import { AppDownloadButtons } from "../Appdownloadbuttons";

export const About = () => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section id="about" className="relative md:pt-20 md:py-10 overflow-hidden">
      <div className="mb-12 max-w-5xl mx-auto ">
        <img src="/images/Hero/banner.png" className="md:rounded-4xl" alt="" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0 relative z-10">
        <Features />

        <div className="">
          {/* First Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-12 md:mb-16 lg:mb-20"
          >
            {/* Image Section with Enhanced Layout */}
            <motion.div
              variants={itemVariants}
              className="relative group order-1 lg:order-2"
            >
              {/* Main image container */}
              <div className="relative z-10 bg-white/50 lg:bg-[#047b7f13] backdrop-blur-sm lg:backdrop-blur-none rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-white/60 shadow-xl lg:shadow-none">
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
                  <img
                    src="/images/About/about1.png"
                    alt="Ticketché - Votre guide mobilité"
                    className="object-contain w-full h-full "
                  />
                </div>
              </div>
            </motion.div>

            {/* Text Content - Enhanced */}
            <motion.div
              variants={itemVariants}
              className="order-2 lg:order-1 space-y-6 md:space-y-8"
            >
              {/* Main heading */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[#005F69]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#005F69]/20 mb-4">
                  <div className="w-2 h-2 bg-[#005F69] rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005F69]">
                    Pour les utilisateurs
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Votre compagnon de{" "}
                  <span className="text-[#005F69]">mobilité quotidienne</span>
                </h2>
                <p className="text-black text-base md:text-lg leading-relaxed">
                  Plus besoin de tourner en rond. Plus besoin de deviner.
                  <b> ticketché</b> vous montre tous les services disponibles autour de
                  vous, en temps réel.
                </p>
              </div>

              {/* Features list - Enhanced with new content */}
              <div className="space-y-5 md:space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Trouvez rapidement le service qu'il vous faut",
                    description:
                      "Services à proximité, prix, disponibilités, horaires et gérants les mieux notés — tout en un coup d'œil.",
                  },
                  {
                    icon: Smartphone,
                    title: "Ticket numérique sécurisé",
                    description:
                      "Fini les tickets papier qui se perdent. Votre ticket sur votre téléphone, clair, vérifiable à tout moment.",
                  },
                  {
                    icon: CreditCard,
                    title: "Paiement fluide et sécurisé",
                    description:
                      "Payez sans tracas grâce à nos partenaires certifiés. Un simple scan à la sortie et vous êtes libre.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    className="group flex items-start gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-[#005F69]/30 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Icon with gradient */}
                    <div
                      className={`
                    flex-shrink-0 w-12 h-12 rounded-xl
                    bg-[#005F69]
                    flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                    shadow-lg
                  `}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 group-hover:text-[#005F69] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Section - Enhanced */}
              <div className="pb-6 text-center space-y-4">
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Téléchargez l'app et transformez votre expérience mobilité :
                </p>

                {/* <div className="flex justify-center gap-4">
                  {[
                    {
                      src: "/images/app.png",
                      alt: "Télécharger sur App Store",
                      type: "ios",
                    },
                    {
                      src: "/images/play.png",
                      alt: "Télécharger sur Google Play",
                      type: "android",
                    },
                  ].map((store, idx) => {
                    return (
                      <a
                        key={idx}
                        href={getDownloadLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative"
                        >
                          <img
                            src={store.src}
                            alt={store.alt}
                            className="h-12 w-auto"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#005f69]/0 to-[#005f69]/0 group-hover:from-[#005f69]/10 group-hover:to-transparent rounded-lg transition-all duration-300"></div>
                        </motion.div>
                      </a>
                    );
                  })}
                </div> */}
                <div className="flex justify-center gap-4">
                <AppDownloadButtons />

                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Second Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center my-10"
          >
            {/* Text Content - Enhanced for Managers */}
            <motion.div
              variants={itemVariants}
              className="order-2 space-y-6 md:space-y-8"
            >
              {/* Main heading */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005F69]/10 to-[#047a7f]/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#005F69]/20 mb-4">
                  <div className="w-2 h-2 bg-[#005F69] rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005F69]">
                    Pour les gérants
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Vous êtes gérant ?
                </h2>
                <p className="text-black text-base md:text-lg leading-relaxed">
                  <b>ticketché</b> vous aide à gérer votre activité plus facilement et
                  à augmenter votre rentabilité. Vous gagnez en visibilité, en
                  organisation et en efficacité sur toutes vos opérations :
                  entrées, sorties, paiements, statistiques et gestion du
                  personnel.
                </p>
              </div>

              {/* Features list - Enhanced with new content */}
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  {
                    icon: Activity,
                    title: "Suivi en temps réel",
                    description:
                      "Consultez instantanément l'état de votre parking, garage ou lavage : véhicules en cours, opérations terminées, files d'attente et volumes journaliers.",
                  },
                  {
                    icon: DollarSign,
                    title: "Encaissement simplifié",
                    description:
                      "Gérez les paiements en espèces et mobile money avec des montants exacts et une traçabilité complète, sans erreurs ni confusion.",
                  },
                  {
                    icon: BarChart3,
                    title: "Statistiques détaillées",
                    description:
                      "Analysez vos performances : revenus, heures de pointe, niveau d’activité, services les plus demandés et progression de votre chiffre d’affaires.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Réduction de la fraude",
                    description:
                      "Tickets numériques anti-perte, horodatés et impossibles à falsifier. Vous éliminez les litiges et sécurisez vos revenus.",
                  },
                  {
                    icon: Users,
                    title: "Gestion du personnel",
                    description:
                      "Suivez le travail de vos agents : services traités, temps moyen, performance individuelle et historique complet des opérations.",
                  },
                  {
                    icon: ClipboardList,
                    title: "Organisation renforcée",
                    description:
                      "Centralisez toutes vos opérations dans un tableau de bord unique. Plus de papier, plus d'oublis, plus de pertes.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    className="group flex items-start gap-4 bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-[#005F69]/30 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Icon with gradient */}
                    <div
                      className={`
            flex-shrink-0 w-8 h-8 rounded-xl
            bg-[#005f69]
            flex items-center justify-center
            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
            shadow-lg
          `}
                    >
                      <item.icon className="w-4 h-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-[#005F69] transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image Section - Enhanced */}
            <motion.div
              variants={itemVariants}
              className="relative group order-1"
            >
              {/* Main image container */}
              <div className="relative z-10 bg-white/50 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-white/60 shadow-xl">
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl">
                  <img
                    src="/images/About/about2.png"
                    alt="Ticketché - Tableau de bord gérant"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
