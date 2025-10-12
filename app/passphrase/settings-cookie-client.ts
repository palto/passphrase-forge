import {
  GeneratorSettings,
  defaultGeneratorSettings,
} from "@/app/passphrase/password-generator";

const SETTINGS_COOKIE_NAME = "generatorSettings";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// Short key mapping for query string format
const KEY_MAP = {
  wc: "wordCount",
  sep: "separator",
  dig: "digits",
  su: "stripUmlauts",
} as const;

// Reverse mapping for encoding
const REVERSE_KEY_MAP: Record<keyof GeneratorSettings, keyof typeof KEY_MAP> = {
  wordCount: "wc",
  separator: "sep",
  digits: "dig",
  stripUmlauts: "su",
};

/**
 * Encode settings to query string format with delta encoding
 * Only stores values that differ from defaults
 */
function encodeSettings(settings: GeneratorSettings): string {
  const params = new URLSearchParams();

  // Only include non-default values (delta encoding)
  if (settings.wordCount !== defaultGeneratorSettings.wordCount) {
    params.set(REVERSE_KEY_MAP.wordCount, String(settings.wordCount));
  }
  if (settings.separator !== defaultGeneratorSettings.separator) {
    params.set(REVERSE_KEY_MAP.separator, settings.separator);
  }
  if (settings.digits !== defaultGeneratorSettings.digits) {
    params.set(REVERSE_KEY_MAP.digits, String(settings.digits));
  }
  if (settings.stripUmlauts !== defaultGeneratorSettings.stripUmlauts) {
    params.set(REVERSE_KEY_MAP.stripUmlauts, settings.stripUmlauts ? "1" : "0");
  }

  return params.toString();
}

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
 * Client-side: Read generator settings from document.cookie
 */
export function getGeneratorSettingsFromDocumentCookies(): GeneratorSettings {
  if (typeof document === "undefined") {
    return defaultGeneratorSettings;
  }

  const cookies = document.cookie.split(";");
  const settingsCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${SETTINGS_COOKIE_NAME}=`),
  );

  if (!settingsCookie) {
    return defaultGeneratorSettings;
  }

  try {
    const value = decodeURIComponent(settingsCookie.split("=")[1]);
    return decodeSettings(value);
  } catch {
    return defaultGeneratorSettings;
  }
}

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
