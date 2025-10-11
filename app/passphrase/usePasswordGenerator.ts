import { useState, useEffect } from "react";
import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { getWordCount } from "@/app/passphrase/db/wordlist-db";
import { IndexedDBWordSource } from "@/app/passphrase/word-source";

const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

// Module-level flag to prevent double initialization in React Strict Mode
let didInit = false;
let initPromise: Promise<void> | null = null;

async function initializeWordlist() {
  const wordCount = await getWordCount();

  if (wordCount === 0) {
    // Initialize wordlist in background worker using Next.js worker bundling
    const worker = new Worker(
      new URL("./workers/wordlist-worker.ts", import.meta.url),
    );
    worker.postMessage({ url: wordListUrl });

    await new Promise<void>((resolve, reject) => {
      worker.onmessage = (event) => {
        if (event.data.success) {
          resolve();
        } else {
          reject(new Error(event.data.error));
        }
        worker.terminate();
      };
    });
  }
}

export function usePasswordGenerator() {
  const [generator, setGenerator] = useState<PasswordGenerator | null>(null);

  useEffect(() => {
    const initializeIndexedDB = async () => {
      // Ensure initialization only happens once, even in React Strict Mode
      if (!didInit) {
        didInit = true;
        initPromise = initializeWordlist();
      }

      // Wait for initialization to complete (handles concurrent calls)
      await initPromise;

      // Create generator with IndexedDB word source
      const wordSource = new IndexedDBWordSource();
      const gen = new PasswordGenerator(wordSource);
      setGenerator(gen);
    };

    initializeIndexedDB();
  }, []);

  return generator;
}
