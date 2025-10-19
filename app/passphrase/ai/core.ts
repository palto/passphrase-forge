import { generateObject, LanguageModel } from "ai";
import { z } from "zod";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";

/**
 * Enhance a single passphrase using AI
 * Pure function that can be used in any environment (web, CLI, etc.)
 */
export async function aiEnhance(
  details: PassphraseDetails,
  model: LanguageModel,
): Promise<PassphraseDetails> {
  const result = await generateObject({
    model,
    system: `
        TÄRKEINTÄ: Säilytä numero täsmälleen samanlaisena! Älä koskaan muuta numeroa sanaksi (esim. "5" ei saa tulla "viisi").
        CRITICAL: Keep the number exactly as-is! Never convert numbers to words (e.g. "5" must NOT become "viisi").

        Annan sinulle tehtävän, joka on suoritettava vaiheissa. Käytä aina samaa sanamuotoa kuin ohjeissa ja varmista, että noudatat jokaista vaihetta tarkasti.

        Käyttäjä antaa sinulle sanoja sekä yhden numeron.

        Keksi 3 eri synonyymiä jokaiselle sanalle ja valitse niistä sellainen jonka yläasteen käynyt ymmärtää.

        Tee sanoista lause joka on kieliopillisesti oikein ja lyhyt.
        Voit taivuttaa sanoja mielesi mukaan. Kaikkia sanoja ei ole pakko käyttää.

        PAKOLLINEN EHTO: Lauseessa pitää olla mukana alkuperäinen numero numeromuodossa, muuten se ei kelpaa.
        ÄLÄ KOSKAAN muuta numeroa kirjaimiksi tai sanoiksi!
        MANDATORY: The sentence must contain the original number in numeric format, or it's invalid.
        NEVER convert numbers to letters or words!

        PITUUSVAATIMUS: Lauseessa on oltava TASAN 4-7 sanaa. Laske sanat tarkkaan!
        LENGTH REQUIREMENT: The sentence must have EXACTLY 4-7 words. Count words carefully!

        ISOT ALKUKIRJAIMET - PAKOLLINEN SÄÄNTÖ:
        Jos lause alkaa numerolla: "5-Kissaa-leikkii-yhdessä" (numeroa seuraava sana ISO KIRJAIN!)
        Jos lause alkaa sanalla: "Kissa-ja-5-koiraa-leikkivät" (ensimmäinen sana ISO KIRJAIN!)

        CAPITALIZATION - MANDATORY RULE:
        If starts with number: "5-Kissaa-leikkii-yhdessä" (word after number CAPITAL!)
        If starts with word: "Kissa-ja-5-koiraa-leikkivät" (first word CAPITAL!)

        VÄÄRÄ: "5-kissaa-leikkii" OIKEA: "5-Kissaa-leikkii"
        WRONG: "5-kissaa-leikkii" RIGHT: "5-Kissaa-leikkii"

        Jos lauseessa on yli 7 sanaa tai vähemmän kuin 4 sanaa, tee lause uudestaan. Jatka niin kauan kunnes nämä ehdot täyttyvät

        MUISTA: Alkuperäinen numero pitää näkyä lopputuloksessa numeromuodossa!
        REMEMBER: The original number must appear in the final result in numeric format!

        Anna lopullinen teksti JSON-muodossa avaimella "passphrase"
        `,
    prompt: details.parts.join(" "),
    schema: z.object({
      passphrase: z.string(),
    }),
  });

  const parts = result.object.passphrase
    // Remove characters , . : from passphrase
    .replace(/[,.:]/g, "")
    .split(" ");

  const passphrase = parts.join(details.separator);

  return { ...details, parts, passphrase };
}

/**
 * Generate a single AI-enhanced passphrase
 * Pure function that can be used in any environment (web, CLI, etc.)
 */
export async function generateAiPassphrase(
  passwordGenerator: PasswordGenerator,
  model: LanguageModel,
  generatorSettings?: Partial<GeneratorSettings>,
): Promise<PassphraseDetails> {
  const details = await passwordGenerator.generateDetails(generatorSettings);
  const aiDetails = await aiEnhance(details, model);
  const settings = {
    ...defaultGeneratorSettings,
    ...generatorSettings,
  };
  const passphrase = settings.stripUmlauts
    ? PasswordGenerator.stripUmlauts(aiDetails.passphrase)
    : aiDetails.passphrase;
  return { ...aiDetails, passphrase };
}

const DEFAULT_PASSPHRASE_COUNT = 5;

/**
 * Generate multiple AI-enhanced passphrases in parallel
 * Pure function that can be used in any environment (web, CLI, etc.)
 */
export async function generateMultipleAiPassphrases(
  passwordGenerator: PasswordGenerator,
  model: LanguageModel,
  generatorSettings?: Partial<GeneratorSettings>,
  count: number = DEFAULT_PASSPHRASE_COUNT,
): Promise<PassphraseDetails[]> {
  const settings = {
    ...defaultGeneratorSettings,
    ...generatorSettings,
  };

  // Generate multiple base passphrases in parallel
  const baseDetailsArray = await passwordGenerator.generateMultiple(
    count,
    generatorSettings,
  );

  // Enhance all passphrases in parallel
  const enhancedDetailsPromises = baseDetailsArray.map(async (details) => {
    try {
      const aiDetails = await aiEnhance(details, model);
      const passphrase = settings.stripUmlauts
        ? PasswordGenerator.stripUmlauts(aiDetails.passphrase)
        : aiDetails.passphrase;
      return { ...aiDetails, passphrase };
    } catch (error) {
      // If AI enhancement fails, return the original passphrase
      console.warn("AI enhancement failed for one passphrase:", error);
      return details;
    }
  });

  return await Promise.all(enhancedDetailsPromises);
}
