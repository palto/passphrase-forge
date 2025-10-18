import { PasswordGenerator } from "@/app/passphrase/password-generator";
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

let passwordGenerator: Promise<PasswordGenerator> | undefined;

export async function getPasswordGenerator() {
  if (!passwordGenerator) {
    passwordGenerator = fetch(wordListUrl, {
      cache: "no-cache",
    }).then(async (response) => {
      return PasswordGenerator.fromText(await response.text());
    });
  }
  return passwordGenerator;
}
