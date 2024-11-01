import { CopyIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const CopyItem: React.FC = () => {
  return <Menubar.Item leftIcon={<CopyIcon />}>Copy</Menubar.Item>;
};

export { CopyItem };
