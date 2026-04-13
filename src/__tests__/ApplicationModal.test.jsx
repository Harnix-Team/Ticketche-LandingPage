import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock submitApplication before importing the component
const mockSubmitApplication = jest.fn();
jest.mock("@/app/services/jobsApi", () => ({
  submitApplication: (...args) => mockSubmitApplication(...args),
}));

import { ApplicationModal } from "@/components/recrutement/ApplicationModal";

const JOB = {
  id: "TCK-001",
  job_title: "Dev Senior",
  department: "Technologie",
  location: { city: "Cotonou" },
};

const SPONTANEOUS_JOB = {
  id: null,
  job_title: "Candidature spontanée",
  department: "Ticketché",
  location: { city: "Cotonou" },
};

function renderModal(job = JOB, onClose = jest.fn()) {
  return render(<ApplicationModal job={job} onClose={onClose} />);
}

// Suppress jsdom CSS parsing noise — these are harmless warnings from in-component <style> tags
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (typeof msg === "string" && msg.includes("Could not parse CSS")) return;
    console.warn(msg);
  });
});

afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  mockSubmitApplication.mockReset();
});

describe("ApplicationModal — rendu", () => {
  it("affiche le titre du poste dans l'en-tête", () => {
    renderModal();
    expect(screen.getByText(/Postuler — Dev Senior/i)).toBeInTheDocument();
  });

  it("affiche le département et la ville", () => {
    renderModal();
    expect(screen.getByText(/Technologie · Cotonou/i)).toBeInTheDocument();
  });
});

describe("ApplicationModal — validation", () => {
  it("affiche des messages d'erreur si on soumet le formulaire vide", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: /Envoyer ma candidature/i }));
    const errors = await screen.findAllByText("Requis");
    expect(errors.length).toBeGreaterThanOrEqual(2); // prénom + nom au minimum
  });

  it("valide le format email", async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("jean@email.com"), "invalid-email");
    await userEvent.click(screen.getByRole("button", { name: /Envoyer ma candidature/i }));
    expect(await screen.findByText("Email invalide")).toBeInTheDocument();
  });

  it("valide le format téléphone béninois", async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("+229 01 XXXXXXXX"), "0600000000");
    await userEvent.click(screen.getByRole("button", { name: /Envoyer ma candidature/i }));
    expect(await screen.findByText("Format requis : +229 01XXXXXXXX")).toBeInTheDocument();
  });

  it("refuse un fichier CV trop lourd (> 10 Mo)", async () => {
    renderModal();
    const bigFile = new File(["x"], "gros.pdf", { type: "application/pdf" });
    Object.defineProperty(bigFile, "size", { value: 11 * 1024 * 1024 });
    const inputs = document.querySelectorAll('input[type="file"]');
    fireEvent.change(inputs[0], { target: { files: [bigFile] } });
    expect(await screen.findByText("Fichier trop lourd (max 10 Mo)")).toBeInTheDocument();
  });
});

describe("ApplicationModal — soumission", () => {
  beforeEach(() => {
    mockSubmitApplication.mockResolvedValue({ success: true, message: "Candidature reçue avec succès" });
  });

  async function fillAndSubmit(container) {
    await userEvent.type(screen.getByPlaceholderText("Jean"), "Jean");
    await userEvent.type(screen.getByPlaceholderText("Ahouansou"), "Dupont");
    await userEvent.type(screen.getByPlaceholderText("jean@email.com"), "jean@test.com");
    await userEvent.type(screen.getByPlaceholderText("+229 01 XXXXXXXX"), "+2290112345678");

    const cvInput = container.querySelectorAll('input[type="file"]')[0];
    const file = new File(["content"], "cv.pdf", { type: "application/pdf" });
    fireEvent.change(cvInput, { target: { files: [file] } });

    await userEvent.click(screen.getByRole("button", { name: /Envoyer ma candidature/i }));
  }

  it("appelle submitApplication avec les bons champs backend", async () => {
    const { container } = renderModal();
    await fillAndSubmit(container);

    await waitFor(() => expect(mockSubmitApplication).toHaveBeenCalled());

    const fd = mockSubmitApplication.mock.calls[0][1];
    expect(fd.get("first_name")).toBe("Jean");
    expect(fd.get("last_name")).toBe("Dupont");
    expect(fd.get("job_id")).toBe("TCK-001");
    expect(fd.get("job_title")).toBe("Dev Senior");
    expect(fd.get("cv")).toBeTruthy();
  });

  it("affiche l'écran de succès après envoi réussi", async () => {
    const { container } = renderModal();
    await fillAndSubmit(container);
    expect(await screen.findByText("Candidature envoyée !")).toBeInTheDocument();
  });

  it("affiche l'erreur si submitApplication lève une exception", async () => {
    mockSubmitApplication.mockRejectedValueOnce(new Error("Erreur serveur"));
    const { container } = renderModal();
    await fillAndSubmit(container);
    expect(await screen.findByText("Une erreur est survenue. Réessayez.")).toBeInTheDocument();
  });

  it("envoie job_id 'spontaneous' et job_title 'Candidature spontanée' pour une cand. spontanée", async () => {
    const { container } = renderModal(SPONTANEOUS_JOB);
    await fillAndSubmit(container);

    await waitFor(() => expect(mockSubmitApplication).toHaveBeenCalled());
    const fd = mockSubmitApplication.mock.calls[0][1];
    expect(fd.get("job_id")).toBe("spontaneous");
    expect(fd.get("job_title")).toBe("Candidature spontanée");
  });
});
