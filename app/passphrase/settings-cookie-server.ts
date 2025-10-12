import { cookies } from "next/headers";
import {
  GeneratorSettings,
  defaultGeneratorSettings,
} from "@/app/passphrase/password-generator";
import { decodeSettings } from "@/app/passphrase/settings-cookie-shared";

const SETTINGS_COOKIE_NAME = "generatorSettings";

/**
 * Server-side: Read generator settings from cookies
 */
export async function getGeneratorSettingsFromCookies(): Promise<GeneratorSettings> {
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get(SETTINGS_COOKIE_NAME);

  if (!settingsCookie?.value) {
    return defaultGeneratorSettings;
  }

  try {
    return decodeSettings(settingsCookie.value);
  } catch {
    return defaultGeneratorSettings;
  }
}
