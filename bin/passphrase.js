#!/usr/bin/env node

// Wrapper to execute the TypeScript CLI using tsx
const { spawn } = require('child_process');
const { resolve } = require('path');

const cliPath = resolve(__dirname, 'passphrase-cli.ts');
const tsxPath = resolve(__dirname, '../node_modules/.bin/tsx');

const child = spawn(tsxPath, [cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
