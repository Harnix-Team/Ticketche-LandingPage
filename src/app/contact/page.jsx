"use client";
import { useState, useEffect} from "react";
import Link from "next/link";
import {
  Phone, EnvelopeSimple, Ticket, Headset, Newspaper,
  ArrowRight, CheckCircle, Star, MapPin, CaretLeft, CaretRight,
} from "@phosphor-icons/react";


const CLUSTERS = [
  { cx: "2%",  cy: "6%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 8, opacity: 0.28, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "91%", cy: "5%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -12, y: 11, size: 8, opacity: 0.25, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "40%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.32, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }, { x: 13, y: -7, size: 6, opacity: 0.20, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "94%", cy: "38%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.35, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }, { x: -11, y: 9, size: 6, opacity: 0.20, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "4%",  cy: "72%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.28, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }, { x: 11, y: -6, size: 6, opacity: 0.18, anim: 2, delay: "0.5s", dur: "3.6s", color: "#00515a" }] },
  { cx: "89%", cy: "70%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }, { x: -9, y: -8, size: 6, opacity: 0.18, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "44%", cy: "1%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "94%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.20, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }] },
  { cx: "20%", cy: "4%",  stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 2, delay: "0.2s", dur: "2.8s", color: "#00818f" }] },
  { cx: "74%", cy: "92%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 0, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
];

const images = [
  "/images/Contact/12.jpg",
  "/images/Contact/13.jpg",
  "/images/Contact/14.jpg",
  "/images/Contact/15.jpg",
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `ctStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", service: "", date: "", message: "" });
  const [sent, setSent] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImg((prev) => (prev + 1) % images.length);
  }, 3000); // change toutes les 3 secondes
  return () => clearInterval(interval);
}, [currentImg]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.message) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

 const whatsappMessage = `Bonjour,


Nom : ${form.name}
Email : ${form.email}
Service : ${form.service || "Non specifie"}
Date souhaitee : ${form.date || "Non precisee"}

Message :
${form.message}

Cordialement,
${form.name}`;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/2290140512133?text=${encodedMessage}`, "_blank");

  setSent(true);
  setTimeout(() => setSent(false), 4000);
  setForm({ name: "", email: "", service: "", date: "", message: "" });
};
  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,.07)",
    border: "1.5px solid rgba(255,255,255,.12)",
    borderRadius: 8, color: "white", fontSize: 16,
    fontFamily: "'Archivo', sans-serif", outline: "none",
    transition: "border .15s", boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @keyframes ctStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes ctStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes ctStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        @keyframes ctArrow {
          0%, 100% { transform: translateX(0px); }
          50%       { transform: translateX(5px); }
        }
        .ct-arrow { animation: ctArrow 1.2s ease-in-out infinite; }
        .ct-card-light {
          background: #ffffff;
          border: 1.5px solid rgba(0,95,105,0.12);
          border-radius: 18px;
          padding: 40px 30px 36px;
          min-height: 200px;
          transition: all .25s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .ct-card-light::after {
          content: '';
          position: absolute;
          bottom: -1px; left: -1px;
          width: 36px; height: 36px;
          border-bottom: 4px solid #005f69;
          border-left: 4px solid #005f69;
          border-radius: 0 0 0 18px;
        }
        .ct-card-light::before {
          content: '';
          position: absolute;
          top: -1px; right: -1px;
          width: 36px; height: 36px;
          border-top: 4px solid #005f69;
          border-right: 4px solid #005f69;
          border-radius: 0 18px 0 0;
        }
        .ct-card-light:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,95,105,0.14);
          border-color: rgba(0,95,105,0.25);
        }
        .ct-card-teal {
          background: #005f69;
          border-radius: 18px;
          padding: 40px 30px 36px;
          min-height: 200px;
          box-shadow: 0 8px 28px rgba(0,95,105,.3);
          transition: all .25s ease;
          cursor: default;
          display: flex;
          flex-direction: column;
        }
        .ct-card-teal:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,95,105,.45);
        }
        .ct-link-dark {
          display: inline-flex; align-items: center; gap: 6px;
          background: #005f69; color: white;
          font-weight: 800; font-size: 13px; padding: 10px 16px;
          border-radius: 999px; text-decoration: none;
          font-family: 'Archivo', sans-serif;
          transition: all .18s ease;
          align-self: flex-start;
        }
        .ct-link-dark:hover { background: #007a8a; transform: translateY(-1px); }
        .ct-link-white {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,.18); color: white;
          font-weight: 800; font-size: 13px; padding: 10px 16px;
          border-radius: 999px; text-decoration: none;
          border: 1px solid rgba(255,255,255,.2);
          font-family: 'Archivo', sans-serif;
          transition: all .18s ease;
          align-self: flex-start;
        }
        .ct-link-white:hover { background: rgba(0,0,0,.35); transform: translateY(-1px); }

        /* ── MOBILE UNIQUEMENT — ne touche pas au desktop ── */
        @media (max-width: 768px) {
          .ct-hero-section { padding: 80px 16px 40px !important; }
          .ct-hero-section h1 { margin-top: 20px !important; }
          .ct-middle-section { padding: 0 16px 50px !important; }
          .ct-middle-grid { grid-template-columns: 1fr !important; gap: 32px !important; max-width: 100% !important; padding: 0 !important; }
          .ct-carousel-wrap { height: 220px !important; }
          .ct-form-box { padding: 32px 20px !important; }
          .ct-form-row-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Archivo', sans-serif", background: "#ecf5f5", position: "relative", overflow: "hidden" }}>
        <StarClusters />

      {/* ══ HERO ══ */}
<section className="ct-hero-section" style={{ padding: "100px 20px 90px", textAlign: "center", position: "relative", zIndex: 2 }}>
  <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "#0a1a1c", letterSpacing: -1, marginBottom: 14, lineHeight: 1.05, marginTop: 60 }}>
    Besoin <span style={{ color: "#005f69" }}>d'aide ?</span>
  </h1>
  <p style={{ color: "#6b7280", fontSize: 18, fontWeight: 500, margin: "0 auto" }}>
    Contactez-nous et un représentant vous répondra dans les plus brefs délais.
  </p>
</section>
  {/* ══ CARDS BOTTOM ══ */}
        {/* <section style={{ padding: "0 20px 80px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "90vw", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>

            <div className="ct-card-teal">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Ticket weight="fill" style={{ width: 22, height: 22, color: "white" }} />
              </div>
              <h4 style={{ color: "white", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Ticket Support</h4>
              <p style={{ color: "rgba(255,255,255,.75)", fontSize: 13, lineHeight: 1.75, marginBottom: 10 }}>
                Soumettez un ticket d'assistance et notre équipe vous prendra en charge rapidement pour résoudre votre problème.
              </p>
              <Link href="/support" className="ct-link-white" style={{ marginTop: "12px" }}>Nous contacter</Link>
            </div>

            <div className="ct-card-light">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Headset weight="fill" style={{ width: 22, height: 22, color: "#005f69" }} />
              </div>
              <h4 style={{ color: "#0a1a1c", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Appel Gratuit</h4>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.75, marginBottom: 10 }}>
                Appelez notre centre d'assistance disponible 7j/7 pour toute question sur nos établissements partenaires.
              </p>
              <Link href="tel:+22997000000" className="ct-link-dark" style={{ marginTop: "12px" }}>Nous contacter</Link>
            </div>

            <div className="ct-card-light">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Newspaper weight="fill" style={{ width: 22, height: 22, color: "#005f69" }} />
              </div>
              <h4 style={{ color: "#0a1a1c", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Actualités</h4>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.75, marginBottom: 10 }}>
                Restez informé des dernières nouveautés, offres exclusives et nouveaux établissements disponibles sur Ticketche.
              </p>
              <Link href="/news" className="ct-link-dark" style={{ marginTop: "12px" }}>Nous contacter</Link>
            </div>

          </div>
        </section> */}
        {/* ══ MIDDLE ══ */}
        <section className="ct-middle-section" style={{ padding: "0 20px 70px", position: "relative", zIndex: 2 }}>
          <div className="ct-middle-grid" style={{
            maxWidth: "90vw", margin: "0 auto", padding: "0 24px",
            display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 60,
           alignItems: "flex-start"
,
          }}>

            {/* Colonne gauche — hauteur calée sur la droite */}
            <div style={{ display: "flex", flexDirection: "column" }}>
  
  {/* Carrousel — flex: 1 pour occuper l'espace restant */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                <div className="ct-carousel-wrap" style={{ flex: 1, borderRadius: 16, overflow: "hidden", background: "#f0fafa", position: "relative", boxShadow: "0 4px 18px rgba(0,95,105,.15)" }}>
                  <img
                    src={images[currentImg]}
                    alt={`photo ${currentImg + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.4s ease" }}
                  />

                  {/* Flèches */}
                  <button onClick={() => setCurrentImg((prev) => (prev - 1 + images.length) % images.length)}
                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                    <CaretLeft weight="bold" style={{ width: 16, height: 16, color: "#005f69" }} />
                  </button>
                  <button onClick={() => setCurrentImg((prev) => (prev + 1) % images.length)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
                    <CaretRight weight="bold" style={{ width: 16, height: 16, color: "#005f69" }} />
                  </button>
                </div>

                {/* Dots */}
<div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10, marginBottom: 46 }}>                  {images.map((_, i) => (
                    <div key={i} onClick={() => setCurrentImg(i)} style={{ width: i === currentImg ? 20 : 7, height: 7, borderRadius: 999, background: i === currentImg ? "#005f69" : "rgba(0,95,105,.25)", cursor: "pointer", transition: "all 0.3s ease" }} />
                  ))}
                </div>
              </div>
              {/* Localisation */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,95,105,.3)" }}>
                  <MapPin weight="fill" style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <p style={{ color: "#005f69", fontWeight: 900, fontSize: 17, letterSpacing: .3 }}>Abomey Calavi, Bénin</p>
                  <p style={{ color: "#9ca3af", fontSize: 14, fontWeight: 500 }}>Notre localisation</p>
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,95,105,.3)" }}>
                  <Phone weight="fill" style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <p style={{ color: "#005f69", fontWeight: 900, fontSize: 17, letterSpacing: .3 }}>+229 01 40 51 21 33</p>
                  <p style={{ color: "#9ca3af", fontSize: 14, fontWeight: 500 }}>Appelez-nous</p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,95,105,.3)" }}>
                  <EnvelopeSimple weight="fill" style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <p style={{ color: "#005f69", fontWeight: 900, fontSize: 15 }}>support@ticketche.com</p>
                  <p style={{ color: "#9ca3af", fontSize: 14, fontWeight: 500 }}>Envoyez un email</p>
                </div>
              </div>

            
            </div>

            {/* Formulaire */}
            <div className="ct-form-box" style={{
              background: "linear-gradient(145deg, #005f69 0%, #004a52 100%)",
              borderRadius: 20, padding: "70px 28px",
              boxShadow: "0 20px 60px rgba(0,95,105,.3)",
              boxSizing: "border-box",
              display: "flex", flexDirection: "column",
            //  margin: "40px ", 
            }}>
              <h3 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 6, letterSpacing: -.3 }}>
                Prendre rendez-vous
              </h3>
              <p style={{ color: "rgba(255,255,255,.65)", fontSize: 15, marginBottom: 18, lineHeight: 1.6 }}>
                Un représentant vous contactera pour confirmer votre rendez-vous.
              </p>

              {sent ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 0" }}>
                  <CheckCircle weight="fill" style={{ width: 52, height: 52, color: "#ffffff", marginBottom: 14 }} />
                  <p style={{ color: "white", fontWeight: 900, fontSize: 17 }}>Message envoyé !</p>
                  <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, marginTop: 6 }}>Nous vous répondrons très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="ct-form-row-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
                    <div>
                      <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Votre nom</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Nom complet" required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                        onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"} />
                    </div>
                    <div>
                      <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Votre email</label>
                      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Entrez votre email" required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                        onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"} />
                    </div>
                  </div>

                  <div className="ct-form-row-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
                    <div>
                      <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Service</label>
                      <select name="service" value={form.service} onChange={handleChange} required
                        style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
                        onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                        onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"}>
                        <option value="" disabled style={{ background: "#004a52" }}>Sélectionner</option>
                        <option value="parking" style={{ background: "#004a52" }}>Parking</option>
                        <option value="lavage"  style={{ background: "#004a52" }}>Lavage</option>
                        <option value="garage"  style={{ background: "#004a52" }}>Garage</option>
                        <option value="event"   style={{ background: "#004a52" }}>Evenement</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Date</label>
                      <input name="date" value={form.date} onChange={handleChange} type="date"
                        style={{ ...inputStyle, colorScheme: "dark" }}
                        onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                        onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 14, flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Votre message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Décrivez votre demande…"
                      style={{ ...inputStyle, resize: "none", lineHeight: 1.6, flex: 1, minHeight: 60 }}
                      onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"} />
                  </div>

                  <button type="submit" style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#ffffff", color: "#005f69",
                    fontWeight: 900, fontSize: 14, padding: "14px 0",
                    borderRadius: 10, border: "none", cursor: "pointer",
                    fontFamily: "'Archivo', sans-serif", letterSpacing: .3,
                    transition: "all .18s ease", boxShadow: "0 4px 18px rgba(255,255,255,.25)",
                    marginTop: "auto",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f0fafa"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,255,255,.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(255,255,255,.25)"; }}
                  >
                    Prendre rendez-vous <ArrowRight weight="bold" className="ct-arrow" style={{ width: 16, height: 16 }} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}