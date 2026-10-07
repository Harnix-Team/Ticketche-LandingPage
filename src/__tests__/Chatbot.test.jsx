import { render } from "@testing-library/react";
import { Chatbot } from "@/components/Chatbot";
import { resolveChatbotProvider } from "@/config/chatbot";

jest.mock("@/components/NixiaChatbot", () => ({ NixiaChatbot: () => <div data-testid="nixia" /> }));
jest.mock("@/components/TawkChatbot", () => ({ TawkChatbot: () => <div data-testid="tawk" /> }));

describe("Chatbot", () => {
  it("monte Nixia par defaut", () => {
    const { queryByTestId } = render(<Chatbot provider={undefined} />);
    expect(queryByTestId("nixia")).not.toBeNull();
    expect(queryByTestId("tawk")).toBeNull();
  });

  it("monte uniquement Tawk quand il est choisi", () => {
    const { queryByTestId } = render(<Chatbot provider="tawk" />);
    expect(queryByTestId("tawk")).not.toBeNull();
    expect(queryByTestId("nixia")).toBeNull();
  });

  it("ne monte aucun widget avec none", () => {
    const { queryByTestId } = render(<Chatbot provider="none" />);
    expect(queryByTestId("nixia")).toBeNull();
    expect(queryByTestId("tawk")).toBeNull();
  });

  it("retombe sur Nixia pour une valeur inconnue et ignore la casse", () => {
    expect(resolveChatbotProvider("inconnu")).toBe("nixia");
    expect(resolveChatbotProvider(" TAWK ")).toBe("tawk");
  });
});
