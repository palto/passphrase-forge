import "server-only";
import {
  type GeneratorSettings,
  type PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { PregeneratedPasshpraseSource } from "@/app/passphrase/pregenerated-source";

export const isPregeneratedConfigured =
  !!process.env.PREGENERATED_PASSPHRASES_URL;

let sourcePromise: Promise<PregeneratedPasshpraseSource> | undefined;

export async function getRandomPregenerated(
  count: number,
  settings: GeneratorSettings,
  randomFn: () => number = Math.random,
): Promise<PassphraseDetails[]> {
  const source = await getSource();

  return Array.from({ length: count }, () => {
    const index = Math.floor(randomFn() * source.count);
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
