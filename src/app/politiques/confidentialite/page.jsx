"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LockKey, Eye, Database, UserCheck, Bell, FileText,
  Scales, Globe, ArrowClockwise, Envelope, Phone, MapPin,
  CaretDown, CheckCircle, Clock, Warning, Buildings, CreditCard,
  Cloud, ChatCircle, PencilSimple, Trash, Package, ProhibitInset,
  PauseCircle, WifiHigh, HardDrive, Key, Detective, Cpu,
  CalendarBlank, Star,
} from "@phosphor-icons/react";

/* ─── palette & tokens ─── */
const T   = "#005F69";
const TB  = "#003f46";
const TL  = "#e8f4f5";
const TLL = "#f4fafb";

/* ─── Star Clusters ─────────────────────────────── */
const STARS = [
  { cx:"3%",  cy:"8%",  s:[{x:0,y:0,sz:13,op:0.45,a:0,d:"0s",  dr:"3.2s",c:"#00818f"},{x:16,y:-10,sz:8,op:0.25,a:1,d:"0.3s",dr:"2.8s",c:"#00515a"}]},
  { cx:"92%", cy:"6%",  s:[{x:0,y:0,sz:14,op:0.40,a:1,d:"0.2s",dr:"3.0s",c:"#00818f"},{x:-13,y:12,sz:8,op:0.22,a:2,d:"0.5s",dr:"3.4s",c:"#00515a"}]},
  { cx:"1%",  cy:"45%", s:[{x:0,y:0,sz:10,op:0.30,a:2,d:"0.1s",dr:"3.5s",c:"#00515a"}]},
  { cx:"95%", cy:"40%", s:[{x:0,y:0,sz:11,op:0.35,a:0,d:"0.3s",dr:"3.3s",c:"#00818f"}]},
  { cx:"5%",  cy:"78%", s:[{x:0,y:0,sz:9, op:0.28,a:1,d:"0.2s",dr:"2.9s",c:"#00818f"}]},
  { cx:"88%", cy:"75%", s:[{x:0,y:0,sz:10,op:0.32,a:2,d:"0.4s",dr:"3.1s",c:"#00515a"}]},
  { cx:"48%", cy:"2%",  s:[{x:0,y:0,sz:8, op:0.22,a:0,d:"0.1s",dr:"3.0s",c:"#00818f"}]},
  { cx:"25%", cy:"92%", s:[{x:0,y:0,sz:7, op:0.20,a:1,d:"0.5s",dr:"3.2s",c:"#00515a"}]},
  { cx:"70%", cy:"90%", s:[{x:0,y:0,sz:9, op:0.25,a:2,d:"0.3s",dr:"2.8s",c:"#00818f"}]},
];

function StarClusters() {
  return (
    <>
      <style>{`
        @keyframes ppStar0{0%,100%{transform:translateY(0) rotate(0deg) scale(1);}33%{transform:translateY(-8px) rotate(15deg) scale(1.10);}66%{transform:translateY(-3px) rotate(-8deg) scale(0.95);}}
        @keyframes ppStar1{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-11px) rotate(20deg) scale(1.07);}}
        @keyframes ppStar2{0%,100%{transform:translateY(0) scale(1);}40%{transform:translateY(-7px) rotate(-12deg) scale(1.12);}80%{transform:translateY(-2px) rotate(6deg) scale(0.92);}}
      `}</style>
      {STARS.map((cluster, ci) => (
        <div key={ci} style={{position:"absolute",left:cluster.cx,top:cluster.cy,width:0,height:0,zIndex:0,pointerEvents:"none"}}>
          {cluster.s.map((s, si) => (
            <div key={si} style={{position:"absolute",left:s.x,top:s.y,transform:"translate(-50%,-50%)",opacity:s.op,animation:`ppStar${s.a} ${s.dr} ease-in-out ${s.d} infinite`,filter:`drop-shadow(0 0 3px ${s.c}88)`}}>
              <Star size={s.sz} color={s.c} weight="fill" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── accordion item ─── */
const SectionCard = ({ icon: Icon, index, title, children }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        background: "#fff",
        borderRadius: 16,
        border: `1px solid ${open ? T : "#e5eef0"}`,
        overflow: "hidden",
        transition: "border-color .3s",
        fontFamily: "'Archivo', sans-serif",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: 16, padding: "22px 28px",
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: open ? T : "#9ab8bb", letterSpacing: "0.06em", minWidth: 22 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: open ? T : TL, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .3s" }}>
            <Icon size={20} color={open ? "#fff" : T} weight="duotone" />
          </div>
        </div>
        <span style={{ flex: 1, fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: open ? TB : "#2d5a60", letterSpacing: "0.01em" }}>
          {title}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, color: open ? T : "#9ab8bb" }}>
          <CaretDown size={18} weight="bold" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 28px 28px", borderTop: `1px solid ${TL}`, paddingTop: 24 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── small chip ─── */
const Chip = ({ children, color = T }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: TL, color, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "'Archivo', sans-serif" }}>
    {children}
  </span>
);

/* ─── info row ─── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0", borderBottom: `1px solid ${TL}` }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: TL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={18} color={T} weight="duotone" />
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9ab8bb", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, fontFamily: "'Archivo', sans-serif" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: TB, margin: 0, fontFamily: "'Archivo', sans-serif" }}>{value}</p>
    </div>
  </div>
);

/* ─── data card ─── */
const DataCard = ({ num, title, items }) => (
  <div style={{ background: TLL, border: `1px solid #d4eaed`, borderRadius: 14, padding: "20px 22px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, background: T, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, fontFamily: "'Archivo', sans-serif", flexShrink: 0 }}>{num}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</span>
    </div>
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>
          <CheckCircle size={14} color={T} weight="fill" />{it}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── purpose card ─── */
const PurposeCard = ({ num, title, desc }) => (
  <motion.div whileHover={{ y: -3, boxShadow: `0 8px 28px rgba(0,95,105,0.12)` }}
    style={{ background: "#fff", border: `1px solid #d4eaed`, borderRadius: 14, padding: "18px 20px", transition: "box-shadow .3s" }}>
    <div style={{ width: 34, height: 34, borderRadius: 10, background: T, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, marginBottom: 10, fontFamily: "'Archivo', sans-serif" }}>{num}</div>
    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</p>
    <p style={{ margin: 0, fontSize: 12, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{desc}</p>
  </motion.div>
);

/* ─── security card ─── */
const SecCard = ({ icon: Icon, title, desc }) => (
  <motion.div whileHover={{ y: -4, boxShadow: `0 10px 32px rgba(0,95,105,0.13)` }}
    style={{ background: "#fff", border: `1px solid #d4eaed`, borderRadius: 14, padding: "20px", textAlign: "center" }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: TL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
      <Icon size={24} color={T} weight="duotone" />
    </div>
    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</p>
    <p style={{ margin: 0, fontSize: 12, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{desc}</p>
  </motion.div>
);

/* ─── right card ─── */
const RightCard = ({ icon: Icon, title, desc }) => (
  <motion.div whileHover={{ scale: 1.02 }}
    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, background: TLL, border: `1px solid #d4eaed` }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: TL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={18} color={T} weight="duotone" />
    </div>
    <div>
      <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</p>
      <p style={{ margin: 0, fontSize: 12, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{desc}</p>
    </div>
  </motion.div>
);

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────────── */
export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: UserCheck,
      title: "Responsable du traitement des données",
      content: (
        <div>
          <InfoRow icon={FileText} label="Application" value="Ticketché" />
          <InfoRow icon={Envelope} label="Email" value="support@ticketche.com" />
          <InfoRow icon={Phone} label="Téléphone" value="+229 01 99 98 43 45" />
          <InfoRow icon={MapPin} label="Adresse" value="Abomey-Calavi, Bénin" />
        </div>
      ),
    },
    {
      icon: Database,
      title: "Données collectées",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.7, fontFamily: "'Archivo', sans-serif" }}>
            Nous collectons les données suivantes pour assurer le bon fonctionnement de l'application :
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <DataCard num="1" title="Identification" items={["Nom et prénom", "Adresse email", "Numéro de téléphone", "Date de naissance"]} />
            <DataCard num="2" title="Véhicule" items={["Immatriculation", "Marque et modèle", "Couleur"]} />
            <DataCard num="3" title="Localisation" items={["Position GPS (avec consentement)", "Historique des parkings"]} />
            <DataCard num="4" title="Paiement" items={["Informations de facturation", "Historique des transactions"]} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: TL, borderLeft: `4px solid ${T}`, borderRadius: "0 12px 12px 0", padding: "14px 18px" }}>
            <Warning size={18} color={T} weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: TB, lineHeight: 1.6, fontFamily: "'Archivo', sans-serif" }}>
              <strong>Note :</strong> Les données de carte bancaire sont traitées uniquement par nos prestataires certifiés (Stripe, PayPal) et ne sont jamais stockées sur nos serveurs.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Eye,
      title: "Pourquoi collectons-nous vos données ?",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <PurposeCard num="1" title="Gestion des réservations" desc="Traiter vos demandes de parking, garage et lavage" />
          <PurposeCard num="2" title="Traitement des paiements" desc="Facturation et gestion des transactions" />
          <PurposeCard num="3" title="Communication" desc="Confirmations, notifications et informations" />
          <PurposeCard num="4" title="Amélioration du service" desc="Analyse et optimisation de l'application" />
          <PurposeCard num="5" title="Support client" desc="Répondre à vos questions et problèmes" />
          <PurposeCard num="6" title="Sécurité" desc="Prévention des fraudes et sécurité" />
        </div>
      ),
    },
    {
      icon: Scales,
      title: "Base légale du traitement",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: FileText,    title: "Exécution du contrat",  desc: "Fourniture des services demandés" },
            { icon: CheckCircle, title: "Consentement",          desc: "Acceptation explicite du traitement (ex : géolocalisation)" },
            { icon: Shield,      title: "Intérêt légitime",      desc: "Amélioration des services et prévention des fraudes" },
            { icon: Scales,      title: "Obligation légale",     desc: "Respect des obligations fiscales et comptables" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderRadius: 12, background: TLL, border: `1px solid #d4eaed` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color="#fff" weight="duotone" />
              </div>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Globe,
      title: "Partage et destinataires des données",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.7, fontFamily: "'Archivo', sans-serif" }}>
            Vos données peuvent être partagées avec les destinataires suivants, uniquement dans le cadre strict de nos services :
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { icon: Buildings,  title: "Gestionnaires de parkings",  desc: "Pour traiter vos réservations" },
              { icon: CreditCard, title: "Prestataires de paiement",   desc: "Stripe, PayPal pour paiements sécurisés" },
              { icon: Cloud,      title: "Services d'hébergement",     desc: "Stockage sécurisé des données" },
              { icon: ChatCircle, title: "Services de communication",  desc: "Envoi d'emails et notifications" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", borderRadius: 12, background: "#fff", border: `1px solid #d4eaed` }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: TL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={T} weight="duotone" />
                </div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: TL, border: `1px solid #b2d8dc`, borderRadius: 12, padding: "14px 18px" }}>
            <Shield size={18} color={T} weight="fill" />
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: TB, fontFamily: "'Archivo', sans-serif" }}>
              Nous ne vendons jamais vos données personnelles à des tiers.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: CalendarBlank,
      title: "Durée de conservation des données",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { type: "Données de compte",         duration: "Jusqu'à suppression + 1 an" },
            { type: "Données de transaction",     duration: "10 ans" },
            { type: "Données de géolocalisation", duration: "6 mois maximum" },
            { type: "Logs de connexion",          duration: "1 an" },
          ].map(({ type, duration }, i) => (
            <div key={i} style={{ padding: "18px 20px", borderRadius: 14, background: TLL, border: `1px solid #d4eaed` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Clock size={16} color={T} weight="fill" />
                <span style={{ fontSize: 12, fontWeight: 700, color: T, fontFamily: "'Archivo', sans-serif" }}>{duration}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: TB, fontFamily: "'Archivo', sans-serif" }}>{type}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Vos droits sur vos données",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.7, fontFamily: "'Archivo', sans-serif" }}>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            <RightCard icon={Eye}          title="Droit d'accès"          desc="Consulter vos données" />
            <RightCard icon={PencilSimple} title="Droit de rectification" desc="Corriger vos données" />
            <RightCard icon={Trash}        title="Droit à l'effacement"   desc="Supprimer vos données" />
            <RightCard icon={Package}      title="Droit à la portabilité" desc="Récupérer vos données" />
            <RightCard icon={ProhibitInset} title="Droit d'opposition"    desc="Refuser le traitement" />
            <RightCard icon={PauseCircle}  title="Droit à la limitation"  desc="Limiter le traitement" />
          </div>
          <div style={{ background: T, borderRadius: 16, padding: "22px 24px", color: "#fff" }}>
            <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>Pour exercer vos droits :</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Envelope size={16} weight="fill" />
                <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>support@ticketche.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ChatCircle size={16} weight="fill" />
                <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>Depuis les paramètres de l'application</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.15)" }}>
              <Clock size={15} weight="fill" />
              <span style={{ fontSize: 12, fontFamily: "'Archivo', sans-serif" }}>Délai de réponse : 30 jours maximum</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: LockKey,
      title: "Sécurité de vos données",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <SecCard icon={LockKey}   title="Chiffrement SSL/TLS"  desc="Communications sécurisées" />
          <SecCard icon={HardDrive} title="Serveurs certifiés"   desc="Stockage sécurisé" />
          <SecCard icon={Key}       title="Authentification forte" desc="Gestion des accès" />
          <SecCard icon={Database}  title="Sauvegardes régulières" desc="Plan de reprise d'activité" />
          <SecCard icon={Detective} title="Audits de sécurité"   desc="Vérifications régulières" />
          <SecCard icon={Cpu}       title="Monitoring 24/7"      desc="Surveillance continue" />
        </div>
      ),
    },
    {
      icon: ArrowClockwise,
      title: "Cookies et technologies de suivi",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.7, fontFamily: "'Archivo', sans-serif" }}>
            L'application utilise des technologies similaires aux cookies pour :
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {["Maintenir votre session connectée", "Mémoriser vos préférences", "Analyser l'utilisation", "Améliorer les performances"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: TLL, border: `1px solid #d4eaed` }}>
                <CheckCircle size={16} color={T} weight="fill" />
                <span style={{ fontSize: 13, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: TL, borderRadius: 12, padding: "14px 16px" }}>
            <WifiHigh size={18} color={T} weight="duotone" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: TB, fontFamily: "'Archivo', sans-serif" }}>
              Vous pouvez gérer ces préférences depuis les paramètres de l'application.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Modifications de la politique",
      content: (
        <div style={{ background: TLL, border: `1px solid #d4eaed`, borderRadius: 14, padding: "22px 24px" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.8, fontFamily: "'Archivo', sans-serif" }}>
            Nous pouvons modifier cette politique à tout moment. En cas de modification importante, vous serez informé par notification dans l'application ou par email. Nous vous encourageons à consulter régulièrement cette page.
          </p>
        </div>
      ),
    },
    {
      icon: Envelope,
      title: "Contact",
      content: (
        <div style={{ background: T, borderRadius: 16, padding: "24px 26px", color: "#fff" }}>
          <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>
            Délégué à la Protection des Données (DPO)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Envelope size={16} weight="fill" />
              <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>support@ticketche.com</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Phone size={16} weight="fill" />
              <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>+229 01 99 98 43 45</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MapPin size={16} weight="fill" />
              <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>Abomey-Calavi, Bénin</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ fontFamily: "'Archivo', sans-serif", minHeight: "100vh", background: TLL, position: "relative", overflow: "hidden" }}>

      <StarClusters />

      {/* ── HERO ── */}
      <div style={{
        background: "#9dcccc",
        color: TB,
        padding: "96px 24px 96px",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}>
        {/* cercles déco */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 340, height: 340, borderRadius: "50%", border: "60px solid rgba(0,95,105,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: "30%", width: 200, height: 200, borderRadius: "50%", border: "40px solid rgba(0,95,105,0.05)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>

            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "rgba(0,95,105,0.10)",
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              border: "1px solid rgba(0,95,105,0.15)",
            }}>
              <Shield size={32} color={T} weight="duotone" />
            </div>

            <Chip>
              <Shield size={12} color={T} weight="fill" />
              Mise à jour — Janvier 2025
            </Chip>

            <h1 style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 900,
              margin: "16px 0 10px",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: TB,
            }}>
              Politique de confidentialité
            </h1>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20, color: TB, margin: 0, lineHeight: 1.6 }}>
              Votre vie privée est notre priorité.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── INTRO CARD ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px", marginTop: -40, position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: "#fff", borderRadius: 20, boxShadow: "0 12px 48px rgba(0,95,105,0.15)", padding: "28px 32px", borderTop: `4px solid ${T}` }}
        >
          <p style={{ margin: 0, fontSize: 15, color: "#1a1a1a", lineHeight: 1.8, fontFamily: "'Archivo', sans-serif" }}>
            Chez{" "}
            <span style={{ fontWeight: 800, color: T }}>Ticketché</span>, nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. Cette politique explique de manière transparente comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </motion.div>
      </div>

      {/* ── SECTIONS ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px 80px", display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
        {sections.map((s, i) => (
          <SectionCard key={i} icon={s.icon} index={i} title={s.title}>
            {s.content}
          </SectionCard>
        ))}
      </div>

    </div>
  );
}