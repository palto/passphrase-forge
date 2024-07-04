'use client';
import useSWR from 'swr';
import React, {useState} from 'react';
import {PasswordGenerator} from '@/app/passphrase/password-generator';
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

export function PassphraseComponent() {

  const {data: generator} = useSWR(wordListUrl, async () => {
    const response = await fetch(wordListUrl);
    const text = await response.text();
    return PasswordGenerator.fromText(text);
  });

  if (!generator) {
    return <div>Loading...</div>
  }

  return <PasswordGeneratorComponent generator={generator} />
}

function PasswordGeneratorComponent({generator}: {
  readonly generator: PasswordGenerator
}) {
  const [passphrase, setPassphrase] = useState(generator.generate());
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPassphrase(generator.generate());
  }
  return <form onSubmit={handleSubmit}>
    <input type="text" readOnly value={passphrase} className="border p-2 text-black"/>
    <button className="border p-2 bg-blue-500 text-white">Generate</button>
  </form>
}
