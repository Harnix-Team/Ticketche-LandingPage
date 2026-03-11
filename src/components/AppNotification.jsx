'use client';
import { useState, useEffect } from 'react';
import { X, DeviceMobile, DownloadSimple, CursorClick } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeviceOS } from '@/utils/deviceDetection';

export default function AppNotificationCompact() {
  const [isVisible, setIsVisible] = useState(true);
  const [deviceOS, setDeviceOS] = useState('other');

  useEffect(() => {
    setDeviceOS(getDeviceOS());
  }, []);

  if (!isVisible) return null;

  const getNotificationContent = () => {
    switch (deviceOS) {
      case 'ios':
        return (
          <a href="https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811"
            target="_blank" rel="noopener noreferrer"
            className="text-white/90 text-sm font-semibold underline decoration-white/40 hover:text-white transition-colors">
            Accéder à la version iOS →
          </a>
        );
      case 'android':
        return (
          <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
            target="_blank" rel="noopener noreferrer"
            className="text-white/90 text-sm font-semibold underline decoration-white/40 hover:text-white transition-colors">
            Accéder à la version Android →
          </a>
        );
      default:
        return (
          <p className="text-white/90 text-sm leading-snug">
            Télécharger pour{' '}
            <a href="https://play.google.com/store/apps/details?id=com.harnixsas.ticketche"
              target="_blank" rel="noopener noreferrer"
              className="font-bold underline decoration-white/40 hover:text-white transition-colors">Android</a>
            {' '}ou{' '}
            <a href="https://apps.apple.com/fr/app/ticketch%C3%A9/id6758046811"
              target="_blank" rel="noopener noreferrer"
              className="font-bold underline decoration-white/40 hover:text-white transition-colors">iOS</a>
          </p>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 w-[320px]"
        >
          {/* Glow */}
          <div style={{
            position: "absolute", inset: -1,
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(0,129,143,0.6), rgba(0,81,90,0.3))",
            filter: "blur(12px)",
            zIndex: -1,
          }} />

          <div style={{
            background: "rgba(0, 20, 25, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: "16px 18px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>

              {/* Icône */}
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #00818f, #00515a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,129,143,0.4)",
              }}>
                <DeviceMobile weight="fill" style={{ width: 18, height: 18, color: "white" }} />
              </div>

              {/* Texte */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: 800, fontSize: 13, marginBottom: 4, letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: 6 }}>
                  <DownloadSimple weight="bold" style={{ width: 14, height: 14, color: "#00818f", flexShrink: 0 }} />
                  Téléchargez l'app gratuitement
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <CursorClick weight="bold" style={{ width: 12, height: 12, flexShrink: 0 }} />
                  Cliquez ici pour accéder à l'application
                </p>
                {getNotificationContent()}
              </div>

              {/* Fermer */}
              <button
                onClick={() => setIsVisible(false)}
                style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: 8,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                aria-label="Fermer"
              >
                <X style={{ width: 13, height: 13, color: "rgba(255,255,255,0.7)" }} />
              </button>
            </div>

            {/* Barre décorative */}
            <div style={{
              marginTop: 14, height: 2, borderRadius: 999,
              background: "linear-gradient(to right, #00818f, transparent)",
              opacity: 0.5,
            }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
//cliquez ici pour la version (ios) ou ici pour la version (android)
// 'use client';
// import { useState, useEffect } from 'react';
// import { X, Warning } from '@phosphor-icons/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { getDeviceOS, getDownloadLink } from '@/utils/deviceDetection';

// export default function AppNotificationCompact() {
//   const [isVisible, setIsVisible] = useState(true);
  
//   const [deviceOS, setDeviceOS] = useState('other');

  
  
//   useEffect(() => {
//     setDeviceOS(getDeviceOS());
//   }, []);
  
//   if (!isVisible) return null;

//   // Contenu dynamique selon l'appareil
//   const getNotificationContent = () => {
//     switch (deviceOS) {
//       case 'ios':
//         return (
//           <p className="text-white text-sm md:text-[16px] leading-snug">
//             {/* <strong>ticketché</strong> est temporairement indisponible sur App Store.{' '} */}
//             <a 
//               href={getDownloadLink()}
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="underline hover:text-amber-100 font-semibold"
//             >
//               Cliquez ici pour accéder à la version iOS
//             </a>
//           </p>
//         );
      
//       case 'android':
//         return (
//           <p className="text-white text-sm md:text-[16px] leading-snug">
//             {/* <strong>Ticketché</strong> est temporairement indisponible sur Google Play.{' '} */}
//             <a 
//               href={getDownloadLink()}
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="underline hover:text-amber-100 font-semibold"
//             >
//               Cliquez ici pour accéder à la version Android
//             </a>
//           </p>
//         );
      
//       default: // Desktop ou autre
//         return (
//           <p className="text-white text-sm md:text-[16px] leading-snug">
//             {/* <strong>Ticketché</strong> est temporairement indisponible sur App Store. Cliquez ici pour la version{' '} */}
//             Cliquez ici pour la version{' '}
//             <a 
//               href={getDownloadLink()}
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="underline hover:text-amber-100 font-semibold"
//             >
//               Android
//             </a>
//             {' '}ou ici pour la version{' '}
//             <a 
//               href={getDownloadLink()}
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="underline hover:text-amber-100 font-semibold"
//             >
//               iOS
//             </a>
//           </p>
//         );
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           initial={{ y: 100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: 100, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-lg"
//         >
//           <div className="relative bg-[#005f69] backdrop-blur-md rounded-xl shadow-lg border border-amber-400/30 p-3 sm:p-4">
//             <div className="flex items-center gap-2 sm:gap-3">
//               {/* Icon */}
//               <Warning className="w-5 h-5 text-white flex-shrink-0" />
              
//               {/* Text dynamique */}
//               <div className="flex-1 min-w-0">
//                 {getNotificationContent()}
//               </div>

//               {/* Close */}
//               <button
//                 onClick={() => setIsVisible(false)}
//                 className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
//                 aria-label="Fermer"
//               >
//                 <X className="w-3.5 h-3.5 text-white" />
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
