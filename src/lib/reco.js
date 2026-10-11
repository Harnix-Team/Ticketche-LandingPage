/** Index `kind:id` du catalogue : les recommandations ne portent que des identifiants. */
export function indexCatalog({ places = [], events = [], restaurants = [] }) {
  const index = new Map();
  for (const item of [...places, ...events, ...restaurants]) index.set(`${item.kind}:${item.id}`, item);

  return index;
}

/**
 * Remplace les identifiants d'une liste recommandee par les objets du catalogue.
 * Un objet absent du catalogue (depublie entre-temps) est ignore.
 */
export function hydrateReco(reco, index, limit = Infinity) {
  if (!reco?.items?.length) return [];

  return reco.items
    .map((entry) => {
      const item = index.get(`${entry.kind}:${entry.id}`);

      return item
        ? {
            ...item,
            reco: {
              reason: entry.reason,
              position: entry.position,
              requestId: reco.requestId,
              version: reco.version,
              arm: reco.arm,
            },
          }
        : null;
    })
    .filter(Boolean)
    .slice(0, limit);
}
