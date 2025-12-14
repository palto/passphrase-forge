#!/usr/bin/env node

import { appendFileSync } from "fs";
import { config } from "dotenv";
import { Command } from "commander";
import { getPasswordGenerator } from "@/lib/cli/wordlist-loader";

config({ path: ".env.local", quiet: true });

const program = new Command();

program
  .name("batch-generate")
  .description("Generate passphrases in batches")
  .option("-t, --total <number>", "Total number of passphrases to generate", "20")
  .option("-b, --batch-size <number>", "Number of passphrases per batch", "5")
  .option("-o, --output <filename>", "Output filename", "passphrases.txt")
  .action(async (options) => {
    try {
      const passwordGenerator = await getPasswordGenerator();
      const batchSize = parseInt(options.batchSize);
      const total = parseInt(options.total);
      const batchCount = Math.ceil(total / batchSize);
      const outputFile = options.output;

      for (let i = 1; i <= batchCount; i++) {
        console.log(`Batch ${i}/${batchCount}`);

        const isLastBatch = i === batchCount;
        const currentBatchSize = isLastBatch ? total - (i - 1) * batchSize : batchSize;

        const passphrases = await passwordGenerator.generateMultiple(currentBatchSize, {
          mode: "gpt-4o",
        });
        const output = passphrases.map((p) => p.passphrase).join("\n") + "\n";

        appendFileSync(outputFile, output);
      }

      console.log(`Done! ${total} passphrases saved to ${outputFile}`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
      process.exit(1);
    }
  });

program.parse();
