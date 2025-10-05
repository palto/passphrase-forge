// Import idb for IndexedDB access
importScripts("https://cdn.jsdelivr.net/npm/idb@8/build/umd.js");

const DB_NAME = "wordlist-db";
const DB_VERSION = 1;

async function initializeWordlist(url) {
  const startTime = performance.now();
  console.log("[Worker] Starting wordlist initialization");

  try {
    // Fetch wordlist
    const fetchStart = performance.now();
    console.log(`[Worker] Fetching wordlist from ${url}`);
    const response = await fetch(url);
    const text = await response.text();
    console.log(
      `[Worker] Fetch completed in ${performance.now() - fetchStart}ms (${text.length} bytes)`,
    );

    // Parse wordlist
    const parseStart = performance.now();
    const words = text
      .split("\n")
      .map((word) => word.trim())
      .filter(Boolean);
    console.log(
      `[Worker] Parsed ${words.length} words in ${performance.now() - parseStart}ms`,
    );

    // Open database
    const dbStart = performance.now();
    console.log("[Worker] Opening IndexedDB");
    const db = await idb.openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore("words");
        db.createObjectStore("meta");
      },
    });
    console.log(
      `[Worker] IndexedDB opened in ${performance.now() - dbStart}ms`,
    );

    // Store words
    const storeStart = performance.now();
    console.log(`[Worker] Storing ${words.length} words to IndexedDB`);
    const tx = db.transaction(["words", "meta"], "readwrite");
    tx.objectStore("meta").put(words.length, "count");

    const wordStore = tx.objectStore("words");
    for (let i = 0; i < words.length; i++) {
      wordStore.put(words[i], i); // Don't await - batch all operations
    }

    await tx.done;
    console.log(
      `[Worker] All words stored in ${performance.now() - storeStart}ms`,
    );

    const totalTime = performance.now() - startTime;
    console.log(`[Worker] Total initialization time: ${totalTime}ms`);

    self.postMessage({ success: true, count: words.length });
  } catch (error) {
    console.error(`[Worker] Error during initialization:`, error);
    self.postMessage({ success: false, error: error.message });
  }
}

self.onmessage = (event) => {
  const { url } = event.data;
  initializeWordlist(url);
};
