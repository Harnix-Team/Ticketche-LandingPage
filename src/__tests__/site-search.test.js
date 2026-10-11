import { fold, searchEntries } from "@/lib/site-search";

const ENTRIES = [
  { id: "events", title: "Événements", keywords: "concert festival billet" },
  { id: "contact", title: "Contact", keywords: "joindre ecrire message" },
  { id: "pay", title: "Quels moyens de paiement sont acceptés ?", detail: "Le Mobile Money et le portefeuille Ticketché." },
  { id: "free", title: "L’application est-elle gratuite ?", detail: "Oui. Elle se télécharge gratuitement." },
];

const ids = (query, limit) => searchEntries(ENTRIES, query, limit).map((entry) => entry.id);

describe("fold", () => {
  it("retire les accents, la casse et la ponctuation", () => {
    expect(fold("  Événements : L’été ! ")).toBe("evenements l ete");
  });
});

describe("searchEntries", () => {
  it("trouve un titre sans tenir compte des accents", () => {
    expect(ids("evenement")).toEqual(["events"]);
  });

  it("trouve une page par ses mots-clés", () => {
    expect(ids("concert")).toEqual(["events"]);
  });

  it("trouve une question par le texte de sa réponse", () => {
    expect(ids("mobile money")).toEqual(["pay"]);
  });

  it("exige tous les mots de la requête", () => {
    expect(ids("paiement concert")).toEqual([]);
  });

  it("classe le titre avant le texte", () => {
    expect(ids("gratuit")).toEqual(["free"]);
    expect(ids("application")).toEqual(["free"]);
  });

  it("ignore les requêtes trop courtes au milieu d'un mot ou dans le texte long", () => {
    expect(ids("le")).toEqual([]);
  });

  it("respecte la limite et renvoie une liste vide sans requête", () => {
    expect(ids("e", 1)).toHaveLength(1);
    expect(ids("   ")).toEqual([]);
  });
});
