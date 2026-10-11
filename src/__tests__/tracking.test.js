/** @jest-environment jsdom */
import { getConsent, setConsent, track } from "@/lib/tracking";

const subject = { kind: "place", id: "01a11f72-c2d3-7116-90c1-1ba6e06492d7", reco: { position: 2, requestId: "req", version: "rules-v2", arm: "TREATMENT" } };

describe("suivi des consultations", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });

  it("n'envoie et ne stocke rien sans accord du visiteur", () => {
    for (let index = 0; index < 12; index += 1) track("CLICK", subject, { surface: "HOME" });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(localStorage.getItem("tk.device")).toBeNull();
  });

  it("envoie un lot complet après accord, avec le contexte de recommandation", async () => {
    setConsent("granted");
    for (let index = 0; index < 10; index += 1) track("CLICK", subject, { surface: "RELATED", seed: { kind: "event", id: "seed-id" } });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const call = global.fetch.mock.calls.find(([url]) => url.endsWith("/tracking/events"));
    const { events } = JSON.parse(call[1].body);

    expect(events).toHaveLength(10);
    expect(events[0]).toMatchObject({
      event_type: "CLICK",
      surface: "RELATED",
      subject_type: "PLACE",
      subject_id: subject.id,
      position: 2,
      reco_request_id: "req",
      metadata: { seed_type: "EVENT", seed_id: "seed-id" },
    });
    expect(events[0].device_id).toBe(localStorage.getItem("tk.device"));
  });

  it("efface l'identifiant de l'appareil quand le visiteur retire son accord", () => {
    setConsent("granted");
    track("CLICK", subject, { surface: "HOME" });
    expect(localStorage.getItem("tk.device")).not.toBeNull();

    setConsent("denied");

    expect(getConsent()).toBe("denied");
    expect(localStorage.getItem("tk.device")).toBeNull();
  });
});
