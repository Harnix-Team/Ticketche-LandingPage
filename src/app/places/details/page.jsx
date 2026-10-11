import { permanentRedirect, redirect } from "next/navigation";
import { getPlace } from "@/lib/api";
import { placePath } from "@/lib/paths";

/**
 * Ancienne adresse d'un lieu : `/places/details?placeId=<uuid>`.
 *
 * Elle circule dans les liens partages depuis l'application et reste le lien universel reconnu par
 * l'app (apple-app-site-association). Sur le web, elle redirige vers l'adresse lisible `/places/<nom>-<uuid>/`.
 */
export const dynamic = "force-dynamic";

export default async function LegacyPlaceDetailsPage({ searchParams }) {
  const params = await searchParams;
  const placeId = typeof params?.placeId === "string" ? params.placeId : null;
  if (!placeId) redirect("/establishments/");

  const place = await getPlace(placeId);
  if (!place?.id) redirect("/establishments/");

  permanentRedirect(placePath(place));
}
