import { getWord, getWordCount } from "@/app/passphrase/db/wordlist-db";

export interface WordSource {
  getWord(id: number): Promise<string>;
  getWordCount(): Promise<number>;
}

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

export class IndexedDBWordSource implements WordSource {
  async getWord(id: number): Promise<string> {
    return getWord(id);
  }

  async getWordCount(): Promise<number> {
    return getWordCount();
  }
}
