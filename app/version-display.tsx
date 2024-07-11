"use client";
import { Button, Modal } from "flowbite-react";
import { useBoolean } from "usehooks-ts";

export function VersionDisplay(
  props: Readonly<{
    version: string;
    children: React.ReactNode;
  }>,
) {
  const {
    value: show,
    setTrue: showModal,
    setFalse: hideModal,
  } = useBoolean(false);

  return (
    <>
      <div onClick={showModal}>v{props.version}</div>
      <Modal dismissible show={show} onClose={hideModal}>
        <Modal.Header>Changelog</Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button onClick={hideModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
