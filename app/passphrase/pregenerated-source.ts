import {
  type GeneratorSettings,
  type PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";

export class PregeneratedPasshpraseSource {
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
