import { describe, it, expect, beforeEach } from "vitest";
import {
  PasswordGenerator,
  GeneratorSettings,
  defaultGeneratorSettings,
} from "../password-generator";
import { ArrayWordSource } from "../word-source";

describe("PasswordGenerator", () => {
  const mockWordList = ["kissa", "koira", "hevonen", "lintu", "kala"];
  const mockWordListWithUmlauts = ["äiti", "isä", "pöytä", "löytää", "yö"];

  describe("constructor", () => {
    it("should initialize with a valid word source", () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      expect(generator).toBeInstanceOf(PasswordGenerator);
    });

    it("should initialize with an empty word source", () => {
      const wordSource = new ArrayWordSource([]);
      const generator = new PasswordGenerator(wordSource);
      expect(generator).toBeInstanceOf(PasswordGenerator);
    });

    it("should handle a large word list", () => {
      const largeWordList = Array.from({ length: 10000 }, (_, i) => `word${i}`);
      const wordSource = new ArrayWordSource(largeWordList);
      const generator = new PasswordGenerator(wordSource);
      expect(generator).toBeInstanceOf(PasswordGenerator);
    });
  });

  describe("getRandomWord()", () => {
    it("should return a word from the word list", async () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      const word = await generator.getRandomWord();
      expect(mockWordList).toContain(word);
    });

    it("should return different words on multiple calls (with high probability)", async () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      const words = new Set();

      // Call multiple times to get different words
      for (let i = 0; i < 20; i++) {
        words.add(await generator.getRandomWord());
      }

      // With 5 words and 20 calls, we should get at least 3 different words
      expect(words.size).toBeGreaterThanOrEqual(3);
    });

    it("should handle empty word list gracefully", async () => {
      const wordSource = new ArrayWordSource([]);
      const generator = new PasswordGenerator(wordSource);
      await expect(generator.getRandomWord()).rejects.toThrow();
    });
  });

  describe("generate() and generateDetails()", () => {
    let generator: PasswordGenerator;

    beforeEach(() => {
      const wordSource = new ArrayWordSource(mockWordList);
      generator = new PasswordGenerator(wordSource);
    });

    it("should generate passphrase with default settings", async () => {
      const passphrase = await generator.generate();
      const parts = passphrase.split("-");

      // Default: 3 words + 1 number group
      expect(parts.length).toBe(4);
      expect(parts.filter((part) => /^\d+$/.test(part)).length).toBe(1);
    });

    it("should generate passphrase with custom word count", async () => {
      const settings: Partial<GeneratorSettings> = { wordCount: 5 };
      const details = await generator.generateDetails(settings);

      // 5 words + 1 number (default)
      expect(details.parts.length).toBe(6);
    });

    it("should generate passphrase with no numbers", async () => {
      const settings: Partial<GeneratorSettings> = { digits: 0 };
      const details = await generator.generateDetails(settings);

      expect(details.parts.length).toBe(3); // Default 3 words
      expect(details.parts.every((part) => !/^\d+$/.test(part))).toBe(true);
    });

    it("should generate passphrase with multiple numbers", async () => {
      const settings: Partial<GeneratorSettings> = { digits: 3 };
      const details = await generator.generateDetails(settings);

      const numberParts = details.parts.filter((part) => /^\d+$/.test(part));
      expect(numberParts.length).toBe(1);
      expect(numberParts[0].length).toBe(3);
    });

    it("should use custom separator", async () => {
      const settings: Partial<GeneratorSettings> = { separator: "_" };
      const details = await generator.generateDetails(settings);

      expect(details.separator).toBe("_");
      expect(details.passphrase).toContain("_");
    });

    it("should use empty separator", async () => {
      const settings: Partial<GeneratorSettings> = { separator: "" };
      const details = await generator.generateDetails(settings);

      expect(details.separator).toBe("");
      expect(details.passphrase).not.toContain("-");
    });

    it("should strip umlauts when enabled", async () => {
      const wordSource = new ArrayWordSource(mockWordListWithUmlauts);
      const generatorWithUmlauts = new PasswordGenerator(wordSource);
      const settings: Partial<GeneratorSettings> = {
        stripUmlauts: true,
        digits: 0,
      };
      const details = await generatorWithUmlauts.generateDetails(settings);

      expect(details.passphrase).not.toMatch(/[äöÄÖ]/);
    });

    it("should preserve umlauts when disabled", async () => {
      const wordSource = new ArrayWordSource(mockWordListWithUmlauts);
      const generatorWithUmlauts = new PasswordGenerator(wordSource);
      const settings: Partial<GeneratorSettings> = {
        stripUmlauts: false,
        digits: 0,
        wordCount: 5, // Increase chances of getting umlauts
      };

      // Generate multiple times to increase chance of getting umlauts
      let foundUmlaut = false;
      for (let i = 0; i < 10; i++) {
        const details = await generatorWithUmlauts.generateDetails(settings);
        if (/[äöÄÖ]/.test(details.passphrase)) {
          foundUmlaut = true;
          break;
        }
      }

      expect(foundUmlaut).toBe(true);
    });

    it("should shuffle parts randomly", async () => {
      const settings: Partial<GeneratorSettings> = {
        wordCount: 3,
        digits: 1,
      };

      // Generate multiple passphrases to check randomness
      const orders = new Set<string>();

      for (let i = 0; i < 20; i++) {
        const details = await generator.generateDetails(settings);
        const hasNumber = details.parts.map((part) => /^\d+$/.test(part));
        orders.add(hasNumber.join(","));
      }

      // Should have different orders (number at different positions)
      expect(orders.size).toBeGreaterThan(1);
    });

    it("should return PassphraseDetails with correct structure", async () => {
      const details = await generator.generateDetails();

      expect(details).toHaveProperty("passphrase");
      expect(details).toHaveProperty("parts");
      expect(details).toHaveProperty("separator");
      expect(Array.isArray(details.parts)).toBe(true);
      expect(typeof details.passphrase).toBe("string");
      expect(typeof details.separator).toBe("string");
    });
  });

  describe("static methods", () => {
    describe("stipUmlauts()", () => {
      it("should replace lowercase ä with a", () => {
        expect(PasswordGenerator.stripUmlauts("äiti")).toBe("aiti");
      });

      it("should replace lowercase ö with o", () => {
        expect(PasswordGenerator.stripUmlauts("pöytä")).toBe("poyta");
      });

      it("should replace uppercase Ä with A", () => {
        expect(PasswordGenerator.stripUmlauts("Äiti")).toBe("Aiti");
      });

      it("should replace uppercase Ö with O", () => {
        expect(PasswordGenerator.stripUmlauts("Öljy")).toBe("Oljy");
      });

      it("should replace all umlauts in a string", () => {
        expect(PasswordGenerator.stripUmlauts("äiti-pöytä-Äiti-Öljy")).toBe(
          "aiti-poyta-Aiti-Oljy",
        );
      });

      it("should not modify strings without umlauts", () => {
        expect(PasswordGenerator.stripUmlauts("hello-world")).toBe(
          "hello-world",
        );
      });

      it("should handle empty string", () => {
        expect(PasswordGenerator.stripUmlauts("")).toBe("");
      });
    });

    describe("fromText()", () => {
      it("should create generator from newline-separated text", async () => {
        const text = "kissa\nkoira\nhevonen";
        const generator = PasswordGenerator.fromText(text);
        const word = await generator.getRandomWord();

        expect(["kissa", "koira", "hevonen"]).toContain(word);
      });

      it("should trim whitespace from words", async () => {
        const text = "  kissa  \n  koira  \n  hevonen  ";
        const generator = PasswordGenerator.fromText(text);
        const word = await generator.getRandomWord();

        expect(["kissa", "koira", "hevonen"]).toContain(word);
      });

      it("should handle empty lines", async () => {
        const text = "kissa\n\nkoira\n\n\nhevonen";
        const generator = PasswordGenerator.fromText(text);

        // The current implementation includes empty strings
        // This test documents the actual behavior
        const possibleWords = ["kissa", "", "koira", "", "", "hevonen"];

        const word = await generator.getRandomWord();
        expect(possibleWords).toContain(word);
      });

      it("should handle empty text", () => {
        const text = "";
        const generator = PasswordGenerator.fromText(text);
        expect(generator).toBeInstanceOf(PasswordGenerator);
      });

      it("should handle text with only whitespace", () => {
        const text = "   \n   \n   ";
        const generator = PasswordGenerator.fromText(text);
        expect(generator).toBeInstanceOf(PasswordGenerator);
      });
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle negative word count", async () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      const settings: Partial<GeneratorSettings> = { wordCount: -1 };
      const details = await generator.generateDetails(settings);

      // Should use 0 words
      expect(details.parts.filter((part) => !/^\d+$/.test(part)).length).toBe(
        0,
      );
    });

    it("should handle negative number count", async () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      const settings: Partial<GeneratorSettings> = { digits: -1 };
      const details = await generator.generateDetails(settings);

      // Should not include any numbers
      expect(details.parts.filter((part) => /^\d+$/.test(part)).length).toBe(0);
    });

    it("should handle very large word count", async () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      const settings: Partial<GeneratorSettings> = { wordCount: 100 };
      const details = await generator.generateDetails(settings);

      expect(details.parts.length).toBe(101); // 100 words + 1 number
    });

    it("should generate consistent number ranges (1-9)", async () => {
      const wordSource = new ArrayWordSource(mockWordList);
      const generator = new PasswordGenerator(wordSource);
      const settings: Partial<GeneratorSettings> = {
        wordCount: 0,
        digits: 100,
      };

      // Generate multiple times to check number range
      for (let i = 0; i < 10; i++) {
        const details = await generator.generateDetails(settings);
        const numberPart = details.parts.find((part) => /^\d+$/.test(part));
        expect(numberPart).toMatch(/^[1-9]+$/);
      }
    });
  });

  describe("defaultGeneratorSettings", () => {
    it("should have correct default values", () => {
      expect(defaultGeneratorSettings.wordCount).toBe(3);
      expect(defaultGeneratorSettings.separator).toBe("-");
      expect(defaultGeneratorSettings.digits).toBe(1);
      expect(defaultGeneratorSettings.stripUmlauts).toBe(true);
    });
  });
});
