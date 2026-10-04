import { render } from "@testing-library/react";
import { NixiaChatbot } from "@/components/NixiaChatbot";
import { NIXIA_CHATBOT_SRC } from "@/config/chatbot";

const mockScript = jest.fn(() => null);
jest.mock("next/script", () => ({
  __esModule: true,
  default: (props) => mockScript(props),
}));

describe("NixiaChatbot", () => {
  beforeEach(() => mockScript.mockClear());

  it("charge le script du widget apres l'interactivite de la page", () => {
    render(<NixiaChatbot />);
    expect(mockScript).toHaveBeenCalledWith(
      expect.objectContaining({ id: "nixia-chatbot", src: NIXIA_CHATBOT_SRC, strategy: "lazyOnload" }),
    );
  });

  it("pointe vers l'API du bot Nixia en HTTPS", () => {
    expect(NIXIA_CHATBOT_SRC).toMatch(/^https:\/\/api\.bot\.nixia\.app\/api\/v2\/embed\/[A-Za-z0-9]+\/chatbot\.js$/);
  });
});
