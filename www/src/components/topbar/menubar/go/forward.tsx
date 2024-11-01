import { ArrowRightIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";

const ForwardItem: React.FC = () => {
  return <Menubar.Item leftIcon={<ArrowRightIcon />}>Forward</Menubar.Item>;
};

export { ForwardItem };
