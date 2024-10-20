import { ClipboardIcon } from "@radix-ui/react-icons";
import React from "react";
import { ContextMenu } from "~/components/tredici";

const PasteMenuItem: React.FC = () => {
  return (
    <ContextMenu.Item leftIcon={<ClipboardIcon />}>Paste</ContextMenu.Item>
  );
};

export { PasteMenuItem };
