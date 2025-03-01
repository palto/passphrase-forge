import { getRequestConfig } from "next-intl/server";
import Negotiator from "negotiator";
import { cookies, headers } from "next/headers";

const supportedLanguages = ["en", "fi"];
const defaultLanguage = "en";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  const h = headers();
  const languages = new Negotiator({
    headers: {
      "accept-language": h.get("accept-language") ?? undefined,
    },
  }).languages();

  let locale =
    languages.find((language) => supportedLanguages.includes(language)) ??
    defaultLanguage;

  const cookieLocale = cookies().get("NEXT_LOCALE");
  if (cookieLocale) {
    locale = cookieLocale.value;
  }

  // Turbopack doesn't support dynamic imports yet
  const messages =
    locale === "en"
      ? (await import(`@/messages/en.json`)).default
      : (await import(`@/messages/fi.json`)).default;
  return {
    locale,
    messages,
  };
});
