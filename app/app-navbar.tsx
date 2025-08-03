"use client";

import {
  DarkThemeToggle,
  Dropdown,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { changeLanguage } from "@/app/changeLanguage";
import { IoLanguage } from "react-icons/io5";

export function AppNavbar() {
  const t = useTranslations("AppNavbar");
  return (
    <Navbar fluid rounded data-testid="app-navbar">
      <NavbarBrand as={Link} href="/" data-testid="navbar-brand">
        <Image
          src="/anvil-logo.png"
          width={36}
          height={36}
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
          data-testid="brand-logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {t("brandTitle")}
        </span>
      </NavbarBrand>
      <div className="flex">
        <DarkThemeToggle data-testid="dark-theme-toggle" />
        <Dropdown
          outline
          label={<IoLanguage />}
          data-testid="language-dropdown"
        >
          <DropdownItem
            onClick={() => changeLanguage("en")}
            data-testid="language-en"
          >
            {t("lang.en")}
          </DropdownItem>
          <DropdownItem
            onClick={() => changeLanguage("fi")}
            data-testid="language-fi"
          >
            {t("lang.fi")}
          </DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
}
