import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const ReloadMenuItem: React.FC = () => {
  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);

  const onSelect = () => cd(dir);

  return (
    <ContextMenu.Item leftIcon={<ReloadIcon />} onSelect={onSelect}>
      Reload
    </ContextMenu.Item>
  );
};

export { ReloadMenuItem };
