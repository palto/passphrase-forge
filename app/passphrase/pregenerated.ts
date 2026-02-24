import "server-only";
import {
  type GeneratorSettings,
  type PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";

export const isPregeneratedConfigured =
  !!process.env.PREGENERATED_PASSPHRASES_URL;

let sourcePromise: Promise<PregeneratedPasshpraseSource> | undefined;

export async function getRandomPregenerated(
  count: number,
  settings: GeneratorSettings,
): Promise<PassphraseDetails[]> {
  const source = await getSource();

  return Array.from({ length: count }, () => {
    const index = Math.floor(Math.random() * source.count);
    return source.getPasshrase(index, settings);
  });
}

function getSource(): Promise<PregeneratedPasshpraseSource> {
  if (!sourcePromise) {
    sourcePromise = (async () => {
      const url = process.env.PREGENERATED_PASSPHRASES_URL;
      if (!url)
        throw new Error("PREGENERATED_PASSPHRASES_URL is not configured");

      const response = await fetch(url, { cache: "force-cache" });
      const text = await response.text();
      return new PregeneratedPasshpraseSource(text);
    })();
  }
  return sourcePromise;
}

class PregeneratedPasshpraseSource {
  passphrasesRaw: string[];

  constructor(passphraseStore: string) {
    this.passphrasesRaw = passphraseStore
      .split("\n")
      .filter((line) => line.trim().length > 0);
  }
  get count() {
    return this.passphrasesRaw.length;
  }

  getPasshrase(index: number, settings: GeneratorSettings): PassphraseDetails {
    return this.parsePasshpraseDetails(this.passphrasesRaw[index], settings);
  }

  parsePasshpraseDetails(
    raw: string,
    settings: GeneratorSettings,
  ): PassphraseDetails {
    const parts = raw.split("-");
    const joined = parts.join(settings.separator);
    const passphrase = settings.stripUmlauts
      ? PasswordGenerator.stripUmlauts(joined)
      : joined;

    return {
      passphrase,
      parts,
      separator: settings.separator,
    };
  }
}
