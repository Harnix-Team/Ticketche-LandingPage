"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Phone, EnvelopeSimple, Ticket, Headset, Newspaper,
  ArrowRight, CheckCircle, Star,
} from "@phosphor-icons/react";

const CLUSTERS = [
  { cx: "2%",  cy: "6%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s",    dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 8, opacity: 0.28, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "91%", cy: "5%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s",  dur: "3.0s", color: "#00818f" }, { x: -12, y: 11, size: 8, opacity: 0.25, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "40%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.32, anim: 2, delay: "0.1s",  dur: "3.5s", color: "#00515a" }, { x: 13, y: -7, size: 6, opacity: 0.20, anim: 0, delay: "0.4s", dur: "2.7s", color: "#00818f" }] },
  { cx: "94%", cy: "38%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.35, anim: 0, delay: "0.3s",  dur: "3.3s", color: "#00818f" }, { x: -11, y: 9, size: 6, opacity: 0.20, anim: 1, delay: "0.6s", dur: "2.9s", color: "#00515a" }] },
  { cx: "4%",  cy: "72%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.28, anim: 1, delay: "0.2s",  dur: "2.9s", color: "#00818f" }, { x: 11, y: -6, size: 6, opacity: 0.18, anim: 2, delay: "0.5s", dur: "3.6s", color: "#00515a" }] },
  { cx: "89%", cy: "70%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 2, delay: "0.4s",  dur: "3.1s", color: "#00515a" }, { x: -9, y: -8, size: 6, opacity: 0.18, anim: 0, delay: "0.7s", dur: "2.8s", color: "#00818f" }] },
  { cx: "44%", cy: "1%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.22, anim: 0, delay: "0.1s",  dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "94%", stars: [{ x: 0, y: 0, size: 7,  opacity: 0.20, anim: 1, delay: "0.3s",  dur: "3.2s", color: "#00515a" }] },
  { cx: "20%", cy: "4%",  stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 2, delay: "0.2s",  dur: "2.8s", color: "#00818f" }] },
  { cx: "74%", cy: "92%", stars: [{ x: 0, y: 0, size: 6,  opacity: 0.18, anim: 0, delay: "0.5s",  dur: "3.4s", color: "#00515a" }] },
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

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", service: "", date: "", message: "" });
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,.07)",
    border: "1.5px solid rgba(255,255,255,.12)",
    borderRadius: 8, color: "white", fontSize: 13,
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
        .ct-card-light {
          background: #ffffff;
          border: 1.5px solid rgba(0,95,105,0.12);
          border-radius: 18px;
          padding: 28px 26px 26px;
          transition: all .25s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
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
          padding: 28px 26px 26px;
          box-shadow: 0 8px 28px rgba(0,95,105,.3);
          transition: all .25s ease;
          cursor: default;
        }
        .ct-card-teal:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,95,105,.45);
        }
        .ct-link-dark {
          display: inline-flex; align-items: center; gap: 6px;
          background: #005f69; color: white;
          font-weight: 800; font-size: 13px; padding: 10px 22px;
          border-radius: 999px; text-decoration: none;
          font-family: 'Archivo', sans-serif;
          transition: all .18s ease;
        }
        .ct-link-dark:hover { background: #007a8a; transform: translateY(-1px); }
        .ct-link-white {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,.18); color: white;
          font-weight: 800; font-size: 13px; padding: 10px 22px;
          border-radius: 999px; text-decoration: none;
          border: 1px solid rgba(255,255,255,.2);
          font-family: 'Archivo', sans-serif;
          transition: all .18s ease;
        }
        .ct-link-white:hover { background: rgba(0,0,0,.35); transform: translateY(-1px); }
      `}</style>

      <div style={{ fontFamily: "'Archivo', sans-serif", background: "#ecf5f5", position: "relative", overflow: "hidden" }}>
        <StarClusters />

        {/* ══ HERO ══ */}
        <section style={{
          padding: "100px 20px 90px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,95,105,0.10)", border: "1px solid rgba(0,95,105,0.2)",
            borderRadius: 999, padding: "6px 18px", marginBottom: 20,
          }}>
            <Star weight="fill" style={{ width: 11, height: 11, color: "#005f69" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#005f69" }}>Nous contacter</span>
            <Star weight="fill" style={{ width: 11, height: 11, color: "#005f69" }} />
          </div>

          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "#0a1a1c", letterSpacing: -1, marginBottom: 14, lineHeight: 1.05 }}>
            Contact
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 500, maxWidth: 460, margin: "0 auto" }}>
            Notre équipe est disponible pour répondre à toutes vos questions.
          </p>
        </section>

        {/* ══ MIDDLE ══ */}
        <section style={{ padding: "0 20px 70px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 60, alignItems: "start" }}>

            {/* Colonne gauche */}
            <div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#0a1a1c", lineHeight: 1.15, marginBottom: 18, letterSpacing: -.4 }}>
                Get in touch
              </h2>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.75, marginBottom: 36 }}>
                Besoin d'aide ou d'informations sur nos services ? Contactez-nous et un représentant vous répondra dans les plus brefs délais.
              </p>

              <div style={{ marginBottom: 28 }}>
                <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, fontWeight: 500 }}>
                  Ticketche Business Centre<br />
                  Cotonou, Littoral<br />
                  Bénin, Afrique de l'Ouest
                </p>
              </div>

              {/* Téléphone */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,95,105,.3)" }}>
                  <Phone weight="fill" style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <p style={{ color: "#005f69", fontWeight: 900, fontSize: 17, letterSpacing: .3 }}>+229 97 00 00 00</p>
                  <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 500 }}>Appelez-nous</p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,95,105,.3)" }}>
                  <EnvelopeSimple weight="fill" style={{ width: 20, height: 20, color: "white" }} />
                </div>
                <div>
                  <p style={{ color: "#005f69", fontWeight: 900, fontSize: 15 }}>contact@ticketche.com</p>
                  <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 500 }}>Envoyez un email</p>
                </div>
              </div>

              <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 800, letterSpacing: .2 }}>www.ticketche.com</p>
            </div>

            {/* Formulaire */}
            <div style={{ background: "linear-gradient(145deg, #005f69 0%, #004a52 100%)", borderRadius: 20, padding: "36px 32px", boxShadow: "0 20px 60px rgba(0,95,105,.3)" }}>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 8, letterSpacing: -.3 }}>
                Réservez votre<br />prestation
              </h3>
              <p style={{ color: "rgba(255,255,255,.65)", fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
                Un représentant vous contactera pour confirmer votre rendez-vous.
              </p>

              {sent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <CheckCircle weight="fill" style={{ width: 52, height: 52, color: "#00c4d4", marginBottom: 14 }} />
                  <p style={{ color: "white", fontWeight: 900, fontSize: 17 }}>Message envoyé !</p>
                  <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, marginTop: 6 }}>Nous vous répondrons très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
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
                        <option value="autre"   style={{ background: "#004a52" }}>Autre</option>
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

                  <div style={{ marginBottom: 22 }}>
                    <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>Votre message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Décrivez votre demande…" rows={4}
                      style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                      onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"} />
                  </div>

                  <button type="submit" style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#00c4d4", color: "#001f25",
                    fontWeight: 900, fontSize: 14, padding: "14px 0",
                    borderRadius: 10, border: "none", cursor: "pointer",
                    fontFamily: "'Archivo', sans-serif", letterSpacing: .3,
                    transition: "all .18s ease", boxShadow: "0 4px 18px rgba(0,196,212,.35)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#00d9eb"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,196,212,.5)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#00c4d4"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,196,212,.35)"; }}
                  >
                    Prendre rendez-vous <ArrowRight weight="bold" style={{ width: 16, height: 16 }} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ══ CARDS BOTTOM ══ */}
        <section style={{ padding: "0 20px 80px", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>

            {/* Card 1 — teal */}
            <div className="ct-card-teal">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Ticket weight="fill" style={{ width: 22, height: 22, color: "white" }} />
              </div>
              <h4 style={{ color: "white", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Ticket Support</h4>
              <p style={{ color: "rgba(255,255,255,.75)", fontSize: 13, lineHeight: 1.75, marginBottom: 22 }}>
                Soumettez un ticket d'assistance et notre équipe vous prendra en charge rapidement pour résoudre votre problème.
              </p>
              <Link href="/support" className="ct-link-white">Nous contacter</Link>
            </div>

            {/* Card 2 — light */}
            <div className="ct-card-light">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Headset weight="fill" style={{ width: 22, height: 22, color: "#005f69" }} />
              </div>
              <h4 style={{ color: "#0a1a1c", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Appel Gratuit</h4>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.75, marginBottom: 22 }}>
                Appelez notre centre d'assistance disponible 7j/7 pour toute question sur nos établissements partenaires.
              </p>
              <Link href="tel:+22997000000" className="ct-link-dark">Nous contacter</Link>
            </div>

            {/* Card 3 — light */}
            <div className="ct-card-light">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Newspaper weight="fill" style={{ width: 22, height: 22, color: "#005f69" }} />
              </div>
              <h4 style={{ color: "#0a1a1c", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>Actualités</h4>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.75, marginBottom: 22 }}>
                Restez informé des dernières nouveautés, offres exclusives et nouveaux établissements disponibles sur Ticketche.
              </p>
              <Link href="/news" className="ct-link-dark">Nous contacter</Link>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}