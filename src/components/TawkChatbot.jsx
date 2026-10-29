import Script from "next/script";
import { TAWK_CHATBOT_SRC } from "@/config/chatbot";

/**
 * Widget de chat Tawk.to. Charge apres l'interactivite de la page (`lazyOnload`) : le chat n'a pas besoin
 * d'etre pret au premier rendu et ne doit pas retarder le contenu. Reprend l'amorce officielle de Tawk.to
 * (`Tawk_API`, `Tawk_LoadStart`, script asynchrone en UTF-8 et `crossorigin`).
 */
export function TawkChatbot() {
  return (
    <Script
      id="tawk-chatbot"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = ${JSON.stringify(TAWK_CHATBOT_SRC)};
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();`,
      }}
    />
  );
}
