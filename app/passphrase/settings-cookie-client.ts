import { setCookie } from "cookies-next";
import { GeneratorSettings } from "@/app/passphrase/password-generator";
import {
  encodeSettings,
  SETTINGS_COOKIE_NAME,
} from "@/app/passphrase/settings-cookie-shared";

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Client-side: Write generator settings to document.cookie
 */
export function setGeneratorSettingsCookie(settings: GeneratorSettings): void {
  const value = encodeSettings(settings);
  setCookie(SETTINGS_COOKIE_NAME, value, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    encode: (v) => v, // Don't URL-encode, keep raw query string format
  });
}
