import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import {
  PasswordGenerator,
  PassphraseDetails,
  GeneratorSettings,
  defaultGeneratorSettings,
} from "@/app/passphrase/password-generator";
import {
  decodeSettings,
  SETTINGS_COOKIE_NAME,
} from "@/app/passphrase/settings-cookie";
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
  settings: GeneratorSettings;
}> {
  const generator = await getPasswordGenerator();

  // Read settings from cookie
  const value = await getCookie(SETTINGS_COOKIE_NAME, { cookies });
  const settings = value
    ? (() => {
        try {
          return decodeSettings(value);
        } catch {
          return defaultGeneratorSettings;
        }
      })()
    : defaultGeneratorSettings;

  const passphrases = await generator.generateMultiple(count, settings);
  return { passphrases, settings };
}
