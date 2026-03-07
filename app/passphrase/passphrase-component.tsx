"use client";
import React, { use, useCallback, useState } from "react";
import { GeneratorSettings } from "@/app/passphrase/password-generator";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
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
          <div key={index} className="space-y-1">
            <ButtonGroup
              className="w-full"
              data-testid={`passphrase-item-${index}`}
            >
              <Input
                value={details.passphrase}
                readOnly
                data-testid={`passphrase-input-${index}`}
              />
              <CopyButton
                text={details.passphrase}
                onCopy={() => {
                  posthog.capture("copy_passphrase_button_click", {
                    passphrase_index: index,
                  });
                }}
                data-testid={`copy-passphrase-button-${index}`}
              />
            </ButtonGroup>
            <p className="text-xs text-muted-foreground">
              {t("settings.characters", { count: details.passphrase.length })}
            </p>
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
