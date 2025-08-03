"use client";

import {
  DarkThemeToggle,
  Dropdown,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { changeLanguage } from "@/app/changeLanguage";
import { IoLanguage } from "react-icons/io5";

export function AppNavbar() {
  const t = useTranslations("AppNavbar");
  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="/">
        <img
          src="/anvil-logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {t("brandTitle")}
        </span>
      </NavbarBrand>
      <div className="flex">
        <DarkThemeToggle />
        <Dropdown outline label={<IoLanguage />}>
          <DropdownItem onClick={() => changeLanguage("en")}>
            {t("lang.en")}
          </DropdownItem>
          <DropdownItem onClick={() => changeLanguage("fi")}>
            {t("lang.fi")}
          </DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
}
