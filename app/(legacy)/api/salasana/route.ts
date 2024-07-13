import { NextResponse } from "next/server";
import { getPasswordGenerator } from "@/app/passphrase/server";

/**
 * API route that is backwards compatible with legacy salasanaseppa.com
 * @constructor
 */
export async function GET() {
  const passwordGenerator = await getPasswordGenerator();
  return NextResponse.json({ password: passwordGenerator.generate() });
}

export const dynamic = "force-dynamic";
