import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import { generateInitialPassphrases } from "@/app/passphrase/server";
import { HR } from "flowbite-react";
import React from "react";
import { AppDetails } from "@/app/app-details";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Version } from "@/app/version/version";
export default async function Home() {
  const t = await getTranslations("Home");
  const initialPassphrases = await generateInitialPassphrases(5);

  return (
    <main className="flex items-center flex-col pt-4 pb-4 space-y-4 mx-auto max-w-lg px-4">
      <div className="dark:bg-gray-300 rounded-2xl shadow-sm dark:shadow-gray-300">
        <Image
          src="/aitio-labdays2018.png"
          alt="Labdays logo"
          width={200}
          height={128.5}
        />
      </div>
      <h1 className="text-2xl">{t("welcome")}</h1>
      <hr></hr>
      <PassphraseComponent initialPassphrases={initialPassphrases} />
      <HR className="w-full" />
      <AppDetails />
      <HR className="w-full" />
      <Version />
    </main>
  );
}
