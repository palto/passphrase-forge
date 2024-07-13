export type GeneratorSettings = {
  readonly wordCount: number;
  readonly separator: string;
  readonly numberCount: number;
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
    const settings = { ...this.defaultSettings, ...generationSettings };
    const parts = Array.from({ length: settings.wordCount }, () =>
      this.getRandomWord(),
    );
    if (settings.numberCount > 0) {
      const numbers = Array.from(
        { length: settings.numberCount },
        () => Math.floor(Math.random() * 9) + 1,
      );
      parts.push(numbers.join(""));
    }
    parts.sort(() => Math.random() - 0.5);
    return {
      parts,
      separator: settings.separator,
      passphrase: parts.join(settings.separator),
    };
  }

  static fromText(text: string) {
    const wordList = text.split("\n").map((password) => password.trim());
    return new PasswordGenerator(wordList);
  }
}
