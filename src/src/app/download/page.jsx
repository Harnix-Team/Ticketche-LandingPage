"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, DeviceMobile } from "@phosphor-icons/react";
import Link from "next/link";
import { getDeviceOS } from "@/utils/deviceDetection";
import { APP_LINKS } from "@/config/appLinks";

const CLUSTERS = [
  { cx: "3%", cy: "8%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.45, anim: 0, delay: "0s", dur: "3.2s", color: "#00818f" }, { x: 16, y: -10, size: 8, opacity: 0.28, anim: 1, delay: "0.3s", dur: "2.8s", color: "#00515a" }] },
  { cx: "90%", cy: "6%", stars: [{ x: 0, y: 0, size: 13, opacity: 0.40, anim: 1, delay: "0.2s", dur: "3.0s", color: "#00818f" }, { x: -12, y: 11, size: 8, opacity: 0.25, anim: 2, delay: "0.5s", dur: "3.4s", color: "#00515a" }] },
  { cx: "1%", cy: "55%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.35, anim: 2, delay: "0.1s", dur: "3.5s", color: "#00515a" }] },
  { cx: "94%", cy: "50%", stars: [{ x: 0, y: 0, size: 11, opacity: 0.38, anim: 0, delay: "0.3s", dur: "3.3s", color: "#00818f" }] },
  { cx: "5%", cy: "82%", stars: [{ x: 0, y: 0, size: 9, opacity: 0.28, anim: 1, delay: "0.2s", dur: "2.9s", color: "#00818f" }] },
  { cx: "88%", cy: "78%", stars: [{ x: 0, y: 0, size: 10, opacity: 0.30, anim: 2, delay: "0.4s", dur: "3.1s", color: "#00515a" }] },
  { cx: "45%", cy: "2%", stars: [{ x: 0, y: 0, size: 7, opacity: 0.22, anim: 0, delay: "0.1s", dur: "3.0s", color: "#00818f" }] },
  { cx: "50%", cy: "92%", stars: [{ x: 0, y: 0, size: 7, opacity: 0.20, anim: 1, delay: "0.3s", dur: "3.2s", color: "#00515a" }] },
];

function StarClusters() {
  return (
    <>
      {CLUSTERS.map((cluster, ci) => (
        <div key={ci} style={{ position: "absolute", left: cluster.cx, top: cluster.cy, width: 0, height: 0, zIndex: 0, pointerEvents: "none" }}>
          {cluster.stars.map((s, si) => (
            <div key={si} style={{ position: "absolute", left: s.x, top: s.y, transform: "translate(-50%,-50%)", opacity: s.opacity, animation: `dlStar${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`, filter: `drop-shadow(0 0 3px ${s.color}88)` }}>
              <Star weight="fill" style={{ width: s.size, height: s.size, color: s.color }} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function DownloadPage() {
  const [deviceOS, setDeviceOS] = useState("other");

  useEffect(() => {
    const device = getDeviceOS();
    setDeviceOS(device);
    if (device === "ios") window.location.href = APP_LINKS.download.ios;
    else if (device === "android") window.location.href = APP_LINKS.download.android;
  }, []);

  if (deviceOS === "ios" || deviceOS === "android") {
    return (
      <div style={{ minHeight: "100vh", background: "#ecf5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div style={{ textAlign: "center", color: "#005f69" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #005f69", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "1.1rem", fontWeight: 600, fontFamily: "'Archivo', sans-serif" }}>Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes dlStar0 {
          0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%      { transform: translateY(-8px) rotate(15deg) scale(1.10); }
          66%      { transform: translateY(-3px) rotate(-8deg) scale(0.95); }
        }
        @keyframes dlStar1 {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-11px) rotate(20deg) scale(1.07); }
        }
        @keyframes dlStar2 {
          0%,100% { transform: translateY(0px) scale(1); }
          40%      { transform: translateY(-7px) rotate(-12deg) scale(1.12); }
          80%      { transform: translateY(-2px) rotate(6deg) scale(0.92); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dlFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        .dl-store-btn {
          display: inline-block;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .dl-store-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 14px 32px rgba(0,95,105,0.25);
        }
        .dl-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #005f69;
          border: 2px solid rgba(0,95,105,0.35);
          border-radius: 12px;
          padding: 13px 32px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
          font-family: 'Archivo', sans-serif;
        }
        .dl-btn-outline:hover {
          transform: translateY(-3px);
          border-color: #005f69;
          background: rgba(0,95,105,0.05);
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#ecf5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 16px",
        fontFamily: "'Archivo', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        <StarClusters />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "600px", width: "100%" }}
        >

          {/* Icône téléphone animée */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}
          >
            <div style={{ animation: "dlFloat 4s ease-in-out infinite" }}>
              <DeviceMobile weight="fill" style={{ width: "clamp(80px,15vw,120px)", height: "clamp(80px,15vw,120px)", color: "#005f69" }} />
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)", fontWeight: 900, color: "#0a1a1c", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Application mobile uniquement
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", color: "#6b7280", lineHeight: 1.75, margin: "0 0 40px", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}
          >
            Veuillez vous munir d'un appareil <strong style={{ color: "#0a1a1c" }}>iOS</strong> ou <strong style={{ color: "#0a1a1c" }}>Android</strong> pour télécharger et profiter de l'application Ticketché.
          </motion.p>

          {/* Store badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}
          >
            <a href="https://apps.apple.com/app/ticketche/id6743762073" target="_blank" rel="noopener noreferrer" className="dl-store-btn">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store" style={{ height: "48px", width: "auto", display: "block" }} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche" target="_blank" rel="noopener noreferrer" className="dl-store-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ height: "48px", width: "auto", display: "block" }} />
            </a>
          </motion.div>

          {/* Retour accueil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link href="/" className="dl-btn-outline">
              ← Retour à l'accueil
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}