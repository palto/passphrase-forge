import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPasswordGenerator } from "@/app/passphrase/server";
import { captureServerSide } from "@/posthog/PostHogClient";

const querySchema = z.object({
  ai: z
    .stringbool({
      truthy: ["true"],
      falsy: ["false"],
    })
    .default(false),
});

/**
 * API route that is backwards compatible with legacy salasanaseppa.com
 * Supports AI enhancement via ?ai=true query parameter
 * @constructor
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse and validate query parameters
  const result = querySchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  void captureServerSide({
    event: "api:password_requested",
    properties: {
      $current_url: request.nextUrl.toString(),
      request_query: result.data,
    },
  });

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: z.flattenError(result.error),
      },
      { status: 400 },
    );
  }

  const { ai: useAi } = result.data;
  const passwordGenerator = await getPasswordGenerator();

  if (useAi) {
    void captureServerSide({
      event: "passphrase_generated",
      properties: {
        count: 1,
        generator_settings: undefined,
      },
    });
    const enhancedResult = await passwordGenerator.generateDetails({
      mode: "gpt-4o",
    });
    return NextResponse.json({ password: enhancedResult.passphrase });
  }

  const password = await passwordGenerator.generate();
  return NextResponse.json({ password: password });
}

export const dynamic = "force-dynamic";
