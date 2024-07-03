import {PassphraseForm} from '@/app/passphrase/passphrase-form';

export default function Home() {
  return (
    <main className="flex items-center flex-col pt-20">
      <h1 className="text-2xl">Passphrase Forge</h1>
      <PassphraseForm />
    </main>
  );
}
