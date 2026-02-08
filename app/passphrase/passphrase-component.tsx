"use client";
import React, { use, useCallback, useState } from "react";
import { GeneratorSettings } from "@/app/passphrase/password-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PassphraseDetails } from "@/app/passphrase/password-generator";
import { setGeneratorSettingsCookie } from "@/app/passphrase/settings-cookie";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import posthog from "posthog-js";

export function PassphraseComponent(props: {
  readonly initialPassphrases: Promise<PassphraseDetails[]>;
  readonly initialSettings: Promise<GeneratorSettings>;
  readonly generatePasswordsAction: (
    settings: GeneratorSettings,
  ) => Promise<PassphraseDetails[]>;
}) {
  const t = useTranslations("PassphraseComponent");
  const initialSettings = use(props.initialSettings);
  const initialPassphrases = use(props.initialPassphrases);
  const generatePasswordsAction = props.generatePasswordsAction;
  const [generatorSettings, setGeneratorSettingsState] =
    useState<GeneratorSettings>(initialSettings);
  const [passphrases, setPassphrases] =
    useState<PassphraseDetails[]>(initialPassphrases);
  const [isLoading, setIsLoading] = useState(false);

  const setGeneratorSettings = useCallback((settings: GeneratorSettings) => {
    setGeneratorSettingsState(settings);
    setGeneratorSettingsCookie(settings);
  }, []);

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
              onClick={() => {
                posthog.capture("copy_passphrase_button_click", {
                  passphrase_index: index,
                });
                void navigator.clipboard.writeText(details.passphrase);
              }}
              data-testid={`copy-passphrase-button-${index}`}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={async () => {
          posthog.capture("generate_passphrase_button_click");
          setIsLoading(true);
          try {
            const passphraseDetails =
              await generatePasswordsAction(generatorSettings);
            setPassphrases(passphraseDetails);
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
        className="w-full"
        data-testid="ai-generate-passphrase-button"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            {t("generate")}
          </>
        ) : (
          t("generate")
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
