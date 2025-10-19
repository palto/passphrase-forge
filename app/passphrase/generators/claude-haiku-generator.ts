import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";
import { PassphraseGenerator } from "@/app/passphrase/generators/base";
import { claudePassphraseAgent } from "@/app/passphrase/generators/claude-agent";

/**
 * Claude Haiku 4.5 passphrase generator with agentic self-evaluation
 * Uses Anthropic's Claude Haiku 4.5 model via Vercel AI Gateway with Agent class
 */
export class ClaudeHaikuPassphraseGenerator implements PassphraseGenerator {
  constructor(private readonly passwordGenerator: PasswordGenerator) {}

  private async enhanceWithClaude(
    details: PassphraseDetails,
  ): Promise<PassphraseDetails> {
    try {
      const result = await claudePassphraseAgent.generate({
        prompt: `Luo salasanalauseke käyttäen seuraavia sanoja ja numeroita: ${details.parts.join(" ")}

Muista:
- Käytä työkaluja tarkistaaksesi ja viimeistelläksesi lausekkeen
- Vastaa lopuksi suoraan vain lausekkeella`,
      });

      // Extract passphrase from the agent's response
      const passphrase = result.text
        .trim()
        .replace(/[,.:;!?]/g, "")
        .split(/\s+/)
        .join(details.separator);

      const parts = passphrase.split(details.separator);
      return { ...details, parts, passphrase };
    } catch (error) {
      console.warn("Agent generation failed:", error);
      throw new Error(
        `Claude agent failed to generate passphrase: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async generate(
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails> {
    const details = await this.passwordGenerator.generateDetails(settings);
    const aiDetails = await this.enhanceWithClaude(details);
    const finalSettings = {
      ...defaultGeneratorSettings,
      ...settings,
    };
    const passphrase = finalSettings.stripUmlauts
      ? PasswordGenerator.stripUmlauts(aiDetails.passphrase)
      : aiDetails.passphrase;
    return { ...aiDetails, passphrase };
  }

  async generateMultiple(
    count: number,
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails[]> {
    const finalSettings = {
      ...defaultGeneratorSettings,
      ...settings,
    };

    // Generate multiple base passphrases in parallel
    const baseDetailsArray = await this.passwordGenerator.generateMultiple(
      count,
      settings,
    );

    // Enhance all passphrases in parallel
    const enhancedDetailsPromises = baseDetailsArray.map(async (details) => {
      try {
        const aiDetails = await this.enhanceWithClaude(details);
        const passphrase = finalSettings.stripUmlauts
          ? PasswordGenerator.stripUmlauts(aiDetails.passphrase)
          : aiDetails.passphrase;
        return { ...aiDetails, passphrase };
      } catch (error) {
        // If AI enhancement fails, return the original passphrase
        console.warn("Claude enhancement failed for one passphrase:", error);
        return details;
      }
    });

    return await Promise.all(enhancedDetailsPromises);
  }

  getName(): string {
    return "claude";
  }

  getDescription(): string {
    return "AI-enhanced passphrase generation using Claude Haiku 4.5";
  }
}
