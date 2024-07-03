export class PasswordGenerator {
  private readonly wordCount;
  constructor(private readonly passwordList: string[]) {
    this.wordCount = passwordList.length;
  }

  getRandomWord() {
    return this.passwordList[Math.floor(Math.random() * this.wordCount)];
  }

  generate() {
    const words = Array.from({length: 4}, () => this.getRandomWord());
    const number = Math.floor(Math.random() * 990) + 10;
    words.push(number.toString());
    words.sort(() => Math.random() - 0.5);
    return words.join('-');
  }

  static fromText(text: string) {
    const wordList = text.split('\n').map(password => password.trim());
    return new PasswordGenerator(wordList);
  }
}
