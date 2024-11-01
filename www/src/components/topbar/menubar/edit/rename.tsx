import { Pencil1Icon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const RenameItem: React.FC = () => {
  return <Menubar.Item leftIcon={<Pencil1Icon />}>Rename</Menubar.Item>;
};

export { RenameItem };
