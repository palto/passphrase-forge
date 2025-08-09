/**
 * Simple AI Quality Tests
 * Tests AI responses with clear pass/fail for each quality metric
 */

import { describe, it, expect, beforeAll } from "vitest";
import { AITestController } from "./config";
import { aiEnhance } from "../../ai/actions";
import { PassphraseDetails } from "../../password-generator";

// Skip all AI tests if not explicitly enabled
const skipAITests = !AITestController.shouldRunAITests();
const skipReason = AITestController.getDisabledReason();

describe("AI Quality Tests", () => {
  beforeAll(() => {
    if (skipAITests) {
      console.log(`⚠️  AI tests skipped: ${skipReason}`);
      console.log("To enable AI tests: npm run test:ai");
    } else {
      console.log(`✅ AI tests enabled`);
    }
  });

  describe.skipIf(skipAITests)("Single Input Test", () => {
    it(
      "should generate 5 AI passwords and check quality metrics",
      { timeout: 30000 },
      async () => {
        // Single test input
        const input = {
          originalWords: ["kissa", "koira"],
          originalNumbers: "5",
          expectedSeparator: "-",
        };

        // Create mock passphrase details for AI
        const mockDetails: PassphraseDetails = {
          parts: [...input.originalWords, input.originalNumbers],
          separator: input.expectedSeparator,
          passphrase: [...input.originalWords, input.originalNumbers].join(
            input.expectedSeparator,
          ),
        };

        console.log(
          `\nInput: ${input.originalWords.join(" ")} + ${input.originalNumbers}\n`,
        );

        // Generate 5 AI responses in parallel - AI generator now handles retries internally
        const promises = Array(5)
          .fill(null)
          .map(async () => {
            return await aiEnhance(mockDetails);
          });

        const results = await Promise.all(promises);

        // Test each passphrase with soft assertions to collect all failures
        results.forEach((result, i) => {
          const aiResponse = result.passphrase;
          const hasOriginalDigit = aiResponse.includes(input.originalNumbers);
          const hasCapitalization = /[A-ZÅÄÖ]/.test(aiResponse);
          const wordCount = aiResponse.split(/[-_\s]/).length;
          const hasCorrectLength = wordCount >= 4 && wordCount <= 7;

          // Display result
          const digitStatus = hasOriginalDigit ? "PASS" : "FAIL";
          const capStatus = hasCapitalization ? "PASS" : "FAIL";
          const lengthStatus = hasCorrectLength ? "PASS" : "FAIL";
          console.log(
            `${i + 1}. ${aiResponse} (Digit: ${digitStatus}, Cap: ${capStatus}, Len: ${lengthStatus})`,
          );

          // Soft assertions - collect all failures instead of stopping at first
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
              `Passphrase "${aiResponse}" should have 4-7 words, got ${wordCount}`,
            )
            .toBe(true);
        });

        // Should have generated exactly 5 passphrases
        expect(results.length).toBe(5);
      },
    );
  });
});
