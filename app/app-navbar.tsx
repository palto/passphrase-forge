"use client";

import { DarkThemeToggle, Navbar } from "flowbite-react";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

export function AppNavbar() {
  const t = useTranslations("AppNavbar");
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <img
          src="/anvil-logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {t("brandTitle")}
        </span>
      </Navbar.Brand>
      <DarkThemeToggle />
    </Navbar>
  );
}
