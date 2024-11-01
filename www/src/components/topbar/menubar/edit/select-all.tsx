import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { useDir } from "~/stores/dir";

const SelectAllItem: React.FC = () => {
  const selectAll = useDir(s => s.selectAll);

  return (
    <Menubar.Item leftIcon={<ArrowUpIcon />} onSelect={selectAll}>
      Select All
    </Menubar.Item>
  );
};

export { SelectAllItem };
