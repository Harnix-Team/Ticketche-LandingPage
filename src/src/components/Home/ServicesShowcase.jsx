"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import {
  Car,
  Wrench,
  Drop,
  Ticket,
  Sparkle,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";
import { Archivo } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const services = [
  {
    id: "parking",
    number: "01",
    label: "Stationnement",
    title: "Trouvez & réservez votre parking",
    tagline: "Fini le stress du stationnement",
    description:
      "Localisez en temps réel les parkings disponibles autour de vous. Obtenez votre ticket numérique en un scan, payez sans espèces. Simple, rapide, zéro stress.",
    icon: Car,
    gradient: "from-[#005F69] to-[#00949F]",
    accentColor: "#005F69",
    lightColor: "#E0F5F7",
    stats: [
      { value: "2 min", label: "Pour trouver" },
      { value: "0 FCFA", label: "De frais cachés" },
    ],
    features: ["Carte interactive", "Ticket numérique", "Paiement mobile"],
  },
  {
    id: "garage",
    number: "02",
    label: "Garage & Mécanique",
    title: "Gérez vos entretiens facilement",
    tagline: "Votre véhicule entre de bonnes mains",
    description:
      "Trouvez les meilleurs garages certifiés, suivez vos réparations en temps réel, recevez vos factures numériques. Transparence totale, zéro mauvaise surprise.",
    icon: Wrench,
    gradient: "from-[#692C00] to-[#9A4000]",
    accentColor: "#692C00",
    lightColor: "#FFF1E6",
    stats: [
      { value: "50+", label: "Garages partenaires" },
      { value: "100%", label: "Transparence" },
    ],
    features: ["Suivi en direct", "Devis instantané", "Historique complet"],
  },
  {
    id: "lavage",
    number: "03",
    label: "Lavage Auto",
    title: "Un véhicule brillant en quelques clics",
    tagline: "Propre, rapide, sans tracas",
    description:
      "Repérez les centres de lavage les mieux notés près de chez vous. Comparez les tarifs, choisissez votre formule, payez en mobile money. Votre voiture mérite le meilleur.",
    icon: Drop,
    gradient: "from-[#005F69] to-[#047a7f]",
    accentColor: "#005F69",
    lightColor: "#E0F5F7",
    stats: [
      { value: "30+", label: "Centres partenaires" },
      { value: "★ 4.8", label: "Note moyenne" },
    ],
    features: ["Gérants notés", "Tarifs transparents", "Lavage premium"],
  },
  {
    id: "events",
    number: "04",
    label: "Événements & Billetterie",
    title: "Vivez les meilleurs événements",
    tagline: "Votre ticket, votre moment",
    description:
      "Concerts, soirées, expositions, conférences — réservez vos places directement depuis l'app. Ticket QR sécurisé, paiement instantané, entrée sans file d'attente.",
    icon: Ticket,
    gradient: "from-[#692C00] to-[#9A4000]",
    accentColor: "#692C00",
    lightColor: "#FFF1E6",
    stats: [
      { value: "100+", label: "Événements/mois" },
      { value: "QR", label: "Entrée instantanée" },
    ],
    features: ["Réservation rapide", "Ticket QR sécurisé", "Rappels automatiques"],
    isNew: true,
  },
];

const reassurances = [
  { icon: ShieldCheck, label: "Sécurisé & certifié",  sub: "Paiements chiffrés",     color: "#005F69" },
  { icon: Clock,  label: "Disponible 24h/24",     sub: "Service non-stop",       color: "#692C00" },
  { icon: MapPin, label: "Cotonou & environs",    sub: "En expansion",           color: "#005F69" },
  { icon: Star,   label: "Noté 4.8 / 5",          sub: "Par nos utilisateurs",   color: "#692C00" },
];

/* ─────────────────────────────────────────
   COUNTER
───────────────────────────────────────── */
function Counter({ value, duration = 1500 }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const numericPart = parseFloat(value);
    if (isNaN(numericPart)) { setDisplay(value); return; }
    const suffix = value.replace(String(numericPart), "");
    const steps = 40;
    let current = 0;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += numericPart / steps;
      if (current >= numericPart) { setDisplay(value); clearInterval(timer); return; }
      setDisplay(
        numericPart % 1 !== 0
          ? current.toFixed(1) + suffix
          : Math.floor(current) + suffix
      );
    }, interval);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

/* ─────────────────────────────────────────
   FLOATING ORB
───────────────────────────────────────── */
function FloatingOrb({ color, size, x, y, delay }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ background: color, width: size, height: size, left: x, top: y }}
      animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1], opacity: [0.4, 0.6, 0.3, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   SPOTLIGHT CARD (style Aceternity)
───────────────────────────────────────── */
function useMousePosition(ref) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [ref]);
  return position;
}

function ServiceCard({ service, index }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const mousePos = useMousePosition(cardRef);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-default flex flex-col h-full rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid #e5e7eb" }}
    >
      {/* ── Spotlight qui suit la souris ── */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${service.accentColor}18, transparent 60%)`,
          }}
        />
      )}

      {/* ── Bordure animée au hover ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{ border: `1.5px solid ${service.accentColor}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* ── Contenu ── */}
      <div className="relative z-20 p-6 flex flex-col flex-1 gap-5">

        {/* Top : icône + numéro + badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isHovered ? { scale: 1.1, rotate: [-4, 4, 0] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: service.lightColor }}
            >
              <Icon weight="duotone" className="w-6 h-6" style={{ color: service.accentColor }} />
            </motion.div>
            <span
              className="text-4xl font-black leading-none select-none"
              style={{ color: service.lightColor }}
            >
              {service.number}
            </span>
          </div>

          {service.isNew && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: service.accentColor }}
            >
              <Sparkle weight="fill" className="w-2.5 h-2.5" />
              NOUVEAU
            </motion.div>
          )}
        </div>

        {/* Label catégorie */}
        <p
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: service.accentColor }}
        >
          {service.label}
        </p>

        {/* Titre */}
        <h3 className="text-lg font-black text-gray-900 leading-tight -mt-3">
          {service.title}
        </h3>

        {/* Ligne décorative animée */}
        <motion.div
          className="h-px rounded-full"
          style={{ background: `linear-gradient(to right, ${service.accentColor}, transparent)` }}
          animate={{ width: isHovered ? "100%" : "2rem" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {service.stats.map((stat, i) => (
            <motion.div
              key={i}
              animate={isHovered ? { y: -2 } : { y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-2.5 text-center"
              style={{ background: service.lightColor }}
            >
              <div className="text-base font-black" style={{ color: service.accentColor }}>
                <Counter value={stat.value} />
              </div>
              <div className="text-[10px] text-gray-500 font-medium mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {service.features.map((f, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + i * 0.07 + 0.3 }}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
              style={{
                color: service.accentColor,
                borderColor: service.accentColor + "35",
                background: service.lightColor,
              }}
            >
              <CheckCircle weight="fill" className="w-3 h-3" />
              {f}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ReassuranceCard({ icon: Icon, label, sub, color, index }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true });
  const mousePos = useMousePosition(cardRef);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 overflow-hidden cursor-default"
    >
      {/* Spotlight */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, ${color}15, transparent 70%)`,
          }}
        />
      )}

      {/* Bordure colorée au hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: `1.5px solid ${color}` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Contenu */}
      <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "15" }}>
        <motion.div animate={isHovered ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.25 }}>
          <Icon weight="duotone" className="w-5 h-5" style={{ color }} />
        </motion.div>
      </div>
      <div className="relative z-10">
        <p className="font-bold text-gray-900 text-sm leading-tight">{label}</p>
        <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}
export function ServicesShowcase() {
  const sectionRef = useRef(null);
  const titleInViewRef = useRef(null);
  const titleInView = useInView(titleInViewRef, { once: true });

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`${archivo.className} relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-white via-[#FFF1E6]/35 to-white`}
    >
      {/* ── BACKGROUND STATIC ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #005F69 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div ref={titleInViewRef} className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-sm mb-6"
          >
            <Sparkle weight="duotone" className="w-4 h-4 text-[#692C00]" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Tout en une seule application
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="title-hero leading-[1.1] mb-5"
          >
            4 services.{" "}
            <span className="relative">
              <span style={{ color: "#00707a" }}>
                1 seule app.
              </span>
              <motion.svg
                initial={{ scaleX: 0 }}
                animate={titleInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0 }}
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 400 8"
                fill="none"
              >
                <path d="M2 4 Q100 1 200 4 Q300 7 398 4" stroke="#00707a" strokeWidth="3.5" strokeLinecap="round" />
              </motion.svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Parking, garage, lavage et événements — ticketché centralise tous vos
            services automobiles et culturels au Bénin.
          </motion.p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-16 items-stretch">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* ── Reassurance strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {reassurances.map(({ icon, label, sub, color }, i) => (
            <ReassuranceCard key={i} icon={icon} label={label} sub={sub} color={color} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}