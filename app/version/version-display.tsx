"use client";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
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
        <ModalHeader>{t("title")}</ModalHeader>
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <Button onClick={hideModal}>{t("close")}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
