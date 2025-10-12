import {
  Label,
  RangeSlider,
  TextInput,
  Drawer,
  DrawerHeader,
  DrawerItems,
  ToggleSwitch,
} from "flowbite-react";
import { useBoolean } from "usehooks-ts";
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
  const { value: isOpen, setFalse: close, setTrue: open } = useBoolean(false);
  const t = useTranslations("PassphraseComponent.settings");
  return (
    <>
      <div className="flex items-center justify-center">
        <button
          onClick={open}
          disabled={props.disabled}
          className="flex flex-col rounded-lg w-20 h-[64px] items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
          data-testid="settings-button"
        >
          <FaGear /> {t("open")}
        </button>
      </div>
      <div>
        <Drawer open={isOpen} onClose={close} data-testid="settings-drawer">
          <DrawerHeader
            title={t("title")}
            data-testid="settings-drawer-header"
          />
          <DrawerItems data-testid="settings-drawer-items">
            <div className="p-4">
              <Label htmlFor="wordCount">
                {t("wordCount", { count: generatorSettings.wordCount })}
              </Label>
              <RangeSlider
                id="wordCount"
                sizing="sm"
                value={generatorSettings.wordCount}
                onChange={(event) => {
                  setGeneratorSettings({
                    ...generatorSettings,
                    wordCount: Number(event.target.value),
                  });
                }}
                min={2}
                max={6}
                step={1}
                data-testid="word-count-slider"
              />
            </div>
            <div className="p-4">
              <Label htmlFor="separator">{t("separator")}</Label>
              <TextInput
                id="separator"
                value={generatorSettings.separator}
                sizing="sm"
                onChange={(event) => {
                  setGeneratorSettings({
                    ...generatorSettings,
                    separator: event.target.value,
                  });
                }}
                maxLength={1}
                data-testid="separator-input"
              />
            </div>
            <div className="p-4">
              <Label htmlFor="digits">
                {t("digits", { count: generatorSettings.digits })}
              </Label>
              <RangeSlider
                id="digits"
                sizing="sm"
                value={generatorSettings.digits}
                onChange={(event) => {
                  setGeneratorSettings({
                    ...generatorSettings,
                    digits: Number(event.target.value),
                  });
                }}
                min={0}
                max={3}
                step={1}
                data-testid="digits-slider"
              />
            </div>
            <div className="p-4">
              <Label htmlFor="stripUmlauts">{t("stripUmlauts")}</Label>
              <ToggleSwitch
                id="stripUmlauts"
                checked={generatorSettings.stripUmlauts ?? false}
                onChange={(checked) => {
                  setGeneratorSettings({
                    ...generatorSettings,
                    stripUmlauts: checked,
                  });
                }}
                label={t("stripUmlauts")}
                data-testid="strip-umlauts-toggle"
              />
            </div>
          </DrawerItems>
        </Drawer>
      </div>
    </>
  );
}
