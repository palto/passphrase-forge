#!/usr/bin/env node

import { Command } from "commander";
import { config } from "dotenv";
import { getWordlistGenerator } from "@/lib/cli/wordlist-loader";
import { GeneratorSettings } from "@/app/passphrase/password-generator";
import { getGenerator } from "@/app/passphrase/generators/registry";

// Load environment variables from .env.local quietly
config({ path: ".env.local", quiet: true });

const program = new Command();

program
  .name("passphrase")
  .description("CLI tool for generating secure passphrases")
  .version("1.0.0")
  .option("-w, --words <number>", "Number of words", "3")
  .option("-s, --separator <string>", "Separator between words", "-")
  .option("-d, --digits <number>", "Number of digits to include", "1")
  .option("-c, --count <number>", "Number of passphrases to generate", "1")
  .option("--no-strip-umlauts", "Don't strip Finnish umlauts (ä, ö)")
  .option("--json", "Output as JSON")
  .option("-g, --generator <type>", "Generator type: basic or gpt-4o", "gpt-4o")
  .action(async (options) => {
    try {
      const passwordGenerator = await getWordlistGenerator();
      const passphraseGenerator = getGenerator(
        options.generator,
        passwordGenerator,
      );

      const settings: Partial<GeneratorSettings> = {
        wordCount: parseInt(options.words),
        separator: options.separator,
        digits: parseInt(options.digits),
        stripUmlauts: options.stripUmlauts,
      };

      const count = parseInt(options.count);
      const passphrases = await passphraseGenerator.generateMultiple(
        count,
        settings,
      );

      if (options.json) {
        console.log(JSON.stringify(passphrases, null, 2));
      } else {
        passphrases.forEach((p) => {
          console.log(p.passphrase);
        });
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      process.exit(1);
    }
  });

program.parse();
