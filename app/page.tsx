import {PassphraseComponent} from '@/app/passphrase/passphrase-component';
export default async function Home() {

  return (
    <main className="flex items-center flex-col pt-20">
      <h1 className="text-2xl">Passphrase Forge</h1>
      <PassphraseComponent />
    </main>
  );
}
