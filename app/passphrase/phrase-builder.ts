import { PassphraseDetails } from "@/app/passphrase/password-generator";
import { enhanceWithGpt4o } from "@/app/passphrase/ai/gpt4o";

/**
 * Type for building phrases from word and digit parts
 * Takes seed parts and returns a complete phrase string
 */
export type PhraseBuilder = (details: PhraseBuilderInput) => Promise<string>;

/**
 * Input for phrase builders - parts and separator without the final passphrase
 */
export type PhraseBuilderInput = Omit<PassphraseDetails, "passphrase">;

/**
 * Registry of phrase builders by mode name
 */
const phraseBuilders = {
  basic: async (details: PhraseBuilderInput) =>
    details.parts.sort(() => Math.random() - 0.5).join(details.separator),
  "gpt-4o": enhanceWithGpt4o,
} as const satisfies Record<string, PhraseBuilder>;

/**
 * Available generator mode types
 */
export type GeneratorMode = keyof typeof phraseBuilders;

/**
 * Get a phrase builder by mode name
 */
export function getPhraseBuilder(mode: GeneratorMode): PhraseBuilder {
  return phraseBuilders[mode];
}
