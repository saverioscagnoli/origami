import { FileIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { useCreating } from "~/stores/states";

const NewFileItem: React.FC = () => {
  const setCreating = useCreating(s => s.set);

  const onSelect = () => {
    setCreating(prev => ({ state: !prev.state, isDir: false }));
  };

  return (
    <Menubar.Item leftIcon={<FileIcon />} onSelect={onSelect}>
      New File
    </Menubar.Item>
  );
};

export { NewFileItem };
