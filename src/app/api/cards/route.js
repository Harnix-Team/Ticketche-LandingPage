import { getCatalog } from "@/lib/api";
import { toCard } from "@/lib/cards";
import { indexCatalog } from "@/lib/reco";

const MAX_IDS = 30;
const KEY_PATTERN = /^(place|event|restaurant):[0-9a-f-]{36}$/i;

/**
 * Cartes du catalogue par identifiant, pour hydrater un fil recommande recu cote navigateur.
 * Servies depuis le cache du serveur : aucun appel a l'API, et seuls les champs d'une carte sortent.
 */
export async function GET(request) {
  const keys = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .filter((key) => KEY_PATTERN.test(key))
    .slice(0, MAX_IDS);

  if (keys.length === 0) return Response.json({ items: [] });

  const now = new Date();
  const catalog = await getCatalog();
  const index = indexCatalog(catalog);
  const items = keys.map((key) => index.get(key.toLowerCase())).filter(Boolean).map((item) => toCard(item, now));

  return Response.json({ items }, { headers: { "Cache-Control": "private, max-age=60" } });
}
