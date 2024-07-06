"use client";
import useSWR from "swr";
import React, { useState } from "react";
import { PasswordGenerator } from "@/app/passphrase/password-generator";
import { Button, TextInput, Clipboard } from "flowbite-react";
import { useTranslations } from "next-intl";
import { aiPassphraseEnhancement } from "@/app/(ai)/actions";
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
  return (
    <>
      <div className="relative w-full">
        <TextInput
          id="passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="w-full"
        />
        <Clipboard.WithIcon valueToCopy={passphrase} />
      </div>
      <div className="flex w-full justify-center space-x-4">
        <Button color="blue" onClick={generateNewPassword}>
          {t("generate")}
        </Button>
        <AiPasshpraseButton
          onPassphrase={(passphrase) => setPassphrase(passphrase)}
          generator={generator}
        />
      </div>
    </>
  );
}

export function AiPasshpraseButton(props: {
  readonly generator: PasswordGenerator;
  readonly onPassphrase: (passphrase: string) => void;
}) {
  const t = useTranslations("PassphraseComponent");
  const [isLoading, setIsLoading] = useState(false);
  const callAi = async () => {
    setIsLoading(true);
    try {
      const passphrase = await aiPassphraseEnhancement(
        props.generator.generate(),
      );
      props.onPassphrase(passphrase);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={callAi}
      isProcessing={isLoading}
      outline
      gradientDuoTone="purpleToPink"
    >
      {t("aiGenerate")}
    </Button>
  );
}
