import { openDB, DBSchema, IDBPDatabase } from "idb";

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

const DB_NAME = "wordlist-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WordlistDB>> | null = null;

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

export async function storeWords(words: string[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["words", "meta"], "readwrite");

  // Store word count in meta
  await tx.objectStore("meta").put(words.length, "count");

  // Store each word with its index as key
  const wordStore = tx.objectStore("words");
  for (let i = 0; i < words.length; i++) {
    await wordStore.put(words[i], i);
  }

  await tx.done;
}
