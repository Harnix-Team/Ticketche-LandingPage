"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchEventById } from "@/app/services/api";
import { EventsCarousel } from "@/components/Home/EventsCarousel";
import Image from "next/image";
import { motion } from "framer-motion";
import { getDownloadLink } from "@/utils/deviceDetection"; import { useDeepLink } from "@/utils/useDeepLink";

import {
  Calendar, MapPin, User, Tag, Ticket, ArrowLeft,
  NavigationArrow, Link as LinkIcon, Users, Clock,
  ArrowRight, ArrowSquareOut, Sparkle, Star, Heart,
  Camera, CheckCircle, Shield,
} from "@phosphor-icons/react";

/* ══════════════════════════════════════════════
   TOKENS — identiques à PlaceDetailsClient
══════════════════════════════════════════════ */
const C = "#005f69";
const CD = "#003d45";
const CL = "rgba(0,95,105,.09)";
const F = "'Archivo', sans-serif";

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
};

const getMinPrice = (tickets = []) => {
  const prices = tickets.map((t) => t.price).filter((p) => p > 0);
  if (prices.length === 0) return "Gratuit";
  return Math.min(...prices).toLocaleString() + " FCFA";
};

const getEventImage = (event) => event?.images?.[0]?.url ?? "/images/logo.png";
const getSecondImage = (event) => event?.images?.[1]?.url ?? getEventImage(event);

/* ── Stars ── */
function Stars({ value }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} weight={n <= Math.round(Number(value)) ? "fill" : "regular"}
          style={{ width: 12, height: 12, color: n <= Math.round(Number(value)) ? "#fbbf24" : "#e5e7eb" }} />
      ))}
    </div>
  );
}

/* ── Loader ── */
function Loader() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ textAlign: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid ${CL}`, borderTopColor: C, margin: "0 auto 14px" }} />
        <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Chargement</p>
      </div>
    </div>
  );
}

/* ── TicketCard — design original conservé ── */
function TicketCard({ ticket, index }) {
  const isFree = ticket.price === 0;
  const remaining = ticket.quantity ? ticket.quantity - (ticket.quantity_sold ?? 0) : null;
  const pct = remaining && ticket.quantity ? Math.round((remaining / ticket.quantity) * 100) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      className="flex items-stretch rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div className="relative flex flex-col items-center justify-center bg-[#005F69] px-4 py-5 flex-shrink-0">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-50" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-50" />
        <Ticket className="w-5 h-5 text-white mb-2" />
        <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">ticketche</span>
      </div>
      <div className="w-px border-l-2 border-dashed border-gray-200 self-stretch" />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-base leading-snug mb-1">{ticket.title}</h4>
            {ticket.description && <p className="text-gray-500 text-xs leading-relaxed">{ticket.description}</p>}
            {remaining !== null && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{remaining} places restantes</span><span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: index * 0.08 + 0.3 }}
                    className="h-full rounded-full bg-[#005F69]" />
                </div>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`font-black text-xl ${isFree ? "text-[#005F69]" : "text-gray-900"}`}>
              {isFree ? "Gratuit" : ticket.price.toLocaleString()}
            </div>
            {!isFree && <div className="text-xs text-gray-400">FCFA</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── ProgramItem — design original conservé ── */
function ProgramItem({ item, index }) {
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }} className="flex gap-4 group">
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: index * 0.07 + 0.15, type: "spring" }}
          className="w-9 h-9 rounded-xl bg-[#005F69] flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-black text-sm">{index + 1}</span>
        </motion.div>
        <div className="w-px flex-1 bg-[#005F69]/20 mt-2" />
      </div>
      <div className="pb-6 flex-1">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 group-hover:border-[#005F69]/30 transition-colors">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h4>
            {item.start_time && (
              <span className="text-[#005F69] text-xs font-bold bg-[#005F69]/10 px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />{item.start_time}
              </span>
            )}
          </div>
          {item.description && <p className="text-gray-500 text-xs leading-relaxed mt-1">{item.description}</p>}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════ */
export default function EventDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("eventId");
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("tickets");
  const [wishlisted, setWishlisted] = useState(false);
  const [downloadLink, setDownloadLink] = useState("https://play.google.com/store/apps/details?id=com.harnixsas.ticketche");
  const { openInApp } = useDeepLink();
  useEffect(() => { setDownloadLink(getDownloadLink()); }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await fetchEventById(id);
        if (data.success) setEvent(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return <Loader />;

  if (!event) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ textAlign: "center" }}>
        <Ticket size={52} color={C} weight="duotone" style={{ marginBottom: 16 }} />
        <p style={{ fontWeight: 900, fontSize: 18, color: "#374151", marginBottom: 10 }}>Événement introuvable</p>
        <button onClick={() => { if (window.history.length > 1) { router.back(); } else { router.push("/events"); } }} style={{ color: C, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
          Retour
        </button>
      </div>
    </div>
  );

  /* ── computed ── */
  const minPrice = getMinPrice(event.tickets);
  const isFree = minPrice === "Gratuit";
  const mapsUrl = event.latitude ? `https://maps.google.com/?q=${event.latitude},${event.longitude}` : "#";
  const heroImages = event.images?.length > 0 ? event.images.map((img) => img.url) : ["/images/logo.png"];
  const img1 = heroImages[activeImage] ?? heroImages[0];
  const img2 = heroImages[activeImage === 0 ? 1 : 0] ?? heroImages[0];

  const totalTickets = event.tickets?.reduce((acc, t) => acc + (t.quantity ?? 0), 0) ?? null;
  const soldTickets = event.tickets?.reduce((acc, t) => acc + (t.quantity_sold ?? 0), 0) ?? null;
  const pctSold = totalTickets ? Math.round((soldTickets / totalTickets) * 100) : null;
  const remaining = totalTickets ? totalTickets - soldTickets : null;

  const tabs = ["tickets", "détails", "programme"];

  return (
    <main style={{ minHeight: "100vh", background: "#f4fafb", fontFamily: F }}>

      <style>{`
        @media (max-width: 768px) {
          .ed-hero-grid { grid-template-columns: 1fr !important; height: 260px !important; }
          .ed-hero-grid > div:last-child { display: none; }
          .ed-main-grid { grid-template-columns: 1fr !important; }
          .ed-apercu-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ed-tabs-scroll { overflow-x: auto; white-space: nowrap; }
        }
      `}</style>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(244,250,251,.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,95,105,.10)",
        padding: "12px 0",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => { if (window.history.length > 1) { router.back(); } else { router.push("/events"); } }}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999, padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer", fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} /> Retour
          </button>

          <p style={{ fontSize: 14, fontWeight: 800, color: CD, margin: 0, letterSpacing: -.2 }}>
            {event.title}
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PHOTO GRID HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "20px 16px 0" }}>
        <div className="ed-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10, height: 320, borderRadius: 22, overflow: "hidden" }}>

          {/* Photo principale */}
          <div style={{ position: "relative" }}>
            <Image src={img1} alt={event.title} fill style={{ objectFit: "cover" }} priority />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 55%)" }} />

            {event.category && (
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <span style={{ background: C, color: "#fff", fontSize: 10, fontWeight: 800, padding: "5px 13px", borderRadius: 999, textTransform: "uppercase", letterSpacing: .6 }}>
                  {event.category.title}
                </span>
              </div>
            )}

            {event.is_featured && (
              <div style={{ position: "absolute", top: 14, right: 14 }}>
                <span style={{ background: "#692C00", color: "#fff", fontSize: 10, fontWeight: 800, padding: "5px 13px", borderRadius: 999, textTransform: "uppercase", letterSpacing: .6, display: "flex", alignItems: "center", gap: 5 }}>
                  <Sparkle style={{ width: 10, height: 10 }} /> À la une
                </span>
              </div>
            )}

            <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px", letterSpacing: -.3, lineHeight: 1.2 }}>
                {event.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                {event.location_name && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
                    <MapPin weight="fill" style={{ width: 13, height: 13, color: "#fff" }} />
                    {event.location_name}
                  </span>
                )}
                {event.start_date && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
                    <Calendar style={{ width: 13, height: 13, color: "#fff" }} />
                    {formatDate(event.start_date)}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6ee7b7", fontWeight: 600 }}>
                  <CheckCircle weight="fill" style={{ width: 13, height: 13 }} />
                  {event.reservations_count ?? 0} réservations
                </span>
              </div>
            </div>
          </div>

          {/* Photo secondaire + dots */}
          <div style={{ position: "relative" }}>
            <Image src={img2} alt={event.title} fill style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.25) 0%, transparent 50%)" }} />

            {heroImages.length > 1 && (
              <div style={{ position: "absolute", top: 14, right: 14, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "4px 10px" }}>
                <Camera style={{ width: 11, height: 11, color: "#fff" }} />
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{heroImages.length}</span>
              </div>
            )}

            {heroImages.length > 1 && (
              <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                {heroImages.slice(0, 5).map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{ width: i === activeImage ? 22 : 7, height: 7, borderRadius: 999, background: i === activeImage ? "#fff" : "rgba(255,255,255,.45)", border: "none", cursor: "pointer", padding: 0, transition: "all .2s" }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CORPS PRINCIPAL — grid 2 colonnes
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="ed-main-grid" style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 16px 0", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* ╔══════════════════════════════════════
            COLONNE GAUCHE
        ══════════════════════════════════════╗ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "26px 28px", border: "1px solid #e9e9e4", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>

            {event.description && (
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#4b5563", marginBottom: 24 }}>
                {event.description}
              </p>
            )}

            {/* ── ONGLETS ── */}
            <div className="ed-tabs-scroll" style={{ display: "flex", borderBottom: "1.5px solid #f0f0eb", marginBottom: 24 }}>
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: "none", border: "none",
                  padding: "9px 20px 10px",
                  fontSize: 13.5, fontWeight: activeTab === tab ? 800 : 500,
                  color: activeTab === tab ? "#111827" : "#9ca3af",
                  cursor: "pointer", fontFamily: F,
                  borderBottom: activeTab === tab ? `2.5px solid ${C}` : "2.5px solid transparent",
                  marginBottom: -1.5, textTransform: "capitalize",
                }}>
                  {tab === "tickets"
                    ? `Tickets (${event.tickets?.length ?? 0})`
                    : tab === "détails" ? "Détails"
                      : `Programme (${event.program_items?.length ?? 0})`}
                </button>
              ))}
            </div>

            {/* ── TAB : Tickets ── */}
            {activeTab === "tickets" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {event.tickets?.length > 0
                  ? event.tickets.map((ticket, i) => <TicketCard key={ticket.id} ticket={ticket} index={i} />)
                  : <p style={{ color: "#9ca3af", fontSize: 13 }}>Aucun ticket disponible.</p>
                }
              </div>
            )}

            {/* ── TAB : Détails ── */}
            {activeTab === "détails" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Date de début", val: formatDate(event.start_date), icon: Calendar, color: C },
                  event.end_date && { label: "Date de fin", val: formatDate(event.end_date), icon: Calendar, color: C },
                  event.location_name && { label: "Lieu", val: event.location_name, icon: MapPin, color: "#692C00" },
                  event.format && { label: "Format", val: event.format, icon: Tag, color: C },
                  event.capacity && { label: "Capacité", val: `${event.capacity} personnes`, icon: Users, color: "#692C00" },
                  event.online_link && { label: "Lien en ligne", val: event.online_link, icon: LinkIcon, color: C, isLink: true },
                  event.organizer && { label: "Organisateur", val: `${event.organizer.first_name} ${event.organizer.second_name}`, icon: User, color: C },
                ].filter(Boolean).map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "#f9f9f6", border: "1px solid #efefea" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 9, background: CL, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon style={{ width: 14, height: 14, color: item.color }} />
                        </div>
                        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{item.label}</span>
                      </div>
                      {item.isLink
                        ? <a href={item.val} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, fontWeight: 800, color: C, background: CL, padding: "4px 12px", borderRadius: 999, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          Rejoindre <ArrowSquareOut style={{ width: 11, height: 11 }} />
                        </a>
                        : <span style={{ fontSize: 12.5, fontWeight: 800, color: C, background: CL, padding: "4px 12px", borderRadius: 999 }}>{item.val}</span>
                      }
                    </motion.div>
                  );
                })}

                {event.places?.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #f0f0eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(105,44,0,.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MapPin style={{ width: 14, height: 14, color: "#692C00" }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 900, color: "#692C00", textTransform: "uppercase", letterSpacing: .8 }}>Lieux associés</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {event.places.map((place) => (
                        <div key={place.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "#f9f9f6", border: "1px solid #efefea" }}>
                          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{place.name}</span>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#9ca3af" }}>{place.city}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB : Programme ── */}
            {activeTab === "programme" && (
              <div>
                {event.program_items?.length > 0
                  ? event.program_items.map((item, i) => <ProgramItem key={i} item={item} index={i} />)
                  : <p style={{ color: "#9ca3af", fontSize: 13 }}>Aucun programme renseigné.</p>
                }
              </div>
            )}

            {/* ── Aperçu rapide ── */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #f0f0eb" }}>
              <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, marginBottom: 14 }}>
                Aperçu rapide
              </p>
              <div className="ed-apercu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[
                  { label: "Tickets", val: event.tickets?.length ?? "—", icon: Ticket, color: C },
                  { label: "Réservations", val: event.reservations_count ?? 0, icon: Users, color: "#059669" },
                  { label: "Prix minimum", val: getMinPrice(event.tickets), icon: Tag, color: "#d97706" },
                  { label: "Sécurité", val: "Certifié", icon: Shield, color: "#005f69" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} style={{ padding: "12px 14px", background: "#f9f9f6", borderRadius: 14, border: "1px solid #efefea" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                        <Icon style={{ width: 12, height: 12, color: item.color }} />
                        <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .6 }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 900, color: item.color }}>{item.val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ╔══════════════════════════════════════
            COLONNE DROITE (sidebar)
        ══════════════════════════════════════╗ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 22px 20px", border: "1px solid #e9e9e4", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 900, color: isFree ? C : "#111827", letterSpacing: -.5 }}>
                {minPrice}
              </span>
              {!isFree && <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 4, fontWeight: 500 }}> / billet</span>}
            </div>

            {totalTickets !== null && (
              <div style={{ background: "#f9f9f6", border: "1px solid #efefea", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, letterSpacing: .7, textTransform: "uppercase", marginBottom: 8 }}>
                  Disponibilité
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    {remaining} / {totalTickets} tickets
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: pctSold < 50 ? "#059669" : pctSold < 80 ? "#d97706" : "#dc2626" }}>
                    {100 - pctSold}% dispo
                  </span>
                </div>
                <div style={{ height: 5, background: "#e9e9e4", borderRadius: 999, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - pctSold}%` }}
                    transition={{ duration: .8, ease: "easeOut" }}
                    style={{ height: "100%", background: pctSold < 50 ? "#34d399" : pctSold < 80 ? "#fbbf24" : "#f87171", borderRadius: 999 }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button onClick={() => setWishlisted(!wishlisted)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: wishlisted ? "#fff0f0" : "#fff",
                border: `1.5px solid ${wishlisted ? "#fca5a5" : "#e5e7eb"}`,
                borderRadius: 999, padding: "10px 0", fontSize: 13, fontWeight: 700,
                color: wishlisted ? "#ef4444" : "#6b7280", cursor: "pointer", fontFamily: F,
              }}>
                <Heart weight={wishlisted ? "fill" : "regular"} style={{ width: 14, height: 14 }} />
                Favoris
              </button>
              <motion.a
                href={mapsUrl} target="_blank" rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C, color: "#fff", borderRadius: 999, padding: "10px 0", fontSize: 13, fontWeight: 800, textDecoration: "none", fontFamily: F }}
              >
                <NavigationArrow style={{ width: 14, height: 14 }} /> Itinéraire
              </motion.a>
            </div>

            {event.tickets?.length > 0 && (
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
                <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, marginBottom: 12 }}>
                  Détail des tarifs
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {event.tickets.slice(0, 4).map((t, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{t.title}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                        {t.price === 0 ? "Gratuit" : `${t.price.toLocaleString()} FCFA`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── CTA Réserver ── */}
          <div style={{
            background: `linear-gradient(140deg, ${C} 0%, ${CD} 100%)`,
            borderRadius: 20, padding: "22px",
            boxShadow: "0 6px 20px rgba(0,95,105,.28)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -10, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
            <p style={{ fontSize: 10, color: "rgba(255,255,255,.55)", fontWeight: 800, textTransform: "uppercase", letterSpacing: .9, marginBottom: 5 }}>
              Prêt à réserver ?
            </p>
            <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 18, lineHeight: 1.35, position: "relative" }}>
              Achetez vos billets en quelques secondes
            </p>
            {/* <motion.a
              href={downloadLink}
              target="_blank" rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", color: C, borderRadius: 12, padding: "13px 18px", fontSize: 13, fontWeight: 800, textDecoration: "none", fontFamily: F, position: "relative" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Ticket style={{ width: 16, height: 16 }} />
                Réserver via l'app
              </div>
              <ArrowRight style={{ width: 14, height: 14, opacity: .4 }} />
            </motion.a> */}

            {/* Bouton deep link */}
            <button
              onClick={() => openInApp("event", event.id)}
              style={{
                marginTop: 10, width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,.25)",
                color: "#fff", borderRadius: 12,
                padding: "11px 18px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: F,
                position: "relative",
              }}
            >
              Ouvrir dans l'app
            </button>
          </div>

        </div>
      </div>
      <div style={{ height: 60 }} />

    </main>
  );
}