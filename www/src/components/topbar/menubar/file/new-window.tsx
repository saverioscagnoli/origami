import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const NewWindowItem: React.FC = () => {
  return (
    <Menubar.Item leftIcon={<OpenInNewWindowIcon />}>New Window</Menubar.Item>
  );
};

export { NewWindowItem };
