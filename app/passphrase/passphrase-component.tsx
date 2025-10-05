"use client";
import React, { useCallback, useState } from "react";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
} from "@/app/passphrase/password-generator";
import { Button, TextInput, ClipboardWithIcon, Spinner } from "flowbite-react";
import { HiSparkles } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import { aiMultiplePassphraseEnhancement } from "@/app/passphrase/ai/actions";
import { PassphraseDetails } from "@/app/passphrase/password-generator";
import { SettingsButton } from "@/app/passphrase/settings-button";
import { useLocalStorage } from "usehooks-ts";
import { usePasswordGenerator } from "@/app/passphrase/usePasswordGenerator";

const PASSPHRASE_COUNT = 5;

export function PassphraseComponent({
  initialPassphrases,
}: {
  readonly initialPassphrases: PassphraseDetails[];
}) {
  const t = useTranslations("PassphraseComponent");
  const [generatorSettings, setGeneratorSettings] = useLocalStorage(
    "generatorSettings",
    defaultGeneratorSettings,
  );
  const [passphrases, setPassphrases] =
    useState<PassphraseDetails[]>(initialPassphrases);
  const generator = usePasswordGenerator();

  const generateRegularPasswords = useCallback(async () => {
    if (!generator) return;
    const newPassphrases = await generator.generateMultiple(
      PASSPHRASE_COUNT,
      generatorSettings,
    );
    setPassphrases(newPassphrases);
  }, [generator, generatorSettings]);

  const generateAiPasswords = useCallback(
    async (aiPassphrases: PassphraseDetails[]) => {
      setPassphrases(aiPassphrases);
    },
    [],
  );

  const updateSettings = useCallback(
    async (settings: GeneratorSettings) => {
      setGeneratorSettings(settings);
      if (!generator) return;
      const newPassphrases = await generator.generateMultiple(
        PASSPHRASE_COUNT,
        settings,
      );
      setPassphrases(newPassphrases);
    },
    [generator, setGeneratorSettings],
  );

  return (
    <div data-testid="passphrase-generator" className="w-full">
      <div data-testid="passphrases-container">
        <div className="grid gap-3">
          {passphrases.map((details, index) => (
            <div
              key={index}
              className="relative w-full"
              data-testid={`passphrase-item-${index}`}
            >
              <TextInput
                value={details.passphrase}
                readOnly
                className="w-full"
                data-testid={`passphrase-input-${index}`}
              />
              <ClipboardWithIcon
                valueToCopy={details.passphrase}
                data-testid={`copy-passphrase-button-${index}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 mt-4"
        data-testid="passphrase-actions"
      >
        <AiPassphraseButton
          onMultiplePassphrases={generateAiPasswords}
          generatorSettings={generatorSettings}
        />
        <Button
          color="blue"
          onClick={generateRegularPasswords}
          className="h-16"
          data-testid="generate-passphrase-button"
        >
          {t("generate")}
        </Button>
        <SettingsButton value={generatorSettings} onChange={updateSettings} />
      </div>
    </div>
  );
}

function AiPassphraseButton(props: {
  readonly onMultiplePassphrases: (passphrases: PassphraseDetails[]) => void;
  readonly generatorSettings?: Partial<GeneratorSettings>;
}) {
  const t = useTranslations("PassphraseComponent");
  const [isLoading, setIsLoading] = useState(false);
  const callAi = async () => {
    setIsLoading(true);
    try {
      const passphraseDetails = await aiMultiplePassphraseEnhancement(
        props.generatorSettings,
        PASSPHRASE_COUNT,
      );
      props.onMultiplePassphrases(passphraseDetails);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={callAi}
      disabled={isLoading}
      className="h-16 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium border-0 disabled:opacity-100 disabled:cursor-wait"
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
