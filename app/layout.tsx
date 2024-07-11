import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeModeScript, Flowbite } from "flowbite-react";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { AppNavbar } from "@/app/app-navbar";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${inter.className} bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300`}
      >
        <Flowbite>
          <NextIntlClientProvider messages={messages}>
            <AppNavbar />
            {children}
          </NextIntlClientProvider>
        </Flowbite>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ namespace: "head" });
  return {
    title: t("title"),
  };
}
