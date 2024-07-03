import {ClientPassphraseForm} from '@/app/passphrase/client-passphrase-form';
const passwordFileUrl = process.env.PASSWORD_LIST_URL as string;
export default async function Home() {
  const response = await fetch(passwordFileUrl, {
    cache: "no-cache"
  });

  const wordFile = await response.text();
  return (
    <main className="flex items-center flex-col pt-20">
      <h1 className="text-2xl">Passphrase Forge</h1>
      <ClientPassphraseForm wordFile={wordFile} />
    </main>
  );
}
