import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import { getPasswordGenerator } from "@/app/passphrase/server";
import { HR } from "flowbite-react";
import React from "react";
import { AppDetails } from "@/app/app-details";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Version } from "@/app/version/version";
import {
  defaultGeneratorSettings,
  GeneratorSettings,
  PassphraseDetails,
} from "@/app/passphrase/password-generator";
import { getCookie } from "cookies-next";
import {
  decodeSettings,
  SETTINGS_COOKIE_NAME,
} from "@/app/passphrase/settings-cookie";
import { cookies } from "next/headers";
export default async function Home() {
  const t = await getTranslations("Home");
  const { passphrases, settings } = await generateInitialPassphrases(5);

  return (
    <main className="flex items-center flex-col pt-4 pb-4 space-y-4 mx-auto max-w-lg px-4">
      <div className="dark:bg-gray-300 rounded-2xl shadow-sm dark:shadow-gray-300 w-64">
        <Image
          src="/aitio-labdays2018.png"
          alt="Labdays logo"
          width={256}
          height={164}
          priority
          className="w-full h-auto"
        />
      </div>
      <h1 className="text-2xl">{t("welcome")}</h1>
      <hr></hr>
      <PassphraseComponent
        initialPassphrases={passphrases}
        initialSettings={settings}
      />
      <HR className="w-full" />
      <AppDetails />
      <HR className="w-full" />
      <Version />
    </main>
  );
}

async function generateInitialPassphrases(count: number = 5): Promise<{
  passphrases: PassphraseDetails[];
  settings: GeneratorSettings;
}> {
  const generator = await getPasswordGenerator();

  // Read settings from cookie
  const value = await getCookie(SETTINGS_COOKIE_NAME, { cookies });
  const settings = value
    ? (() => {
        try {
          return decodeSettings(value);
        } catch {
          return defaultGeneratorSettings;
        }
      })()
    : defaultGeneratorSettings;

  const passphrases = await generator.generateMultiple(count, settings);
  return { passphrases, settings };
}
