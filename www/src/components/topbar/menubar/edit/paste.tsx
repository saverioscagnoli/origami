import { ClipboardIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const PasteItem: React.FC = () => {
  return <Menubar.Item leftIcon={<ClipboardIcon />}>Paste</Menubar.Item>;
};

export { PasteItem };
