import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPasswordGenerator } from "@/app/passphrase/server";
import { aiPassphraseEnhancement } from "@/app/passphrase/ai/actions";

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

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: result.error.format(),
      },
      { status: 400 },
    );
  }

  const { ai: useAi } = result.data;

  if (useAi) {
    const enhancedResult = await aiPassphraseEnhancement();
    return NextResponse.json({ password: enhancedResult.passphrase });
  }

  const passwordGenerator = await getPasswordGenerator();
  return NextResponse.json({ password: passwordGenerator.generate() });
}

export const dynamic = "force-dynamic";
