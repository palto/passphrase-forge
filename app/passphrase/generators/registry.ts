import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { PassphraseGenerator } from "@/app/passphrase/generators/base";
import { BasicPassphraseGenerator } from "@/app/passphrase/generators/basic-generator";
import { Gpt4oPassphraseGenerator } from "@/app/passphrase/generators/gpt4o-generator";
import { ClaudeHaikuPassphraseGenerator } from "@/app/passphrase/generators/claude-haiku-generator";

/**
 * Factory function for creating passphrase generators
 */
type GeneratorFactory = (
  passwordGenerator: PasswordGenerator,
) => PassphraseGenerator;

/**
 * Registry of available passphrase generators
 */
const generators: Record<string, GeneratorFactory> = {
  basic: (passwordGenerator) => new BasicPassphraseGenerator(passwordGenerator),
  "gpt-4o": (passwordGenerator) =>
    new Gpt4oPassphraseGenerator(passwordGenerator),
  claude: (passwordGenerator) =>
    new ClaudeHaikuPassphraseGenerator(passwordGenerator),
};

/**
 * Get a passphrase generator by name
 * @param name - The name of the generator (e.g., "basic", "gpt-4o")
 * @param passwordGenerator - The base password generator to use
 * @returns The requested passphrase generator
 * @throws Error if the generator name is not found
 */
export function getGenerator(
  name: string,
  passwordGenerator: PasswordGenerator,
): PassphraseGenerator {
  const factory = generators[name];

  if (!factory) {
    const available = Object.keys(generators).join(", ");
    throw new Error(
      `Unknown generator: ${name}. Available generators: ${available}`,
    );
  }

  return factory(passwordGenerator);
}

/**
 * Get a list of all available generator names
 */
export function getAvailableGenerators(): string[] {
  return Object.keys(generators);
}

/**
 * Get all generators with their descriptions
 */
export function getGeneratorInfo(
  passwordGenerator: PasswordGenerator,
): Array<{ name: string; description: string }> {
  return Object.keys(generators).map((name) => {
    const generator = generators[name](passwordGenerator);
    return {
      name: generator.getName(),
      description: generator.getDescription(),
    };
  });
}
