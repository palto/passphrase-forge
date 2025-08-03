"use client";
import useSWR from "swr";
import React, { useCallback, useState } from "react";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";
import {
  Button,
  TextInput,
  ClipboardWithIcon,
  HR,
  Spinner,
} from "flowbite-react";
import { useTranslations } from "next-intl";
import { aiPassphraseEnhancement } from "@/app/passphrase/ai/actions";
import { SettingsButton } from "@/app/passphrase/settings-button";
import { useLocalStorage } from "usehooks-ts";
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

export function PassphraseComponent() {
  const t = useTranslations("PassphraseComponent");
  const generator = usePasswordGenerator();

  if (!generator) {
    return <div>{t("loading")}</div>;
  }

  return <PasswordGeneratorComponent generator={generator} />;
}

function usePasswordGenerator() {
  const { data: generator } = useSWR(wordListUrl, async () => {
    const response = await fetch(wordListUrl);
    const text = await response.text();
    return PasswordGenerator.fromText(text);
  });
  return generator;
}

function PasswordGeneratorComponent({
  generator,
}: {
  readonly generator: PasswordGenerator;
}) {
  const t = useTranslations("PassphraseComponent");
  const [generatorSettings, setGeneratorSettings] = useLocalStorage(
    "generatorSettings",
    defaultGeneratorSettings,
  );
  const [passphrase, setPassphrase] = useState<string>(
    generator.generate(generatorSettings),
  );
  const generateNewPassword = useCallback(() => {
    setPassphrase(generator.generate(generatorSettings));
  }, [generatorSettings]);

  const updateSettings = useCallback(
    (settings: GeneratorSettings) => {
      setGeneratorSettings(settings);
      setPassphrase(generator.generate(settings));
    },
    [generatorSettings],
  );

  return (
    <>
      <div className="relative w-full">
        <TextInput
          id="passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="w-full"
        />
        <ClipboardWithIcon valueToCopy={passphrase} />
      </div>
      <div className="flex w-full space-x-4">
        <Button color="blue" onClick={generateNewPassword} className="h-16">
          {t("generate")}
        </Button>
        <AiPasshpraseButton
          onPassphrase={setPassphrase}
          generatorSettings={generatorSettings}
        />
        <SettingsButton value={generatorSettings} onChange={updateSettings} />
      </div>
      <HR />
    </>
  );
}

export function AiPasshpraseButton(props: {
  readonly onPassphrase: (passphrase: string) => void;
  readonly generatorSettings?: Partial<GeneratorSettings>;
}) {
  const t = useTranslations("PassphraseComponent");
  const [isLoading, setIsLoading] = useState(false);
  const callAi = async () => {
    setIsLoading(true);
    try {
      const passphraseDetails = await aiPassphraseEnhancement(
        props.generatorSettings,
      );
      props.onPassphrase(passphraseDetails.passphrase);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={callAi}
      outline
      color="purple"
      disabled={isLoading}
      className="h-16"
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="me-3" />
          {t("aiGenerate")}
        </>
      ) : (
        t("aiGenerate")
      )}
    </Button>
  );
}
