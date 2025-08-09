import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
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
