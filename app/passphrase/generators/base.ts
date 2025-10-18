import {
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";

/**
 * Interface for passphrase generators
 * Each generator can use different models and strategies
 */
export interface PassphraseGenerator {
  /**
   * Generate a single passphrase
   */
  generate(settings?: Partial<GeneratorSettings>): Promise<PassphraseDetails>;

  /**
   * Generate multiple passphrases
   */
  generateMultiple(
    count: number,
    settings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails[]>;

  /**
   * Get the name of this generator
   */
  getName(): string;

  /**
   * Get a description of this generator
   */
  getDescription(): string;
}
