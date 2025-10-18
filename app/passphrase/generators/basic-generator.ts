import {
  GeneratorSettings,
  PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";
import { PassphraseGenerator } from "@/app/passphrase/generators/base";

/**
 * Basic passphrase generator without AI enhancement
 * Uses the core PasswordGenerator for simple word-based passphrases
 */
export class BasicPassphraseGenerator implements PassphraseGenerator {
  constructor(private readonly passwordGenerator: PasswordGenerator) {}

  async generate(
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails> {
    return this.passwordGenerator.generateDetails(settings);
  }

  async generateMultiple(
    count: number,
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails[]> {
    return this.passwordGenerator.generateMultiple(count, settings);
  }

  getName(): string {
    return "basic";
  }

  getDescription(): string {
    return "Basic passphrase generation without AI enhancement";
  }
}
