"use client";
import React, { useCallback, useState } from "react";
import { GeneratorSettings } from "@/app/passphrase/password-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiSparkles } from "react-icons/hi2";
import { Copy, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { aiMultiplePassphraseEnhancement } from "@/app/passphrase/ai/actions";
import { PassphraseDetails } from "@/app/passphrase/password-generator";
import { setGeneratorSettingsCookie } from "@/app/passphrase/settings-cookie";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PASSPHRASE_COUNT = 5;

export function PassphraseComponent({
  initialPassphrases,
  initialSettings,
}: {
  readonly initialPassphrases: PassphraseDetails[];
  readonly initialSettings: GeneratorSettings;
}) {
  const t = useTranslations("PassphraseComponent");
  const [generatorSettings, setGeneratorSettingsState] =
    useState<GeneratorSettings>(initialSettings);
  const [passphrases, setPassphrases] =
    useState<PassphraseDetails[]>(initialPassphrases);
  const [isLoading, setIsLoading] = useState(false);

  const setGeneratorSettings = useCallback((settings: GeneratorSettings) => {
    setGeneratorSettingsState(settings);
    setGeneratorSettingsCookie(settings);
  }, []);

  const generateAiPasswords = useCallback(async () => {
    setIsLoading(true);
    try {
      const passphraseDetails = await aiMultiplePassphraseEnhancement(
        generatorSettings,
        PASSPHRASE_COUNT,
      );
      setPassphrases(passphraseDetails);
    } finally {
      setIsLoading(false);
    }
  }, [generatorSettings]);

  return (
    <div data-testid="passphrase-generator" className="w-full space-y-4">
      <div className="space-y-3" data-testid="passphrases-container">
        {passphrases.map((details, index) => (
          <div
            key={index}
            className="relative"
            data-testid={`passphrase-item-${index}`}
          >
            <Input
              value={details.passphrase}
              readOnly
              className="pr-10"
              data-testid={`passphrase-input-${index}`}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => navigator.clipboard.writeText(details.passphrase)}
              data-testid={`copy-passphrase-button-${index}`}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={generateAiPasswords}
        disabled={isLoading}
        className="w-full h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        data-testid="ai-generate-passphrase-button"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            {t("generate")}
          </>
        ) : (
          <>
            <HiSparkles className="mr-2 h-6 w-6" />
            {t("generate")}
          </>
        )}
      </Button>

      <div className="flex items-center justify-between">
        <Label htmlFor="stripUmlauts" className="text-base">
          {t("settings.stripUmlauts")}
        </Label>
        <Switch
          id="stripUmlauts"
          checked={generatorSettings.stripUmlauts ?? false}
          onCheckedChange={(checked) => {
            setGeneratorSettings({
              ...generatorSettings,
              stripUmlauts: checked,
            });
          }}
          data-testid="strip-umlauts-toggle"
        />
      </div>
    </div>
  );
}
