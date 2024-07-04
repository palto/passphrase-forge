import React from "react";
import { useLocale } from "next-intl";

export function AppDetails() {
  const locale = useLocale();
  return (
    <>
      {locale === "fi" && <DetailsFi />}
      {locale === "en" && <DetailsEn />}
    </>
  );
}

function DetailsFi() {
  return (
    <>
      <h2 className="text-xl">Mikä se Salasanaseppä oikein on?</h2>
      <p className="text-sm">
        Salasanaseppä luo turvallisia mutta helposti muistettavia salasanoja
        joita voit käyttää missä tahansa palvelussa johon rekisteröityminen
        vaatii salasanan keksimisen. Luoduissa salasanoissa on aina isoja ja
        pieniä kirjamia, erikoismerkkejä ja numeroita. Salasanassa 3 tavallista
        sanaa ja 1 numerosarja. Sanat ja numerosarjat on eroteltu toisistaan
        viivan ( - ) merkillä.
      </p>
      <h2 className="text-xl">Miksi salasanat on helppo muistaa?</h2>
      <p className="text-sm">
        Salasanat ovat helppoja muistaa, koska niissä on käytetty suomen kielen
        sanoja. Salasanaseppä on oppinut sanat Kotimaisten kielten keskuksen
        Kaino sanastosta. Kaino-sanaston löydät osoitteesta
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
        Koska salasanasepän sanasto on niin pitkä, on salasanaa vaikea arvata
        vaikka tietäisikin kuinka salasana on muodostettu. Jo pelkästään 3 sanan
        oikeaan arvaamiseen tarvitaan 94 000 ^ 3 = 830 584 miljardia yritystä,
        puhumattakaan vielä numerosarjan arvaamisesta!
      </p>
    </>
  );
}

function DetailsEn() {
  return (
    <>
      <h2 className="text-xl">What is Passphrase Forge?</h2>
      <p className="text-sm">
        Passphrase Forge creates secure yet easy-to-remember passwords that you
        can use for any service that requires a password upon registration. The
        generated passwords always contain uppercase and lowercase letters,
        special characters, and numbers. Each password consists of 3 common
        words and 1 numeric sequence. The words and numeric sequences are
        separated by a hyphen (-).
      </p>
      <h2 className="text-xl">Why are the passwords easy to remember?</h2>
      <p className="text-sm">
        The passwords are easy to remember because they use Finnish words.
        Passphrase Forge has learned the words from the Kaino vocabulary of the
        Institute for the Languages of Finland. You can find the Kaino
        vocabulary at http://kaino.kotus.fi/sanat/nykysuomi/
      </p>
      <h2 className="text-xl">Does Passphrase Forge remember my password?</h2>
      <p className="text-sm">
        No! Passphrase Forge forgets the password it generated immediately.
        Therefore, you cannot use Passphrase Forge as a password storage.
      </p>
      <h2 className="text-xl">Why are Passphrase Forges passwords secure?</h2>
      <p className="text-sm">
        Because Passphrase Forges vocabulary is so extensive, it is difficult to
        guess the password even if one knows how it is constructed. Just
        guessing the correct 3 words requires 94,000 ^ 3 = 830,584 billion
        attempts, not to mention the numeric sequence!
      </p>
    </>
  );
}
