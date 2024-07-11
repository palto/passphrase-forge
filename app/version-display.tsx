"use client";
import { Button, Modal } from "flowbite-react";
import { useBoolean } from "usehooks-ts";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export function VersionDisplay(
  props: Readonly<{
    version: string;
    children: ReactNode;
  }>,
) {
  const t = useTranslations("Home.changelog");
  const {
    value: show,
    setTrue: showModal,
    setFalse: hideModal,
  } = useBoolean(false);

  return (
    <>
      <Button pill color="gray" onClick={showModal}>
        v{props.version}
      </Button>
      <Modal dismissible show={show} onClose={hideModal}>
        <Modal.Header>{t("title")}</Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button onClick={hideModal}>{t("close")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
