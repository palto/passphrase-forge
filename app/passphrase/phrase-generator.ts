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
 * Registry of phrase generators by mode name
 */
const phraseGenerators = {
  basic: async (details: PhraseGeneratorDetail) =>
    details.parts.sort(() => Math.random() - 0.5).join(details.separator),
  "gpt-4o": enhanceWithGpt4o,
} as const satisfies Record<string, PhraseGenerator>;

/**
 * Available generator mode types
 */
export type GeneratorMode = keyof typeof phraseGenerators;

/**
 * Get a phrase generator by mode name
 */
export function getPhraseGenerator(mode: GeneratorMode): PhraseGenerator {
  return phraseGenerators[mode];
}
