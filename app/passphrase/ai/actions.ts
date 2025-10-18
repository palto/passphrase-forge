"use server";
import { createGateway } from "@ai-sdk/gateway";
import {
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getPasswordGenerator } from "@/app/passphrase/server";
import {
  generateAiPassphrase,
  generateMultipleAiPassphrases,
} from "@/app/passphrase/ai/core";

const gateway = createGateway({
  // OIDC authentication is automatic on Vercel deployments
  // Locally, authentication is handled via vercel env pull
});

const model = gateway("openai/gpt-4o");

/**
 * Server action for generating a single AI-enhanced passphrase
 * Thin wrapper around core logic for Next.js server actions
 */
export async function aiPassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
): Promise<PassphraseDetails> {
  const passwordGenerator = await getPasswordGenerator();
  return generateAiPassphrase(passwordGenerator, model, generatorSettings);
}

const DEFAULT_PASSPHRASE_COUNT = 5;

/**
 * Server action for generating multiple AI-enhanced passphrases
 * Thin wrapper around core logic for Next.js server actions
 */
export async function aiMultiplePassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
  count: number = DEFAULT_PASSPHRASE_COUNT,
): Promise<PassphraseDetails[]> {
  const passwordGenerator = await getPasswordGenerator();
  return generateMultipleAiPassphrases(
    passwordGenerator,
    model,
    generatorSettings,
    count,
  );
}
