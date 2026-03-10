"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchAllPlaces } from "@/app/services/api";
import {
  MapPin, Clock, Star, Wrench, ArrowLeft, NavigationArrow,
  CheckCircle, Car, Drop, CurrencyDollar, Shield, ArrowRight,
  Heart, ShareNetwork, DotsThree, Camera, Gauge, CalendarBlank,
  ChatCircle, Phone, Flag, PencilSimple,
} from "@phosphor-icons/react";

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

/* ── Star row ── */
function StarRow({ value }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} weight={n <= Math.round(Number(value)) ? "fill" : "regular"}
          style={{ width: 12, height: 12, color: n <= Math.round(Number(value)) ? "#fbbf24" : "#e5e7eb" }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   LOADER
══════════════════════════════════════════════ */
function Loader() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(0,95,105,.15)", borderTopColor: "#005f69", margin: "0 auto 16px" }}
        />
        <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>Chargement</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   REVIEW CARD
══════════════════════════════════════════════ */
function ReviewCard({ note, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: "white", borderRadius: 16, padding: "16px 18px",
        border: "1px solid #f3f4f6",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #005f69, #00818a)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>
              {note.user?.first_name?.[0]}{note.user?.second_name?.[0]}
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 800, color: "#111827", fontSize: 13, marginBottom: 4 }}>
              {note.user?.first_name} {note.user?.second_name}
            </p>
            <StarRow value={note.star} />
          </div>
        </div>
        <span style={{ fontSize: 28, color: "rgba(0,95,105,.1)", fontWeight: 900, lineHeight: 1 }}>❝</span>
      </div>
      {note.description && (
        <p style={{ color: "#6b7280", fontSize: 12.5, lineHeight: 1.7, fontStyle: "italic", borderLeft: "2px solid rgba(0,95,105,.2)", paddingLeft: 10 }}>
          {note.description}
        </p>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════ */
export default function PlaceDetailsClient() {
  const { id } = useParams();
  const [place, setPlace]           = useState(null);
  const [allPlaces, setAllPlaces]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab]   = useState("services");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchAllPlaces()
      .then((r) => {
        if (r.success) {
          const found = r.data.find((p) => String(p.id) === String(id));
          if (found) setPlace(found);
          setAllPlaces(r.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!place) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📍</div>
        <p style={{ fontWeight: 900, fontSize: 18, color: "#374151", marginBottom: 10 }}>Emplacement introuvable</p>
        <button onClick={() => window.close()} style={{ color: "#005f69", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Fermer</button>
      </div>
    </div>
  );

  const rating             = getPlaceRating(place);
  const servicesByCategory = getServicesByCategory(place.services);
  const activeServices     = place.services.filter((s) => s.pivot.status === "ON");
  const heroImages         = place.images?.length > 0
    ? place.images.map((img) => formatImage(img.link))
    : ["/images/Space/recom1.png", "/images/Space/recom1.png"];
  const img1 = heroImages[activeImage] ?? heroImages[0];
  const img2 = heroImages[activeImage === 0 ? 1 : 0] ?? heroImages[0];

  const pctFree = place.total_place
    ? Math.round((place.available_places / place.total_place) * 100)
    : null;

  /* Total prix services */
  const servicesTotal = activeServices.reduce((acc, s) => acc + (Number(s.pivot.price) || 0), 0);

  const tabs = ["services", "horaires", "avis"];

  return (
    <main style={{ minHeight: "100vh", background: "#eeeee9", fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* ══ TOP BAR ══════════════════════════════════════ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <button onClick={() => window.close()} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "white", border: "1px solid #e5e7eb", borderRadius: 999,
            padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#374151",
            cursor: "pointer", fontFamily: "'Archivo', sans-serif",
            boxShadow: "0 1px 3px rgba(0,0,0,.06)",
          }}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> Retour
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {[Heart, ShareNetwork, DotsThree].map((Icon, i) => (
              <button key={i} style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "white", border: "1px solid #e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#6b7280",
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              }}>
                <Icon style={{ width: 16, height: 16 }} />
              </button>
            ))}
          </div>
        </div>

        {/* ══ PHOTO GRID ═══════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 8, marginBottom: 24, height: 260 }}>
          {/* Photo principale */}
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
            <Image src={img1} alt={place.name} fill style={{ objectFit: "cover" }} priority />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)" }} />
            {/* Tag service */}
            <div style={{ position: "absolute", top: 12, left: 12 }}>
              {activeServices[0] && (
                <span style={{
                  background: "#005f69", color: "white", fontSize: 10,
                  fontWeight: 800, padding: "4px 12px", borderRadius: 999,
                  textTransform: "uppercase", letterSpacing: .5,
                }}>{activeServices[0].name}</span>
              )}
            </div>
            {/* Rating */}
            {rating && (
              <div style={{
                position: "absolute", top: 12, right: 12,
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.3)", color: "white",
                padding: "5px 10px", borderRadius: 999,
              }}>
                <Star weight="fill" style={{ width: 11, height: 11, color: "#fbbf24" }} />
                <span style={{ fontWeight: 900, fontSize: 12 }}>{rating}</span>
              </div>
            )}
            {/* Boutons bas */}
            <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 6 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", border: "none", borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#374151", fontFamily: "'Archivo', sans-serif" }}>
                <Gauge style={{ width: 12, height: 12 }} /> Visite 360°
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", border: "none", borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#374151", fontFamily: "'Archivo', sans-serif" }}>
                <Camera style={{ width: 12, height: 12 }} /> Toutes les photos
              </button>
            </div>
          </div>
          {/* Photo secondaire */}
          <div style={{ borderRadius: 18, overflow: "hidden", position: "relative" }}>
            <Image src={img2} alt={place.name} fill style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.25) 0%, transparent 50%)" }} />
            {place.images?.length > 1 && (
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                {place.images.slice(0, 4).map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} style={{
                    width: i === activeImage ? 22 : 7, height: 7, borderRadius: 999,
                    background: i === activeImage ? "white" : "rgba(255,255,255,.45)",
                    border: "none", cursor: "pointer", padding: 0, transition: "all .2s",
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ LAYOUT PRINCIPAL ════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>

          {/* ──────────── COLONNE GAUCHE ──────────────── */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px 28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,.05)", border: "1px solid #e9e9e4" }}>

            {/* Titre */}
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111827", marginBottom: 10, letterSpacing: -.3, lineHeight: 1.25 }}>
              {place.name}
            </h1>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                <MapPin weight="fill" style={{ width: 13, height: 13, color: "#005f69" }} />
                {place.city}
              </span>
              {place.total_place && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                  <Car style={{ width: 13, height: 13, color: "#005f69" }} />
                  {place.available_places ?? "—"} / {place.total_place} places
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#059669", fontWeight: 600 }}>
                <CheckCircle weight="fill" style={{ width: 13, height: 13 }} />
                Certifié
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#6b7280", marginBottom: 24 }}>
              {place.description ?? "Aucune description disponible pour cet emplacement."}
            </p>

            {/* ── Onglets ── */}
            <div style={{ display: "flex", borderBottom: "1.5px solid #f0f0eb", marginBottom: 24 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: "none", border: "none",
                  padding: "9px 20px 10px",
                  fontSize: 13.5, fontWeight: activeTab === tab ? 800 : 500,
                  color: activeTab === tab ? "#111827" : "#9ca3af",
                  cursor: "pointer", fontFamily: "'Archivo', sans-serif",
                  borderBottom: activeTab === tab ? "2px solid #005f69" : "2px solid transparent",
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
                        {/* Catégorie header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(0,95,105,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CatIcon style={{ width: 14, height: 14, color: "#005f69" }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 900, color: "#005f69", textTransform: "uppercase", letterSpacing: .8 }}>{cat}</span>
                        </div>
                        {/* Services list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {svcs.map((s, si) => (
                            <motion.div key={si}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.04 }}
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "11px 16px", borderRadius: 12,
                                background: "#f9f9f6", border: "1px solid #efefea",
                              }}
                            >
                              <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
                                {s.pivot.service_type_name || s.name}
                              </span>
                              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#005f69", background: "rgba(0,95,105,.08)", padding: "4px 12px", borderRadius: 999 }}>
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {place.availabilities?.length > 0
                  ? place.availabilities.map((a, i) => {
                      const short = DAYS_SHORT[a.day?.toLowerCase()] ?? a.day?.slice(0, 3) ?? "?";
                      return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "#f9f9f6", border: "1px solid #efefea", borderRadius: 14, padding: "12px 14px", minWidth: 62 }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: "#005f69", textTransform: "uppercase", letterSpacing: .6 }}>{short}</span>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                          <span style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 600, textAlign: "center", lineHeight: 1.5 }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {place.noteUsers?.length > 0
                  ? place.noteUsers.map((note, i) => <ReviewCard key={note.id ?? i} note={note} index={i} />)
                  : <p style={{ color: "#9ca3af", fontSize: 13 }}>Aucun avis pour le moment.</p>
                }
              </div>
            )}

            {/* ══ AUTRES EMPLACEMENTS ══════════════════════ */}
            {allPlaces.filter(p => String(p.id) !== String(id)).length > 0 && (
              <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1.5px solid #f0f0eb" }}>
                {/* En-tête section */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(0,95,105,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MapPin style={{ width: 14, height: 14, color: "#005f69" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#005f69", textTransform: "uppercase", letterSpacing: .8 }}>
                      Autres emplacements
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
                    {allPlaces.filter(p => String(p.id) !== String(id)).length} disponibles
                  </span>
                </div>

                {/* Liste */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {allPlaces
                    .filter(p => String(p.id) !== String(id))
                    .map((p, i) => {
                      const r = getPlaceRating(p);
                      const tags = p.services
                        .filter(s => s.pivot.status === "ON")
                        .slice(0, 2)
                        .map(s => s.name);
                      const thumb = p.images?.length > 0
                        ? formatImage(p.images[0].link)
                        : "/images/Space/recom1.png";
                      const TagIcon = tags[0]?.toLowerCase().includes("parking") ? Car
                                    : tags[0]?.toLowerCase().includes("lavage")  ? Drop
                                    : Wrench;

                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            localStorage.setItem("selectedPlace", JSON.stringify(p));
                            window.open(`/places/${p.id}`, "_blank");
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 0,
                            background: "#f9f9f6", border: "1px solid #efefea",
                            borderRadius: 16, overflow: "hidden", cursor: "pointer",
                            transition: "all .18s ease",
                          }}
                          whileHover={{ y: -2, boxShadow: "0 6px 18px rgba(0,95,105,.1)", borderColor: "rgba(0,95,105,.25)" }}
                        >
                          {/* Accent latéral */}
                          <div style={{
                            flexShrink: 0, width: 48,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            padding: "12px 0", gap: 4,
                            background: "linear-gradient(160deg, #005f69, #003d45)",
                            alignSelf: "stretch",
                          }}>
                            <TagIcon style={{ width: 17, height: 17, color: "white" }} />
                            <span style={{ color: "rgba(255,255,255,.5)", fontSize: 7.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: .8, textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>
                              {tags[0] ?? "Service"}
                            </span>
                          </div>

                          {/* Miniature */}
                          <div style={{ flexShrink: 0, width: 80, height: 72, position: "relative", overflow: "hidden" }}>
                            <Image src={thumb} alt={p.name} fill style={{ objectFit: "cover" }} />
                            {r && (
                              <div style={{ position: "absolute", bottom: 5, left: 5, display: "flex", alignItems: "center", gap: 3, background: "rgba(255,255,255,.9)", borderRadius: 999, padding: "2px 7px" }}>
                                <Star weight="fill" style={{ width: 9, height: 9, color: "#fbbf24" }} />
                                <span style={{ fontSize: 9.5, fontWeight: 900, color: "#111" }}>{r}</span>
                              </div>
                            )}
                          </div>

                          {/* Infos */}
                          <div style={{ flex: 1, padding: "12px 14px", minWidth: 0 }}>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                              {tags.map((tag, ti) => (
                                <span key={ti} style={{ fontSize: 9, fontWeight: 800, color: "#692C00", textTransform: "uppercase", letterSpacing: .4, border: "1px solid rgba(105,44,0,.2)", padding: "1px 7px", borderRadius: 999 }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p style={{ fontWeight: 800, color: "#111827", fontSize: 13.5, lineHeight: 1.3, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {p.name}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}>
                                <MapPin weight="fill" style={{ width: 10, height: 10, color: "#005f69" }} />
                                {p.city}
                              </span>
                              <span style={{ fontSize: 12, fontWeight: 900, color: "#005f69" }}>
                                {p.minimum_price ? `${Number(p.minimum_price).toLocaleString()} FCFA` : "Sur demande"}
                              </span>
                            </div>
                          </div>

                          {/* Flèche */}
                          <div style={{ flexShrink: 0, padding: "0 12px 0 4px" }}>
                            <ArrowRight style={{ width: 14, height: 14, color: "#d1d5db" }} />
                          </div>
                        </motion.div>
                      );
                    })
                  }
                </div>
              </div>
            )}

          </div>{/* fin colonne gauche */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* ── Carte prix + actions ── */}
            <div style={{ background: "white", borderRadius: 20, padding: "22px 22px 20px", border: "1px solid #e9e9e4", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>

              {/* Prix */}
              <div style={{ marginBottom: 18 }}>
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

              {/* Barre disponibilité */}
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

              {/* Boutons Favoris + Itinéraire */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button onClick={() => setWishlisted(!wishlisted)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: wishlisted ? "#fff0f0" : "white",
                  border: `1.5px solid ${wishlisted ? "#fca5a5" : "#e5e7eb"}`,
                  borderRadius: 999, padding: "10px 0", fontSize: 13, fontWeight: 700,
                  color: wishlisted ? "#ef4444" : "#6b7280", cursor: "pointer",
                  fontFamily: "'Archivo', sans-serif", transition: "all .15s",
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
                    background: "#005f69", color: "white", borderRadius: 999,
                    padding: "10px 0", fontSize: 13, fontWeight: 800,
                    textDecoration: "none", fontFamily: "'Archivo', sans-serif",
                  }}
                >
                  <NavigationArrow style={{ width: 14, height: 14 }} /> Itinéraire
                </motion.a>
              </div>

              {/* Détail des tarifs */}
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
                {activeServices.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 8, borderTop: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#005f69" }}>Total estimé</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#005f69" }}>{servicesTotal.toLocaleString()} FCFA</span>
                  </div>
                )}
              </div>

              {/* Signaler */}
              <button style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 14, background: "none", border: "none", fontSize: 11, color: "#d1d5db", cursor: "pointer", fontFamily: "'Archivo', sans-serif", padding: 0 }}>
                <Flag style={{ width: 11, height: 11 }} /> Signaler cet emplacement
              </button>
            </div>

            {/* ── CTA Réserver ── */}
            <div style={{
              background: "linear-gradient(140deg, #005f69 0%, #003d45 100%)",
              borderRadius: 20, padding: "22px 22px 22px",
              boxShadow: "0 6px 20px rgba(0,95,105,.28)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -10, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
              <p style={{ fontSize: 10, color: "rgba(255,255,255,.55)", fontWeight: 800, textTransform: "uppercase", letterSpacing: .9, marginBottom: 5 }}>
                Prêt à réserver ?
              </p>
              <p style={{ fontSize: 16, fontWeight: 900, color: "white", marginBottom: 18, lineHeight: 1.35, position: "relative" }}>
                Accédez à votre place en quelques secondes
              </p>
              <motion.a
                href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
                target="_blank" rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "white", color: "#005f69", borderRadius: 12,
                  padding: "13px 18px", fontSize: 13, fontWeight: 800,
                  textDecoration: "none", fontFamily: "'Archivo', sans-serif",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle weight="fill" style={{ width: 16, height: 16 }} />
                  Réserver via l'app
                </div>
                <ArrowRight style={{ width: 14, height: 14, opacity: .4 }} />
              </motion.a>
            </div>

            {/* ── Aperçu rapide ── */}
            <div style={{ background: "white", borderRadius: 20, padding: "20px 22px", border: "1px solid #e9e9e4", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
              <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, marginBottom: 16 }}>
                Aperçu rapide
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Places totales",  val: place.total_place ?? "—",       icon: Car,         color: "#005f69" },
                  { label: "Places libres",   val: place.available_places ?? "—",  icon: CheckCircle, color: "#059669" },
                  { label: "Note",            val: rating ?? "—",                  icon: Star,        color: "#d97706" },
                  { label: "Sécurité",        val: "Certifié",                     icon: Shield,      color: "#1d4ed8" },
                ].map((item, i) => {
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

          </div>{/* fin sidebar */}
        </div>{/* fin grid */}
      </div>
    </main>
  );
}