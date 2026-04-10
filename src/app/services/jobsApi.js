// src/app/services/jobsApi.js
// Source de données unique pour les offres d'emploi
// Remplacer les fonctions par des appels API réels quand les endpoints seront disponibles

import jobsData from "@/data/jobs.json";

const MOCK_DELAY = 300; // simule la latence réseau

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Récupère toutes les offres d'emploi actives
 */
export async function fetchJobs() {
  await delay(MOCK_DELAY);
  return jobsData.jobs.filter((job) => job.status === "open");
}

/**
 * Récupère une offre par son slug ou son id
 */
export async function fetchJobBySlug(slug) {
  await delay(MOCK_DELAY);
  return jobsData.jobs.find((job) => job.slug === slug || job.id === slug) || null;
}

/**
 * Soumet une candidature (mock — à remplacer par l'API réelle)
 * @param {string} jobId - L'ID de l'offre
 * @param {FormData} formData - Les données du formulaire
 */
export async function submitApplication(jobId, formData) {
  await delay(800);
  // TODO: remplacer par fetch vers l'endpoint réel
  // const res = await fetch(`${API_BASE}/jobs/${jobId}/apply`, { method: 'POST', body: formData });
  // return res.json();
  
  console.log("Mock submitApplication:", { jobId, formData });
  return { success: true, message: "Candidature reçue avec succès" };
}