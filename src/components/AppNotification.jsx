'use client';
import { useState, useEffect } from 'react';
import { X, DeviceMobile } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeviceOS } from '@/utils/deviceDetection';

export default function AppNotificationCompact() {
  const [isVisible, setIsVisible] = useState(true);
  const [deviceOS, setDeviceOS] = useState('other');

  useEffect(() => {
    setDeviceOS(getDeviceOS());
  }, []);

  const getNotificationContent = () => {
    switch (deviceOS) {
      case 'ios':
        return (
          <a href="https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811"
            target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)" }}>
            Accéder à la version iOS →
          </a>
        );
      case 'android':
        return (
          <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
            target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)", wordSpacing: "4px" }}>
            Accéder à la version Android →
          </a>
        );
      default:
        return (
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, margin: 0, letterSpacing: "0.03em", wordSpacing: "3px" }}>
            Télécharger pour{' '}
            <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
              target="_blank" rel="noopener noreferrer"
              style={{ fontWeight: 700, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)", color: "white", wordSpacing: "4px" }}>Android</a>
            {' '}ou{' '}
            <a href="https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811"
              target="_blank" rel="noopener noreferrer"
              style={{ fontWeight: 700, textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.3)", color: "white", wordSpacing: "4px" }}>iOS</a>
          </p>
        );
    }
  };

  return (
    <>
      {/* Card complète */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="app-notif"
            style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 420 }}
          >
            {/* Glow */}
            <div style={{
              position: "absolute", inset: -1, borderRadius: 16,
              background: "linear-gradient(135deg, rgba(0,129,143,0.6), rgba(0,81,90,0.3))",
              filter: "blur(10px)", zIndex: -1,
            }} />

            <div style={{
              background: "rgba(0, 20, 25, 0.80)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16, padding: "16px 20px", boxShadow: "0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                {/* Icône */}
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #00818f, #00515a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,129,143,0.4)",
                }}>
                  <DeviceMobile weight="fill" style={{ width: 16, height: 16, color: "white" }} />
                </div>

                {/* Texte */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {getNotificationContent()}
                </div>

                {/* Fermer — masque la card, affiche le bouton flottant */}
                <button
                  onClick={() => setIsVisible(false)}
                  style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 7,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  aria-label="Masquer"
                >
                  <X style={{ width: 11, height: 11, color: "rgba(255,255,255,0.7)" }} />
                </button>
              </div>

             
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant pour rouvrir */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setIsVisible(true)}
            aria-label="Ouvrir la notification app"
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 50,
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #00818f, #00515a)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,129,143,0.45)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,129,143,0.55)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,129,143,0.45)";
            }}
          >
            <DeviceMobile weight="fill" style={{ width: 22, height: 22, color: "white" }} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}