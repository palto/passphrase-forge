import { WordSource } from "@/app/passphrase/word-source/word-source";
import { ArrayWordSource } from "@/app/passphrase/word-source/array-word-source";
import {
  getPhraseGenerator,
  type GeneratorMode,
} from "@/app/passphrase/phrase-generator";

// Re-export GeneratorMode for external use
export type { GeneratorMode };

export type GeneratorSettings = {
  readonly wordCount: number;
  readonly separator: string;
  readonly digits: number;
  readonly stripUmlauts?: boolean;
  readonly mode?: GeneratorMode;
};

export type PassphraseDetails = {
  readonly passphrase: string;
  readonly parts: string[];
  readonly separator: string;
};

export const defaultGeneratorSettings: GeneratorSettings = {
  wordCount: 3,
  separator: "-",
  digits: 1,
  stripUmlauts: true,
};

export class PasswordGenerator {
  private readonly defaultSettings: GeneratorSettings =
    defaultGeneratorSettings;

  constructor(private readonly wordSource: WordSource) {}

  async getRandomWord(): Promise<string> {
    const totalWords = await this.wordSource.getWordCount();
    const randomId = Math.floor(Math.random() * totalWords);
    return this.wordSource.getWord(randomId);
  }

  async generate(
    generationSettings?: Partial<GeneratorSettings>,
  ): Promise<string> {
    const details = await this.generateDetails(generationSettings);
    return details.passphrase;
  }

  async generateDetails(
    generationSettings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails> {
    const settings = {
      ...this.defaultSettings,
      ...generationSettings,
    };

    const mode = settings.mode || "basic";

    // Generate seed parts for the passphrase
    const { wordCount, digits, stripUmlauts, separator } = settings;
    const parts = await Promise.all(
      Array.from({ length: wordCount }, () => this.getRandomWord()),
    );
    if (digits > 0) {
      const numbers = Array.from(
        { length: digits },
        () => Math.floor(Math.random() * 9) + 1,
      );
      parts.push(numbers.join(""));
    }

    // Use a generation strategy based on the requested mode
    const phraseGenerator = getPhraseGenerator(mode);
    let passphrase = await phraseGenerator({ parts, separator });

    // Post-processing
    passphrase = stripUmlauts
      ? PasswordGenerator.stripUmlauts(passphrase)
      : passphrase;

    return {
      parts,
      separator,
      passphrase,
    };
  }

  async generateMultiple(
    count: number,
    generationSettings?: Partial<GeneratorSettings>,
  ): Promise<PassphraseDetails[]> {
    return Promise.all(
      Array.from({ length: count }, () =>
        this.generateDetails(generationSettings),
      ),
    );
  }

  static stripUmlauts(text: string) {
    return text
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/Ä/g, "A")
      .replace(/Ö/g, "O");
  }

  static fromText(text: string) {
    const wordList = text.split("\n").map((password) => password.trim());
    const wordSource = new ArrayWordSource(wordList);
    return new PasswordGenerator(wordSource);
  }
}
