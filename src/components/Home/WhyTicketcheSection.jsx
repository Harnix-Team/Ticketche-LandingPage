"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Lightning, ChartBar, Ticket, DeviceMobile,
  MapPin, Bell, Star, CreditCard, Users,
  Wallet, Tag, Car, CalendarPlus,
  ChatCircle, QrCode, PlusCircle, Handshake,
  MusicNote, Storefront,
} from "@phosphor-icons/react";

const C = { teal: "#005f69", brown: "#692C00", purp: "#4f46e5" };

const TABS = [
  { key: "users",      label: "Utilisateurs",   icon: Users,        color: C.teal  },
  { key: "managers",   label: "Gérants",         icon: Storefront,   color: C.brown },
  { key: "organizers", label: "Organisateurs",   icon: CalendarPlus, color: C.purp  },
];

const USE_CASES = {
  users: [
    { id: "u1", icon: MapPin,    color: C.teal,  badge: "Localisation", title: "Trouvez parking, lavage ou garage",  description: "Localisez en temps réel les parkings disponibles, les centres de lavage les mieux notés et les garages certifiés près de chez vous.", mockupImg: "/images/why/accès.png" },
    { id: "u2", icon: Wallet,    color: C.brown, badge: "Paiement MoMo", title: "Payez en Mobile Money",             description: "Réglez vos parkings, lavages, garages et billets directement en MoMo. Votre portefeuille numérique centralise solde, historique et remboursements.", mockupAccent: "#ff9f4a", mockupImg: "/images/why/partager.png" },
    { id: "u3", icon: Ticket,    color: C.teal,  badge: "Billetterie",   title: "Achetez vos billets en ligne",       description: "Concerts, festivals, conférences, soirées — réservez vos places en quelques secondes, recevez votre QR code et entrez sans attendre.", mockupAccent: "#a8f0e8", mockupImg: "/images/why/assistance.png" },
    { id: "u4", icon: Tag,       color: C.brown, badge: "Promo",         title: "Codes promo & réductions",          description: "Saisissez un code promo lors du paiement pour bénéficier de réductions exclusives sur tous les services — parking, lavage, garage ou événement.", mockupAccent: "#ffd580", mockupImg: "/images/why/voirticket.png" },
    { id: "u5", icon: Star,      color: C.teal,  badge: "Avis",          title: "Notez et consultez les avis",       description: "Lisez les avis vérifiés d'autres utilisateurs avant de choisir un prestataire. Partagez votre expérience pour aider la communauté.", mockupAccent: "#c8fbd8", mockupImg: "/images/why/voirticket.png" },
    { id: "u6", icon: Car,       color: C.brown, badge: "Véhicules",     title: "Enregistrez vos véhicules",         description: "Ajoutez vos véhicules une fois, retrouvez-les à chaque réservation. Historique d'entretien, lavages et stationnements pour chaque auto.", mockupAccent: "#ffc0a0", mockupImg: "/images/why/partager.png" },
  ],
  managers: [
    { id: "m1", icon: PlusCircle, color: C.brown, badge: "Création",      title: "Créez votre emplacement",           description: "Déclarez votre parking, centre de lavage ou garage en quelques minutes : photos, tarifs, horaires, services additionnels et localisation GPS.", mockupAccent: "#00e5ff", mockupImg: "/images/why/ajouterstock.png" },
    { id: "m2", icon: Lightning,  color: C.teal,  badge: "Temps réel",    title: "Gérez entrées & sorties",           description: "Suivez chaque véhicule entrant et sortant de votre établissement — tableaux de bord en direct, scan QR, zéro papier.", mockupAccent: "#b0f0e0", mockupImg: "/images/why/ajouterstock.png" },
    { id: "m3", icon: CreditCard, color: C.brown, badge: "Encaissement",  title: "Acceptez les paiements MoMo",       description: "Encaissez en espèces ou mobile money avec traçabilité complète. Évitez les erreurs, suivez chaque transaction, générez vos rapports automatiquement.", mockupAccent: "#ffb347", mockupImg: "/images/why/ajoutervehicule.png" },
    { id: "m4", icon: ChartBar,   color: C.teal,  badge: "Stats",         title: "Statistiques & revenus",            description: "Consultez vos revenus, heures de pointe et fréquentation. Identifiez vos meilleures plages et optimisez votre rentabilité en continu.", mockupAccent: "#80c8ff", mockupImg: "/images/why/ajoutervehicule.png" },
    { id: "m5", icon: ChatCircle, color: C.brown, badge: "Avis clients",  title: "Recevez et répondez aux avis",      description: "Consultez les avis laissés par vos clients, répondez publiquement et améliorez votre note pour attirer plus de réservations.", mockupAccent: "#ffd0a0", mockupImg: "/images/why/messagerie.png" },
    { id: "m6", icon: Handshake,  color: C.teal,  badge: "Services +",   title: "Ajoutez des services additionnels", description: "Proposez des extras payants : vidange, gonflage, nettoyage intérieur, recharge électrique — augmentez votre panier moyen facilement.", mockupAccent: "#a0e8c0", mockupImg: "/images/why/modif.png" },
  ],
  organizers: [
    { id: "o1", icon: CalendarPlus, color: C.purp, badge: "Création",    title: "Créez votre événement",             description: "Concert, festival, conférence, réunion ou soirée — en présentiel ou en ligne. Configurez tarifs, capacité, catégories de billets et date en quelques clics.", mockupAccent: "#c0b0ff", mockupImg: "/images/why/accès.png" },
    { id: "o2", icon: MusicNote,    color: C.purp, badge: "Types",       title: "Tous types d'événements",           description: "Concerts & festivals, conférences & formations, soirées privées, réunions, webinaires en ligne ou événements hybrides présentiel + distanciel.", mockupAccent: "#e0c8ff", mockupImg: "/images/why/assistance.png" },
    { id: "o3", icon: Ticket,       color: C.purp, badge: "Billetterie", title: "Vente de tickets en ligne",         description: "Ouvrez la billetterie instantanément. Les acheteurs paient en MoMo, reçoivent leur QR code et entrent sans file d'attente grâce au scan à l'entrée.", mockupAccent: "#b8e0ff", mockupImg: "/images/why/voirticket.png" },
    { id: "o4", icon: Tag,          color: C.purp, badge: "Promo",       title: "Codes promo & offres spéciales",    description: "Créez des codes promo personnalisés : pourcentage, montant fixe, nombre limité d'utilisations. Boostez vos ventes et fidélisez votre audience.", mockupAccent: "#ffd0ff", mockupImg: "/images/why/voirticket.png" },
    { id: "o5", icon: QrCode,       color: C.purp, badge: "Contrôle",   title: "Scan & contrôle d'accès",           description: "Validez les entrées en scannant les QR codes. Vue en temps réel du nombre d'entrées, billets restants et tentatives frauduleuses.", mockupAccent: "#c0ffe0", mockupImg: "/images/why/ajouterstock.png" },
    { id: "o6", icon: ChartBar,     color: C.purp, badge: "Analytics",  title: "Suivi des ventes en direct",        description: "Suivez vos ventes de tickets en temps réel, visualisez les revenus par catégorie, exportez vos données et analysez le profil de vos participants.", mockupAccent: "#a0d8ff", mockupImg: "/images/why/ajoutervehicule.png" },
  ],
};

function PhoneImage({ activeCase }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <motion.div animate={{ background: activeCase.mockupAccent || "#00e0d0" }} transition={{ duration: 0.6, ease: "easeInOut" }} style={{ position: "absolute", inset: "-10%", borderRadius: "50%", opacity: 0.15, filter: "blur(56px)", background: activeCase.mockupAccent || "#00e0d0", pointerEvents: "none", zIndex: 0 }} />
      <motion.div animate={{ background: activeCase.mockupAccent || "#00e0d0" }} transition={{ duration: 0.6, ease: "easeInOut", delay: 0.05 }} style={{ position: "absolute", top: "20%", left: "20%", right: "20%", bottom: "20%", borderRadius: "50%", opacity: 0.22, filter: "blur(32px)", background: activeCase.mockupAccent || "#00e0d0", pointerEvents: "none", zIndex: 0 }} />
      <AnimatePresence mode="wait">
        <motion.div key={activeCase.id} style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }} initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }} exit={{ opacity: 0, scale: 0.96 }} transition={{ opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }, y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.45 } }}>
          <Image src={activeCase.mockupImg} alt={activeCase.title} fill style={{ objectFit: "contain", transform: "scale(1.8)", transformOrigin: "center" }} sizes="(max-width: 900px) 90vw, 50vw" priority />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export const WhyTicketcheSection = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [activeIdx, setActiveIdx] = useState(0);
  const autoRef = useRef(null);
  const pauseRef = useRef(false);
  const activeTabRef = useRef(activeTab);
  const cases = USE_CASES[activeTab];
  const activeCase = cases[activeIdx];

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (pauseRef.current) return;
      setActiveIdx(prev => (prev + 1) % USE_CASES[activeTabRef.current].length);
    }, 3200);
  }, []);

  useEffect(() => { startAuto(); return () => clearInterval(autoRef.current); }, [startAuto]);

  const switchTab = (tab) => {
    setActiveTab(tab); activeTabRef.current = tab; setActiveIdx(0);
    pauseRef.current = true; clearInterval(autoRef.current);
    setTimeout(() => { pauseRef.current = false; startAuto(); }, 800);
  };

  const handleCaseClick = (idx) => {
    setActiveIdx(idx); pauseRef.current = true; clearInterval(autoRef.current);
    setTimeout(() => { pauseRef.current = false; startAuto(); }, 6000);
  };

  return (
    <section className="wtcSection">
      <style>{`
        .wtc-usecase__accent-bar { position:absolute; left:0; top:14px; bottom:14px; width:3px; border-radius:3px; opacity:0; transition:opacity 0.3s ease; }
        .wtc-cases-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; align-content:start; }
        @media(max-width:899px){ .wtc-left{display:none!important} .wtc-body{grid-template-columns:1fr!important} }
        @media(max-width:500px){ .wtc-cases-grid{grid-template-columns:1fr!important} }
        @media(max-width:899px){ .wtc-tabs__inner{flex-wrap:wrap; gap:6px} .wtc-tab{padding:9px 16px; font-size:0.8rem} }
      `}</style>

      <div className="wtcSection__inner">
        <motion.div className="wtc-heading" initial={{ opacity:0, y:-20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.6, ease:"easeOut" }}>
          <div className="wtc-heading__label">
            <div className="wtc-heading__dot" />
            <span>Pourquoi Ticketché ?</span>
          </div>
          <h2 className="wtc-heading__title">Une plateforme pensée pour <em>tout le monde</em></h2>
          <p className="wtc-heading__sub">Utilisateurs, gérants d'emplacements et organisateurs d'événements — chacun trouve les outils qu'il lui faut.</p>
        </motion.div>

        <motion.div className="wtc-tabs" initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:0.15 }}>
          <div className="wtc-tabs__inner">
            {TABS.map(({ key, label, icon: Icon, color }) => (
              <button key={key} className={`wtc-tab ${activeTab===key ? "wtc-tab--active" : ""}`} style={activeTab===key ? { color, boxShadow:`0 2px 12px ${color}22` } : {}} onClick={() => switchTab(key)}>
                <Icon className="wtc-tab__icon" weight={activeTab===key ? "fill" : "regular"} style={{ color: activeTab===key ? color : "#9ca3af" }} />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} className="wtc-body" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}>
            <div className="wtc-left" style={{ height:"clamp(380px,60vw,580px)" }}>
              <PhoneImage activeCase={activeCase} />
            </div>

            <div className="wtc-right wtc-cases-grid">
              {cases.map((uc, idx) => {
                const Icon = uc.icon;
                const isActive = idx === activeIdx;
                return (
                  <motion.div
                    key={uc.id}
                    className={`wtc-usecase ${isActive ? "wtc-usecase--active" : ""}`}
                    style={isActive ? { borderColor:`${uc.color}35`, background:`${uc.color}07`, boxShadow:`0 4px 20px ${uc.color}18` } : {}}
                    onClick={() => handleCaseClick(idx)}
                    onMouseEnter={() => { setActiveIdx(idx); pauseRef.current = true; }}
                    onMouseLeave={() => { pauseRef.current = false; }}
                    initial={{ opacity:0, y:16 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay: idx*0.06, duration:0.38, ease:[0.22,1,0.36,1] }}
                  >
                    <div className="wtc-usecase__accent-bar" style={{ background: uc.color }} />
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"8px" }}>
                      <div className="wtc-usecase__icon-wrap" style={{ background:`${uc.color}15`, width:38, height:38, borderRadius:10, flexShrink:0 }}>
                        <Icon weight="duotone" style={{ width:20, height:20, color:uc.color }} />
                      </div>
                      <span style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:uc.color, background:`${uc.color}12`, borderRadius:"999px", padding:"2px 8px", flexShrink:0 }}>
                        {uc.badge}
                      </span>
                    </div>
                    <div className="wtc-usecase__content">
                      <h3 className="wtc-usecase__title" style={isActive ? { color:uc.color } : {}}>{uc.title}</h3>
                      <p className="wtc-usecase__desc">{uc.description}</p>
                    </div>
                    {isActive && <div key={uc.id+activeTab} className="wtc-usecase__progress" style={{ background:uc.color }} />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};