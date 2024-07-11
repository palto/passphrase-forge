import { PassphraseComponent } from "@/app/passphrase/passphrase-component";
import { HR } from "flowbite-react";
import React from "react";
import { AppDetails } from "@/app/app-details";
import Image from "next/image";
import { VersionDisplay } from "@/app/version-display";
import { getTranslations } from "next-intl/server";
import * as fs from "node:fs";
import { MDXRemote } from "next-mdx-remote/rsc";
export default async function Home() {
  const t = await getTranslations("Home");

  const changeLogContents = await fs.promises.readFile("CHANGELOG.md", "utf-8");
  return (
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
      {process.env.npm_package_version && (
        <VersionDisplay version={process.env.npm_package_version}>
          <MDXRemote source={changeLogContents} />
        </VersionDisplay>
      )}
    </main>
  );
}
