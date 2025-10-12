import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import {
  GeneratorSettings,
  defaultGeneratorSettings,
} from "@/app/passphrase/password-generator";
import {
  decodeSettings,
  SETTINGS_COOKIE_NAME,
} from "@/app/passphrase/settings-cookie-shared";

/**
 * Server-side: Read generator settings from cookies
 */
export async function getGeneratorSettingsFromCookies(): Promise<GeneratorSettings> {
  const value = await getCookie(SETTINGS_COOKIE_NAME, { cookies });

  if (!value) {
    return defaultGeneratorSettings;
  }

  try {
    return decodeSettings(value);
  } catch {
    return defaultGeneratorSettings;
  }
}
