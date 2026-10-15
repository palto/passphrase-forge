import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": fileURLToPath(
        new URL("./test-utils/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    env: {
      // Load environment variables for testing
      ...process.env,
    },
  },
  // Load environment files like Next.js does
  envDir: ".",
  envPrefix: ["VITE_", "NEXT_PUBLIC_", "OPENAI_", "RUN_AI_", "AI_TEST_"],
});
