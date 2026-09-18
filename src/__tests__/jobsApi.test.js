import {
  fetchJobs,
  fetchJobBySlug,
  submitApplication,
  formatSalaryText,
} from "@/app/services/jobsApi";

const OPEN_JOB = {
  id: "TCK-001",
  slug: "dev-senior",
  job_title: "Dev Senior",
  department: "Tech",
  status: "open",
};

const CLOSED_JOB = {
  id: "TCK-002",
  slug: "dev-junior",
  job_title: "Dev Junior",
  department: "Tech",
  status: "closed",
};

const API_RESPONSE = { success: true, data: [OPEN_JOB, CLOSED_JOB] };

afterEach(() => {
  jest.restoreAllMocks();
});

describe("fetchJobs", () => {
  it("retourne uniquement les offres avec status 'open'", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => API_RESPONSE,
    });

    const jobs = await fetchJobs();

    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe("TCK-001");
    expect(jobs[0].status).toBe("open");
  });

  it("appelle le bon endpoint /jobs", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => API_RESPONSE,
    });

    await fetchJobs();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/jobs")
    );
  });

  it("lève une erreur si la réponse n'est pas ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(fetchJobs()).rejects.toThrow("Erreur réseau : 500");
  });

  it("retourne un tableau vide si data est absent dans la réponse", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const jobs = await fetchJobs();

    expect(jobs).toEqual([]);
  });
});

describe("fetchJobBySlug", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => API_RESPONSE,
    });
  });

  it("retourne l'offre correspondant au slug", async () => {
    const job = await fetchJobBySlug("dev-senior");
    expect(job).not.toBeNull();
    expect(job.slug).toBe("dev-senior");
  });

  it("retourne null si aucune offre ne correspond", async () => {
    const job = await fetchJobBySlug("inconnu");
    expect(job).toBeNull();
  });

  it("ne retourne pas les offres fermées même si le slug correspond", async () => {
    const job = await fetchJobBySlug("dev-junior");
    expect(job).toBeNull();
  });
});

describe("submitApplication", () => {
  it("envoie les données en POST et retourne la réponse JSON", async () => {
    const mockResponse = { success: true, message: "Candidature reçue" };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const fd = new FormData();
    fd.append("first_name", "Jean");
    const result = await submitApplication("TCK-001", fd);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/jobs/apply"),
      expect.objectContaining({ method: "POST", body: fd })
    );
  });

  it("lève une erreur avec le message du backend si la réponse n'est pas ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: "Validation error." }),
    });

    await expect(submitApplication("TCK-001", new FormData())).rejects.toThrow(
      "Validation error."
    );
  });

  it("lève une erreur générique si le backend n'envoie pas de message", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(submitApplication(null, new FormData())).rejects.toThrow(
      "Erreur serveur : 500"
    );
  });
});

describe("formatSalaryText", () => {
  it("affiche une fourchette min - max", () => {
    const text = formatSalaryText(
      { displayed: true, min: 30000, max: 80000, currency: "XOF", period: "mensuel" },
      "Selon profil"
    );
    expect(text).toBe("30,000 - 80,000 XOF/mensuel");
  });

  it("affiche uniquement min quand max est null (remuneration fixe)", () => {
    const text = formatSalaryText(
      { displayed: true, min: 1000, max: null, currency: "XOF", period: "journalier" },
      "Selon profil"
    );
    expect(text).toBe("1,000 XOF/journalier");
  });

  it("affiche uniquement max quand min est null", () => {
    const text = formatSalaryText(
      { displayed: true, min: null, max: 50000, currency: "XOF", period: "mensuel" },
      "Selon profil"
    );
    expect(text).toBe("50,000 XOF/mensuel");
  });

  it("retourne le fallback quand displayed est false", () => {
    const text = formatSalaryText(
      { displayed: false, min: null, max: null, currency: "XOF", period: "mensuel" },
      "Selon profil"
    );
    expect(text).toBe("Selon profil");
  });

  it("retourne le fallback quand displayed est true mais min et max sont null", () => {
    const text = formatSalaryText(
      { displayed: true, min: null, max: null, currency: "XOF", period: "mensuel" },
      "Selon profil"
    );
    expect(text).toBe("Selon profil");
  });
});
