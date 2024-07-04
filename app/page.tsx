import {PassphraseComponent} from '@/app/passphrase/passphrase-component';
import {DarkThemeToggle} from 'flowbite-react';
import React from 'react';
export default async function Home() {
  return (
      <main className="flex items-center flex-col pt-20 space-y-4 mx-auto max-w-lg px-4">
        <h1 className="text-2xl">Passphrase Forge</h1>
        <PassphraseComponent />
        <DarkThemeToggle />
      </main>
  );
}
