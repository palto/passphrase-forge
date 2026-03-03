import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeneratorSettings } from "../password-generator";

vi.mock("server-only", () => ({}));

const STORE = "kissa-koira-lintu\nhevonen-kala-lintu\näiti-isä-tyttö";

const baseSettings: GeneratorSettings = {
  wordCount: 3,
  separator: "-",
  digits: 0,
  stripUmlauts: false,
};

function makeFetch(text: string) {
  return vi.fn().mockResolvedValue({ text: () => Promise.resolve(text) });
}

describe("getRandomPregenerated", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.PREGENERATED_PASSPHRASES_URL =
      "https://example.com/passphrases";
  });

  it("returns exactly count items", async () => {
    vi.stubGlobal("fetch", makeFetch(STORE));
    const { getRandomPregenerated } = await import("../pregenerated");
    const results = await getRandomPregenerated(5, baseSettings);
    expect(results).toHaveLength(5);
  });

  it("uses randomFn to select the passphrase index", async () => {
    vi.stubGlobal("fetch", makeFetch(STORE));
    const { getRandomPregenerated } = await import("../pregenerated");
    // STORE has 3 entries; returning 0.5 → Math.floor(0.5 * 3) = index 1
    const results = await getRandomPregenerated(1, baseSettings, () => 0.5);
    expect(results[0].passphrase).toBe("hevonen-kala-lintu");
  });
});
