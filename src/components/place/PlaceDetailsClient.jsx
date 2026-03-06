"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import {
  MapPin,
  Clock,
  Star,
  Wrench,
  ArrowLeft,
  NavigationArrow,
  CheckCircle,
  Car,
  Drop,
  CurrencyDollar,
  Shield,
  ArrowRight,
} from "@phosphor-icons/react";

/* ── Star rating ── */
function StarRow({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= Math.round(Number(value)) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

/* ── Service icon ── */
function getServiceIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("parking") || n.includes("station")) return Car;
  if (n.includes("lavage") || n.includes("wash")) return Drop;
  return Wrench;
}

/* ── Day chip ── */
const DAYS_SHORT = {
  lundi: "Lun",
  mardi: "Mar",
  mercredi: "Mer",
  jeudi: "Jeu",
  vendredi: "Ven",
  samedi: "Sam",
  dimanche: "Dim",
};

function DayBadge({ avail }) {
  const short =
    DAYS_SHORT[avail.day?.toLowerCase()] ?? avail.day?.slice(0, 3) ?? "?";
  return (
    <div className="flex flex-col items-center gap-1.5 bg-white border border-gray-100 rounded-2xl px-3.5 py-3 shadow-sm min-w-[58px]">
      <span className="text-[10px] font-black text-[#005F69] uppercase tracking-widest">
        {short}
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      <span className="text-[9px] text-gray-400 font-medium leading-tight text-center">
        {avail.open_hour}
        <br />—<br />
        {avail.close_hour}
      </span>
    </div>
  );
}

/* ── Review card ── */
function ReviewCard({ note, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#005F69] to-[#00949F] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-black text-xs">
              {note.user?.first_name?.[0]}
              {note.user?.second_name?.[0]}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none mb-1">
              {note.user?.first_name} {note.user?.second_name}
            </p>
            <StarRow value={note.star} />
          </div>
        </div>
        <span className="text-3xl font-black text-[#005F69]/10 leading-none select-none">
          ❝
        </span>
      </div>
      {note.description && (
        <p className="text-gray-500 text-[13px] leading-relaxed italic border-l-2 border-[#005F69]/20 pl-3">
          {note.description}
        </p>
      )}
    </motion.div>
  );
}

/* ── Section title ── */
function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-[#005F69]/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-[#005F69]" />
        </div>
      )}
      <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#005F69]">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[#005F69]/20 to-transparent" />
    </div>
  );
}

export default function PlaceDetailsClient() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const { scrollYProgress } = useScroll();
  const imgY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        const response = await fetchAllPlaces();
        if (response.success) {
          const found = response.data.find((p) => String(p.id) === String(id));
          if (found) setPlace(found);
        }
      } catch (err) {
        console.error(err);
        
      } finally {
        setLoading(false);
      }
    };
    loadPlace();
  }, [id]);

  const formatImage = (img) => {
    if (!img) return "/images/logo.png";
    return img.replace("/storage/app/public", "/storage");
  };

  const getPlaceRating = (p) => {
    if (p?.noteUsers?.length > 0) {
      const total = p.noteUsers.reduce((sum, n) => sum + parseFloat(n.star), 0);
      return (total / p.noteUsers.length).toFixed(1);
    }
    return null;
  };

  const getServicesByCategory = (services = []) =>
    services
      .filter((s) => s.pivot.status === "ON")
      .reduce((acc, s) => {
        const cat = s.service_category ?? "Services";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
      }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border-4 border-[#005F69]/20 border-t-[#005F69] mx-auto mb-5"
          />
          <p className="text-gray-400 font-medium tracking-widest text-sm uppercase">
            Chargement
          </p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📍</div>
          <p className="text-gray-700 text-xl font-bold mb-3">
            Emplacement introuvable
          </p>
          <button
            onClick={() => window.close()}
            className="text-[#005F69] underline"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const rating = getPlaceRating(place);
  const servicesByCategory = getServicesByCategory(place.services);
  const mapsUrl = `https://maps.google.com/?q=${place.latitude},${place.longitude}`;
  const heroImg =
    place.images?.length > 0
      ? formatImage(place.images[activeImage]?.link)
      : "/images/Space/recom1.png";
  const pctFree = place.total_place
    ? Math.round((place.available_places / place.total_place) * 100)
    : null;

  return (
    <main className="min-h-screen bg-[#F8FAFB]">

      {/* ══ HERO ══ */}
      <section className="relative h-[50vh] min-h-[320px] overflow-hidden bg-gray-900">
        <motion.div
          className="absolute inset-0"
          style={{ y: imgY, scale: imgScale }}
        >
          <Image
            src={heroImg}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#005F69] via-[#00949F] to-transparent origin-left z-10"
        />

        {/* Retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.close()}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/25 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour
        </motion.button>

        {/* Note */}
        {rating && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white px-3 py-1.5 rounded-full"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-black text-sm">{rating}</span>
            <span className="text-white/60 text-xs">/ 5</span>
          </motion.div>
        )}

        {/* Contenu bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-1.5 mb-2"
          >
            {place.services
              .filter((s) => s.pivot.status === "ON")
              .slice(0, 3)
              .map((s, i) => (
                <span
                  key={i}
                  className="bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                >
                  {s.name}
                </span>
              ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 text-white/75 text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00949F]" />
              {place.city}
            </span>
            {place.minimum_price && (
              <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <CurrencyDollar className="w-3.5 h-3.5" />
                À partir de {place.minimum_price} FCFA
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">

        {/* Miniatures */}
        {place.images?.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {place.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i
                    ? "border-[#005F69] shadow-md shadow-[#005F69]/20"
                    : "border-gray-200 opacity-60"
                  }`}
              >
                <Image
                  src={formatImage(img.link)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </motion.div>
        )}

        {/* ══ KPI CARDS ══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
        >
          {[
            {
              label: "Places dispo",
              value: `${place.available_places ?? "—"} / ${place.total_place ?? "—"}`,
              sub: pctFree !== null ? `${pctFree}% libre` : null,
              icon: Car,
              accent: "#005F69",
            },
            ...(rating
              ? [{
                label: "Note clients",
                value: `★ ${rating}`,
                sub: `${place.noteUsers?.length ?? 0} avis`,
                icon: Star,
                accent: "#B45309",
              }]
              : []),
            ...(place.minimum_price
              ? [{
                label: "Tarif min.",
                value: `${place.minimum_price} FCFA`,
                sub: "Toutes taxes",
                icon: CurrencyDollar,
                accent: "#047857",
              }]
              : []),
            {
              label: "Sécurité",
              value: "Certifié",
              sub: "ticketché partner",
              icon: Shield,
              accent: "#1D4ED8",
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm flex items-start gap-2 sm:gap-3 overflow-hidden relative"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${kpi.accent}60, transparent)` }}
                />
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: `${kpi.accent}15` }}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: kpi.accent }} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1">
                    {kpi.label}
                  </p>
                  <p
                    className="font-black text-sm sm:text-base leading-none truncate"
                    style={{ color: kpi.accent }}
                  >
                    {kpi.value}
                  </p>
                  {kpi.sub && (
                    <p className="text-gray-400 text-[10px] mt-0.5">{kpi.sub}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ══ LAYOUT ══ */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── SIDEBAR ── */}
          <div className="order-first lg:order-last lg:col-start-3 space-y-4">

            {place.availabilities?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm"
              >
                <SectionTitle icon={Clock}>Horaires</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {place.availabilities.map((a, i) => (
                    <DayBadge key={i} avail={a} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#005F69] to-[#00818A] rounded-2xl p-4 sm:p-6 shadow-xl shadow-[#005F69]/25"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
              <div className="flex flex-col sm:block">
                <p className="relative text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
                  Prêt à réserver ?
                </p>
                <p className="relative text-white font-black text-sm sm:text-lg leading-snug mb-4">
                  Accédez à votre place en quelques secondes
                </p>
                <div className="relative flex flex-col sm:flex-col gap-2">
                  <motion.a
                    href={`https://app.ticketche.com/places/itinerary?placeId=${place.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-between bg-white text-[#005F69] py-2.5 sm:py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <NavigationArrow className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Voir l'itinéraire
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </motion.a>
                  <motion.a
                    href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-between bg-white/15 border border-white/25 text-white py-2.5 sm:py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm backdrop-blur-sm transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Réserver via l'app
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── CONTENU PRINCIPAL ── */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">

            <motion.section
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">A propos</h2>
              <p className="text-gray-600 leading-relaxed">{place.description}</p>
              <div className="flex items-center gap-2 mt-4 text-[#005f69]">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{place.city}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span>{place.available_places} places disponibles sur {place.total_place}</span>
                {place.minimum_price && (
                  <span className="font-semibold text-[#692C00]">A partir de {place.minimum_price} FCFA</span>
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm"
            >
              <SectionTitle icon={Wrench}>Services & Tarifs</SectionTitle>
              {Object.entries(servicesByCategory).map(([category, services], ci) => {
                const Icon = getServiceIcon(category);
                return (
                  <div
                    key={category}
                    className={ci > 0 ? "mt-6 pt-6 border-t border-dashed border-gray-100" : ""}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-[#005F69]/10 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#005F69]" />
                      </div>
                      <h3 className="font-black text-gray-700 text-[11px] uppercase tracking-widest">
                        {category}
                      </h3>
                    </div>
                    <div className="space-y-0.5">
                      {services.map((s, si) => (
                        <motion.div
                          key={si}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + si * 0.05 }}
                          className="group flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-[#005F69]/5 transition-colors cursor-default"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#005F69]/30 group-hover:bg-[#005F69] transition-colors flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-xs sm:text-sm truncate">
                              {s.pivot.service_type_name}
                            </span>
                          </div>
                          <span className="font-black text-[#005F69] bg-[#005F69]/8 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex-shrink-0 ml-2">
                            {Number(s.pivot.price).toLocaleString()} FCFA
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.section>

            {place.noteUsers?.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <SectionTitle icon={Star}>
                  Avis clients ({place.noteUsers.length})
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {place.noteUsers.map((note, i) => (
                    <ReviewCard key={note.id} note={note} index={i} />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
