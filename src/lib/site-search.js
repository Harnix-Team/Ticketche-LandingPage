/** Minuscules sans accents ni ponctuation : « Événements » et « evenements » se valent. */
export const fold = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const startsWord = (text, word) => text.split(" ").some((part) => part.startsWith(word));

function score(entry, words) {
  const title = fold(entry.title);
  const keywords = fold(entry.keywords);
  const detail = fold(entry.detail);
  let total = 0;

  for (const word of words) {
    if (title.startsWith(word)) total += 6;
    else if (startsWord(title, word)) total += 4;
    else if (startsWord(keywords, word)) total += 2;
    // Au milieu d'un mot ou dans le texte long, une requete trop courte (« le », « de ») se retrouverait partout.
    else if (word.length >= 3 && title.includes(word)) total += 3;
    else if (word.length >= 3 && detail.includes(word)) total += 1;
    else return 0;
  }

  return total;
}

/**
 * Recherche dans les contenus du site (pages, questions, contacts, offres). Chaque mot de la requete doit se
 * retrouver dans l'entree `{ title, detail, keywords }` ; le titre pese plus que les mots-cles et le texte.
 */
export function searchEntries(entries, query, limit = 4) {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];

  return entries
    .map((entry) => ({ entry, total: score(entry, words) }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
