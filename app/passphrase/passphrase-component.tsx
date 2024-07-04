"use client";
import useSWR from "swr";
import React, { useState } from "react";
import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { Button, TextInput, Clipboard } from "flowbite-react";
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

export function PassphraseComponent() {
  const { data: generator } = useSWR(wordListUrl, async () => {
    const response = await fetch(wordListUrl);
    const text = await response.text();
    return PasswordGenerator.fromText(text);
  });

  if (!generator) {
    return <div>Loading...</div>;
  }

  return <PasswordGeneratorComponent generator={generator} />;
}

function PasswordGeneratorComponent({
  generator,
}: {
  readonly generator: PasswordGenerator;
}) {
  const [passphrase, setPassphrase] = useState(generator.generate());
  const generateNewPassword = () => {
    setPassphrase(generator.generate());
  };
  return (
    <>
      <div className="relative w-full">
        <TextInput
          id="passphrase"
          readOnly
          value={passphrase}
          className="w-full"
        />
        <Clipboard.WithIcon valueToCopy={passphrase} />
      </div>
      <Button onClick={generateNewPassword}>Forge new passphrase</Button>
    </>
  );
}
