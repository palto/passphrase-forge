"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { changeLanguage } from "@/app/changeLanguage";
import { IoLanguage } from "react-icons/io5";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppNavbar() {
  const t = useTranslations("AppNavbar");
  return (
    <nav
      className="flex items-center justify-between p-4 border-b"
      data-testid="app-navbar"
    >
      <Link
        href="/"
        className="flex items-center gap-3"
        data-testid="navbar-brand"
      >
        <Image
          src="/anvil-logo.png"
          width={36}
          height={36}
          className="h-6 sm:h-9 w-auto"
          alt="Logo"
          data-testid="brand-logo"
        />
        <span className="text-xl font-semibold">{t("brandTitle")}</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle data-testid="dark-theme-toggle" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="language-dropdown">
              <IoLanguage className="h-5 w-5" />
              <span className="sr-only">Change language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => changeLanguage("en")}
              data-testid="language-en"
            >
              {t("lang.en")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("fi")}
              data-testid="language-fi"
            >
              {t("lang.fi")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
