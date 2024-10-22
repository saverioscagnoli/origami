import { EnterIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { fs } from "@wails/methods/models";
import React from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

type DiskContextMenuProps = fs.Disk & {
  children: React.ReactNode;
};

const DiskContextMenu: React.FC<DiskContextMenuProps> = ({
  children,
  Mountpoint
}) => {
  const cd = useCurrentDir(s => s.cd);

  const onSelect = () => {
    cd(Mountpoint);
  };

  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item leftIcon={<EnterIcon />} onSelect={onSelect}>
          Open
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item leftIcon={<InfoCircledIcon />}>
          Properties
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { DiskContextMenu };
