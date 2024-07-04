"use client";
import useSWR from "swr";
import React, { useState } from "react";
import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { Button, TextInput, Clipboard } from "flowbite-react";
import { useTranslations } from "next-intl";
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

export function PassphraseComponent() {
  const t = useTranslations("PassphraseComponent");
  const { data: generator } = useSWR(wordListUrl, async () => {
    const response = await fetch(wordListUrl);
    const text = await response.text();
    return PasswordGenerator.fromText(text);
  });

  if (!generator) {
    return <div>{t("loading")}</div>;
  }

  return <PasswordGeneratorComponent generator={generator} />;
}

function PasswordGeneratorComponent({
  generator,
}: {
  readonly generator: PasswordGenerator;
}) {
  const t = useTranslations("PassphraseComponent");
  const [passphrase, setPassphrase] = useState(generator.generate());
  const generateNewPassword = () => {
    setPassphrase(generator.generate());
  };
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="relative w-full">
        <TextInput
          ref={inputRef}
          id="passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="w-full"
        />
        <Clipboard.WithIcon valueToCopy={passphrase} />
      </div>
      <Button onClick={generateNewPassword}>{t("generate")}</Button>
    </>
  );
}
