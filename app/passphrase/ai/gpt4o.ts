import { LanguageModel } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { aiEnhance } from "@/app/passphrase/ai/core";
import type { PhraseBuilderInput } from "@/app/passphrase/phrase-builder";

/**
 * Cached GPT-4o model instance
 * Lazy initialized on first use to avoid unnecessary gateway creation
 */
let cachedGpt4oModel: LanguageModel | null = null;

/**
 * Get or create the GPT-4o model instance
 * Uses singleton pattern to reuse the model across all calls
 */
function getGpt4oModel(): LanguageModel {
  if (!cachedGpt4oModel) {
    const gateway = createGateway({
      // OIDC authentication is automatic on Vercel deployments
      // Locally, authentication is handled via vercel env pull
    });
    cachedGpt4oModel = gateway("openai/gpt-4o");
  }
  return cachedGpt4oModel;
}

/**
 * Enhance a passphrase using GPT-4o
 * Gateway and model are created once and cached for reuse
 */
export async function enhanceWithGpt4o(
  details: PhraseBuilderInput,
): Promise<string> {
  const model = getGpt4oModel();
  return (await aiEnhance(details, model)).passphrase;
}
