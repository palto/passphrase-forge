import { useState, useEffect } from "react";
import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { getWordCount } from "@/app/passphrase/db/wordlist-db";
import { IndexedDBWordSource } from "@/app/passphrase/word-source";

const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

export function usePasswordGenerator() {
  const [generator, setGenerator] = useState<PasswordGenerator | null>(null);

  useEffect(() => {
    const initializeIndexedDB = async () => {
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

      // Create generator with IndexedDB word source
      const wordSource = new IndexedDBWordSource();
      const gen = new PasswordGenerator(wordSource);
      setGenerator(gen);
    };

    initializeIndexedDB();
  }, []);

  return generator;
}
