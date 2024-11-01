import { ArrowLeftIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const BackItem: React.FC = () => {
  return <Menubar.Item leftIcon={<ArrowLeftIcon />}>Back</Menubar.Item>;
};

export { BackItem };
