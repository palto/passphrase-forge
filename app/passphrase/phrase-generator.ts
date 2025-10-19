import { PassphraseDetails } from "@/app/passphrase/password-generator";
import { enhanceWithGpt4o } from "@/app/passphrase/ai/gpt4o";

/**
 * Type for converting words and digits to phrases
 * Takes seed parts that it turns into a complete phrase
 */
export type PhraseGenerator = (
  details: PhraseGeneratorDetail,
) => Promise<string>;

export type PhraseGeneratorDetail = Omit<PassphraseDetails, "passphrase">;

/**
 * Registry of AI enhancers by mode name
 */
const phraseGenerator: Record<string, PhraseGenerator> = {
  "gpt-4o": enhanceWithGpt4o,
  basic: async (details) =>
    details.parts.sort(() => Math.random() - 0.5).join(details.separator),
};

/**
 * Get a phrase generator by mode name
 */
export function getPhraseGenerator(mode: string): PhraseGenerator {
  if (phraseGenerator[mode] === undefined)
    throw new Error("Mode not found: " + mode);
  return phraseGenerator[mode];
}
