import { EnterIcon } from "@radix-ui/react-icons";
import { OpenFiles } from "@wails/methods/fs/Filesystem";
import React from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const OpenMenuItem: React.FC = () => {
  const [cd, selected] = useCurrentDir(s => [s.cd, s.selected]);

  const onSelect = () => {
    const paths = selected.map(e => e.Path);
    if (paths.length === 1 && selected.at(0)!.IsDir) {
      cd(paths[0]);
    } else {
      OpenFiles(paths);
    }
  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onSelect={onSelect}>
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
