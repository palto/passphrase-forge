import {
  Label,
  RangeSlider,
  TextInput,
  Drawer,
  ToggleSwitch,
} from "flowbite-react";
import { useBoolean } from "usehooks-ts";
import { useTranslations } from "next-intl";
import { FaGear } from "react-icons/fa6";
import { GeneratorSettings } from "@/app/passphrase/password-generator";

export function SettingsButton(props: {
  readonly value: GeneratorSettings;
  readonly onChange: (settings: GeneratorSettings) => void;
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
          className="flex rounded-lg w-8 h-8 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaGear />
        </button>
      </div>
      <div>
        <Drawer open={isOpen} onClose={close}>
          <Drawer.Header title={t("title")} />
          <Drawer.Items>
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
              />
            </div>
            <div className="p-4">
              <Label htmlFor="numberCount">
                {t("numberCount", { count: generatorSettings.numberCount })}
              </Label>
              <RangeSlider
                id="numberCount"
                sizing="sm"
                value={generatorSettings.numberCount}
                onChange={(event) => {
                  setGeneratorSettings({
                    ...generatorSettings,
                    numberCount: Number(event.target.value),
                  });
                }}
                min={0}
                max={3}
                step={1}
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
              />
            </div>
          </Drawer.Items>
        </Drawer>
      </div>
    </>
  );
}
