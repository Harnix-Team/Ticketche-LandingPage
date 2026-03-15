// services/api.js
const API_BASE_URL = 'https://api.ticketche.com/api/v1';

export const fetchAllPlaces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all_places`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};