"use server";
import {
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getPasswordGenerator } from "@/app/passphrase/server";
import { captureServerSide } from "@/posthog/PostHogClient";

/**
 * Server action for generating a single AI-enhanced passphrase
 * Uses the gpt-4o mode by default
 */
export async function aiPassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
): Promise<PassphraseDetails> {
  void captureServerSide({
    event: "passphrase_generated",
    properties: {
      count: 1,
      generator_settings: generatorSettings,
    },
  });
  const passwordGenerator = await getPasswordGenerator();
  return passwordGenerator.generateDetails({
    ...generatorSettings,
    mode: "gpt-4o",
  });
}
