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
 * Formate le texte de rémunération d'une offre, en gérant les cas où
 * min et/ou max sont absents (rémunération fixe ou non renseignée).
 * @param {{displayed: boolean, min: number|null, max: number|null, currency: string, period: string}} remuneration
 * @param {string} fallback - Texte affiché quand la rémunération n'est pas affichable
 * @returns {string}
 */
export function formatSalaryText(remuneration, fallback) {
  const { displayed, min, max, currency, period } = remuneration;

  if (!displayed || (min == null && max == null)) {
    return fallback;
  }

  if (min != null && max != null && min !== max) {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}/${period}`;
  }

  return `${(min ?? max).toLocaleString()} ${currency}/${period}`;
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
