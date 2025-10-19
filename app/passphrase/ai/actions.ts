"use server";
import {
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getPasswordGenerator } from "@/app/passphrase/server";

const DEFAULT_PASSPHRASE_COUNT = 5;

/**
 * Server action for generating a single AI-enhanced passphrase
 * Uses the gpt-4o mode by default
 */
export async function aiPassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
): Promise<PassphraseDetails> {
  const passwordGenerator = await getPasswordGenerator();
  return passwordGenerator.generateDetails({
    ...generatorSettings,
    mode: "gpt-4o",
  });
}

/**
 * Server action for generating multiple AI-enhanced passphrases
 * Uses the gpt-4o mode by default
 */
export async function aiMultiplePassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
  count: number = DEFAULT_PASSPHRASE_COUNT,
): Promise<PassphraseDetails[]> {
  const passwordGenerator = await getPasswordGenerator();
  return passwordGenerator.generateMultiple(count, {
    ...generatorSettings,
    mode: "gpt-4o",
  });
}
