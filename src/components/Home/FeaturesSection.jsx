"use client";
import { motion } from "framer-motion";
import { Car, CreditCard, BarChart3, Ticket } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Car,
      title: "Gestion intelligente",
      description:
        "Gérez parking, garage et lavage depuis une seule plateforme, avec un suivi clair et instantané.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "from-blue-500 to-cyan-500",
    },
    {
      icon: CreditCard,
      title: "Paiements simplifiés",
      description:
        "Encaissez plus rapidement en espèces ou Mobile Money, sans erreurs ni complications.",
      gradient: "from-amber-500/20 to-orange-500/20",
      iconBg: "from-amber-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Statistiques avancées",
      description:
        "Visualisez vos revenus, votre fréquentation et vos performances en un coup d'œil.",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "from-purple-500 to-pink-500",
    },
    {
      icon: Ticket,
      title: "Tickets numériques",
      description:
        "Dites adieu au papier : tickets scannables, sécurisés et suivis automatiquement.",
      gradient: "from-rose-500/20 to-red-500/20",
      iconBg: "from-rose-500 to-red-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative md:py-10 mb-10">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005f69]/10 to-[#047a7f]/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#005f69]/20 mb-6">
            <div className="w-2 h-2 bg-[#005f69] rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005f69]">
              Fonctionnalités innovantes
            </span>
          </div>

          <h2 className="text-center gap-2 sm:gap-3 text-xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span>Découvrez la puissance de{" "}</span>
            <span className="inline-flex items-center text-[#005f69]">
              {/* <img
                src="/images/logo.png"
                alt="Ticketché"
                className="h-4 md:h-8 w-auto object-contain"
              /> */} ticketché
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Des outils modernes pour transformer votre gestion quotidienne
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`
                  group relative overflow-hidden
                `}
              >
                {/* Glass card */}
                <div className="relative backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 overflow-hidden">
                  {/* Gradient overlay on hover */}

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#047a7f] to-transparent opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`
                      relative inline-flex items-center justify-center w-14 h-14
                      bg-[#005f69] rounded-2xl mb-5 sm:mb-6
                      shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                    `}
                    >
                      <Icon className="w-7 h-7 text-white" />

                      {/* Icon glow */}
                      <div
                        className={`
                        absolute inset-0 bg-[#005f69] 
                        rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500
                      `}
                      ></div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-[#005f69] transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-black leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
