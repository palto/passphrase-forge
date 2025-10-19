import { createGateway } from "@ai-sdk/gateway";
import { LanguageModel } from "ai";
import {
  GeneratorSettings,
  PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";
import { PassphraseGenerator } from "@/app/passphrase/generators/base";
import {
  generateAiPassphrase,
  generateMultipleAiPassphrases,
} from "@/app/passphrase/ai/core";

/**
 * GPT-5-mini passphrase generator with AI enhancement
 * Uses OpenAI's GPT-5-mini model via Vercel AI Gateway
 */
export class Gpt5MiniPassphraseGenerator implements PassphraseGenerator {
  private readonly model: LanguageModel;

  constructor(private readonly passwordGenerator: PasswordGenerator) {
    const gateway = createGateway({
      // OIDC authentication is automatic on Vercel deployments
      // Locally, authentication is handled via vercel env pull
    });
    this.model = gateway("openai/gpt-5-mini");
  }

  async generate(
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails> {
    return generateAiPassphrase(this.passwordGenerator, this.model, settings);
  }

  async generateMultiple(
    count: number,
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails[]> {
    return generateMultipleAiPassphrases(
      this.passwordGenerator,
      this.model,
      settings,
      count,
    );
  }

  getName(): string {
    return "gpt-5-mini";
  }

  getDescription(): string {
    return "AI-enhanced passphrase generation using OpenAI GPT-5-mini";
  }
}
