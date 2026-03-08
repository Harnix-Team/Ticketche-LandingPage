"use client";
import { Car, CreditCard, ChartBar, Ticket } from "@phosphor-icons/react";
import { Wallet, Tag, Star, QrCode, MapPin, Handshake, DeviceMobile, Users } from "@phosphor-icons/react";
import { Archivo } from "next/font/google";
import { motion } from "framer-motion";
import { useState } from "react";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

/* ── 8 feature cards ── */
const features = [
  {
    icon: MapPin,
    title: "Parking · Lavage · Garage",
    description: "Localisez, réservez et payez en temps réel. Centres de lavage notés, garages certifiés, parkings disponibles près de vous.",
    accent: "#005F69",
    span: 1,
  },
  {
    icon: Ticket,
    title: "Billetterie & Événements",
    description: "Achetez vos billets de concerts, festivals et conférences. Gérez vos propres événements avec vente de tickets intégrée.",
    accent: "#692C00",
    span: 1,
  },
  {
    icon: Wallet,
    title: "Portefeuille numérique",
    description: "Centralisez votre solde, rechargez en Mobile Money et réglez tous vos services Ticketché d'un seul tap. Historique complet inclus.",
    accent: "#005F69",
    span: 1,
  },
  {
    icon: Tag,
    title: "Codes promo & réductions",
    description: "Saisissez un code promo au paiement pour obtenir des réductions instantanées sur parking, lavage, garage ou billets d'événements.",
    accent: "#692C00",
    span: 1,
  },
  {
    icon: Star,
    title: "Avis & notations",
    description: "Consultez les avis vérifiés avant de choisir un prestataire. Notez votre expérience et aidez la communauté à faire les meilleurs choix.",
    accent: "#005F69",
    span: 1,
  },
  {
    icon: Car,
    title: "Enregistrement de véhicules",
    description: "Ajoutez vos véhicules une fois pour toujours. Chaque réservation, lavage ou entretien est automatiquement rattaché à votre véhicule.",
    accent: "#692C00",
    span: 1,
  },
  {
    icon: QrCode,
    title: "QR Code & accès rapide",
    description: "Ticket numérique infalsifiable pour chaque service. Scan instantané à l'entrée — zéro papier, zéro file d'attente, zéro fraude.",
    accent: "#005F69",
    span: 1,
  },
  {
    icon: Handshake,
    title: "Services additionnels",
    description: "Les gérants proposent des extras : vidange, gonflage pneus, nettoyage intérieur, recharge électrique — réservables directement dans l'app.",
    accent: "#692C00",
    span: 1,
  },
];


export default function Features() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className={`${archivo.className} relative md:py-10 mb-10`}>
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#005f69]/10 to-[#047a7f]/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#005f69]/20 mb-6">
            <div className="w-2 h-2 bg-[#005f69] rounded-full"></div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#005f69]">
              5 services, une seule application
            </span>
          </div>

          <h2 className="text-center gap-2 sm:gap-3 title-section mb-4">
            <span>Découvrez la puissance de{" "}</span>
            <span className="inline-flex items-center text-[#005f69]">ticketché</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Parking, lavage, garage, billetterie et événements — tout ce dont vous avez besoin dans une seule app.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIdx === index;
            const isOtherHovered = hoveredIdx !== null && hoveredIdx !== index;

            return (
              <motion.div
                key={index}
                className="group relative overflow-hidden"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.5 }}
              >
                <motion.div
                  className="relative backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 overflow-hidden transition-all duration-500 h-full"
                  style={{
                    boxShadow: isHovered
                      ? `0 20px 40px ${feature.accent}40`
                      : "0 8px 20px rgba(0,0,0,0.07)",
                    filter: isOtherHovered ? "grayscale(60%) blur(0.5px) opacity(0.8)" : "none",
                    background: isHovered ? `${feature.accent}06` : "white",
                    borderColor: isHovered ? `${feature.accent}30` : "rgba(229,231,235,0.8)",
                  }}
                  animate={{ scale: isHovered ? 1.04 : 1, y: isHovered ? -4 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(to right, transparent, ${feature.accent}${isHovered ? "bb" : "44"}, transparent)`, transition: "all 0.4s" }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 shadow-md transition-all duration-500"
                      style={{
                        background: isHovered
                          ? feature.accent
                          : `${feature.accent}18`,
                        transform: isHovered ? "rotate(8deg) scale(1.1)" : "none",
                      }}
                    >
                      <Icon weight="duotone" className="w-6 h-6" style={{ color: isHovered ? "white" : feature.accent }} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight" style={{ color: isHovered ? feature.accent : undefined, transition: "color 0.3s" }}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover glow bg */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 30% 30%, ${feature.accent}10, transparent 65%)`, borderRadius: "inherit" }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom strip — 3 pillars */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: DeviceMobile, label: "App mobile", sub: "iOS & Android" },
            { icon: CreditCard,   label: "Mobile Money", sub: "Paiement sécurisé" },
            { icon: Users,        label: "Communauté", sub: "Avis & entraide" },
          ].map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-center gap-4 bg-gradient-to-r from-[#005f69]/5 to-transparent border border-[#005f69]/10 rounded-2xl px-6 py-4">
              <div className="w-10 h-10 rounded-xl bg-[#005f69]/10 flex items-center justify-center flex-shrink-0">
                <Icon weight="duotone" className="w-5 h-5 text-[#005f69]" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{label}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}