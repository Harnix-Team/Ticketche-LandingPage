"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Warning, User, DeviceMobile, CreditCard,
  ArrowClockwise, Shield, Lock, Scales, EnvelopeSimple,
  CheckCircle, XCircle, CaretDown, MapPin, Star,
} from "@phosphor-icons/react";

const CLUSTERS = [
  { cx: "2%",  cy: "6%",  stars: [{ x: 0, y: 0, size: 12, opacity: 0.35, anim: 0, delay: "0s",   dur: "3.2s", color: "#00818f" }, { x: 14, y: -9, size: 8, opacity: 0.22, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "91%", cy: "4%",  stars: [{ x: 0, y: 0, size: 13, opacity: 0.32, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -11, y: 10, size: 7, opacity: 0.20, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%",  cy: "35%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.28, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "95%", cy: "38%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
  { cx: "3%",  cy: "70%", stars: [{ x: 0, y: 0, size: 8,  opacity: 0.24, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }] },
  { cx: "92%", cy: "72%", stars: [{ x: 0, y: 0, size: 9,  opacity: 0.26, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }] },
  { cx: "46%", cy: "1%",  stars: [{ x: 0, y: 0, size: 7,  opacity: 0.18, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `cguStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

const sections = [
  {
    icon: FileText,
    num: "01",
    title: "Objet",
    content: (
      <p style={{ color: "#4b6366", lineHeight: 1.8, fontSize: 15 }}>
        Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation
        de l'application mobile <strong style={{ color: "#005f69" }}>Ticketché</strong>, ainsi que les droits et obligations des utilisateurs et de l'éditeur.
      </p>
    ),
  },
  {
    icon: Warning,
    num: "02",
    title: "Éditeur de l'application",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Application", value: "Ticketché" },
          { label: "Email", value: "support@ticketche.com" },
        ].map((item, idx) => (
          <div key={idx} style={{ background: "rgba(0,95,105,0.05)", border: "1.5px solid rgba(0,95,105,0.12)", borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,95,105,0.55)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0a1a1c" }}>{item.value}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: DeviceMobile,
    num: "03",
    title: "Accès à l'application",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ color: "#4b6366", lineHeight: 1.8, fontSize: 15 }}>
          L'application Ticketché est accessible gratuitement via les plateformes Apple App Store et Google Play Store.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: DeviceMobile, label: "Prérequis",  desc: "Smartphone iOS ou Android compatible" },
            { icon: Shield,       label: "Connexion",  desc: "Internet requis (frais à votre charge)" },
          ].map(({ icon: Icon, label, desc }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px", background: "rgba(0,95,105,0.05)", borderRadius: 12, border: "1.5px solid rgba(0,95,105,0.12)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon weight="bold" style={{ width: 18, height: 18, color: "white" }} />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#0a1a1c", marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: User,
    num: "04",
    title: "Inscription et compte utilisateur",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ color: "#4b6366", lineHeight: 1.8, fontSize: 15 }}>
          Pour utiliser les services de Ticketché, l'utilisateur doit créer un compte personnel en fournissant des informations exactes et à jour.
        </p>
        {[
          { icon: CheckCircle, text: "Fournir des informations exactes (nom, email, téléphone)", ok: true },
          { icon: Lock,        text: "Maintenir la confidentialité de vos identifiants", ok: true },
          { icon: Warning,     text: "Signaler immédiatement toute utilisation frauduleuse", ok: false },
        ].map(({ icon: Icon, text, ok }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: ok ? "rgba(0,95,105,0.05)" : "rgba(255,140,0,0.06)", borderRadius: 10, border: `1.5px solid ${ok ? "rgba(0,95,105,0.12)" : "rgba(255,140,0,0.18)"}` }}>
            <Icon weight="bold" style={{ width: 18, height: 18, color: ok ? "#005f69" : "#e07b00", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500, lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: CheckCircle,
    num: "05",
    title: "Services proposés",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ color: "#4b6366", lineHeight: 1.8, fontSize: 15 }}>Ticketché met à disposition les services suivants :</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {[
            { icon: MapPin,     title: "Réservation parking",  desc: "Places en temps réel" },
            { icon: MapPin,     title: "Localisation",         desc: "Parkings disponibles" },
            { icon: FileText,   title: "Gestion garages",      desc: "Espaces de stationnement" },
            { icon: Shield,     title: "Lavage automobile",    desc: "Services de nettoyage" },
            { icon: FileText,   title: "Historique",           desc: "Suivi des réservations" },
            { icon: CreditCard, title: "Paiements",            desc: "Transactions sécurisées" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(0,95,105,0.04)", borderRadius: 10, border: "1.5px solid rgba(0,95,105,0.10)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,95,105,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon weight="bold" style={{ width: 16, height: 16, color: "#005f69" }} />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 13, color: "#0a1a1c" }}>{title}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: CreditCard,
    num: "06",
    title: "Tarifs et paiement",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { icon: CreditCard,     title: "Tarifs transparents", desc: "Prix affichés taxes incluses" },
            { icon: Lock,           title: "Paiements sécurisés",  desc: "Partenaires certifiés" },
            { icon: EnvelopeSimple, title: "Reçus instantanés",   desc: "Envoyés par email" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} style={{ textAlign: "center", padding: "18px 12px", background: "white", borderRadius: 14, border: "1.5px solid rgba(0,95,105,0.12)", boxShadow: "0 2px 12px rgba(0,95,105,0.06)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,105,0.10)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Icon weight="bold" style={{ width: 22, height: 22, color: "#005f69" }} />
              </div>
              <p style={{ fontWeight: 800, fontSize: 13, color: "#0a1a1c", marginBottom: 4 }}>{title}</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "rgba(0,95,105,0.07)", borderRadius: 12, border: "1.5px solid rgba(0,95,105,0.18)" }}>
          <Lock weight="bold" style={{ width: 18, height: 18, color: "#005f69", flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 14, color: "#005f69", fontWeight: 600, lineHeight: 1.6 }}>
            Ticketché ne stocke aucune donnée de carte bancaire sur ses serveurs.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    num: "07",
    title: "Responsabilités",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ padding: "14px 16px", background: "rgba(0,95,105,0.07)", borderRadius: 12, border: "1px solid rgba(0,95,105,0.2)" }}>
          <p style={{ fontWeight: 800, fontSize: 14, color: "#005f69", marginBottom: 4 }}>Ticketché agit en tant qu'intermédiaire</p>
          <p style={{ fontSize: 13, color: "#4b6366", lineHeight: 1.7 }}>Entre les utilisateurs et les prestataires de services (parkings, garages, lavages)</p>
        </div>
        <p style={{ fontWeight: 800, fontSize: 14, color: "#0a1a1c" }}>Ticketché ne peut être tenu responsable de :</p>
        {[
          "Dommages causés au véhicule pendant le stationnement",
          "Vol ou détérioration d'objets dans le véhicule",
          "Indisponibilité temporaire de l'application",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "rgba(220,38,38,0.04)", borderRadius: 10, border: "1.5px solid rgba(220,38,38,0.12)" }}>
            <XCircle weight="bold" style={{ width: 18, height: 18, color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "rgba(255,140,0,0.06)", borderRadius: 10, border: "1.5px solid rgba(255,140,0,0.18)" }}>
          <Warning weight="bold" style={{ width: 18, height: 18, color: "#e07b00", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 14, color: "#374151", fontWeight: 500, lineHeight: 1.6 }}>L'utilisateur doit vérifier que son véhicule est correctement stationné et fermé.</span>
        </div>
      </div>
    ),
  },
  {
    icon: Lock,
    num: "08",
    title: "Propriété intellectuelle",
    content: (
      <div style={{ padding: "18px 20px", background: "linear-gradient(135deg, rgba(0,95,105,0.07) 0%, rgba(0,95,105,0.03) 100%)", borderRadius: 14, border: "1.5px solid rgba(0,95,105,0.15)" }}>
        <p style={{ color: "#4b6366", lineHeight: 1.85, fontSize: 15 }}>
          L'ensemble des éléments de l'application Ticketché (logo, design, code source, textes, images) est
          protégé par les droits de propriété intellectuelle. Toute reproduction, représentation ou exploitation
          non autorisée est <strong style={{ color: "#005f69" }}>strictement interdite</strong>.
        </p>
      </div>
    ),
  },
  {
    icon: Shield,
    num: "09",
    title: "Protection des données personnelles",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ color: "#4b6366", lineHeight: 1.8, fontSize: 15 }}>
          Ticketché collecte et traite les données personnelles conformément au RGPD et à notre Politique de Confidentialité.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {[
            { icon: User,           title: "Droit d'accès",           desc: "Consulter vos données" },
            { icon: FileText,       title: "Droit de rectification",   desc: "Corriger vos données" },
            { icon: XCircle,        title: "Droit à l'effacement",     desc: "Supprimer vos données" },
            { icon: ArrowClockwise, title: "Droit à la portabilité",   desc: "Récupérer vos données" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(0,95,105,0.05)", borderRadius: 10, border: "1.5px solid rgba(0,95,105,0.10)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,95,105,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon weight="bold" style={{ width: 16, height: 16, color: "#005f69" }} />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 13, color: "#0a1a1c" }}>{title}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "rgba(0,95,105,0.07)", borderRadius: 12, border: "1.5px solid rgba(0,95,105,0.18)" }}>
          <EnvelopeSimple weight="bold" style={{ width: 18, height: 18, color: "#005f69", flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: "#005f69", fontWeight: 700 }}>support@ticketche.com</p>
        </div>
      </div>
    ),
  },
  {
    icon: ArrowClockwise,
    num: "10",
    title: "Modifications des CGU",
    content: (
      <div style={{ padding: "18px 20px", background: "rgba(255,180,0,0.06)", borderRadius: 14, border: "1px solid rgba(255,180,0,0.22)" }}>
        <p style={{ color: "#4b6366", lineHeight: 1.85, fontSize: 15 }}>
          Ticketché se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
          informés de toute modification par notification dans l'application ou par email. L'utilisation continue
          de l'application après modification vaut <strong style={{ color: "#0a1a1c" }}>acceptation des nouvelles conditions</strong>.
        </p>
      </div>
    ),
  },
  {
    icon: Scales,
    num: "11",
    title: "Droit applicable et litiges",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "rgba(0,95,105,0.06)", borderRadius: 12, border: "1.5px solid rgba(0,95,105,0.14)" }}>
          <Scales weight="bold" style={{ width: 22, height: 22, color: "#005f69", flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 14, color: "#0a1a1c", marginBottom: 2 }}>Droit applicable</p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Les présentes CGU sont régies par le droit béninois.</p>
          </div>
        </div>
        <p style={{ fontWeight: 800, fontSize: 14, color: "#0a1a1c", padding: "0 4px" }}>En cas de litige :</p>
        {[
          "Recherche d'une solution amiable en priorité",
          "À défaut, les tribunaux compétents de Cotonou sont seuls compétents",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 14px", background: "rgba(0,95,105,0.04)", borderRadius: 10, border: "1.5px solid rgba(0,95,105,0.10)" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#005f69", color: "white", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: EnvelopeSimple,
    num: "12",
    title: "Contact",
    content: (
      <div style={{ background: "linear-gradient(135deg, #005f69 0%, #004a52 100%)", borderRadius: 16, padding: "24px" }}>
        <p style={{ fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>Pour toute question concernant ces CGU</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <EnvelopeSimple weight="bold" style={{ width: 20, height: 20, color: "white" }} />
          </div>
          <p style={{ fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.9)" }}>support@ticketche.com</p>
        </div>
      </div>
    ),
  },
];

const SectionCard = ({ section, index }) => {
  const Icon = section.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
      style={{
        background: "white", borderRadius: 20,
        padding: "clamp(18px, 4vw, 32px) clamp(16px, 4vw, 36px)",
        border: "1.5px solid rgba(0,95,105,0.10)",
        boxShadow: "0 4px 20px rgba(0,95,105,0.07)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -1, right: -1, width: 40, height: 40, borderTop: "3px solid #005f69", borderRight: "3px solid #005f69", borderRadius: "0 20px 0 0" }} />
      <div style={{ position: "absolute", bottom: -1, left: -1, width: 40, height: 40, borderBottom: "3px solid rgba(0,95,105,0.18)", borderLeft: "3px solid rgba(0,95,105,0.18)", borderRadius: "0 0 0 20px" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: "#005f69", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon weight="bold" style={{ width: 22, height: 22, color: "white" }} />
        </div>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,95,105,0.50)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Article {section.num}</span>
          <h2 style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 900, color: "#0a1a1c", letterSpacing: "-0.3px", lineHeight: 1.1, marginTop: 2 }}>{section.title}</h2>
        </div>
      </div>

      {section.content}
    </motion.div>
  );
};

export default function TermsAndConditionsPage() {
  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", background: "#ecf5f5", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        @keyframes cguStar0 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1);}33%{transform:translateY(-8px) rotate(15deg) scale(1.10);}66%{transform:translateY(-3px) rotate(-8deg) scale(0.95);} }
        @keyframes cguStar1 { 0%,100%{transform:translateY(0px) rotate(0deg);}50%{transform:translateY(-11px) rotate(20deg) scale(1.07);} }
        @keyframes cguStar2 { 0%,100%{transform:translateY(0px) scale(1);}40%{transform:translateY(-7px) rotate(-12deg) scale(1.12);}80%{transform:translateY(-2px) rotate(6deg) scale(0.92);} }
      `}</style>

      <StarClusters />

      {/* ══ HERO ══ */}
      <div style={{
        background: "#9dcccc",
        padding: "clamp(80px, 12vw, 140px) clamp(16px, 4vw, 24px) clamp(60px, 8vw, 90px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        zIndex: 2,
      }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(0,95,105,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-8%", width: 300, height: 300, borderRadius: "50%", background: "rgba(0,95,105,0.04)", pointerEvents: "none" }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(0,95,105,0.10)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(0,95,105,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <FileText weight="bold" style={{ width: 28, height: 28, color: "#005f69" }} />
          </div>

          <span style={{
            display: "inline-block",
            background: "rgba(0,95,105,0.10)",
            border: "1px solid rgba(0,95,105,0.20)",
            color: "#005f69",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "5px 18px",
            borderRadius: 999, marginBottom: 20,
          }}>
            Dernière mise à jour — 2025
          </span>

          <h1 style={{
            fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 900,
            color: "#003f46", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 16,
          }}>
            Conditions Générales<br />d'Utilisation
          </h1>

          <p style={{ color: "#4b6366", fontSize: "clamp(14px, 2vw, 17px)", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
            Utilisation claire et transparente de Ticketché
          </p>
        </motion.div>
      </div>

      {/* ══ INTRO CARD ══ */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(12px, 4vw, 24px)", position: "relative", zIndex: 2, marginTop: -32 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: "white", borderRadius: 20,
            padding: "clamp(18px, 4vw, 28px) clamp(16px, 4vw, 36px)",
            boxShadow: "0 12px 40px rgba(0,95,105,0.14)",
            display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap",
          }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(0,95,105,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Warning weight="bold" style={{ width: 24, height: 24, color: "#005f69" }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontWeight: 900, fontSize: 16, color: "#0a1a1c", marginBottom: 6 }}>Bienvenue sur Ticketché</p>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.75 }}>
              Ticketché est une application mobile de gestion de parkings, garages et services de lavage.
              En utilisant notre application, vous acceptez les présentes conditions générales d'utilisation.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ══ SECTIONS ══ */}
      <div style={{
        maxWidth: 900, margin: "0 auto",
        padding: "40px clamp(12px, 4vw, 24px) 100px",
        display: "flex", flexDirection: "column", gap: 16,
        position: "relative", zIndex: 2,
      }}>
        {sections.map((section, index) => (
          <SectionCard key={index} section={section} index={index} />
        ))}
      </div>
    </div>
  );
}