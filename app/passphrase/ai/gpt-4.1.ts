import { LanguageModel } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { aiEnhance } from "@/app/passphrase/ai/core";
import type { PhraseBuilderInput } from "@/app/passphrase/phrase-builder";

/**
 * Cached GPT-4.1 model instance
 * Lazy initialized on first use to avoid unnecessary gateway creation
 */
let cachedGpt41Model: LanguageModel | null = null;

/**
 * Get or create the GPT-4.1 model instance
 * Uses singleton pattern to reuse the model across all calls
 */
function getGpt41Model(): LanguageModel {
  if (!cachedGpt41Model) {
    const gateway = createGateway({
      // OIDC authentication is automatic on Vercel deployments
      // Locally, authentication is handled via vercel env pull
    });
    cachedGpt41Model = gateway("openai/gpt-4.1");
  }
  return cachedGpt41Model;
}

/**
 * Enhance a passphrase using GPT-4.1
 * Gateway and model are created once and cached for reuse
 */
export async function enhanceWithGpt41(
  details: PhraseBuilderInput,
): Promise<string> {
  const model = getGpt41Model();
  return (await aiEnhance(details, model)).passphrase;
}
