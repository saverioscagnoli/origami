import { CodeIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";

const ConfigDirectoryMenuItem: React.FC = () => {
  const cd = useCurrentDir(s => s.cd);
  const configDir = useEnv(s => s.configDir);

  const onSelect = () => {
    cd(configDir);
  };

  return (
    <Menubar.Item leftIcon={<CodeIcon />} onSelect={onSelect}>
      Config Directory
    </Menubar.Item>
  );
};

export { ConfigDirectoryMenuItem };
