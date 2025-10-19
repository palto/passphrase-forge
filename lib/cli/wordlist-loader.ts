import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { fetchWordSource } from "@/app/passphrase/word-source/word-source";

let cachedGenerator: PasswordGenerator | null = null;

/**
 * Load wordlist from URL and create a PasswordGenerator
 * Caches the generator for subsequent calls
 */
export async function getPasswordGenerator(
  wordlistUrl: string | undefined = process.env.NEXT_PUBLIC_WORD_LIST_URL,
): Promise<PasswordGenerator> {
  if (cachedGenerator) {
    return cachedGenerator;
  }

  const url = wordlistUrl;

  if (!url) {
    throw new Error(
      "Wordlist URL not found. Please set PASSWORD_LIST_URL environment variable.",
    );
  }

  const wordSource = await fetchWordSource(url);
  cachedGenerator = new PasswordGenerator(wordSource);
  return cachedGenerator;
}
