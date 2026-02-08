import { Separator } from "@/components/ui/separator";
import React, { Suspense } from "react";
import { AppDetails } from "@/app/app-details";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Version } from "@/app/version/version";
import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import { defaultGeneratorSettings } from "@/app/passphrase/password-generator";
import { getCookie } from "cookies-next";
import {
  decodeSettings,
  SETTINGS_COOKIE_NAME,
} from "@/app/passphrase/settings-cookie";
import { cookies } from "next/headers";
import { aiMultiplePassphraseEnhancement } from "@/app/passphrase/ai/actions";
export default async function Home() {
  const t = await getTranslations("Home");
  const initialSettings = getInitialSettings();
  const initialPassphrases = initialSettings.then((s) =>
    aiMultiplePassphraseEnhancement(s, 5),
  );
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
      <Separator className="w-full" />
      <Suspense fallback={<PassphraseSkeleton />}>
        <PassphraseComponent
          initialSettings={initialSettings}
          initialPassphrases={initialPassphrases}
        />
      </Suspense>
      <Separator className="w-full" />
      <AppDetails />
      <Separator className="w-full" />
      <Version />
    </main>
  );
}

function PassphraseSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

async function getInitialSettings() {
  // Read settings from cookie
  const value = await getCookie(SETTINGS_COOKIE_NAME, { cookies });
  return value
    ? (() => {
        try {
          return decodeSettings(value);
        } catch {
          return defaultGeneratorSettings;
        }
      })()
    : defaultGeneratorSettings;
}
