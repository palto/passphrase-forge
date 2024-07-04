import { NextResponse } from "next/server";
import { PasswordGenerator } from "@/app/passphrase/password-generator";

const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

let passwordGenerator: Promise<PasswordGenerator> | undefined;

/**
 * API route that is backwards compatible with legacy salasanaseppa.com
 * @constructor
 */
export async function GET() {
  const passwordGenerator = await getPasswordGenerator();
  return NextResponse.json({ password: passwordGenerator.generate() });
}

async function getPasswordGenerator() {
  if (!passwordGenerator) {
    passwordGenerator = fetch(wordListUrl, {
      cache: "no-cache",
    }).then(async (response) => {
      return PasswordGenerator.fromText(await response.text());
    });
  }
  return passwordGenerator;
}

export const dynamic = "force-dynamic";
