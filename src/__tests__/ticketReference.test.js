import {
  computeCheckChar,
  normalizeReference,
  validateReference,
} from "@/utils/ticketReference";

describe("computeCheckChar", () => {
  it.each([
    ["7K3MQ9X", "2"],
    ["2222222", "2"],
    ["ABCDEFG", "8"],
    ["3456789", "P"],
  ])("%s -> %s", (random, check) => {
    expect(computeCheckChar(random)).toBe(check);
  });

  it("returns null for characters outside the alphabet", () => {
    expect(computeCheckChar("0000000")).toBeNull();
  });
});

describe("normalizeReference", () => {
  it("restores dashes and uppercases", () => {
    expect(normalizeReference(" tkev7k3mq9x2 ")).toBe("TKEV-7K3M-Q9X2");
    expect(normalizeReference("tkev 7k3m q9x2")).toBe("TKEV-7K3M-Q9X2");
    expect(normalizeReference("TKEV-7K3M-Q9X2")).toBe("TKEV-7K3M-Q9X2");
  });

  it("keeps legacy references untouched", () => {
    expect(normalizeReference("evt-ab12-cd34")).toBe("EVT-AB12-CD34");
    expect(normalizeReference("tkp-12345")).toBe("TKP-12345");
    expect(normalizeReference("item-99")).toBe("ITEM-99");
  });
});

describe("validateReference", () => {
  it("accepts valid new-format references", () => {
    ["TKEV-7K3M-Q9X2", "TKEV-2222-2222", "TKAB-ABCD-EFG8", "TKEV-3456-789P"].forEach(
      (r) => expect(validateReference(r).valid).toBe(true),
    );
  });

  it("rejects a wrong check character", () => {
    expect(validateReference("TKEV-7K3M-Q9X3")).toEqual({ valid: false, reason: "checksum" });
  });

  it("rejects malformed values", () => {
    expect(validateReference("TKEV-7K3M").valid).toBe(false);
    expect(validateReference("hello").reason).toBe("format");
    expect(validateReference("").reason).toBe("empty");
  });

  it("accepts legacy references", () => {
    ["EVTKT-123", "ITEM-42", "EVT-AB12-CD34", "TKP-777", "TCKT-1A2B"].forEach((r) =>
      expect(validateReference(r).valid).toBe(true),
    );
  });
});
