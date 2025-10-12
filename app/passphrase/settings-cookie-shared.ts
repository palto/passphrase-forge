import {
  GeneratorSettings,
  defaultGeneratorSettings,
} from "@/app/passphrase/password-generator";

// Short key mapping for query string format
export const KEY_MAP = {
  wc: "wordCount",
  sep: "separator",
  dig: "digits",
  su: "stripUmlauts",
} as const;

// Reverse mapping for encoding
export const REVERSE_KEY_MAP: Record<
  keyof GeneratorSettings,
  keyof typeof KEY_MAP
> = {
  wordCount: "wc",
  separator: "sep",
  digits: "dig",
  stripUmlauts: "su",
};

/**
 * Encode settings to query string format with delta encoding
 * Only stores values that differ from defaults
 */
export function encodeSettings(settings: GeneratorSettings): string {
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
export function decodeSettings(queryString: string): GeneratorSettings {
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
