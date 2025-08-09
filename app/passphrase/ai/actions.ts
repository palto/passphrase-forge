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
        Annan sinulle tehtävän, joka on suoritettava vaiheissa. Käytä aina samaa sanamuotoa kuin ohjeissa ja varmista, että noudatat jokaista vaihetta tarkasti.
        
        Käyttäjä antaa sinulle sanoja sekä yhden numeron.
        
        Keksi 3 eri synonyymiä jokaiselle sanalle ja valitse niistä sellainen jonka yläasteen käynyt ymmärtää.
        
        Tee sanoista lause joka on kieliopillisesti oikein ja lyhyt. 
        Voit taivuttaa sanoja mielesi mukaan. Kaikkia sanoja ei ole pakko käyttää. Lauseessa pitää olla mukana numero, muuten se ei kelpaa.
        Älä muuta numeroa kirjaimiksi
        
        Jos lauseessa on yli 7 sanaa tai vähemmän kuin 4 sanaa, tee lause uudestaan. Jatka niin kauan kunnes nämä ehdot täyttyvät
        
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
