import { PassphraseDetails } from "@/app/passphrase/password-generator";
import { enhanceWithGpt4o } from "@/app/passphrase/ai/gpt4o";

/**
 * Type for AI enhancer functions
 * Takes passphrase details and returns enhanced version
 */
export type AiEnhancer = (
  details: PassphraseDetails,
) => Promise<PassphraseDetails>;

/**
 * Registry of AI enhancers by mode name
 */
const enhancers: Record<string, AiEnhancer> = {
  "gpt-4o": enhanceWithGpt4o,
};

/**
 * Get an AI enhancer function by mode name
 * Returns null if mode is not found in registry
 */
export function getEnhancer(mode: string): AiEnhancer | null {
  return enhancers[mode] ?? null;
}
