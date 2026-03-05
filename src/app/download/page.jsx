"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DeviceMobile, AppleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { getDeviceOS } from "@/utils/deviceDetection";
import { APP_LINKS } from "@/config/appLinks";

export default function DownloadPage() {
  const [deviceOS, setDeviceOS] = useState("other");

  useEffect(() => {
    const device = getDeviceOS();
    setDeviceOS(device);

    // Redirection automatique si mobile
    if (device === "ios") {
      window.location.href = APP_LINKS.download.ios;
    } else if (device === "android") {
      window.location.href = APP_LINKS.download.android;
    }
  }, []);

  // Si c'est un mobile, afficher un message de chargement pendant la redirection
  if (deviceOS === "ios" || deviceOS === "android") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#005f69] to-[#047a7f] flex items-center justify-center px-4">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-semibold">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Page pour desktop
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#005f69] via-[#047a7f] to-[#058a8f] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#F29E10]/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto pt-0 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="title-hero text-white mb-4 sm:mb-6 px-4"
            >
              Application mobile uniquement
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Veuillez vous munir d'un appareil <strong>iOS</strong> ou{" "}
              <strong>Android</strong> pour télécharger et profiter de
              l'application Ticketché.
            </motion.p>

            {/* Instructions cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-1 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4"
            >
              {/* Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AppleLogo className="w-6 h-6 text-[#005f69]" />
                  </div>
                  
                  <Link
                    href="/"
                    className="block w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-3xl text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 text-center"
                  >
                    Retour à la page d'accueil
                  </Link>
                  
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <DeviceMobile className="w-6 h-6 text-[#005f69]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}