"use client";

import { useSyncExternalStore } from "react";

/**
 * Suivi des consultations pour le moteur de recommandation (POST /tracking/events).
 *
 * Rien n'est envoye ni stocke avant l'accord explicite du visiteur. Apres accord, les impressions,
 * clics et vues partent par lots (10 evenements, 15 s, ou a la mise en arriere-plan), comme dans l'app.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";
const GUEST_SESSION = process.env.NEXT_PUBLIC_RECO_GUEST_SESSION === "1";

const KEYS = { consent: "tk.consent", device: "tk.device", token: "tk.guest", session: "tk.session" };
const CONSENT_EVENT = "tk:consent";
const BATCH_SIZE = 10;
const FLUSH_DELAY = 15_000;

const storage = (kind) => {
  try {
    return window[kind];
  } catch {
    return null;
  }
};

const read = (key, kind = "localStorage") => storage(kind)?.getItem(key) ?? null;

const write = (key, value, kind = "localStorage") => {
  try {
    storage(kind)?.setItem(key, value);
  } catch {
    // Stockage refuse (navigation privee) : le suivi reste simplement inactif.
  }
};

const uuid = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

function persistentId(key, kind) {
  let id = read(key, kind);
  if (!id) {
    id = uuid();
    write(key, id, kind);
  }

  return id;
}

export const getConsent = () => (typeof window === "undefined" ? null : read(KEYS.consent));

export function setConsent(value) {
  write(KEYS.consent, value);
  if (value !== "granted") {
    queue.length = 0;
    try {
      storage("localStorage")?.removeItem(KEYS.token);
      storage("localStorage")?.removeItem(KEYS.device);
    } catch {
      // Rien a effacer.
    }
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

const subscribe = (callback) => {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

/** `undefined` pendant le rendu serveur, puis "granted", "denied" ou null (pas encore de choix). */
export const useConsent = () => useSyncExternalStore(subscribe, getConsent, () => undefined);

export const deviceId = () => persistentId(KEYS.device, "localStorage");

let tokenPromise = null;

/**
 * Jeton de session invite : c'est lui qui permet au moteur de personnaliser le classement.
 * Sans lui (option desactivee ou echec), les evenements restent anonymes et ne servent qu'aux mesures.
 */
export function guestToken() {
  if (!GUEST_SESSION || getConsent() !== "granted") return Promise.resolve(null);

  const stored = read(KEYS.token);
  if (stored) return Promise.resolve(stored);

  tokenPromise ??= fetch(`${API_URL}/guest/mobile-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_uuid: deviceId(), device_info: { platform: "web" } }),
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((payload) => {
      const token = payload?.data?.session_token ?? null;
      if (token) write(KEYS.token, token);

      return token;
    })
    .catch(() => null)
    .finally(() => {
      tokenPromise = null;
    });

  return tokenPromise;
}

const queue = [];
let timer = null;

async function flush() {
  clearTimeout(timer);
  timer = null;
  if (queue.length === 0 || getConsent() !== "granted") return;

  const token = await guestToken();
  // Sans jeton, l'API n'accepte que 20 evenements par lot.
  const events = queue.splice(0, token ? 100 : 20);

  fetch(`${API_URL}/tracking/events`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ events }),
  }).catch(() => {});
}

let listening = false;

function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}

/**
 * @param {"IMPRESSION"|"CLICK"|"VIEW"|"SEARCH"|"SHARE"} type
 * @param {{kind: string, id: string, reco?: object}} subject objet du catalogue, avec son contexte de recommandation
 * @param {{surface: string, seed?: {kind: string, id: string}, durationMs?: number}} context
 */
export function track(type, subject, { surface, seed, durationMs } = {}) {
  if (typeof window === "undefined" || getConsent() !== "granted" || !subject?.id) return;

  const metadata = {
    ...(seed && { seed_type: seed.kind.toUpperCase(), seed_id: seed.id }),
    ...(durationMs && { duration_ms: Math.round(durationMs) }),
  };

  queue.push({
    event_type: type,
    surface,
    subject_type: subject.kind.toUpperCase(),
    subject_id: subject.id,
    occurred_at: new Date().toISOString(),
    session_id: persistentId(KEYS.session, "sessionStorage"),
    device_id: deviceId(),
    ...(subject.reco?.position && { position: subject.reco.position }),
    ...(subject.reco?.requestId && {
      reco_request_id: subject.reco.requestId,
      reco_version: subject.reco.version,
      experiment_arm: subject.reco.arm,
    }),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  });

  listen();
  if (queue.length >= BATCH_SIZE) flush();
  else timer ??= setTimeout(flush, FLUSH_DELAY);
}

/** Fil « Pour vous » du visiteur : personnalise des qu'un jeton invite existe. Null si indisponible. */
export async function fetchPersonalFeed({ types = ["EVENT", "PLACE", "RESTAURANT"], limit = 12, position } = {}) {
  const token = await guestToken();
  if (!token) return null;

  const params = new URLSearchParams({ surface: "HOME", section: "FOR_YOU", limit: String(limit) });
  types.forEach((type) => params.append("types[]", type));
  params.set("device_id", deviceId());
  if (position) {
    params.set("latitude", String(position.lat));
    params.set("longitude", String(position.lng));
  }

  try {
    const response = await fetch(`${API_URL}/recommendations?${params}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    const payload = response.ok ? await response.json() : null;
    if (!payload?.enabled) return null;

    return {
      requestId: payload.reco_request_id,
      version: payload.reco_version,
      arm: payload.experiment_arm,
      items: payload.items.map((item) => ({
        kind: String(item.subject_type).toLowerCase(),
        id: item.subject_id,
        reason: item.reason,
        position: item.position,
      })),
    };
  } catch {
    return null;
  }
}

/** Classement « Près de vous » du moteur autour d'une position (rayon de 30 km). Liste d'identifiants, ou null. */
export async function fetchNearbyRanking(position, types = ["PLACE", "EVENT"]) {
  const params = new URLSearchParams({
    surface: "MAP",
    section: "NEARBY",
    limit: "50",
    latitude: String(position.lat),
    longitude: String(position.lng),
  });
  types.forEach((type) => params.append("types[]", type));

  try {
    const response = await fetch(`${API_URL}/recommendations?${params}`, { headers: { Accept: "application/json" } });
    const payload = response.ok ? await response.json() : null;

    return payload?.enabled ? payload.items.map((item) => item.subject_id) : null;
  } catch {
    return null;
  }
}
