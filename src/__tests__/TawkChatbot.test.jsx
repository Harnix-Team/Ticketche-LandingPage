import { render } from "@testing-library/react";
import { TawkChatbot } from "@/components/TawkChatbot";
import { TAWK_CHATBOT_SRC } from "@/config/chatbot";

const mockScript = jest.fn(() => null);
jest.mock("next/script", () => ({
  __esModule: true,
  default: (props) => mockScript(props),
}));

describe("TawkChatbot", () => {
  beforeEach(() => mockScript.mockClear());

  it("charge le widget apres l'interactivite de la page", () => {
    render(<TawkChatbot />);
    expect(mockScript).toHaveBeenCalledWith(
      expect.objectContaining({ id: "tawk-chatbot", strategy: "lazyOnload" }),
    );
  });

  it("injecte le script Tawk.to de la propriete en HTTPS", () => {
    render(<TawkChatbot />);
    const { dangerouslySetInnerHTML } = mockScript.mock.calls[0][0];
    expect(dangerouslySetInnerHTML.__html).toContain(JSON.stringify(TAWK_CHATBOT_SRC));
    expect(TAWK_CHATBOT_SRC).toMatch(/^https:\/\/embed\.tawk\.to\/[a-f0-9]+\/[a-z0-9]+$/);
  });
});
