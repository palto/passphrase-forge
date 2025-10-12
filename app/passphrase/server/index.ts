import {
  PasswordGenerator,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getGeneratorSettingsFromCookies } from "@/app/passphrase/settings-cookie-server";
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

let passwordGenerator: Promise<PasswordGenerator> | undefined;

export async function getPasswordGenerator() {
  if (!passwordGenerator) {
    passwordGenerator = fetch(wordListUrl, {
      cache: "no-cache",
    }).then(async (response) => {
      return PasswordGenerator.fromText(await response.text());
    });
  }
  return passwordGenerator;
}

export async function generateInitialPassphrases(count: number = 5): Promise<{
  passphrases: PassphraseDetails[];
  settings: Awaited<ReturnType<typeof getGeneratorSettingsFromCookies>>;
}> {
  const generator = await getPasswordGenerator();
  const settings = await getGeneratorSettingsFromCookies();
  const passphrases = await generator.generateMultiple(count, settings);
  return { passphrases, settings };
}
