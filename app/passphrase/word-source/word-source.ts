import { ArrayWordSource } from "@/app/passphrase/word-source/array-word-source";

export interface WordSource {
  getWord(id: number): Promise<string>;
  getWordCount(): Promise<number>;
}

export async function fetchWordSource(url: string): Promise<WordSource> {
  const response = await fetch(url);
  const text = await response.text();
  const words = text.split("\n");
  return new ArrayWordSource(words);
}
