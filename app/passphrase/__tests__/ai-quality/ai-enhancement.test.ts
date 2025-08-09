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

// Test input cases
const testCases = [
  {
    name: "Simple Finnish words with single digit",
    originalWords: ["kissa", "koira"],
    originalNumbers: "5",
    expectedSeparator: "-",
  },
  {
    name: "Complex compound words with digit 1",
    originalWords: ["Sorainen", "Rohkeasti", "Guru"],
    originalNumbers: "143",
    expectedSeparator: "-",
  },
  {
    name: "Long compound words with digit 2",
    originalWords: ["Kertamaksulaina", "Paraatiovi", "Pienkerrostalo"],
    originalNumbers: "29",
    expectedSeparator: "-",
  },
  {
    name: "Mixed complex words with digit 9",
    originalWords: ["Federatiivinen", "Katukaytava", "Piirustus"],
    originalNumbers: "943",
    expectedSeparator: "-",
  },
  {
    name: "Abstract concepts with digit 2",
    originalWords: ["Tuntuvasti", "Rahavirta", "Rivinen"],
    originalNumbers: "87",
    expectedSeparator: "-",
  },
];

describe("AI Quality Tests", () => {
  describe.skipIf(skipAITests)("Multiple Input Tests", () => {
    testCases.forEach((testCase, index) => {
      it(
        `should generate 5 AI passwords for test case ${index + 1}: ${testCase.name}`,
        { timeout: TEST_TIMEOUT_MS },
        async () => {
          // Arrange
          const parts = [...testCase.originalWords, testCase.originalNumbers];
          const mockDetails: PassphraseDetails = {
            parts,
            separator: testCase.expectedSeparator,
            passphrase: parts.join(testCase.expectedSeparator),
          };

          console.log(
            `\nTest Case ${index + 1}: ${testCase.originalWords.join(" ")} + ${testCase.originalNumbers}\n`,
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
            const hasOriginalDigit = aiResponse.includes(
              testCase.originalNumbers,
            );
            const hasCapitalization = /[A-ZÅÄÖ]/.test(aiResponse);
            const wordCount = aiResponse.split(/[-_\s]/).length;
            const hasCorrectLength =
              wordCount >= MIN_WORD_COUNT && wordCount <= MAX_WORD_COUNT;

            expect
              .soft(
                hasOriginalDigit,
                `Passphrase "${aiResponse}" should contain digit "${testCase.originalNumbers}"`,
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
});
