"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function aiPassphraseEnhancement(
  inputPassphrase: string,
): Promise<string> {
  const result = await generateText({
    model: openai("gpt-4o"),
    system: `
    Annan sinulle tehtävän joka on suoritettava vaiheissa. 
Annan sinulle väliviivalla eroteltuja sanoja ja numeron.

1. Erottele sanat ja numerot listaksi
2. Selvitä jokaisen sanan kohdalla onko sille lyhyempi synonyymi. Jos on niin käytetään sitä. Jos kyseessä on numero, käytä sitä sellaisenaan
3. Listaa valitsemasi sanat alekkain
4. Tee valitsemistasi sanoista 5 lyhyttä lausetta. Taivuta sanat jotta lause on sujuvampi. Lauseen pitää sisältää myös numero
5. Valitse lauseista selkein ja yksinkertaisin lause jossa on numero
5. Laita lauseen eteen teksti "VASTAUS: " ja korvaa välilyönnit yhdysviivalla sekä poista pilkut ja pisteet
    `,
    prompt: inputPassphrase,
  });
  const text = result.text;
  // Find the passphrase from the text that is prefixed with "VASTAUS: "
  const parts = text.split("VASTAUS: ");
  // Answer is the last part
  return parts[parts.length - 1];
}
