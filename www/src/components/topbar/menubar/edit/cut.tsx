import { ScissorsIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const CutItem: React.FC = () => {
  return <Menubar.Item leftIcon={<ScissorsIcon />}>Cut</Menubar.Item>;
};

export { CutItem };
