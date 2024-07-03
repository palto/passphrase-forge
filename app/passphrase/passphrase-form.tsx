"use client"
import { useFormState } from 'react-dom'
import {generatePassphrase} from '@/app/passphrase/actions';

export function PassphraseForm() {

  const [response, generateAction] = useFormState(generatePassphrase, {
    passphrase: ""
  })

  return <form action={generateAction}>
    <input type="text" readOnly value={response.passphrase} className="border p-2 text-black"/>
    <button className="border p-2 bg-blue-500 text-white">Generate</button>
  </form>
}
