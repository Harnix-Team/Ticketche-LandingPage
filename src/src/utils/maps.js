/**
 * Ouvre Google Maps avec l'itinéraire entre la position actuelle et une destination
 * @param {number} destLat - Latitude de destination
 * @param {number} destLng - Longitude de destination
 * @param {string} placeName - Nom de l'établissement
 */
export const openGoogleMapsDirection = (destLat, destLng, placeName = '') => {
  if (!destLat || !destLng) {
    console.error('Coordonnées de destination invalides');
    return;
  }

  // Vérifier si la géolocalisation est supportée
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      // Succès - Position obtenue
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // URL Google Maps avec origine et destination
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`;
        
        window.open(url, '_blank');
      },
      // Erreur - Impossible d'obtenir la position
      (error) => {
        console.warn('Géolocalisation refusée ou indisponible:', error.message);
        
        // Fallback: ouvrir Google Maps sans origine (l'utilisateur devra définir son point de départ)
        const url = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
        
        window.open(url, '_blank');
      },
      // Options de géolocalisation
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    // Navigateur ne supporte pas la géolocalisation
    console.warn('Géolocalisation non supportée par ce navigateur');
    
    // Fallback: ouvrir directement la destination
    const url = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
    window.open(url, '_blank');
  }
};

/**
 * Calcule la distance approximative entre deux points (formule de Haversine)
 * @param {number} lat1 - Latitude point 1
 * @param {number} lng1 - Longitude point 1
 * @param {number} lat2 - Latitude point 2
 * @param {number} lng2 - Longitude point 2
 * @returns {number} Distance en kilomètres
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
};