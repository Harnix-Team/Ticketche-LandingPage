"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDownloadLink } from "@/utils/deviceDetection";
import { AppDownloadButtons } from "../Appdownloadbuttons";

export const Hero = () => {
  return (
    <section className="relative pb-10 lg:pb-0 pt-36 min-h-screen flex items-center overflow-hidden">
      {/* Background avec parallax */}
      <motion.div className="absolute inset-0 z-0">
        <Image
          src="/images/Hero/bg.png"
          alt="Background"
          fill
          quality={90}
          priority
        />
      </motion.div>

      <motion.div className="relative z-20 w-full px-4 md:px-0">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT - Text */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center lg:text-left space-y-8 xl:pl-28"
            >
              {/* Main Title avec gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-5xl font-black leading-tight"
              >
                <span className="">Révolutionnez la gestion</span>
                <br />
                <span className="relative inline-block">
                  <span className="bg-[#005F69] bg-clip-text text-transparent">
                    de vos services
                  </span>
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 10"
                  >
                    <motion.path
                      d="M0 5 Q150 0 300 5"
                      stroke="#005F69"
                      strokeWidth="3"
                      fill="none"
                    />
                  </motion.svg>
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-gray-700 font-medium max-w-lg mx-auto lg:mx-0"
              >
                La solution digitale qui simplifie la supervision de vos
                parkings, garages et centres de lavage au Bénin.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <ul className="space-y-4 max-w-md mx-auto md:mx-0">
                  {[
                    "Gestion centralisée et fluide",
                    "Suivi en temps réel des tickets",
                    "Transparence totale des opérations",
                    "Réduction des erreurs et pertes",
                  ].map((service, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="flex items-center justify-center md:justify-start"
                    >
                      <span className="text-white bg-amber-950 px-2 py-0.5 rounded-full mr-3">
                        ✓
                      </span>
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* App Store Buttons - Simplifié */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                {[
                  {
                    src: "/images/app.png",
                    alt: "App Store",
                    type: "ios",
                  },
                  {
                    src: "/images/play.png",
                    alt: "Play Store",
                    type: "android",
                  },
                ].map((store, idx) => (
                  <Link
                    key={idx}
                    href={getDownloadLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden"
                    >
                      <img
                        src={store.src}
                        alt={store.alt}
                        className="w-40 md:w-44 h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent transition-all duration-300" />
                    </motion.div>
                  </Link>
                ))}
              </motion.div> */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <AppDownloadButtons />
              </motion.div>

              {/* Active Users - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-center lg:justify-start gap-4 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-amber-100 w-fit mx-auto lg:mx-0"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((num) => (
                    <motion.div
                      key={num}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.3 + num * 0.1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                    >
                      <Image
                        src={`/images/users/user${num}.png`}
                        alt={`User ${num}`}
                        width={45}
                        height={45}
                        className="rounded-full border-3 border-white shadow-md"
                      />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">+30</p>
                  <p className="text-xs text-gray-600">Gérants actifs</p>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT CONTENT - Media */}
            <div className="relative">
              {/* Video for Mobile & Tablet */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="xl:hidden relative mx-auto max-w-md md:max-w-lg"
              >
                <div className="relative group">
                  {/* Video container */}
                  <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                    <div className="overflow-hidden rounded-2xl">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto object-cover"
                      >
                        <source src="/videos/hero.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Image for XL screens */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="hidden xl:block relative"
              >
                <div className="relative group">
                  {/* Animated gradient background */}
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -inset-4 bg-[#005F69] rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                  />

                  {/* Main image */}
                  <div className="relative mt-20">
                    <img
                      src="/images/Hero/hero.png"
                      alt="Ticketché App"
                      quality={95}
                      className="w-full h-[560px] object-cover drop-shadow-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
