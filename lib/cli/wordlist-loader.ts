import { PasswordGenerator } from "@/app/passphrase/password-generator";

let cachedGenerator: PasswordGenerator | null = null;

/**
 * Load wordlist from URL and create a PasswordGenerator
 * Caches the generator for subsequent calls
 */
export async function getWordlistGenerator(
  wordlistUrl?: string,
): Promise<PasswordGenerator> {
  if (cachedGenerator) {
    return cachedGenerator;
  }

  const url =
    wordlistUrl ||
    process.env.NEXT_PUBLIC_WORD_LIST_URL ||
    process.env.WORD_LIST_URL;

  if (!url) {
    throw new Error(
      "Wordlist URL not found. Please set NEXT_PUBLIC_WORD_LIST_URL or WORD_LIST_URL environment variable.",
    );
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch wordlist: ${response.statusText}`);
    }

    const text = await response.text();
    cachedGenerator = PasswordGenerator.fromText(text);
    return cachedGenerator;
  } catch (error) {
    throw new Error(
      `Failed to load wordlist from ${url}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
