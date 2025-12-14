"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

export function VersionDisplay(
  props: Readonly<{
    version: string;
    children: ReactNode;
  }>,
) {
  const t = useTranslations("Home.changelog");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          v{props.version}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{props.children}</div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>{t("close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
