// src/app/services/jobsApi.js
// Source de données unique pour les offres d'emploi

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";

/**
 * Récupère toutes les offres d'emploi actives depuis le backend.
 * @returns {Promise<Array>}
 */
export async function fetchJobs() {
  const res = await fetch(`${API_URL}/jobs`);
  if (!res.ok) throw new Error(`Erreur réseau : ${res.status}`);
  const json = await res.json();
  const jobs = json.data ?? [];
  return jobs.filter((job) => job.status === "open");
}

/**
 * Récupère une offre par son slug en filtrant la liste complète.
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function fetchJobBySlug(slug) {
  const jobs = await fetchJobs();
  return jobs.find((job) => job.slug === slug || job.id === slug) ?? null;
}

/**
 * Soumet une candidature au backend.
 * @param {FormData} formData - Les données du formulaire (champs backend)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitApplication(_jobId, formData) {
  const res = await fetch(`${API_URL}/jobs/apply`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    const message =
      json.message || `Erreur serveur : ${res.status}`;
    throw new Error(message);
  }

  return json;
}
