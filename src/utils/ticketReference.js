const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

const LEGACY_PREFIXES = ["EVTKT-", "ITEM-", "EVT-", "TKP-", "TCKT-"];
const NEW_COMPACT = new RegExp(`^TK[A-Z]{2}[${ALPHABET}]{8}$`);

/** Check character: sum(index * 1-based position) of the 7 random chars, mod 30. */
export function computeCheckChar(random7) {
  let sum = 0;
  for (let i = 0; i < random7.length; i++) {
    const idx = ALPHABET.indexOf(random7[i]);
    if (idx < 0) return null;
    sum += idx * (i + 1);
  }
  return ALPHABET[sum % ALPHABET.length];
}

export function isLegacyReference(ref) {
  return LEGACY_PREFIXES.some((p) => ref.startsWith(p)) && ref.length > 6;
}

/** Trim, uppercase, strip spaces and restore dashes of the new format. */
export function normalizeReference(input) {
  const cleaned = String(input ?? "").trim().toUpperCase().replace(/\s+/g, "");
  if (isLegacyReference(cleaned)) return cleaned;
  const compact = cleaned.replace(/-/g, "");
  if (NEW_COMPACT.test(compact)) {
    return `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8)}`;
  }
  return cleaned;
}

/** Validates a normalized reference locally. Returns { valid, reason }. */
export function validateReference(ref) {
  if (!ref) return { valid: false, reason: "empty" };
  if (isLegacyReference(ref)) return { valid: true };
  const m = /^TK[A-Z]{2}-([A-Z0-9]{4})-([A-Z0-9]{4})$/.exec(ref);
  if (!m) return { valid: false, reason: "format" };
  const body = m[1] + m[2];
  if (![...body].every((c) => ALPHABET.includes(c))) {
    return { valid: false, reason: "format" };
  }
  if (computeCheckChar(body.slice(0, 7)) !== body[7]) {
    return { valid: false, reason: "checksum" };
  }
  return { valid: true };
}
