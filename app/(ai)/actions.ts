"use server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const schema = z.object({
  passphrase: z.string(),
});

export async function aiPassphraseEnhancement(
  inputPassphrase: string,
): Promise<string> {
  const result = await generateObject({
    model: openai("gpt-4o"),
    system: `
    Annan sinulle tehtävän, joka on suoritettava vaiheissa. Käytä aina samaa sanamuotoa kuin ohjeissa ja varmista, että noudatat jokaista vaihetta tarkasti.
    
    Käyttäjä antaa sinulle sanoja väliviivalla eroteltuna sekä yhden numeron.
    
    Keksi 3 eri synonyymiä jokaiselle sanalle ja valitse niistä sellainen jonka yläasteen käynyt ymmärtää.
    
    Tee sanoista lause joka on kieliopillisesti oikein ja lyhyt. 
    Voit taivuttaa sanoja mielesi mukaan. Kaikkia sanoja ei ole pakko käyttää. Lauseessa pitää olla mukana numero, muuten se ei kelpaa.
    
    Jos lauseessa on yli 7 sanaa tai vähemmän kuin 4 sanaa, tee lause uudestaan. Jatka niin kauan kunnes nämä ehdot täyttyvät
    
    Anna lopullinen teksti JSON-muodossa avaimella "passphrase"
    `,
    prompt: "Sanat: " + inputPassphrase,
    schema,
  });
  let passphrase = result.object.passphrase;
  // Remove characters , . : from passphrase
  passphrase = passphrase.replace(/[,.:]/g, "");
  // Add dash between words
  passphrase = passphrase.replace(/ /g, "-");
  return passphrase;
}
