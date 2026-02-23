'use client';
import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeviceOS, getDownloadLink } from '@/utils/deviceDetection';

export default function AppNotificationCompact() {
  const [isVisible, setIsVisible] = useState(true);
  const [deviceOS, setDeviceOS] = useState('other');

  useEffect(() => {
    setDeviceOS(getDeviceOS());
  }, []);
  if (!isVisible) return null;

  // Contenu dynamique selon l'appareil
  const getNotificationContent = () => {
    switch (deviceOS) {
      case 'ios':
        return (
          <p className="text-white text-sm md:text-[16px] leading-snug">
            {/* <strong>ticketché</strong> est temporairement indisponible sur App Store.{' '} */}
            <a 
              href={getDownloadLink()}
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-amber-100 font-semibold"
            >
              Cliquez ici pour accéder à la version iOS
            </a>
          </p>
        );
      
      case 'android':
        return (
          <p className="text-white text-sm md:text-[16px] leading-snug">
            {/* <strong>Ticketché</strong> est temporairement indisponible sur Google Play.{' '} */}
            <a 
              href={getDownloadLink()}
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-amber-100 font-semibold"
            >
              Cliquez ici pour accéder à la version Android
            </a>
          </p>
        );
      
      default: // Desktop ou autre
        return (
          <p className="text-white text-sm md:text-[16px] leading-snug">
            {/* <strong>Ticketché</strong> est temporairement indisponible sur App Store. Cliquez ici pour la version{' '} */}
            Cliquez ici pour la version{' '}
            <a 
              href={getDownloadLink()}
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-amber-100 font-semibold"
            >
              Android
            </a>
            {' '}ou ici pour la version{' '}
            <a 
              href={getDownloadLink()}
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-amber-100 font-semibold"
            >
              iOS
            </a>
          </p>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-lg"
        >
          <div className="relative bg-[#005f69] backdrop-blur-md rounded-xl shadow-lg border border-amber-400/30 p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Icon */}
              <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
              
              {/* Text dynamique */}
              <div className="flex-1 min-w-0">
                {getNotificationContent()}
              </div>

              {/* Close */}
              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                aria-label="Fermer"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
