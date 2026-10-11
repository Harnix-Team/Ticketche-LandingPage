/** Parametres d'URL reduits a des chaines simples (un parametre repete ne garde que sa premiere valeur). */
export async function readParams(searchParams, keys) {
  const raw = (await searchParams) ?? {};
  const params = {};
  for (const key of keys) {
    const value = Array.isArray(raw[key]) ? raw[key][0] : raw[key];
    if (typeof value === "string" && value.trim() !== "") params[key] = value.trim().slice(0, 80);
  }

  return params;
}

const fold = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Recherche simple, insensible aux accents, sur quelques champs. */
export const matches = (term, ...fields) => {
  const needle = fold(term);

  return needle === "" || fields.some((field) => fold(field).includes(needle));
};

/** Place en tete les objets classes par le moteur de recommandation, dans son ordre ; le reste suit, inchange. */
export function rankWith(items, reco) {
  if (!reco?.items?.length) return items;
  const rank = new Map(reco.items.map((entry, index) => [entry.id, { index, entry }]));

  return [...items]
    .map((item) => {
      const ranked = rank.get(item.id);

      return ranked
        ? { ...item, reco: { reason: ranked.entry.reason, position: ranked.entry.position, requestId: reco.requestId, version: reco.version, arm: reco.arm } }
        : item;
    })
    .sort((a, b) => (rank.get(a.id)?.index ?? Infinity) - (rank.get(b.id)?.index ?? Infinity));
}
