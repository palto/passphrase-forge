"use server";
import {
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getPasswordGenerator } from "@/app/passphrase/server";
import { getGenerator } from "@/app/passphrase/generators/registry";

const DEFAULT_PASSPHRASE_COUNT = 5;

/**
 * Server action for generating a single AI-enhanced passphrase
 * Uses the gpt-4o generator by default
 */
export async function aiPassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
): Promise<PassphraseDetails> {
  const passwordGenerator = await getPasswordGenerator();
  const generator = getGenerator("gpt-4o", passwordGenerator);
  return generator.generate(generatorSettings);
}

/**
 * Server action for generating multiple AI-enhanced passphrases
 * Uses the gpt-4o generator by default
 */
export async function aiMultiplePassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
  count: number = DEFAULT_PASSPHRASE_COUNT,
): Promise<PassphraseDetails[]> {
  const passwordGenerator = await getPasswordGenerator();
  const generator = getGenerator("gpt-4o", passwordGenerator);
  return generator.generateMultiple(count, generatorSettings);
}
