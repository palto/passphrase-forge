import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import { HR } from "flowbite-react";
import React from "react";
import { useTranslations } from "next-intl";
import { AppDetails } from "@/app/app-details";
import Image from "next/image";
import { AppNavbar } from "@/app/app-navbar";
export default function Home() {
  const t = useTranslations("Home");
  return (
    <>
      <AppNavbar />
      <main className="flex items-center flex-col pt-4 pb-4 space-y-4 mx-auto max-w-lg px-4">
        <div className="dark:bg-gray-300 rounded-2xl shadow dark:shadow-gray-300">
          <Image
            src="/aitio-labdays2018.png"
            alt="Labdays logo"
            width={200}
            height={128.5}
          />
        </div>
        <h1 className="text-2xl">{t("welcome")}</h1>
        <hr></hr>
        <PassphraseComponent />
        <HR className="w-full" />
        <AppDetails />
      </main>
    </>
  );
}
