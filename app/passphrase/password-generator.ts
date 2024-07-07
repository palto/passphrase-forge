export class PasswordGenerator {
  private readonly totalWords;
  private readonly wordCount = 3;
  constructor(private readonly passwordList: string[]) {
    this.totalWords = passwordList.length;
  }

  getRandomWord() {
    return this.passwordList[Math.floor(Math.random() * this.totalWords)];
  }

  generate() {
    const words = Array.from({ length: this.wordCount }, () =>
      this.getRandomWord(),
    );
    // Number between 1 and 9
    const number = Math.floor(Math.random() * 9) + 1;
    words.push(number.toString());
    words.sort(() => Math.random() - 0.5);
    return words.join("-");
  }

  static fromText(text: string) {
    const wordList = text.split("\n").map((password) => password.trim());
    return new PasswordGenerator(wordList);
  }
}
