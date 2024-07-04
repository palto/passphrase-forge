import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import { DarkThemeToggle, HR } from "flowbite-react";
import React from "react";
import { useTranslations } from "next-intl";
import { AppDetails } from "@/app/app-details";
export default function Home() {
  const t = useTranslations("Home");
  return (
    <main className="flex items-center flex-col pt-4 pb-4 space-y-4 mx-auto max-w-lg px-4">
      <h1 className="text-2xl">{t("title")}</h1>
      <hr></hr>
      <PassphraseComponent />
      <DarkThemeToggle />
      <HR className="w-full" />
      <AppDetails />
    </main>
  );
}
