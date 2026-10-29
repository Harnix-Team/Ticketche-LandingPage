// Widgets de chat disponibles : un seul est actif a la fois, choisi par NEXT_PUBLIC_CHATBOT_PROVIDER
// (fige au build, comme les autres NEXT_PUBLIC_*). Les identifiants ci-dessous sont publics, pas des secrets.

// Nixia : le script est servi par l'API du bot et ajoute lui-meme le bouton de discussion.
export const NIXIA_CHATBOT_SRC =
  "https://api.bot.nixia.app/api/v2/embed/nUQoX1yG6KW4625EiOI4qZULWfCfT5gx/chatbot.js";

// Tawk.to : identifiants de propriete et de widget.
export const TAWK_PROPERTY_ID = "684b6b404b5a53190afc5880";
export const TAWK_WIDGET_ID = "1itj9ltg3";
export const TAWK_CHATBOT_SRC = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;

export const CHATBOT_PROVIDERS = { NIXIA: "nixia", TAWK: "tawk", NONE: "none" };

/** Valeur absente ou inconnue : Nixia, le widget historique. `none` desactive tout widget. */
export function resolveChatbotProvider(value) {
  const provider = String(value ?? "").trim().toLowerCase();
  return Object.values(CHATBOT_PROVIDERS).includes(provider) ? provider : CHATBOT_PROVIDERS.NIXIA;
}
