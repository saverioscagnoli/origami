import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const ParentDirItem: React.FC = () => {
  return (
    <Menubar.Item leftIcon={<ArrowUpIcon />}>Parent Directory</Menubar.Item>
  );
};

export { ParentDirItem };
