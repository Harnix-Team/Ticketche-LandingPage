import { CHATBOT_PROVIDERS, resolveChatbotProvider } from "@/config/chatbot";
import { NixiaChatbot } from "@/components/NixiaChatbot";
import { TawkChatbot } from "@/components/TawkChatbot";

/** Monte le widget de chat choisi par NEXT_PUBLIC_CHATBOT_PROVIDER (un seul a la fois). */
export function Chatbot({ provider = process.env.NEXT_PUBLIC_CHATBOT_PROVIDER }) {
  switch (resolveChatbotProvider(provider)) {
    case CHATBOT_PROVIDERS.TAWK:
      return <TawkChatbot />;
    case CHATBOT_PROVIDERS.NONE:
      return null;
    default:
      return <NixiaChatbot />;
  }
}
