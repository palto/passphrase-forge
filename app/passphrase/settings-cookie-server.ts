import { cookies } from "next/headers";
import {
  GeneratorSettings,
  defaultGeneratorSettings,
} from "@/app/passphrase/password-generator";

const SETTINGS_COOKIE_NAME = "generatorSettings";

// Short key mapping for query string format
const KEY_MAP = {
  wc: "wordCount",
  sep: "separator",
  dig: "digits",
  su: "stripUmlauts",
} as const;

/**
 * Decode query string format to settings object
 * Merges with defaults for values not present
 */
function decodeSettings(queryString: string): GeneratorSettings {
  const params = new URLSearchParams(queryString);
  const settings: {
    wordCount?: number;
    separator?: string;
    digits?: number;
    stripUmlauts?: boolean;
  } = {};

  // Parse each parameter
  for (const [shortKey, longKey] of Object.entries(KEY_MAP)) {
    const value = params.get(shortKey);
    if (value === null) continue;

    switch (longKey) {
      case "wordCount":
      case "digits":
        settings[longKey] = parseInt(value, 10);
        break;
      case "separator":
        settings[longKey] = value;
        break;
      case "stripUmlauts":
        settings[longKey] = value === "1";
        break;
    }
  }

  return { ...defaultGeneratorSettings, ...settings };
}

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
