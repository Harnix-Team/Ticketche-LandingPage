import Script from "next/script";
import { NIXIA_CHATBOT_SRC } from "@/config/chatbot";

/**
 * Widget de chat Nixia. Charge apres l'interactivite de la page (`lazyOnload`) : le chat n'a pas besoin
 * d'etre pret au premier rendu et ne doit pas retarder le contenu.
 */
export function NixiaChatbot() {
  return <Script id="nixia-chatbot" src={NIXIA_CHATBOT_SRC} strategy="lazyOnload" />;
}
