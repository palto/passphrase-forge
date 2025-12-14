import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { FaGear } from "react-icons/fa6";
import { GeneratorSettings } from "@/app/passphrase/password-generator";

export function SettingsButton(props: {
  readonly value: GeneratorSettings;
  readonly onChange: (settings: GeneratorSettings) => void;
  readonly disabled?: boolean;
}) {
  const generatorSettings = props.value;
  const setGeneratorSettings = props.onChange;
  const t = useTranslations("PassphraseComponent.settings");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={props.disabled}
          className="flex flex-col h-16 w-20 gap-1"
          data-testid="settings-button"
        >
          <FaGear className="h-5 w-5" />
          <span className="text-xs">{t("open")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent data-testid="settings-drawer">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="stripUmlauts" className="text-base">
              {t("stripUmlauts")}
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
      </SheetContent>
    </Sheet>
  );
}
