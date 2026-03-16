"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Buildings, IdentificationCard, Globe, Copyright, Warning,
  Gavel, Link, Envelope, Phone, MapPin, CaretDown,
  ArrowClockwise, ShieldCheck, BookOpen, Bank, Scales, Info, Star,
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
        @keyframes mlStar0{0%,100%{transform:translateY(0) rotate(0deg) scale(1);}33%{transform:translateY(-8px) rotate(15deg) scale(1.10);}66%{transform:translateY(-3px) rotate(-8deg) scale(0.95);}}
        @keyframes mlStar1{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-11px) rotate(20deg) scale(1.07);}}
        @keyframes mlStar2{0%,100%{transform:translateY(0) scale(1);}40%{transform:translateY(-7px) rotate(-12deg) scale(1.12);}80%{transform:translateY(-2px) rotate(6deg) scale(0.92);}}
      `}</style>
      {STARS.map((cluster, ci) => (
        <div key={ci} style={{position:"absolute",left:cluster.cx,top:cluster.cy,width:0,height:0,zIndex:0,pointerEvents:"none"}}>
          {cluster.s.map((s, si) => (
            <div key={si} style={{position:"absolute",left:s.x,top:s.y,transform:"translate(-50%,-50%)",opacity:s.op,animation:`mlStar${s.a} ${s.dr} ease-in-out ${s.d} infinite`,filter:`drop-shadow(0 0 3px ${s.c}88)`}}>
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
      style={{ background: "#fff", borderRadius: 16, border: `1px solid ${open ? T : "#e5eef0"}`, overflow: "hidden", transition: "border-color .3s", fontFamily: "'Archivo', sans-serif" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "22px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
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

/* ─── chip ─── */
const Chip = ({ children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: TL, color: T, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "'Archivo', sans-serif" }}>
    {children}
  </span>
);

/* ─── info row ─── */
const InfoRow = ({ icon: Icon, label, value, href }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0", borderBottom: `1px solid ${TL}` }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: TL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={18} color={T} weight="duotone" />
    </div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9ab8bb", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0, fontFamily: "'Archivo', sans-serif" }}>{label}</p>
      {href ? (
        <a href={href} style={{ fontSize: 14, fontWeight: 500, color: T, margin: 0, fontFamily: "'Archivo', sans-serif", textDecoration: "none" }}>{value}</a>
      ) : (
        <p style={{ fontSize: 14, fontWeight: 500, color: TB, margin: 0, fontFamily: "'Archivo', sans-serif" }}>{value}</p>
      )}
    </div>
  </div>
);

/* ─── text block ─── */
const TextBlock = ({ children }) => (
  <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.8, fontFamily: "'Archivo', sans-serif" }}>{children}</p>
);

/* ─── notice banner ─── */
const Notice = ({ icon: Icon, children }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: TL, borderLeft: `4px solid ${T}`, borderRadius: "0 12px 12px 0", padding: "14px 18px" }}>
    <Icon size={18} color={T} weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
    <p style={{ margin: 0, fontSize: 13, color: TB, lineHeight: 1.6, fontFamily: "'Archivo', sans-serif" }}>{children}</p>
  </div>
);

/* ─── simple list item ─── */
const ListItem = ({ icon: Icon, title, desc }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", borderRadius: 12, background: TLL, border: `1px solid #d4eaed` }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: T, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={18} color="#fff" weight="duotone" />
    </div>
    <div>
      <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: TB, fontFamily: "'Archivo', sans-serif" }}>{title}</p>
      {desc && <p style={{ margin: 0, fontSize: 13, color: "#1a1a1a", fontFamily: "'Archivo', sans-serif" }}>{desc}</p>}
    </div>
  </div>
);

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────────── */
export default function MentionsLegalesPage() {
  const sections = [
    {
      icon: Buildings,
      title: "Éditeur du site",
      content: (
        <div>
          <InfoRow icon={IdentificationCard} label="Raison sociale" value="Harnix-Team" />
          <InfoRow icon={Buildings}          label="Application"    value="Ticketché" />
          <InfoRow icon={MapPin}             label="Siège social"   value="Abomey-Calavi, Bénin" />
          <InfoRow icon={Envelope}           label="Email"          value="support@ticketche.com"  href="mailto:support@ticketche.com" />
          <InfoRow icon={Phone}              label="Téléphone"      value="+229 01 40 51 21 33"    href="tel:+2290140512133" />
          <InfoRow icon={Globe}              label="Site web"       value="www.ticketche.com"       href="https://www.ticketche.com" />
        </div>
      ),
    },
    {
      icon: Globe,
      title: "Hébergement",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextBlock>Le site et l'application Ticketché sont hébergés par des prestataires tiers certifiés garantissant la sécurité, la disponibilité et l'intégrité des données.</TextBlock>
          <Notice icon={ShieldCheck}>Les serveurs d'hébergement sont soumis à des audits de sécurité réguliers et respectent les normes en vigueur en matière de protection des données personnelles.</Notice>
        </div>
      ),
    },
    {
      icon: Copyright,
      title: "Propriété intellectuelle",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <TextBlock>L'ensemble des contenus présents sur le site et l'application Ticketché — incluant, sans s'y limiter, les textes, graphismes, logos, icônes, images, sons et logiciels — sont la propriété exclusive de <strong>Harnix-Team</strong> ou de ses partenaires, et sont protégés par les lois en vigueur relatives à la propriété intellectuelle.</TextBlock>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ListItem icon={Copyright}   title="Marque et logo"      desc="Le nom « Ticketché » et son logo sont des marques déposées. Toute reproduction est interdite sans autorisation préalable." />
            <ListItem icon={BookOpen}    title="Contenus éditoriaux" desc="Textes, visuels et données publiés sur la plateforme ne peuvent être reproduits sans accord écrit." />
            <ListItem icon={ShieldCheck} title="Code source"         desc="Le code source de l'application est protégé. Toute ingénierie inverse est strictement interdite." />
          </div>
        </div>
      ),
    },
    {
      icon: Gavel,
      title: "Responsabilité",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextBlock>Ticketché s'efforce de fournir des informations exactes et à jour sur sa plateforme. Cependant, nous ne pouvons garantir l'exactitude, l'exhaustivité ou l'actualité de ces informations.</TextBlock>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ListItem icon={Warning} title="Disponibilité du service" desc="Nous ne saurions être tenus responsables d'une interruption de service due à des opérations de maintenance ou à des incidents techniques." />
            <ListItem icon={Link}    title="Liens externes"           desc="Ticketché ne peut être tenu responsable du contenu des sites tiers vers lesquels des liens sont proposés." />
            <ListItem icon={Info}    title="Exactitude des informations" desc="Les informations publiées sont données à titre indicatif et peuvent être modifiées à tout moment sans préavis." />
          </div>
        </div>
      ),
    },
    {
      icon: Link,
      title: "Liens hypertextes",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextBlock>La création de liens hypertextes vers le site Ticketché est autorisée sous réserve de ne pas porter atteinte à l'image de la marque. En revanche, les liens en profondeur (<em>deep linking</em>) ainsi que les techniques de <em>framing</em> sont formellement interdits sans accord préalable écrit de Harnix-Team.</TextBlock>
          <Notice icon={Warning}>Tout lien non autorisé sera considéré comme une violation des présentes mentions légales et pourra faire l'objet de poursuites.</Notice>
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: "Protection des données personnelles",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextBlock>La collecte et le traitement des données personnelles des utilisateurs sont encadrés par notre Politique de confidentialité, disponible sur notre plateforme. Ticketché s'engage à respecter la réglementation applicable en matière de protection des données personnelles.</TextBlock>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: T, borderRadius: 12, padding: "14px 18px", color: "#fff" }}>
            <Envelope size={16} weight="fill" />
            <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>
              Pour toute demande relative à vos données : <strong>support@ticketche.com</strong>
            </span>
          </div>
        </div>
      ),
    },
    {
      icon: ArrowClockwise,
      title: "Cookies",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextBlock>L'application Ticketché utilise des technologies de traçage fonctionnel (équivalentes aux cookies) pour assurer le bon fonctionnement du service, mémoriser vos préférences et améliorer votre expérience utilisateur.</TextBlock>
          <TextBlock>Aucun cookie publicitaire ou de profilage tiers n'est utilisé sans votre consentement explicite. Vous pouvez gérer vos préférences directement depuis les paramètres de l'application.</TextBlock>
        </div>
      ),
    },
    {
      icon: Scales,
      title: "Droit applicable et juridiction",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextBlock>Les présentes mentions légales sont régies par le droit béninois. En cas de litige relatif à l'utilisation du site ou de l'application Ticketché, et à défaut de résolution amiable, les tribunaux compétents du Bénin seront seuls compétents.</TextBlock>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ListItem icon={Gavel}  title="Droit applicable"     desc="Droit de la République du Bénin" />
            <ListItem icon={Bank}   title="Juridiction compétente" desc="Tribunaux compétents d'Abomey-Calavi, Bénin" />
            <ListItem icon={Scales} title="Résolution amiable"   desc="Tout différend sera d'abord soumis à une tentative de résolution amiable avant toute action judiciaire." />
          </div>
        </div>
      ),
    },
    {
      icon: ArrowClockwise,
      title: "Mise à jour des mentions légales",
      content: (
        <div style={{ background: TLL, border: `1px solid #d4eaed`, borderRadius: 14, padding: "22px 24px" }}>
          <TextBlock>Harnix-Team se réserve le droit de modifier les présentes mentions légales à tout moment, notamment pour se conformer à toute évolution légale, jurisprudentielle ou technique. La version en vigueur est celle accessible sur la plateforme. Nous vous encourageons à la consulter régulièrement.</TextBlock>
        </div>
      ),
    },
    {
      icon: Envelope,
      title: "Contact",
      content: (
        <div style={{ background: T, borderRadius: 16, padding: "24px 26px", color: "#fff" }}>
          <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>
            Pour toute question relative aux présentes mentions légales :
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Envelope size={16} weight="fill" />
              <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>support@ticketche.com</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Phone size={16} weight="fill" />
              <span style={{ fontSize: 13, fontFamily: "'Archivo', sans-serif" }}>+229 01 40 51 21 33</span>
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
              <Gavel size={32} color={T} weight="duotone" />
            </div>

            <Chip>
              <Gavel size={12} color={T} weight="fill" />
              Mise à jour — Janvier 2025
            </Chip>

            <h1 style={{ fontFamily: "'Archivo', sans-serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, margin: "16px 0 10px", letterSpacing: "-0.02em", lineHeight: 1.15, color: TB }}>
              Mentions légales
            </h1>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20, color: TB, margin: 0, lineHeight: 1.6 }}>
              Informations légales relatives à la plateforme Ticketché.
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
            Conformément aux dispositions légales en vigueur, les présentes mentions légales définissent les conditions d'utilisation du site et de l'application{" "}
            <span style={{ fontWeight: 800, color: T }}>Ticketché</span>, éditée par <strong>Harnix-Team</strong>. En accédant à notre plateforme, vous acceptez sans réserve ces mentions légales.
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