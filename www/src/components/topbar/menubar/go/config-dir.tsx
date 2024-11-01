import { CodeIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { useDir } from "~/stores/dir";
import { useEnv } from "~/stores/env";

const ConfigDirItem: React.FC = () => {
  const cd = useDir(s => s.cd);
  const configDir = useEnv(s => s.configDir);

  const onSelect = () => cd(configDir);

  return (
    <Menubar.Item leftIcon={<CodeIcon />} onSelect={onSelect}>
      Config Directory
    </Menubar.Item>
  );
};

export { ConfigDirItem };
