"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Lightning, ChartBar, Ticket, DeviceMobile,
    MapPin, Bell, Star, QrCode, CreditCard, Users,
} from "@phosphor-icons/react";

const TABS = [
    { key: "users", label: "Pour les utilisateurs", icon: Users },
    { key: "managers", label: "Pour les gérants", icon: DeviceMobile },
];

const USE_CASES = {
    users: [
        {
            id: "u1", icon: MapPin, color: "#005f69",
            title: "Achetez vos billets en ligne",
            description: " Réservez votre place en quelques clics et profitez d'un accès rapide, sécurisé et sans file d'attente.",
            mockupImg: "/images/why/accès.png",
        },
        {
            id: "u2", icon: CreditCard, color: "#692C00",
            title: "Partagez votre ticket",
            description: "Envoyez facilement votre ticket numérique à une autre personne en toute sécurité.",
            mockupAccent: "#ff9f4a", mockupLabel: "Paiement rapide",
            mockupImg: "/images/why/partager.png",
        },
        {
            id: "u3", icon: Bell, color: "#005f69",
            title: "Assistance Ticketché",
            description: "Notre équipe d'assistance est disponible pour répondre à toutes vos préoccupations.",
            mockupAccent: "#a8f0e8", mockupLabel: "Notifications live",
            mockupImg: "/images/why/assistance.png",
        },
        {
            id: "u4", icon: Star, color: "#692C00",
            title: "Voir mon ticket",
            description: "Accédez rapidement à votre ticket numérique en quelques clics.",
            mockupAccent: "#ffd580", mockupLabel: "Avis vérifiés",
            mockupImg: "/images/why/voirticket.png",
        },
    ],
    managers: [
        {
            id: "m1", icon: Lightning, color: "#005f69",
            title: "Modifier un èvenement",
            description: "Modifiez les informations de votre événement en toute simplicité et mettez-le à jour en temps réel.",
            mockupAccent: "#00e5ff", mockupLabel: "Dashboard live",
            mockupImg: "/images/why/ajouterstock.png",
        },
        {
            id: "m2", icon: ChartBar, color: "#692C00",
            title: "Enregistrer vos véhicules",
            description: "Enregistrez vos véhicules dans votre espace pour un suivi et une gestion optimisés.",
            mockupAccent: "#ffb347", mockupLabel: "Analytics avancés",
            mockupImg: "/images/why/ajoutervehicule.png",
        },
        {
            id: "m3", icon: Ticket, color: "#005f69",
            title: "Messagerie",
            description: "Accédez à notre assistance et communiquez directement avec notre équipe via la messagerie.",
            mockupAccent: "#80ffee", mockupLabel: "Scan & Valider",
            mockupImg: "/images/why/messagerie.png",
        },
        {
            id: "m4", icon: DeviceMobile, color: "#692C00",
            title: "Modifier un évènement",
            description: "Modifiez facilement les détails de votre événement pour garantir des informations toujours à jour.",
            mockupAccent: "#ffa07a", mockupLabel: "App gérant",
            mockupImg: "/images/why/modif.png",
        },
    ],
};

/* ══════════════════════════════════════════════════════
   IMAGE GAUCHE
══════════════════════════════════════════════════════ */
function PhoneImage({ activeCase }) {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <motion.div
                animate={{ background: activeCase.mockupAccent }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    inset: "-10%",
                    borderRadius: "50%",
                    opacity: 0.15,
                    filter: "blur(56px)",
                    background: activeCase.mockupAccent,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            <motion.div
                animate={{ background: activeCase.mockupAccent }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.05 }}
                style={{
                    position: "absolute",
                    top: "20%", left: "20%", right: "20%", bottom: "20%",
                    borderRadius: "50%",
                    opacity: 0.22,
                    filter: "blur(32px)",
                    background: activeCase.mockupAccent,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCase.id}
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                    }}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -14, 0],
                    }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                        opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                        y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.45 },
                    }}
                >
                    <Image
                        src={activeCase.mockupImg}
                        alt={activeCase.mockupLabel || activeCase.title}
                        fill
                        style={{ objectFit: "contain", transform: "scale(1.8)", transformOrigin: "center" }}
                        sizes="(max-width: 900px) 90vw, 50vw"
                        priority
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export const WhyTicketcheSection = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [activeIdx, setActiveIdx] = useState(0);
    const autoRef = useRef(null);
    const pauseRef = useRef(false);

    const activeTabRef = useRef(activeTab);
    const cases = USE_CASES[activeTab];
    const activeCase = cases[activeIdx];

    // Garder la ref synchronisee avec le state
    useEffect(() => {
        activeTabRef.current = activeTab;
    }, [activeTab]);

    const startAuto = useCallback(() => {
        clearInterval(autoRef.current);
        autoRef.current = setInterval(() => {
            if (pauseRef.current) return;
            setActiveIdx((prev) => (prev + 1) % USE_CASES[activeTabRef.current].length);
        }, 3000);
    }, []);

    useEffect(() => {
        startAuto();
        return () => clearInterval(autoRef.current);
    }, [startAuto]);

    const switchTab = (tab) => {
        setActiveTab(tab);
        activeTabRef.current = tab;
        setActiveIdx(0);
        pauseRef.current = true;
        clearInterval(autoRef.current);
        setTimeout(() => { pauseRef.current = false; startAuto(); }, 800);
    };

    const handleCaseClick = (idx) => {
        setActiveIdx(idx);
        pauseRef.current = true;
        clearInterval(autoRef.current);
        setTimeout(() => { pauseRef.current = false; startAuto(); }, 6000);
    };

    return (
        <section className="wtcSection">
            <div className="wtcSection__inner">
                <motion.div
                    className="wtc-heading"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="wtc-heading__label">
                        <div className="wtc-heading__dot" />
                        <span>Pourquoi Ticketché ?</span>
                    </div>
                    <h2 className="wtc-heading__title">
                        Une plateforme pensée pour <em>tout le monde</em>
                    </h2>
                    <p className="wtc-heading__sub">
                        Que vous soyez utilisateur ou gérant, Ticketché vous offre les outils
                        qu'il vous faut, quand vous en avez besoin.
                    </p>
                </motion.div>

                <motion.div
                    className="wtc-tabs"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div className="wtc-tabs__inner">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                className={`wtc-tab ${activeTab === key ? "wtc-tab--active" : ""}`}
                                onClick={() => switchTab(key)}
                            >
                                <Icon
                                    className="wtc-tab__icon"
                                    weight={activeTab === key ? "fill" : "regular"}
                                    style={{ color: activeTab === key ? "#005f69" : "#9ca3af" }}
                                />
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        className="wtc-body"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="wtc-left" style={{ height: "clamp(380px, 60vw, 580px)" }}>
                            <PhoneImage activeCase={activeCase} />
                        </div>

                        <div className="wtc-right">
                            {cases.map((uc, idx) => {
                                const Icon = uc.icon;
                                const isActive = idx === activeIdx;
                                return (
                                    <motion.div
                                        key={uc.id}
                                        className={`wtc-usecase ${isActive ? "wtc-usecase--active" : ""}`}
                                        style={isActive ? { borderColor: `${uc.color}30`, background: `${uc.color}06` } : {}}
                                        onClick={() => handleCaseClick(idx)}
                                        onMouseEnter={() => { setActiveIdx(idx); pauseRef.current = true; }}
                                        onMouseLeave={() => { pauseRef.current = false; }}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className="wtc-usecase__accent-bar" style={{ background: uc.color }} />
                                        <div className="wtc-usecase__icon-wrap" style={{ background: `${uc.color}15` }}>
                                            <Icon weight="duotone" style={{ width: 24, height: 24, color: uc.color }} />
                                        </div>
                                        <div className="wtc-usecase__content">
                                            <h3 className="wtc-usecase__title" style={isActive ? { color: uc.color } : {}}>
                                                {uc.title}
                                            </h3>
                                            <p className="wtc-usecase__desc">{uc.description}</p>
                                        </div>
                                        {isActive && (
                                            <div
                                                key={uc.id + activeTab}
                                                className="wtc-usecase__progress"
                                                style={{ background: uc.color }}
                                            />
                                        )}
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