"use client";

export default function TicketcheFonction() {
    return (
        <section style={{
            padding: "clamp(48px, 7vw, 90px) clamp(20px, 5vw, 72px)",
            paddingBottom: "clamp(240px, 28vw, 360px)",
            position: "relative",
            background: "#ecf5f6",
        }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>

                {/* ── GRANDE CARTE SOMBRE ── élargie avec marges négatives */}
                <div style={{
                    background: "#001e22",
                    borderRadius: "clamp(24px, 3vw, 36px)",
                    padding: "clamp(36px, 5vw, 60px) clamp(28px, 5vw, 80px)",
                    paddingBottom: "clamp(380px, 44vw, 560px)",      // ← PLUS HAUT pour laisser place aux cartes
                    marginLeft: "clamp(-150px, -40vw, -200px)",        // ← DÉBORDE À GAUCHE
                    marginRight: "clamp(-40px, -6vw, -120px)",       // ← DÉBORDE À DROITE
                    position: "relative",
                    overflow: "visible",
                }}>

                    {/* Halos */}
                    <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "0", left: "15%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,95,105,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

                    {/* EN-TÊTE */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "clamp(20px, 4vw, 60px)", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#ffffff", maxWidth: "460px", margin: 0 }}>
                            Sécurisé &amp; Pratique{" "}
                            <span style={{ color: "#00c9a7" }}>pour tous</span>
                        </h2>
                        <p style={{ fontSize: "clamp(0.88rem, 1.2vw, 1rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: "360px", margin: 0, paddingTop: "6px" }}>
                            Payez et encaissez en toute confiance grâce à notre plateforme.
                            Transactions instantanées, sans commission cachée et sans mauvaise surprise.
                        </p>
                    </div>

                    {/* 3 CARTES — positionnées en bas de la carte sombre */}
                    <div style={{
                        position: "absolute",
                        bottom: "-120px",                             // décalage vers le bas
                        left: "clamp(20px, 4vw, 60px)",
                        right: "clamp(20px, 4vw, 60px)",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "clamp(32px, 5vw, 64px)",
                        zIndex: 10,
                        paddingTop: "clamp(40px, 5vw, 80px)",         // ← ESPACE EN HAUT DES CARDS
                    }}>

                        {/* ── CARTE 1 ── */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "clamp(16px, 2vw, 24px)",
                            padding: "clamp(22px, 2.5vw, 32px) clamp(18px, 2vw, 28px) 0",
                            overflow: "visible",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "300px",
                            position: "relative",
                        }}>
                            <span style={{ display: "inline-block", background: "rgba(0,95,105,0.1)", color: "#005f69", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 11px", borderRadius: "100px", marginBottom: "14px", width: "fit-content" }}>Instantané</span>
                            <h3 style={{ fontSize: "clamp(1rem, 1.6vw, 1.35rem)", fontWeight: 800, color: "#0a1a1c", lineHeight: 1.25, letterSpacing: "-0.015em", marginBottom: "10px" }}>Paiement Instantané,<br />Sans Frais</h3>
                            <p style={{ fontSize: "clamp(0.78rem, 0.95vw, 0.88rem)", color: "#6b7280", lineHeight: 1.65, marginBottom: "20px" }}>Effectuez ou recevez vos paiements en quelques secondes, en espèces ou Mobile Money, sans commission surprise.</p>

                            {/* Mockup carte 1 */}
                            <div style={{ position: "absolute", bottom: "-5vw", left: "50%", transform: "translateX(-44%) translateX(-18vw)", width: "0%", zIndex: 5 }}>
                                <div style={{ width: "100%", overflow: "hidden" }}>
                                    <img
                                        src="/images/mockups/user.png"
                                        alt="mockup"
                                        style={{ width: "100%", height: "auto", display: "block" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── CARTE 2 ── */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "clamp(16px, 2vw, 24px)",
                            padding: "clamp(22px, 2.5vw, 32px) clamp(18px, 2vw, 28px) 0",
                            overflow: "visible",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "650px",
                            position: "relative",
                        }}>
                            <span style={{ display: "inline-block", background: "rgba(0,95,105,0.1)", color: "#005f69", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 11px", borderRadius: "100px", marginBottom: "14px", width: "fit-content" }}>Statistiques</span>
                            <h3 style={{ fontSize: "clamp(1rem, 1.6vw, 1.35rem)", fontWeight: 800, color: "#0a1a1c", lineHeight: 1.25, letterSpacing: "-0.015em", marginBottom: "10px" }}>Suivez votre Trésorerie<br />en Temps Réel</h3>
                            <p style={{ fontSize: "clamp(0.78rem, 0.95vw, 0.88rem)", color: "#6b7280", lineHeight: 1.65, marginBottom: "20px" }}>Visualisez toutes vos entrées et sorties d'argent. Cartes, Mobile Money, espèces — tout centralisé en un clin d'œil.</p>

                            {/* Mockup carte 2 */}
                            <div style={{ position: "absolute", bottom: "4px", left: "-10%", transform: "translateX(-44%) rotate(-10deg)", transformOrigin: "bottom right", width: "200%", zIndex: 5 }}>
                                <div style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    WebkitMaskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
                                    maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)"
                                }}>
                                    <img
                                        src="/images/mockups/gerant.png"
                                        alt="mockup"
                                        style={{ width: "100%", height: "auto", display: "block" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── CARTE 3 ── */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "clamp(16px, 2vw, 24px)",
                            padding: "0 clamp(18px, 2vw, 28px) clamp(22px, 2.5vw, 32px)",
                            overflow: "visible",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            minHeight: "300px",
                            position: "relative",
                        }}>
                            {/* Mockup carte 3 */}
<div style={{ position: "absolute", bottom: "-965px", left: "-22%", transform: "translateX(-42%) rotate(-10deg)", transformOrigin: "bottom left", width: "200%", zIndex: 18 }}>                                
    <div style={{ width: "130%", aspectRatio: "9/19", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img
                                        src="/images/mockups/organisateur.png"
                                        alt="mockup"
                                        style={{ width: "100%", height: "auto", display: "block" }}
                                    />
                                </div>
                            </div>

                            {/* Textes en bas */}
                            <div style={{ paddingTop: "clamp(180px, 24vw, 230px)" }}>
                                <span style={{ display: "inline-block", background: "rgba(0,95,105,0.1)", color: "#005f69", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 11px", borderRadius: "100px", marginBottom: "14px", width: "fit-content" }}>Contrôle total</span>
                                <h3 style={{ fontSize: "clamp(1rem, 1.6vw, 1.35rem)", fontWeight: 800, color: "#0a1a1c", lineHeight: 1.25, letterSpacing: "-0.015em", marginBottom: "10px" }}>Zéro Abonnement<br />Indésirable</h3>
                                <p style={{ fontSize: "clamp(0.78rem, 0.95vw, 0.88rem)", color: "#6b7280", lineHeight: 1.65 }}>Vous restez maître de votre budget. Aucun prélèvement automatique sans votre accord. Transparence totale.</p>
                            </div>
                        </div>

                    </div>{/* fin grid */}
                </div>{/* fin grande carte sombre */}
            </div>
        </section>
    );
}