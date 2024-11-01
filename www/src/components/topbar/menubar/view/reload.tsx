import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { Menubar } from "~/components/tredici";
import { useDir } from "~/stores/dir";

const ReloadItem: React.FC = () => {
  const reload = useDir(s => s.reload);

  return (
    <Menubar.Item leftIcon={<ReloadIcon />} onSelect={reload}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadItem };
