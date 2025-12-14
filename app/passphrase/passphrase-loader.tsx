import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getCookie } from "cookies-next";
import {
  decodeSettings,
  SETTINGS_COOKIE_NAME,
} from "@/app/passphrase/settings-cookie";
import { cookies } from "next/headers";
import { aiMultiplePassphraseEnhancement } from "@/app/passphrase/ai/actions";

async function generateInitialPassphrases(count: number = 5): Promise<{
  passphrases: PassphraseDetails[];
  settings: GeneratorSettings;
}> {
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

  const passphrases = await aiMultiplePassphraseEnhancement(settings, count);
  return { passphrases, settings };
}

export async function PassphraseLoader() {
  const { passphrases, settings } = await generateInitialPassphrases(5);

  return (
    <PassphraseComponent
      initialPassphrases={passphrases}
      initialSettings={settings}
    />
  );
}
