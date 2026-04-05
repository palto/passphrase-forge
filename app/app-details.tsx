import React from "react";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";

async function getMcpUrl() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}/api/mcp`;
}

export async function AppDetails() {
  const [locale, mcpUrl] = await Promise.all([getLocale(), getMcpUrl()]);
  return (
    <>
      {locale === "fi" && <DetailsFi mcpUrl={mcpUrl} />}
      {locale === "en" && <DetailsEn mcpUrl={mcpUrl} />}
    </>
  );
}

function DetailsFi({ mcpUrl }: { mcpUrl: string }) {
  return (
    <>
      <h2 className="text-xl">Mikä se Salasanaseppä oikein on?</h2>
      <p className="text-sm">
        Salasanaseppä luo turvallisia ja helposti muistettavia salasanoja
        käyttämällä Kotuksen virallista suomen kielen sanalistaa siemensanoina.
        Tekoäly muokkaa nämä siemensanat kieliopillisesti oikeiksi, helposti
        muistettaviksi lauseiksi. Jokaisessa salasanassa on isoja ja pieniä
        kirjaimia, erikoismerkkejä ja numeroita, muotoiltuna luonnolliseksi
        suomalaiseksi lauseeksi numerosarjan kanssa.
      </p>
      <h2 className="text-xl">Miksi salasanat on helppo muistaa?</h2>
      <p className="text-sm">
        Salasanat ovat helppoja muistaa, koska tekoäly muodostaa Kotuksen
        sanalistan sanoista järkeviä suomen kielen lauseita. Satunnaisten
        sanojen sijaan saat kieliopillisesti oikean lauseen, jonka aivosi
        muistavat helposti. Siemensanat tulevat Kotuksen (Kotimaisten kielten
        keskus) virallisesta sanalistasta osoitteessa
        http://kaino.kotus.fi/sanat/nykysuomi/
      </p>
      <h2 className="text-xl">Muistaako Salasanaseppä salasanani?</h2>
      <p className="text-sm">
        Ei! Salasanaseppä unohtaa välittömästi takomansa salasanan.
        Salasanaseppää ei siis voi käyttää salasanavarastona.
      </p>
      <h2 className="text-xl">
        Miksi salasanasepän salasanat ovat turvallisia?
      </h2>
      <p className="text-sm">
        Turvallisuus perustuu laajaan Kotuksen sanalistaan, jota käytetään
        siemensanoina. Vaikka tietäisi miten salasanat muodostetaan, oikeiden
        siemensanojen arvaaminen vaatii 94 000 ^ 3 = 830 584 miljardia yritystä.
        Tekoälyn muunnos lisää monimutkaisuutta säilyttäen samalla
        muistettavuuden.
      </p>
      <h2 className="text-xl">Käytä tekoälyassistentissasi</h2>
      <p className="text-sm">
        Salasanaseppä tukee MCP-protokollaa (Model Context Protocol), joten voit
        generoida salasanoja suoraan tekoälyassistentistasi kuten Claude
        Desktopista tai Claude Codesta.
      </p>
      <p className="text-sm">
        Lisää palvelin Claude Desktop -asetuksiin (
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
          claude_desktop_config.json
        </code>
        ):
      </p>
      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto w-full">
        {`{
  "mcpServers": {
    "passphrase-forge": {
      "type": "http",
      "url": "${mcpUrl}"
    }
  }
}`}
      </pre>
      <p className="text-sm">
        Claude Codessa:{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
          {`claude mcp add --transport http passphrase-forge ${mcpUrl}`}
        </code>
      </p>
    </>
  );
}

function DetailsEn({ mcpUrl }: { mcpUrl: string }) {
  return (
    <>
      <h2 className="text-xl">What is Passphrase Forge?</h2>
      <p className="text-sm">
        Passphrase Forge creates secure, memorable passwords by using words from
        the official Kotus Finnish wordlist as seed material. AI then transforms
        these seed words into grammatically correct, easy-to-remember sentences.
        Each password contains uppercase and lowercase letters, special
        characters, and numbers, formatted as a natural Finnish sentence with a
        numeric sequence.
      </p>
      <h2 className="text-xl">Why are the passwords easy to remember?</h2>
      <p className="text-sm">
        The passwords are easy to remember because AI transforms seed words from
        the Kotus wordlist into natural Finnish sentences that make sense.
        Instead of random words, you get grammatically correct phrases that your
        brain can easily recall. The seed words come from the official Kotus
        (Institute for the Languages of Finland) wordlist at
        http://kaino.kotus.fi/sanat/nykysuomi/
      </p>
      <h2 className="text-xl">Does Passphrase Forge remember my password?</h2>
      <p className="text-sm">
        No! Passphrase Forge forgets the password it generated immediately.
        Therefore, you cannot use Passphrase Forge as a password storage.
      </p>
      <h2 className="text-xl">Why are Passphrase Forges passwords secure?</h2>
      <p className="text-sm">
        The security comes from the vast Kotus wordlist used as seed material.
        Even knowing how the passwords are constructed, guessing the correct
        seed words requires 94,000 ^ 3 = 830,584 billion attempts. The AI
        transformation adds another layer of complexity while maintaining
        memorability.
      </p>
      <h2 className="text-xl">Use inside your AI assistant</h2>
      <p className="text-sm">
        Passphrase Forge supports the MCP protocol (Model Context Protocol), so
        you can generate passphrases directly from your AI assistant such as
        Claude Desktop or Claude Code.
      </p>
      <p className="text-sm">
        Add the server to your Claude Desktop config (
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
          claude_desktop_config.json
        </code>
        ):
      </p>
      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto w-full">
        {`{
  "mcpServers": {
    "passphrase-forge": {
      "type": "http",
      "url": "${mcpUrl}"
    }
  }
}`}
      </pre>
      <p className="text-sm">
        In Claude Code:{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
          {`claude mcp add --transport http passphrase-forge ${mcpUrl}`}
        </code>
      </p>
    </>
  );
}
