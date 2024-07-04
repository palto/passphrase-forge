import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ThemeModeScript, Flowbite} from 'flowbite-react';
import React from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Passphrase Forge",
  description: "The next generation of passphrase generation tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${inter.className} bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-400`}>
      <Flowbite>
        {children}
      </Flowbite>
      </body>
    </html>
  );
}
