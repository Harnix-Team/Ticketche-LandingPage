"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Phone, EnvelopeSimple, Globe, Ticket, Headset, Newspaper,
  ArrowRight, MapPin, CheckCircle,
} from "@phosphor-icons/react";

/* ══════════════════════════════════════════════
   CONTACT PAGE — design exact de la maquette
   Couleur : #005f69  |  Police : Archivo
══════════════════════════════════════════════ */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", service: "", date: "", message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", service: "", date: "", message: "" });
  };

  /* ── styles partagés ── */
  const inputStyle = {
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,.07)",
    border: "1.5px solid rgba(255,255,255,.12)",
    borderRadius: 8, color: "white", fontSize: 13,
    fontFamily: "'Archivo', sans-serif", outline: "none",
    transition: "border .15s",
    boxSizing: "border-box",
  };

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", background: "#080e12" }}>

      {/* ══ HERO SECTION ══════════════════════════════════ */}
      <section style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,95,105,.45) 0%, transparent 65%),
          linear-gradient(180deg, #080e12 0%, #0d1a1e 100%)
        `,
        padding: "80px 20px 90px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Lignes décoratives */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(0,95,105,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,95,105,.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
        }} />

        <h1 style={{
          fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900,
          color: "white", letterSpacing: -.5,
          marginBottom: 14, position: "relative",
        }}>
          Contact
        </h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: 15, fontWeight: 500, position: "relative" }}>
          Notre équipe est disponible pour répondre à toutes vos questions.
        </p>
      </section>

      {/* ══ MIDDLE SECTION ════════════════════════════════ */}
      <section style={{
        background: "#0d1a1e",
        padding: "70px 20px",
      }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 60, alignItems: "start" }}>

          {/* ── COLONNE GAUCHE : Get in touch ── */}
          <div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: 18, letterSpacing: -.4 }}>
              Get in touch
            </h2>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 14, lineHeight: 1.75, marginBottom: 36 }}>
              Besoin d'aide ou d'informations sur nos services ? Contactez-nous et un représentant vous répondra dans les plus brefs délais.
            </p>

            {/* Adresse */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, lineHeight: 1.8, fontWeight: 500 }}>
                Ticketche Business Centre<br />
                Cotonou, Littoral<br />
                Bénin, Afrique de l'Ouest
              </p>
            </div>

            {/* Téléphone */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#005f69",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Phone weight="fill" style={{ width: 20, height: 20, color: "white" }} />
              </div>
              <div>
                <p style={{ color: "#00c4d4", fontWeight: 900, fontSize: 17, letterSpacing: .3 }}>
                  +229 97 00 00 00
                </p>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, fontWeight: 500 }}>Appelez-nous</p>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#005f69",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <EnvelopeSimple weight="fill" style={{ width: 20, height: 20, color: "white" }} />
              </div>
              <div>
                <p style={{ color: "#00c4d4", fontWeight: 900, fontSize: 15 }}>
                  contact@ticketche.com
                </p>
                <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, fontWeight: 500 }}>Envoyez un email</p>
              </div>
            </div>

            {/* Site web */}
            <p style={{ color: "rgba(255,255,255,.55)", fontSize: 15, fontWeight: 800, letterSpacing: .2 }}>
              www.ticketche.com
            </p>
          </div>

          {/* ── COLONNE DROITE : Formulaire ── */}
          <div style={{
            background: "linear-gradient(145deg, #005f69 0%, #004a52 100%)",
            borderRadius: 20, padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,95,105,.35)",
          }}>
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
                {/* Nom + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                      Votre nom
                    </label>
                    <input
                      name="name" value={form.name} onChange={handleChange}
                      placeholder="Nom complet" required style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                    />
                  </div>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                      Votre email
                    </label>
                    <input
                      name="email" value={form.email} onChange={handleChange} type="email"
                      placeholder="Entrez votre email" required style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                    />
                  </div>
                </div>

                {/* Service + Date */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                      Service
                    </label>
                    <select
                      name="service" value={form.service} onChange={handleChange} required
                      style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
                      onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                    >
                      <option value="" disabled style={{ background: "#0d1a1e" }}>Sélectionner</option>
                      <option value="parking" style={{ background: "#0d1a1e" }}>Parking</option>
                      <option value="lavage"  style={{ background: "#0d1a1e" }}>Lavage</option>
                      <option value="garage"  style={{ background: "#0d1a1e" }}>Garage</option>
                      <option value="autre"   style={{ background: "#0d1a1e" }}>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                      Date
                    </label>
                    <input
                      name="date" value={form.date} onChange={handleChange} type="date"
                      style={{ ...inputStyle, colorScheme: "dark" }}
                      onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                      onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                    />
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 22 }}>
                  <label style={{ color: "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 700, letterSpacing: .5, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                    Votre message
                  </label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Décrivez votre demande…" rows={4}
                    style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = "rgba(0,196,212,.7)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.12)"}
                  />
                </div>

                {/* Bouton CTA */}
                <button type="submit" style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "#00c4d4", color: "#001f25",
                  fontWeight: 900, fontSize: 14, padding: "14px 0",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: "'Archivo', sans-serif", letterSpacing: .3,
                  transition: "all .18s ease",
                  boxShadow: "0 4px 18px rgba(0,196,212,.35)",
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

      {/* ══ CARDS BOTTOM ══════════════════════════════════ */}
      <section style={{ background: "#080e12", padding: "0 20px 80px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>

          {/* Card 1 — Ticket Support (teal bg) */}
          <div
            style={{
              background: "#005f69",
              borderRadius: 18, padding: "28px 26px 26px",
              boxShadow: "0 8px 28px rgba(0,95,105,.4)",
              transition: "all .25s ease", cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,95,105,.55)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,95,105,.4)";
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Ticket weight="fill" style={{ width: 22, height: 22, color: "white" }} />
            </div>
            <h4 style={{ color: "white", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>
              Ticket Support
            </h4>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1.75, marginBottom: 22 }}>
              Soumettez un ticket d'assistance et notre équipe vous prendra en charge rapidement pour résoudre votre problème.
            </p>
            <Link href="/support" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(0,0,0,.25)", color: "white",
              fontWeight: 800, fontSize: 13, padding: "10px 22px",
              borderRadius: 999, textDecoration: "none",
              border: "1px solid rgba(255,255,255,.15)",
              transition: "all .18s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Nous contacter
            </Link>
          </div>

          {/* Card 2 — Appel Gratuit (dark) */}
          <div
            style={{
              background: "#0d1a1e",
              border: "1px solid rgba(0,95,105,.3)",
              borderRadius: 18, padding: "28px 26px 26px",
              transition: "all .25s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,95,105,.25)";
              e.currentTarget.style.borderColor = "rgba(0,95,105,.6)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(0,95,105,.3)";
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Headset weight="fill" style={{ width: 22, height: 22, color: "#00c4d4" }} />
            </div>
            <h4 style={{ color: "white", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>
              Appel Gratuit
            </h4>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.75, marginBottom: 22 }}>
              Appelez notre centre d'assistance disponible 7j/7 pour toute question sur nos établissements partenaires.
            </p>
            <Link href="tel:+22997000000" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#005f69", color: "white",
              fontWeight: 800, fontSize: 13, padding: "10px 22px",
              borderRadius: 999, textDecoration: "none", transition: "all .18s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#007a8a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#005f69"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Nous contacter
            </Link>
          </div>

          {/* Card 3 — Actualités (dark) */}
          <div
            style={{
              background: "#0d1a1e",
              border: "1px solid rgba(0,95,105,.3)",
              borderRadius: 18, padding: "28px 26px 26px",
              transition: "all .25s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,95,105,.25)";
              e.currentTarget.style.borderColor = "rgba(0,95,105,.6)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(0,95,105,.3)";
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
              <Newspaper weight="fill" style={{ width: 22, height: 22, color: "#00c4d4" }} />
            </div>
            <h4 style={{ color: "white", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>
              Actualités
            </h4>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, lineHeight: 1.75, marginBottom: 22 }}>
              Restez informé des dernières nouveautés, offres exclusives et nouveaux établissements disponibles sur Ticketche.
            </p>
            <Link href="/news" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#005f69", color: "white",
              fontWeight: 800, fontSize: 13, padding: "10px 22px",
              borderRadius: 999, textDecoration: "none", transition: "all .18s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#007a8a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#005f69"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Nous contacter
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}