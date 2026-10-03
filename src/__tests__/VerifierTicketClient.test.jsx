import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerifierTicketClient from "@/app/verifier-ticket/VerifierTicketClient";
import * as api from "@/api/ticketApi";

jest.mock("@/api/ticketApi");

const REF = "TKEV-7K3M-Q9X2";

const item = (over = {}) => ({
  id: 1,
  reference: "ITEM-1",
  ticket_title: "Pass VIP",
  quantity: 1,
  status: "ISSUED",
  format_chosen: "PRESENTIEL",
  qr_data: "QR-PAYLOAD",
  can_request_replacement: false,
  pending_replacement: null,
  ...over,
});

const summary = (items, online_access = null) => ({
  reference: "RES-1",
  status: "PAID",
  event: {
    id: 1,
    title: "Concert Cotonou",
    start_date: "2026-12-01T18:00:00Z",
    end_date: null,
    format: "PRESENTIEL",
    location_name: "Stade de l'Amitié",
    cover_image_url: null,
  },
  items,
  online_access,
});

async function toCodeStep(user, reference = REF) {
  api.requestTicketCode.mockResolvedValue({
    destination: { channel: "email", masked: "a***@x.com" },
    expires_in: 600,
  });
  await user.type(screen.getByLabelText("Référence du ticket"), reference);
  await user.click(screen.getByRole("button", { name: "Recevoir mon code" }));
  await screen.findByLabelText("Code de vérification");
}

async function toResult(user, data) {
  await toCodeStep(user);
  api.confirmTicketCode.mockResolvedValue({ verification_token: "tok", expires_in: 900, reservation: data });
  await user.type(screen.getByLabelText("Code de vérification"), "123456");
  await user.click(screen.getByRole("button", { name: "Vérifier" }));
  await screen.findByText("Concert Cotonou");
}

beforeEach(() => jest.resetAllMocks());

describe("VerifierTicketClient", () => {
  it("runs the success flow and normalizes the reference", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toCodeStep(user, "tkev7k3mq9x2");
    expect(api.requestTicketCode).toHaveBeenCalledWith(REF, "email");
    expect(screen.getByText(/a\*\*\*@x\.com/)).toBeInTheDocument();

    api.confirmTicketCode.mockResolvedValue({
      verification_token: "tok",
      reservation: summary([item()]),
    });
    await user.type(screen.getByLabelText("Code de vérification"), "123456");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));
    expect(await screen.findByText("Concert Cotonou")).toBeInTheDocument();
    expect(api.confirmTicketCode).toHaveBeenCalledWith(REF, "123456");
    expect(screen.getByText("Valide")).toBeInTheDocument();
  });

  it("rejects an invalid check character without calling the API", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await user.type(screen.getByLabelText("Référence du ticket"), "TKEV-7K3M-Q9X3");
    await user.click(screen.getByRole("button", { name: "Recevoir mon code" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/erronée/);
    expect(api.requestTicketCode).not.toHaveBeenCalled();
  });

  it("shows an error for a wrong code (401)", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toCodeStep(user);
    api.confirmTicketCode.mockRejectedValue(Object.assign(new Error("x"), { status: 401 }));
    await user.type(screen.getByLabelText("Code de vérification"), "000000");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Code invalide ou expiré/);
  });

  it("shows a throttle message (429)", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    api.requestTicketCode.mockRejectedValue(Object.assign(new Error("x"), { status: 429 }));
    await user.type(screen.getByLabelText("Référence du ticket"), REF);
    await user.click(screen.getByRole("button", { name: "Recevoir mon code" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Trop de tentatives/);
  });

  it("shows an unknown reference message (404)", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    api.requestTicketCode.mockRejectedValue(Object.assign(new Error("x"), { status: 404 }));
    await user.type(screen.getByLabelText("Référence du ticket"), REF);
    await user.click(screen.getByRole("button", { name: "Recevoir mon code" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Aucun ticket/);
  });

  it("lets the user change the reference and disables resend during the countdown", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toCodeStep(user);
    expect(screen.getByRole("button", { name: /Renvoyer le code \(\d+ s\)/ })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Changer de référence" }));
    expect(screen.getByLabelText("Référence du ticket")).toBeInTheDocument();
  });

  it("shows the QR only for ISSUED non-online items with qr_data", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(
      user,
      summary([
        item({ id: 1, ticket_title: "Valide physique" }),
        item({ id: 2, ticket_title: "Utilisé", status: "SCANNED" }),
        item({ id: 3, ticket_title: "En ligne", format_chosen: "EN_LIGNE" }),
        item({ id: 4, ticket_title: "Sans QR", qr_data: null }),
      ]),
    );
    expect(screen.getAllByRole("button", { name: "Afficher mon QR" })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Afficher mon QR" }));
    expect(screen.getByRole("button", { name: "Agrandir" })).toBeInTheDocument();
  });

  it("disables the join button when online access is not available", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(
      user,
      summary([item({ format_chosen: "EN_LIGNE" })], {
        available: false,
        opens_at: "2026-12-01T17:00:00Z",
        online_link: null,
        access_code: null,
      }),
    );
    expect(screen.getByRole("button", { name: "Rejoindre l'événement" })).toBeDisabled();
    expect(screen.getByText(/Disponible à partir du/)).toBeInTheDocument();
  });

  it("shows the join link when online access is available", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(
      user,
      summary([item({ format_chosen: "EN_LIGNE" })], {
        available: true,
        opens_at: null,
        online_link: "https://meet.example/abc",
        access_code: "9988",
      }),
    );
    expect(screen.getByRole("link", { name: "Rejoindre l'événement" })).toHaveAttribute(
      "href",
      "https://meet.example/abc",
    );
  });

  it("sends a replacement request and shows the confirmation", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(user, summary([item({ can_request_replacement: true })]));
    api.requestTicketReplacement.mockResolvedValue({});
    await user.click(screen.getByRole("button", { name: "J'ai perdu mon ticket" }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Motif/), "Téléphone volé");
    await user.click(within(dialog).getByRole("button", { name: "Envoyer la demande" }));
    await waitFor(() =>
      expect(api.requestTicketReplacement).toHaveBeenCalledWith("tok", 1, "Téléphone volé"),
    );
    expect(await screen.findByText(/Votre demande a été envoyée à l'organisateur/)).toBeInTheDocument();
  });

  it("shows the pending replacement state", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(
      user,
      summary([
        item({ pending_replacement: { id: 9, status: "APPROVED", new_reference: "TKEV-2222-2222" } }),
      ]),
    );
    expect(screen.getByText(/Demande acceptée/)).toHaveTextContent("TKEV-2222-2222");
  });

  it("treats a boolean pending_replacement as a pending request", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(user, summary([item({ pending_replacement: true, can_request_replacement: false })]));
    expect(screen.getByText(/Demande de remplacement en attente/i)).toBeInTheDocument();
  });

  it("shows the reference that replaced a lost ticket", async () => {
    const user = userEvent.setup();
    render(<VerifierTicketClient />);
    await toResult(
      user,
      summary([item({ status: "LOST", can_request_replacement: false, replaced_by_reference: "TKBI-2222-2222" })]),
    );
    expect(screen.getByText(/remplacé par TKBI-2222-2222/)).toBeInTheDocument();
  });
});
