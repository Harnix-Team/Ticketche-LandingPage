/**
 * Configuration centralisée des liens de l'application
 */

export const APP_LINKS = {
  // Liens de téléchargement
 download: {
    ios: "https://apps.apple.com/app/ticketche/id6741428128",
    android: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
    playStore: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
    default: "/download"
  },
};

/**
 * Obtient le lien de téléchargement selon l'appareil
 * @returns {string}
 */
export const getSmartDownloadLink = () => {
  if (typeof window === 'undefined') {
    return APP_LINKS.download.default;
  }

  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

  // iOS → App Store
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return APP_LINKS.download.ios;
  }

  // Android → Play Store
  if (/android/i.test(userAgent)) {
    return APP_LINKS.download.android;
  }

  // Desktop → Page web explicative
  return APP_LINKS.download.default;
};