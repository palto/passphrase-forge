import { GeneratorSettings } from "@/app/passphrase/password-generator";
import { encodeSettings } from "@/app/passphrase/settings-cookie-shared";

const SETTINGS_COOKIE_NAME = "generatorSettings";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Client-side: Write generator settings to document.cookie
 */
export function setGeneratorSettingsCookie(settings: GeneratorSettings): void {
  if (typeof document === "undefined") {
    return;
  }

  const value = encodeSettings(settings);
  document.cookie = `${SETTINGS_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}
