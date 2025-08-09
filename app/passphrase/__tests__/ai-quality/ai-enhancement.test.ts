/**
 * Simple AI Quality Tests
 * Tests AI responses with clear pass/fail for each quality metric
 */

import { describe, it, expect } from "vitest";
import { aiEnhance } from "../../ai/actions";
import { PassphraseDetails } from "../../password-generator";

// Test constants
const PARALLEL_GENERATIONS = 5;
const MIN_WORD_COUNT = 4;
const MAX_WORD_COUNT = 7;
const TEST_TIMEOUT_MS = 30000;

// Skip all AI tests if not explicitly enabled
const skipAITests =
  process.env.RUN_AI_TESTS !== "true" || !process.env.OPENAI_API_KEY;

describe("AI Quality Tests", () => {
  describe.skipIf(skipAITests)("Single Input Test", () => {
    it(
      "should generate 5 AI passwords and check quality metrics",
      { timeout: TEST_TIMEOUT_MS },
      async () => {
        // Arrange
        const input = {
          originalWords: ["kissa", "koira"],
          originalNumbers: "5",
          expectedSeparator: "-",
        };

        const parts = [...input.originalWords, input.originalNumbers];
        const mockDetails: PassphraseDetails = {
          parts,
          separator: input.expectedSeparator,
          passphrase: parts.join(input.expectedSeparator),
        };

        console.log(
          `\nInput: ${input.originalWords.join(" ")} + ${input.originalNumbers}\n`,
        );

        // Act
        const promises = Array.from({ length: PARALLEL_GENERATIONS }, () =>
          aiEnhance(mockDetails),
        );

        const results = await Promise.all(promises);

        // Display all generated passphrases
        results.forEach((result, i) => {
          console.log(`${i + 1}. ${result.passphrase}`);
        });

        // Assert
        results.forEach((result) => {
          const aiResponse = result.passphrase;
          const hasOriginalDigit = aiResponse.includes(input.originalNumbers);
          const hasCapitalization = /[A-ZÅÄÖ]/.test(aiResponse);
          const wordCount = aiResponse.split(/[-_\s]/).length;
          const hasCorrectLength =
            wordCount >= MIN_WORD_COUNT && wordCount <= MAX_WORD_COUNT;

          expect
            .soft(
              hasOriginalDigit,
              `Passphrase "${aiResponse}" should contain digit "${input.originalNumbers}"`,
            )
            .toBe(true);
          expect
            .soft(
              hasCapitalization,
              `Passphrase "${aiResponse}" should have capitalization`,
            )
            .toBe(true);
          expect
            .soft(
              hasCorrectLength,
              `Passphrase "${aiResponse}" should have ${MIN_WORD_COUNT}-${MAX_WORD_COUNT} words, got ${wordCount}`,
            )
            .toBe(true);
        });

        // Should have generated exactly 5 passphrases
        expect(results.length).toBe(PARALLEL_GENERATIONS);
      },
    );
  });
});
