import { WordSource } from "@/app/passphrase/word-source/word-source";

export class ArrayWordSource implements WordSource {
  constructor(private readonly words: string[]) {}

  async getWord(id: number): Promise<string> {
    const word = this.words[id];
    if (word === undefined) {
      throw new Error(`Word not found at id ${id}`);
    }
    return word;
  }

  async getWordCount(): Promise<number> {
    return this.words.length;
  }
}
