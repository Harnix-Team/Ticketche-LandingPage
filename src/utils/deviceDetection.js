import { APP_LINKS } from '@/config/appLinks';

/**
 * Détecte le système d'exploitation de l'utilisateur
 * @returns {'ios' | 'android' | 'other'}
 */
export const getDeviceOS = () => {
  if (typeof window === 'undefined') {
    return 'other';
  }

  const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

  // Détection iOS
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  // Détection Android
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  return 'other';
};

/**
 * Retourne le lien de téléchargement approprié selon l'appareil
 * Utilise la configuration centralisée
 * @returns {string}
 */
export const getDownloadLink = () => {
  const deviceOS = getDeviceOS();
  
  switch (deviceOS) {
    case 'ios':
      return APP_LINKS.download.ios;
    case 'android':
      return APP_LINKS.download.android;
    default:
      return APP_LINKS.download.default;
  }
};

/**
 * Retourne le lien intelligent pour les boutons App Store / Play Store
 * Si l'utilisateur clique sur Play Store depuis iOS, il est redirigé vers App Store
 * @param {'ios' | 'android'} storeType - Type de store cliqué
 * @returns {string}
 */
export const getSmartStoreLink = (storeType) => {
  const deviceOS = getDeviceOS();
  
  // Si on clique sur le bouton iOS
  if (storeType === 'ios') {
    return APP_LINKS.download.ios;
  }
  
  // Si on clique sur le bouton Android
  if (storeType === 'android') {
    // Sur iOS → redirige vers App Store (redirection intelligente)
    if (deviceOS === 'ios') {
      return APP_LINKS.download.ios;
    }
    // Sinon → lien Android normal
    return APP_LINKS.download.android;
  }
  
  return APP_LINKS.download.default;
};

/**
 * Vérifie si l'utilisateur est sur mobile
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

/**
 * Retourne le texte du bouton de téléchargement selon l'appareil
 * @returns {string}
 */
export const getDownloadButtonText = () => {
  if (isMobileDevice()) {
    return "Télécharger maintenant";
  }
  return "Télécharger l'app";
};