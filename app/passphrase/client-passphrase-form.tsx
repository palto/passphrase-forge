'use client';
import React, {useMemo} from 'react';
import {PasswordGenerator} from '@/app/passphrase/password-generator';

export function ClientPassphraseForm(props: {
  readonly wordFile: string
}) {

  const generator = useMemo(() => PasswordGenerator.fromText(props.wordFile), [props.wordFile]);
  const [passphrase, setPassphrase] = React.useState(generator.generate());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPassphrase(generator.generate());
  }

  return <form onSubmit={handleSubmit}>
    <p>Clientside</p>
    <input type="text" readOnly value={passphrase} className="border p-2 text-black"/>
    <button className="border p-2 bg-blue-500 text-white">Generate</button>
  </form>
}
