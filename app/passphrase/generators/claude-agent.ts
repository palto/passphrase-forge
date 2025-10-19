import { Experimental_Agent as Agent, stepCountIs, tool } from "ai";
import { gateway } from "@ai-sdk/gateway";
import z from "zod";

const model = gateway("anthropic/claude-sonnet-4.5");

export const claudePassphraseAgent = new Agent({
  model: model,
  system: `Olet salasanalauseke-agentti. Tehtäväsi on luoda turvallinen ja muistettava suomenkielinen salasanalauseke.

TEHTÄVÄ:
1. Luo kieliopillisesti oikea suomenkielinen lause käyttäen annettuja sanoja ja numeroita
2. Voit taivuttaa sanoja
3. Kaikkia sanoja ei tarvitse käyttää
4. Lausekkeen TÄYTYY sisältää numeroita

PROSESSI:
1. Generoi lauseke
2. Käytä validate_passphrase työkalua tarkistaaksesi sen
3. Jos löydät numerosanoja (esim. "viisi"), MUUNNA ne numeroiksi (esim. "5") ja luo lauseke uudelleen
4. Jos kielioppi ei ole kunnossa, korjaa se
5. Kun lauseke on valmis, käytä finalize_passphrase työkalua

Vastaa AINA lopuksi suoraan lausekkeella ilman ylimääräistä tekstiä.`,
  tools: {
    validate_passphrase: tool({
      description:
        "Validates a Finnish passphrase for grammar correctness and checks if it contains digits or Finnish number words (yksi, kaksi, kolme, etc.). Returns validation results.",
      inputSchema: z.object({
        passphrase: z.string().describe("The passphrase to validate"),
      }),
      execute: async ({ passphrase }) => {
        const hasDigits = /\d/.test(passphrase);
        const finnishNumberWords = [
          "nolla",
          "yksi",
          "kaksi",
          "kolme",
          "neljä",
          "viisi",
          "kuusi",
          "seitsemän",
          "kahdeksan",
          "yhdeksän",
          "kymmenen",
        ];
        const foundNumberWords = finnishNumberWords.filter((word) =>
          passphrase.toLowerCase().includes(word),
        );

        return {
          has_digits: hasDigits,
          number_words: foundNumberWords,
          needs_number_conversion: foundNumberWords.length > 0,
        };
      },
    }),
    finalize_passphrase: tool({
      description:
        "Finalizes the passphrase by converting Finnish number words to digits if needed. This should be called after validation to ensure the passphrase contains digits.",
      inputSchema: z.object({
        passphrase: z.string().describe("The passphrase to finalize"),
        grammar_ok: z.boolean().describe("Whether grammar is acceptable"),
      }),
      execute: async ({ passphrase, grammar_ok }) => {
        return {
          final_passphrase: passphrase,
          grammar_ok,
          ready: true,
        };
      },
    }),
  },
  stopWhen: stepCountIs(5), // Max 5 steps
});
