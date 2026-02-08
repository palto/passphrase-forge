import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

// Mock dependencies
vi.mock("@/app/passphrase/server", () => ({
  getPasswordGenerator: vi.fn(),
}));

import { getPasswordGenerator } from "@/app/passphrase/server";
import type { PasswordGenerator } from "@/app/passphrase/password-generator";

describe("GET /api/salasana", () => {
  const mockTraditionalPassword = "Kissa-Koira-Auto-5";
  const mockAiPassword = "5-Kissaa-leikkii-yhdessa";

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock password generator with both generate and generateDetails methods
    const mockGenerator: Pick<
      PasswordGenerator,
      "generate" | "generateDetails"
    > = {
      generate: vi.fn().mockReturnValue(mockTraditionalPassword),
      generateDetails: vi.fn().mockResolvedValue({
        passphrase: mockAiPassword,
        parts: ["5", "Kissaa", "leikkii", "yhdessa"],
        separator: "-",
      }),
    };
    vi.mocked(getPasswordGenerator).mockResolvedValue(
      mockGenerator as PasswordGenerator,
    );
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
    });

    it("should generate traditional password when ai=false", async () => {
      const request = createRequest({ ai: "false" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ password: mockTraditionalPassword });
      expect(getPasswordGenerator).toHaveBeenCalledOnce();
    });
  });

  describe("AI-enhanced password generation", () => {
    it("should generate AI password when ai=true", async () => {
      const request = createRequest({ ai: "true" });
      const response = await GET(request);
      const data = await response.json();
      const mockGenerator =
        await vi.mocked(getPasswordGenerator).mock.results[0].value;

      expect(response.status).toBe(200);
      expect(data).toEqual({ password: mockAiPassword });
      expect(getPasswordGenerator).toHaveBeenCalledOnce();
      expect(mockGenerator.generateDetails).toHaveBeenCalledWith({
        mode: "gpt-4o",
      });
    });
  });

  describe("Query parameter validation", () => {
    it("should return 400 error for invalid ai parameter value", async () => {
      const request = createRequest({ ai: "invalid" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid query parameters");
      expect(data.details).toEqual({
        formErrors: [],
        fieldErrors: {
          ai: expect.arrayContaining([expect.any(String)]),
        },
      });
      console.log(data.details);
      expect(getPasswordGenerator).not.toHaveBeenCalled();
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
      const mockGenerator: Pick<
        PasswordGenerator,
        "generate" | "generateDetails"
      > = {
        generate: vi.fn().mockReturnValue(mockTraditionalPassword),
        generateDetails: vi.fn().mockRejectedValue(new Error(errorMessage)),
      };
      vi.mocked(getPasswordGenerator).mockResolvedValue(
        mockGenerator as PasswordGenerator,
      );

      const request = createRequest({ ai: "true" });

      expect(GET(request)).rejects.toThrow(errorMessage);
    });

    it("should propagate password generator errors", async () => {
      const errorMessage = "Failed to fetch word list";
      vi.mocked(getPasswordGenerator).mockRejectedValue(
        new Error(errorMessage),
      );

      const request = createRequest();

      expect(GET(request)).rejects.toThrow(errorMessage);
    });
  });
});
