import { generateObject, LanguageModel } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { z } from "zod";
import type { PhraseBuilderInput } from "@/app/passphrase/phrase-builder";

/**
 * Cached GPT-OSS-120B model instance
 * Lazy initialized on first use to avoid unnecessary gateway creation
 */
let cachedGptOss120bModel: LanguageModel | null = null;

/**
 * Get or create the GPT-OSS-120B model instance
 * Uses singleton pattern to reuse the model across all calls
 */
function getGptOss120bModel(): LanguageModel {
  if (!cachedGptOss120bModel) {
    const gateway = createGateway({
      // OIDC authentication is automatic on Vercel deployments
      // Locally, authentication is handled via vercel env pull
    });
    cachedGptOss120bModel = gateway("openai/gpt-oss-120b");
  }
  return cachedGptOss120bModel;
}

/**
 * Enhance a passphrase using GPT-OSS-120B with simplified prompt
 * Gateway and model are created once and cached for reuse
 */
export async function enhanceWithGptOss120b(
  details: PhraseBuilderInput,
): Promise<string> {
  const model = getGptOss120bModel();

  const result = await generateObject({
    model,
    system: `Luo lyhyt suomenkielinen lause annetuista sanoista ja numeroista.

SÄÄNNÖT:
- Pidä numero numeromuodossa (älä muuta "5" -> "viisi")
- Tee 4-6 sanan lause
- Aloita iso kirjaimella
- Vastaa JSON-muodossa`,
    prompt: details.parts.join(" "),
    schema: z.object({
      passphrase: z.string(),
    }),
  });

  return result.object.passphrase
    .replace(/[,.:;!?]/g, "")
    .split(/\s+/)
    .join(details.separator);
}
