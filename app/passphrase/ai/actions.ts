"use server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PassphraseDetails,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";
import { getPasswordGenerator } from "@/app/passphrase/server";

const schema = z.object({
  passphrase: z.string(),
});

export async function aiPassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
): Promise<PassphraseDetails> {
  const passwordGenerator = await getPasswordGenerator();
  const details = passwordGenerator.generateDetails(generatorSettings);
  const aiDetails = await aiEnhance(details);
  const settings = {
    ...defaultGeneratorSettings,
    ...generatorSettings,
  };
  const passphrase = settings.stripUmlauts
    ? PasswordGenerator.stipUmlauts(aiDetails.passphrase)
    : aiDetails.passphrase;
  return { ...aiDetails, passphrase };
}

const DEFAULT_PASSPHRASE_COUNT = 5;

export async function aiMultiplePassphraseEnhancement(
  generatorSettings?: Partial<GeneratorSettings>,
  count: number = DEFAULT_PASSPHRASE_COUNT,
): Promise<PassphraseDetails[]> {
  const passwordGenerator = await getPasswordGenerator();
  const settings = {
    ...defaultGeneratorSettings,
    ...generatorSettings,
  };

  // Generate multiple base passphrases in parallel
  const baseDetailsPromises = Array.from({ length: count }, () =>
    passwordGenerator.generateDetails(generatorSettings),
  );
  const baseDetailsArray = await Promise.all(baseDetailsPromises);

  // Enhance all passphrases in parallel
  const enhancedDetailsPromises = baseDetailsArray.map(async (details) => {
    try {
      const aiDetails = await aiEnhance(details);
      const passphrase = settings.stripUmlauts
        ? PasswordGenerator.stipUmlauts(aiDetails.passphrase)
        : aiDetails.passphrase;
      return { ...aiDetails, passphrase };
    } catch (error) {
      // If AI enhancement fails, return the original passphrase
      console.warn("AI enhancement failed for one passphrase:", error);
      return details;
    }
  });

  const results = await Promise.all(enhancedDetailsPromises);
  return results;
}

export async function aiEnhance(
  details: PassphraseDetails,
): Promise<PassphraseDetails> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateObject({
        model: openai("gpt-4o"),
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
        schema,
      });

      const parts = result.object.passphrase
        // Remove characters , . : from passphrase
        .replace(/[,.:]/g, "")
        .split(" ");

      const passphrase = parts.join(details.separator);

      return { ...details, parts, passphrase };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }
    }
  }

  throw new Error(
    `AI enhancement failed after ${maxRetries} attempts. Last error: ${lastError?.message}`,
  );
}
