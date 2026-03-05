"use client";
import { Car, CreditCard, ChartBar, Ticket } from "@phosphor-icons/react";
import { Archivo } from "next/font/google";
import { motion } from "framer-motion";
import { useState } from "react";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

export default function Features() {
  const features = [
    {
      icon: Car,
      title: "Gestion intelligente",
      description:
        "Gérez parking, garage, lavage et événements depuis une seule plateforme, avec un suivi clair et instantané.",
      accent: "#005F69",
    },
    {
      icon: CreditCard,
      title: "Paiements simplifiés",
      description:
        "Encaissez plus rapidement en espèces ou Mobile Money, sans erreurs ni complications.",
      accent: "#692C00",
    },
    {
      icon: ChartBar,
      title: "Statistiques avancées",
      description:
        "Visualisez vos revenus, votre fréquentation et vos performances en un coup d'œil.",
      accent: "#005F69",
    },
    {
      icon: Ticket,
      title: "Billetterie événements",
      description:
        "Vendez et gérez vos billets d'événements en ligne : QR sécurisé, paiement instantané, zéro file d'attente.",
      accent: "#692C00",
    },
  ];

const [activeColor, setActiveColor] = useState(null);
  return (
    <section className={`${archivo.className} relative md:py-10 mb-10`}>
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005f69]/10 to-[#047a7f]/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#005f69]/20 mb-6">
            <div className="w-2 h-2 bg-[#005f69] rounded-full"></div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005f69]">
              Fonctionnalités innovantes
            </span>
          </div>

          <h2 className="text-center gap-2 sm:gap-3 title-section mb-4">
            <span>Découvrez la puissance de{" "}</span>
            <span className="inline-flex items-center text-[#005f69]">
              ticketché
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Parking, garage, lavage et événements — des outils modernes pour tout gérer au quotidien.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeColor === feature.accent;

            return (
              <motion.div
                key={index}
                className="group relative overflow-hidden"
                onMouseEnter={() => setActiveColor(feature.accent)}
                onMouseLeave={() => setActiveColor(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="relative backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500"
                  style={{
                    boxShadow: isActive
                      ? `0 20px 40px ${feature.accent}50` // glow couleur
                      : "0 8px 20px rgba(0,0,0,0.08)",
                    filter:
                      activeColor && !isActive ? "grayscale(80%) blur(1px)" : "none",
                  }}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-60"
                    style={{
                      background: `linear-gradient(to right, transparent, ${feature.accent}, transparent)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 sm:mb-6 shadow-lg transition-all duration-500"
                      style={{
                        background: feature.accent,
                        transform: isActive ? "rotate(6deg) scale(1.1)" : "none",
                      }}
                    >
                      <Icon weight="duotone" className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-black leading-relaxed transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}