import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

// Mock dependencies
vi.mock("@/app/passphrase/server", () => ({
  getPasswordGenerator: vi.fn(),
}));

vi.mock("@/app/passphrase/ai/actions", () => ({
  aiPassphraseEnhancement: vi.fn(),
}));

import { getPasswordGenerator } from "@/app/passphrase/server";
import { aiPassphraseEnhancement } from "@/app/passphrase/ai/actions";

describe("GET /api/salasana", () => {
  const mockTraditionalPassword = "Kissa-Koira-Auto-5";
  const mockAiPassword = "5-Kissaa-leikkii-yhdessa";

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock traditional password generator
    vi.mocked(getPasswordGenerator).mockResolvedValue({
      generate: vi.fn().mockReturnValue(mockTraditionalPassword),
    } as any);

    // Mock AI enhancement
    vi.mocked(aiPassphraseEnhancement).mockResolvedValue({
      passphrase: mockAiPassword,
      parts: ["5", "Kissaa", "leikkii", "yhdessa"],
      separator: "-",
    });
  });

  function createRequest(queryParams: Record<string, string> = {}) {
    const url = new URL("http://localhost:3000/api/salasana");
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return new NextRequest(url);
  }

  describe("Traditional password generation", () => {
    it("should generate traditional password when no query parameter is provided", async () => {
      const request = createRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ password: mockTraditionalPassword });
      expect(getPasswordGenerator).toHaveBeenCalledOnce();
      expect(aiPassphraseEnhancement).not.toHaveBeenCalled();
    });

    it("should generate traditional password when ai=false", async () => {
      const request = createRequest({ ai: "false" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ password: mockTraditionalPassword });
      expect(getPasswordGenerator).toHaveBeenCalledOnce();
      expect(aiPassphraseEnhancement).not.toHaveBeenCalled();
    });
  });

  describe("AI-enhanced password generation", () => {
    it("should generate AI password when ai=true", async () => {
      const request = createRequest({ ai: "true" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ password: mockAiPassword });
      expect(aiPassphraseEnhancement).toHaveBeenCalledOnce();
      expect(getPasswordGenerator).not.toHaveBeenCalled();
    });
  });

  describe("Query parameter validation", () => {
    it("should return 400 error for invalid ai parameter value", async () => {
      const request = createRequest({ ai: "invalid" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid query parameters");
      expect(data).toHaveProperty("details");
      expect(aiPassphraseEnhancement).not.toHaveBeenCalled();
      expect(getPasswordGenerator).not.toHaveBeenCalled();
    });

    it("should return 400 error for ai=1", async () => {
      const request = createRequest({ ai: "1" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid query parameters");
    });

    it("should return 400 error for ai=0", async () => {
      const request = createRequest({ ai: "0" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid query parameters");
    });

    it("should return 400 error for ai=yes", async () => {
      const request = createRequest({ ai: "yes" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid query parameters");
    });

    it("should return 400 error for ai=no", async () => {
      const request = createRequest({ ai: "no" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid query parameters");
    });

    it("should ignore unknown query parameters", async () => {
      const request = createRequest({ unknown: "param", other: "value" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ password: mockTraditionalPassword });
    });
  });

  describe("Error handling", () => {
    it("should propagate AI enhancement errors", async () => {
      const errorMessage = "OpenAI API rate limit exceeded";
      vi.mocked(aiPassphraseEnhancement).mockRejectedValue(
        new Error(errorMessage),
      );

      const request = createRequest({ ai: "true" });

      await expect(GET(request)).rejects.toThrow(errorMessage);
    });

    it("should propagate password generator errors", async () => {
      const errorMessage = "Failed to fetch word list";
      vi.mocked(getPasswordGenerator).mockRejectedValue(
        new Error(errorMessage),
      );

      const request = createRequest();

      await expect(GET(request)).rejects.toThrow(errorMessage);
    });
  });
});
