import { describe, it, expect } from "vitest";
import { PregeneratedPasshpraseSource } from "../pregenerated-source";
import { GeneratorSettings } from "../password-generator";

const baseSettings: GeneratorSettings = {
  wordCount: 3,
  separator: "-",
  digits: 0,
  stripUmlauts: false,
};

describe("PregeneratedPasshpraseSource", () => {
  describe("count", () => {
    it("returns the number of non-empty lines", () => {
      const source = new PregeneratedPasshpraseSource(
        "kissa-koira-lintu\nhevonen-kala-lintu\näiti-isä-tyttö",
      );
      expect(source.count).toBe(3);
    });
  });

  describe("parsePasshpraseDetails", () => {
    it("joins words with the settings separator", () => {
      const source = new PregeneratedPasshpraseSource("kissa-koira-lintu");
      const result = source.parsePasshpraseDetails("kissa-koira-lintu", {
        ...baseSettings,
        separator: "_",
      });
      expect(result.passphrase).toBe("kissa_koira_lintu");
      expect(result.separator).toBe("_");
    });

    it("strips umlauts when stripUmlauts is true", () => {
      const source = new PregeneratedPasshpraseSource("äiti-pöytä-yö");
      const result = source.parsePasshpraseDetails("äiti-pöytä-yö", {
        ...baseSettings,
        stripUmlauts: true,
      });
      expect(result.passphrase).not.toMatch(/[äöÄÖ]/);
      expect(result.passphrase).toBe("aiti-poyta-yo");
    });

    it("preserves umlauts when stripUmlauts is false", () => {
      const source = new PregeneratedPasshpraseSource("äiti-pöytä-yö");
      const result = source.parsePasshpraseDetails("äiti-pöytä-yö", {
        ...baseSettings,
        stripUmlauts: false,
      });
      expect(result.passphrase).toBe("äiti-pöytä-yö");
    });

    it("parts contains the original dash-split words before separator substitution", () => {
      const source = new PregeneratedPasshpraseSource("kissa-koira-lintu");
      const result = source.parsePasshpraseDetails("kissa-koira-lintu", {
        ...baseSettings,
        separator: ".",
      });
      expect(result.parts).toEqual(["kissa", "koira", "lintu"]);
    });
  });

  describe("getPasshrase", () => {
    it("retrieves the passphrase at the given index", () => {
      const source = new PregeneratedPasshpraseSource(
        "kissa-koira-lintu\nhevonen-kala-lintu\näiti-isä-tyttö",
      );
      const result = source.getPasshrase(1, baseSettings);
      expect(result.passphrase).toBe("hevonen-kala-lintu");
    });
  });

  describe("constructor", () => {
    it("filters out empty and whitespace-only lines", () => {
      const source = new PregeneratedPasshpraseSource(
        "kissa-koira-lintu\n\n   \nhevonen-kala-lintu\n",
      );
      expect(source.count).toBe(2);
    });
  });
});
