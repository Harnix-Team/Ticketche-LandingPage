"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AppDownloadButtons } from "../Appdownloadbuttons";
import { useEffect, useState } from "react";
import { Archivo } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

const WORDS = ["parkings", "garages", "lavages", "événements"];
const COLORS = ["#692C00", "#005F69", "#692C00", "#005F69"];

/* ─────────────────────────────────────────────
   Typewriter
───────────────────────────────────────────── */
function TypewriterWords() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      key={idx}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="inline-block"
      style={{ color: COLORS[idx] }}
    >
      {WORDS[idx]}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   PhoneMockup
───────────────────────────────────────────── */
function PhoneMockup({ src, alt, appearDelay, rotation, floatOffset, floatDuration, floatDelay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.82 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: appearDelay,
        duration: 1,
        ease: [0.34, 1.4, 0.64, 1],
      }}
      style={{ rotate: `${rotation}deg` }}
    >
      <motion.div
        animate={{ y: [0, floatOffset, 0] }}
        transition={{
          delay: appearDelay + floatDelay,
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
      >
        <div style={{ position: "relative", width: "1100px", height: "2400px" }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="450px"
            className="object-contain"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const PHONES = [
  {
    src: "/images/Hero/explorer.png",
    alt: "Ticketché – Événements",
  },
  {
    src: "/images/Hero/accueil.png",
    alt: "Ticketché – Événements",
  },
  {
    src: "/images/Hero/recomm.png",
    alt: "Ticketché – Événements",
  },
];
/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let delay;

    if (activeIndex === 2) {
      delay = 4000; // le 3e reste plus longtemps
    } else {
      delay = 2500;
    }

    const interval = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % PHONES.length);
    }, delay);

    return () => clearTimeout(interval);
  }, [activeIndex]);
  return (
    <section
      className={`${archivo.className} relative pb-10 lg:pb-0 pt-15 min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-[#E0F5F7]/40 to-white`}
    >
      {/* Background */}
      <motion.div className="absolute inset-0 z-0">
        <Image src="/images/Hero/bg.png" alt="Background" fill quality={90} priority />
      </motion.div>

      <motion.div className="relative z-20 w-full px-4 md:px-0">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ══════════ GAUCHE : texte ══════════ */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center lg:text-left space-y-8 xl:pl-0"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="title-hero"
              >
                <span>Retrouvez vos</span>
                <br />
                <span className="inline-block min-w-[160px]">
                  <TypewriterWords />
                </span>
                <br />
                <span className="text-gray-900">en un seul clic.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-gray-700 font-medium max-w-lg mx-auto lg:mx-0"
              >
                La solution digitale qui simplifie la supervision de vos
                parkings, garages, centres de lavage et événements au Bénin.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <ul className="space-y-4 max-w-md w-full mx-auto lg:mx-0 text-left">
                  {[
                    "Gestion centralisée et fluide",
                    "Suivi en temps réel des tickets",
                    "Billetterie et contrôle d'accès pour vos événements",
                    "Transparence totale sur vos opérations",
                  ].map((service, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 text-white bg-amber-950 px-2 py-0.5 rounded-full text-xs">✓</span>
                      <span className="text-sm md:text-base">{service}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Boutons App Store / Google Play */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              >
                <AppDownloadButtons />
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="
  flex items-center justify-center lg:justify-start gap-4 
  bg-white/55 backdrop-blur-xl rounded-full 
  px-6 py-3 
  border border-cyan-200/30
  shadow-lg shadow-cyan-300/20 
  w-fit mx-auto lg:mx-0
  relative overflow-hidden
  transition-all duration-400 ease-out

  before:content-[''] before:absolute before:inset-[-1px] before:rounded-full 
  before:bg-gradient-to-r before:from-cyan-400/15 before:via-sky-400/10 before:to-blue-400/5
  before:opacity-0 hover:before:opacity-80
  before:blur-md before:transition-opacity before:duration-500

  hover:shadow-xl hover:shadow-cyan-400/40
  hover:scale-[1.025]
  hover:border-cyan-300/50
"
              >
                <div className="flex -space-x-3 relative z-10">
                  {[1, 2, 3, 4].map((num) => (
                    <Image
                      key={num}
                      src={`/images/users/user${num}.png`}
                      alt={`User ${num}`}
                      width={45}
                      height={45}
                      className="rounded-full border-2 border-white shadow-md"
                    />
                  ))}
                </div>
                <div className="relative z-10">
                  <p className="text-2xl font-bold text-gray-900 drop-shadow-sm">+30</p>
                  <p className="text-xs text-gray-600">Gérants actifs</p>
                </div>
              </motion.div>
            </motion.div>

            {/* ══════════ DROITE : téléphones ══════════ */}
            <div className="relative" style={{ overflow: "visible" }}>

              {/* ── MOBILE (< xl) : 2 vidéos ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="xl:hidden relative mx-auto w-full max-w-2xl flex gap-3 px-2"
              >
                <div className="flex-1 bg-white p-1.5 rounded-2xl shadow-2xl">
                  <div className="overflow-hidden rounded-xl">
                    <video autoPlay loop muted playsInline className="w-full h-auto object-cover">
                      <source src="/videos/hero.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
                <div className="flex-1 bg-white p-1.5 rounded-2xl shadow-2xl">
                  <div className="overflow-hidden rounded-xl">
                    <video autoPlay loop muted playsInline className="w-full h-auto object-cover">
                      <source src="https://assets.mixkit.co/videos/17631/17631-720.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </motion.div>

              {/* ── DESKTOP (xl+) : 3 téléphones sans cadre ── */}
              <div className="relative hidden xl:flex items-center justify-center h-[900px] group">

                {/* Background circulaire */}
                <div
  className="
    absolute 
    w-[900px] h-[900px] 
    rounded-full 
    bg-[#b4cfd1] 
    blur-3xl 
    opacity-60
    transition-all duration-500
    group-hover:bg-[#8fb3b6]
    group-hover:opacity-80
    group-hover:scale-105
  "
/>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -80, scale: 0.95 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.34, 1.4, 0.64, 1],
                    }}
                    className="relative z-10"
                  >
                    <PhoneMockup
                      src={PHONES[activeIndex].src}
                      alt={PHONES[activeIndex].alt}
                      floatOffset={-20}
                      floatDuration={3.5}
                    />
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};