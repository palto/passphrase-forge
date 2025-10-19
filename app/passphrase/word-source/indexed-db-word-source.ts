import { WordSource } from "@/app/passphrase/word-source/word-source";
import { openDB, DBSchema, IDBPDatabase } from "idb";

const DB_NAME = "wordlist-db";
const DB_VERSION = 1;
let dbPromise: Promise<IDBPDatabase<WordlistDB>> | null = null;

export class IndexedDbWordSource implements WordSource {
  async getWord(id: number): Promise<string> {
    return getWord(id);
  }

  async getWordCount(): Promise<number> {
    return getWordCount();
  }
}

interface WordlistDB extends DBSchema {
  words: {
    key: number;
    value: string;
  };
  meta: {
    key: "count";
    value: number;
  };
}

function getDB(): Promise<IDBPDatabase<WordlistDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WordlistDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore("words");
        db.createObjectStore("meta");
      },
    });
  }
  return dbPromise;
}

export async function getWordCount(): Promise<number> {
  const db = await getDB();
  const count = await db.get("meta", "count");
  return count ?? 0;
}

export async function getWord(id: number): Promise<string> {
  const db = await getDB();
  const word = await db.get("words", id);
  if (!word) {
    throw new Error(`Word not found at id ${id}`);
  }
  return word;
}
