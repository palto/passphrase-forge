import "@testing-library/jest-dom/vitest";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.development.local for testing
config({ path: resolve(process.cwd(), ".env.development.local") });
