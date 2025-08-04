"use client";
import useSWR from "swr";
import React, { useCallback, useState } from "react";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PasswordGenerator,
} from "@/app/passphrase/password-generator";
import { Button, TextInput, ClipboardWithIcon, Spinner } from "flowbite-react";
import { HiSparkles } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import { aiPassphraseEnhancement } from "@/app/passphrase/ai/actions";
import { SettingsButton } from "@/app/passphrase/settings-button";
import { useLocalStorage } from "usehooks-ts";
const wordListUrl = process.env.NEXT_PUBLIC_WORD_LIST_URL as string;

export function PassphraseComponent() {
  const t = useTranslations("PassphraseComponent");
  const generator = usePasswordGenerator();

  if (!generator) {
    return <div data-testid="passphrase-loading">{t("loading")}</div>;
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
  }, [generator, generatorSettings]);

  const updateSettings = useCallback(
    (settings: GeneratorSettings) => {
      setGeneratorSettings(settings);
      setPassphrase(generator.generate(settings));
    },
    [generator, setGeneratorSettings],
  );

  return (
    <div data-testid="passphrase-generator">
      <div className="relative w-full" data-testid="passphrase-input-container">
        <TextInput
          id="passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="w-full"
          data-testid="passphrase-input"
        />
        <ClipboardWithIcon
          valueToCopy={passphrase}
          data-testid="copy-passphrase-button"
        />
      </div>
      <div className="flex w-full gap-4 mt-4" data-testid="passphrase-actions">
        <Button
          color="blue"
          onClick={generateNewPassword}
          className="h-16"
          data-testid="generate-passphrase-button"
        >
          {t("generate")}
        </Button>
        <AiPasshpraseButton
          onPassphrase={setPassphrase}
          generatorSettings={generatorSettings}
        />
        <SettingsButton value={generatorSettings} onChange={updateSettings} />
      </div>
    </div>
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
      disabled={isLoading}
      className="h-16 w-48 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium border-0 disabled:opacity-100 disabled:cursor-wait"
      data-testid="ai-generate-passphrase-button"
    >
      {isLoading ? (
        <>
          <Spinner size="md" className="me-3 text-yellow-300" />
          {t("aiGenerate")}
        </>
      ) : (
        <>
          <HiSparkles className="me-3 w-6 h-6" />
          {t("aiGenerate")}
        </>
      )}
    </Button>
  );
}
