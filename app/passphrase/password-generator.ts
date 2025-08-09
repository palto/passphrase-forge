export type GeneratorSettings = {
  readonly wordCount: number;
  readonly separator: string;
  readonly numberCount: number;
  readonly stripUmlauts?: boolean;
};

export type PassphraseDetails = {
  readonly passphrase: string;
  readonly parts: string[];
  readonly separator: string;
};

export const defaultGeneratorSettings: GeneratorSettings = {
  wordCount: 3,
  separator: "-",
  numberCount: 1,
  stripUmlauts: true,
};

export class PasswordGenerator {
  private readonly totalWords;
  private readonly defaultSettings: GeneratorSettings =
    defaultGeneratorSettings;
  constructor(private readonly passwordList: string[]) {
    this.totalWords = passwordList.length;
  }

  getRandomWord() {
    return this.passwordList[Math.floor(Math.random() * this.totalWords)];
  }

  generate(generationSettings?: Partial<GeneratorSettings>) {
    return this.generateDetails(generationSettings).passphrase;
  }

  generateDetails(
    generationSettings?: Partial<GeneratorSettings>,
  ): PassphraseDetails {
    const { wordCount, numberCount, stripUmlauts, separator } = {
      ...this.defaultSettings,
      ...generationSettings,
    };
    const parts = Array.from({ length: wordCount }, () => this.getRandomWord());
    if (numberCount > 0) {
      const numbers = Array.from(
        { length: numberCount },
        () => Math.floor(Math.random() * 9) + 1,
      );
      parts.push(numbers.join(""));
    }
    parts.sort(() => Math.random() - 0.5);
    const passphrase = stripUmlauts
      ? PasswordGenerator.stipUmlauts(parts.join(separator))
      : parts.join(separator);

    return {
      parts,
      separator,
      passphrase,
    };
  }

  generateMultiple(
    count: number,
    generationSettings?: Partial<GeneratorSettings>,
  ): PassphraseDetails[] {
    return Array.from({ length: count }, () =>
      this.generateDetails(generationSettings),
    );
  }

  static stipUmlauts(text: string) {
    return text
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/Ä/g, "A")
      .replace(/Ö/g, "O");
  }

  static fromText(text: string) {
    const wordList = text.split("\n").map((password) => password.trim());
    return new PasswordGenerator(wordList);
  }
}
