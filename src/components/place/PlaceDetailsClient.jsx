"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchAllPlaces, queryKeys } from "@/app/services/api";
import { getDownloadLink } from "@/utils/deviceDetection";
import { useDeepLink } from "@/utils/useDeepLink";
import {
  MapPin, Star, Wrench, ArrowLeft, NavigationArrow,
  CheckCircle, Car, Drop, Shield, ArrowRight, ArrowUpRight,
  Heart, Camera,
} from "@phosphor-icons/react";

/* ══════════════════════════════════════════════
   TOKENS
══════════════════════════════════════════════ */
const C = "#005f69";
const CD = "#003d45";
const CL = "rgba(0,95,105,.09)";

const F = "'Archivo', sans-serif";

/* ══════════════════════════════════════════════
   RESPONSIVE STYLES (injected once)
══════════════════════════════════════════════ */
const RESPONSIVE_CSS = `
  /* Hero grid : 1 colonne sur mobile */
  @media (max-width: 768px) {
    .pd-hero-grid {
      grid-template-columns: 1fr !important;
      height: auto !important;
    }
    .pd-hero-main {
      height: 260px !important;
    }
    .pd-hero-secondary {
      display: none !important;
    }
  }

  /* Grid principal : sidebar sous le contenu */
  @media (max-width: 768px) {
    .pd-main-grid {
      grid-template-columns: 1fr !important;
      padding: 16px 12px 0 !important;
      gap: 14px !important;
    }
  }

  /* Onglets : scroll horizontal */
  @media (max-width: 480px) {
    .pd-tabs-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      flex-wrap: nowrap !important;
    }
    .pd-tabs-scroll::-webkit-scrollbar { display: none; }
    .pd-tabs-scroll button {
      white-space: nowrap;
      flex-shrink: 0;
      padding: 9px 12px 10px !important;
      font-size: 12px !important;
    }
  }

  /* Aperçu rapide : 2 colonnes */
  @media (max-width: 480px) {
    .pd-apercu-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  /* Avis : 1 colonne */
  @media (max-width: 640px) {
    .pd-avis-grid {
      grid-template-columns: 1fr !important;
    }
  }

  /* Top bar : nom tronqué */
  @media (max-width: 480px) {
    .pd-topbar-name {
      font-size: 12px !important;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /* Card principale padding réduit */
  @media (max-width: 480px) {
    .pd-main-card {
      padding: 18px 16px !important;
    }
    .pd-sidebar-card {
      padding: 18px 16px !important;
    }
  }

  /* CTA sidebar */
  @media (max-width: 768px) {
    .pd-cta-card {
      border-radius: 16px !important;
    }
  }
`;

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const formatImage = (img) =>
  img ? img.replace("/storage/app/public", "/storage") : "/images/logo.png";

const getPlaceRating = (p) => {
  if (!p?.noteUsers?.length) return null;
  const total = p.noteUsers.reduce((sum, n) => sum + parseFloat(n.star), 0);
  return (total / p.noteUsers.length).toFixed(1);
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

function getServiceIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("parking") || n.includes("station")) return Car;
  if (n.includes("lavage") || n.includes("wash")) return Drop;
  return Wrench;
}

const DAYS_SHORT = {
  lundi: "Lun", mardi: "Mar", mercredi: "Mer",
  jeudi: "Jeu", vendredi: "Ven", samedi: "Sam", dimanche: "Dim",
};

/* ── Stars ── */
function Stars({ value }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          weight={n <= Math.round(Number(value)) ? "fill" : "regular"}
          style={{ width: 12, height: 12, color: n <= Math.round(Number(value)) ? "#fbbf24" : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

/* ── Loader ── */
function Loader() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid ${CL}`, borderTopColor: C, margin: "0 auto 14px" }}
        />
        <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Chargement</p>
      </div>
    </div>
  );
}

/* ── ReviewCard ── */
function ReviewCard({ note, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "16px 18px",
        border: "1px solid #f0f0eb",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C}, #00818a)`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>
              {note.user?.first_name?.[0]}{note.user?.second_name?.[0]}
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 800, color: "#111827", fontSize: 13, margin: "0 0 4px" }}>
              {note.user?.first_name} {note.user?.second_name}
            </p>
            <Stars value={note.star} />
          </div>
        </div>
        <span style={{ fontSize: 28, color: "rgba(0,95,105,.10)", fontWeight: 900, lineHeight: 1 }}>❝</span>
      </div>
      {note.description && (
        <p style={{
          color: "#6b7280", fontSize: 12.5, lineHeight: 1.7,
          fontStyle: "italic", borderLeft: `2px solid rgba(0,95,105,.2)`, paddingLeft: 10, margin: 0,
        }}>
          {note.description}
        </p>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════════ */
export default function PlaceDetailsClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("placeId");
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("services");
  const [wishlisted, setWishlisted] = useState(false);
  const [downloadLink, setDownloadLink] = useState("https://play.google.com/store/apps/details?id=com.harnixsas.ticketche");
  const { openInApp } = useDeepLink();
  useEffect(() => {
    setDownloadLink(getDownloadLink());
  }, []);

  const { data: allPlaces = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.allPlaces,
    queryFn: fetchAllPlaces,
    enabled: !!id,
    select: (r) => r?.data ?? [],
  });
  const place = allPlaces.find((p) => String(p.id) === String(id)) ?? null;

  // Auto-swipe images
  useEffect(() => {
    if (!place?.images?.length || place.images.length <= 1) return;
    const total = Math.min(place.images.length, 5);
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(timer);
  }, [place?.images?.length]);

  if (loading) return <Loader />;

  if (!place) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ textAlign: "center" }}>
        <MapPin size={52} color={C} weight="duotone" style={{ marginBottom: 16 }} />
        <p style={{ fontWeight: 900, fontSize: 18, color: "#374151", marginBottom: 10 }}>Emplacement introuvable</p>
        <button onClick={() => router.back()} style={{ color: C, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
          Fermer
        </button>
      </div>
    </div>
  );

  /* ── computed ── */
  const rating = getPlaceRating(place);
  const servicesByCategory = getServicesByCategory(place.services);
  const activeServices = place.services.filter((s) => s.pivot.status === "ON");
  const heroImages = place.images?.length > 0
    ? place.images.map((img) => formatImage(img.link))
    : ["/images/Space/recom1.png"];

  const img1 = heroImages[activeImage] ?? heroImages[0];
  const img2 = heroImages[activeImage === 0 ? 1 : 0] ?? heroImages[0];

  const pctFree = place.total_place
    ? Math.round((place.available_places / place.total_place) * 100)
    : null;

  const servicesTotal = activeServices.reduce((acc, s) => acc + (Number(s.pivot.price) || 0), 0);
  const tabs = ["services", "horaires", "avis"];
  const otherPlaces = id ? allPlaces.filter((p) => String(p.id) !== String(id)) : [];

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  return (
    <main style={{ minHeight: "100vh", background: "#f4fafb", fontFamily: F }}>

      {/* ── Inject responsive styles ── */}
      <style>{RESPONSIVE_CSS}</style>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TOP BAR */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(244,250,251,.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,95,105,.10)",
        padding: "12px 0",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999,
              padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#374151",
              cursor: "pointer", fontFamily: F, boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} /> Retour
          </button>

          <p className="pd-topbar-name" style={{ fontSize: 14, fontWeight: 800, color: CD, margin: 0, letterSpacing: -.2 }}>
            {place.name}
          </p>
        </div>  {/* ← ferme le div intérieur */}
      </div>    {/* ← ferme le div extérieur */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PHOTO GRID HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ padding: "20px 16px 0", maxWidth: 1140, marginLeft: "auto", marginRight: "auto" }}>
        <div
          className="pd-hero-grid"
          style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10, height: 320, borderRadius: 22, overflow: "hidden" }}
        >
          {/* Photo principale */}
          <div className="pd-hero-main" style={{ position: "relative", height: "100%" }}>
            <Image src={img1} alt={place.name} fill style={{ objectFit: "cover" }} priority />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 55%)" }} />

            {activeServices[0] && (
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <span style={{
                  background: C, color: "#fff", fontSize: 10,
                  fontWeight: 800, padding: "5px 13px", borderRadius: 999,
                  textTransform: "uppercase", letterSpacing: .6,
                }}>
                  {activeServices[0].name}
                </span>
              </div>
            )}

            {rating && (
              <div style={{
                position: "absolute", top: 14, right: 14,
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,.18)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.3)", color: "#fff",
                padding: "5px 11px", borderRadius: 999,
              }}>
                <Star weight="fill" style={{ width: 11, height: 11, color: "#fbbf24" }} />
                <span style={{ fontWeight: 900, fontSize: 12 }}>{rating}</span>
              </div>
            )}

            <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px", letterSpacing: -.3, lineHeight: 1.2 }}>
                {place.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
                  <MapPin weight="fill" style={{ width: 13, height: 13, color: "#fff" }} />
                  {place.city}
                </span>
                {place.total_place && (
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
                    <Car style={{ width: 13, height: 13, color: "#fff" }} />
                    {place.available_places ?? "—"} / {place.total_place} places
                  </span>
                )}

              </div>
            </div>
          </div>

          {/* Photo secondaire */}
          <div className="pd-hero-secondary" style={{ position: "relative" }}>
            <Image src={img2} alt={place.name} fill style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.25) 0%, transparent 50%)" }} />

            {heroImages.length > 1 && (
              <div style={{
                position: "absolute", top: 14, right: 14,
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(0,0,0,.35)", backdropFilter: "blur(6px)",
                borderRadius: 999, padding: "4px 10px",
              }}>
                <Camera style={{ width: 11, height: 11, color: "#fff" }} />
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{heroImages.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dots de navigation visibles sur mobile (photo secondaire masquée) */}
        {heroImages.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
            {heroImages.slice(0, 5).map((_, i) => (
              <button key={i} onClick={() => setActiveImage(i)} style={{
                width: i === activeImage ? 22 : 7, height: 7, borderRadius: 999,
                background: i === activeImage ? C : "#cbd5e1",
                border: "none", cursor: "pointer", padding: 0, transition: "all .2s",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CORPS PRINCIPAL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="pd-main-grid"
        style={{
          display: "grid", gridTemplateColumns: "1fr 320px", gap: 20,
          padding: "24px 16px 0", maxWidth: 1140, marginLeft: "auto", marginRight: "auto",
          alignItems: "start",
        }}
      >

        {/* ╔══════════════════════════════════════
            COLONNE GAUCHE
        ══════════════════════════════════════╗ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div className="pd-main-card" style={{ background: "#fff", borderRadius: 20, padding: "26px 28px", border: "1px solid #e9e9e4", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>

            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#4b5563", marginBottom: 24 }}>
              {place.description ?? "Aucune description disponible pour cet emplacement."}
            </p>

            {/* ── ONGLETS ── */}
            <div className="pd-tabs-scroll" style={{ display: "flex", borderBottom: "1.5px solid #f0f0eb", marginBottom: 24 }}>
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: "none", border: "none",
                  padding: "9px 20px 10px",
                  fontSize: 13.5, fontWeight: activeTab === tab ? 800 : 500,
                  color: activeTab === tab ? "#111827" : "#9ca3af",
                  cursor: "pointer", fontFamily: F,
                  borderBottom: activeTab === tab ? `2.5px solid ${C}` : "2.5px solid transparent",
                  marginBottom: -1.5,
                }}>
                  {tab === "services" ? "Services & Tarifs"
                    : tab === "horaires" ? "Horaires"
                      : `Avis (${place.noteUsers?.length ?? 0})`}
                </button>
              ))}
            </div>

            {/* ── TAB : Services ── */}
            {activeTab === "services" && (
              <div>
                {Object.entries(servicesByCategory).length === 0
                  ? <p style={{ color: "#9ca3af", fontSize: 13 }}>Aucun service actif.</p>
                  : Object.entries(servicesByCategory).map(([cat, svcs], ci) => {
                    const CatIcon = getServiceIcon(cat);
                    return (
                      <div key={cat} style={ci > 0 ? { marginTop: 22, paddingTop: 22, borderTop: "1px dashed #f0f0eb" } : {}}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 9, background: CL, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CatIcon style={{ width: 14, height: 14, color: C }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 900, color: C, textTransform: "uppercase", letterSpacing: .8 }}>{cat}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                          {svcs.map((s, si) => (
                            <motion.div key={si}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.04 }}
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "12px 16px", borderRadius: 12,
                                background: "#f9f9f6", border: "1px solid #efefea",
                              }}
                            >
                              <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
                                {s.pivot.service_type_name || s.name}
                              </span>
                              <span style={{ fontSize: 12.5, fontWeight: 800, color: C, background: CL, padding: "4px 12px", borderRadius: 999 }}>
                                {Number(s.pivot.price).toLocaleString()} FCFA
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}

            {/* ── TAB : Horaires ── */}
            {activeTab === "horaires" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {place.availabilities?.length > 0
                  ? place.availabilities.map((a, i) => {
                    const short = DAYS_SHORT[a.day?.toLowerCase()] ?? a.day?.slice(0, 3) ?? "?";
                    return (
                      <div key={i} style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        background: "#f9f9f6", border: "1px solid #efefea",
                        borderRadius: 14, padding: "14px 16px", minWidth: 66,
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: C, textTransform: "uppercase", letterSpacing: .6 }}>{short}</span>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textAlign: "center", lineHeight: 1.5 }}>
                          {a.open_hour}<br />—<br />{a.close_hour}
                        </span>
                      </div>
                    );
                  })
                  : <p style={{ color: "#9ca3af", fontSize: 13 }}>Horaires non renseignés.</p>
                }
              </div>
            )}

            {/* ── TAB : Avis ── */}
            {activeTab === "avis" && (
              <div className="pd-avis-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {place.noteUsers?.length > 0
                  ? place.noteUsers.map((note, i) => <ReviewCard key={note.id ?? i} note={note} index={i} />)
                  : <p style={{ color: "#9ca3af", fontSize: 13 }}>Aucun avis pour le moment.</p>
                }
              </div>
            )}

            {/* ── Aperçu rapide ── */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #f0f0eb" }}>
              <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, marginBottom: 14 }}>
                Aperçu rapide
              </p>
              <div className="pd-apercu-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "Places totales", val: place.total_place ?? "—", icon: Car, color: C },
                  { label: "Places libres", val: place.available_places ?? "—", icon: CheckCircle, color: "#059669" },
                  { label: "Note", val: rating ?? "—", icon: Star, color: "#d97706" },                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} style={{ padding: "12px 14px", background: "#f9f9f6", borderRadius: 14, border: "1px solid #efefea" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                        <Icon style={{ width: 12, height: 12, color: item.color }} />
                        <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .6 }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 900, color: item.color }}>{item.val}</span>
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

          {/* ── Prix + disponibilité ── */}
          <div className="pd-sidebar-card" style={{ background: "#fff", borderRadius: 20, padding: "22px 22px 20px", border: "1px solid #e9e9e4", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>

            <div style={{ marginBottom: 16 }}>
              {place.minimum_price ? (
                <>
                  <span style={{ fontSize: 30, fontWeight: 900, color: "#111827", letterSpacing: -.5 }}>
                    {Number(place.minimum_price).toLocaleString()} FCFA
                  </span>
                  <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 4, fontWeight: 500 }}> / service</span>
                </>
              ) : (
                <span style={{ fontSize: 15, fontWeight: 700, color: "#9ca3af" }}>Sur demande</span>
              )}
            </div>

            {place.total_place && (
              <div style={{ background: "#f9f9f6", border: "1px solid #efefea", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, letterSpacing: .7, textTransform: "uppercase", marginBottom: 8 }}>
                  Disponibilité
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    {place.available_places} / {place.total_place} places
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: pctFree > 50 ? "#059669" : pctFree > 20 ? "#d97706" : "#dc2626" }}>
                    {pctFree}% libre
                  </span>
                </div>
                <div style={{ height: 5, background: "#e9e9e4", borderRadius: 999, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctFree}%` }}
                    transition={{ duration: .8, ease: "easeOut" }}
                    style={{ height: "100%", background: pctFree > 50 ? "#34d399" : pctFree > 20 ? "#fbbf24" : "#f87171", borderRadius: 999 }}
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
                color: wishlisted ? "#ef4444" : "#6b7280", cursor: "pointer",
                fontFamily: F, transition: "all .15s",
              }}>
                <Heart weight={wishlisted ? "fill" : "regular"} style={{ width: 14, height: 14 }} />
                Favoris
              </button>
              <motion.a
                href={`https://app.ticketche.com/places/itinerary?placeId=${place.id}`}
                target="_blank" rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: C, color: "#fff", borderRadius: 999,
                  padding: "10px 0", fontSize: 13, fontWeight: 800,
                  textDecoration: "none", fontFamily: F,
                }}
              >
                <NavigationArrow style={{ width: 14, height: 14 }} /> Itinéraire
              </motion.a>
            </div>

            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
              <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, marginBottom: 12 }}>
                Détail des tarifs
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeServices.slice(0, 4).map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{s.pivot.service_type_name || s.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{Number(s.pivot.price).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── CTA Réserver ── */}
          <div className="pd-cta-card" style={{
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
              Accédez à votre place en quelques secondes
            </p>
            {/* <motion.a
              href={downloadLink} target="_blank" rel="noopener noreferrer"
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#fff", color: C, borderRadius: 12,
                padding: "13px 18px", fontSize: 13, fontWeight: 800,
                textDecoration: "none", fontFamily: F, position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle weight="fill" style={{ width: 16, height: 16 }} />
                Réserver via l'app
              </div>
              <ArrowRight style={{ width: 14, height: 14, opacity: .4 }} />
            </motion.a> */}

            {/* Bouton deep link */}
            <button
              onClick={() => openInApp("place", place.id)}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          AUTRES EMPLACEMENTS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {otherPlaces.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ padding: "0 16px", maxWidth: 1140, marginLeft: "auto", marginRight: "auto", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #d4eaed)" }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #d4eaed)" }} />
            </div>
          </div>
          <div style={{ padding: "40px 0 60px", background: "#ebf4f4", position: "relative", overflow: "hidden" }}>
            <div style={{ maxWidth: "90vw", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
              <h3 style={{ margin: "0 0 28px", fontSize: 40, fontWeight: 900, color: "#0a1628", letterSpacing: "-0.02em" }}>
                Autres <span style={{ color: C }}>emplacements</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 28 }}>
                {otherPlaces.slice(0, 4).map((p) => {
                  const pRating = p.noteUsers?.length > 0
                    ? (p.noteUsers.reduce((s, n) => s + parseFloat(n.star), 0) / p.noteUsers.length).toFixed(1)
                    : null;
                  const pImg = p.images?.length > 0
                    ? p.images[0].link?.replace("/storage/app/public", "/storage")
                    : "/images/Space/recom1.png";
                  const pTags = [...new Set(p.services.filter((s) => s.pivot.status === "ON").map((s) => s.name))].slice(0, 3);
                  const pPrice = p.minimum_price
                    ? `${p.minimum_price} FCFA`
                    : (() => { const prices = p.services.filter((s) => s.pivot.status === "ON").map((s) => s.pivot.price); return prices.length > 0 ? `${Math.min(...prices)} FCFA` : "Sur demande"; })();

                  return (
                    <motion.article
                      key={p.id}
                      onClick={() => { localStorage.setItem("selectedPlace", JSON.stringify(p)); router.push(`/places/details?placeId=${p.id}`); }}
                      whileHover={{ y: -8, boxShadow: "0 0 0 4px #ffffff, 0 24px 56px rgba(0,0,0,0.35)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "4px solid #ffffff", boxShadow: "0 8px 32px rgba(0,0,0,0.22)", cursor: "pointer", height: 320, display: "flex", flexDirection: "column" }}
                    >
                      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                        <Image src={pImg} alt={p.name} fill sizes="(max-width: 640px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.82) 100%)", zIndex: 1 }} />
                      </div>

                      {pRating && (
                        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 3, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.7)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>★</span><span>{pRating}</span>
                        </div>
                      )}

                      {p.city && (
                        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 3, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: 999, padding: "4px 10px", fontSize: 10, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin weight="fill" style={{ width: 10, height: 10 }} />
                          {p.city}
                        </div>
                      )}

                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 8, zIndex: 2 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {pTags.map((tag, i) => (
                            <span key={i} style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.45)", borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: "0.03em" }}>{tag}</span>
                          ))}
                        </div>
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.01em", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                          {p.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1.5px solid rgba(255,255,255,0.22)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {p.noteUsers?.length > 0 && (
                              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                                <svg width="13" height="13" viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {p.noteUsers.length}
                              </span>
                            )}
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                              <svg width="13" height="13" viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>
                              {pPrice}
                            </span>
                          </div>
                          <button
                            style={{ display: "flex", alignItems: "center", gap: 5, background: "#ffffff", color: "#005f69", border: "none", borderRadius: 999, padding: "6px 14px", fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em", transition: "background 0.15s, transform 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                            onClick={(e) => { e.stopPropagation(); localStorage.setItem("selectedPlace", JSON.stringify(p)); router.push(`/places/details?placeId=${p.id}`); }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#e6f7f8"; e.currentTarget.style.transform = "scale(1.04)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "scale(1)"; }}
                          >
                            Détails <ArrowUpRight style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 60 }} />
    </main>
  );
}