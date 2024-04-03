import React, { useMemo } from "react";
import { ContextMenu } from "@tredici";
import { ChildrenProps } from "@types";
import { useCurrentDir } from "@hooks/use-current-dir";
import { Open } from "./open";
import { Star } from "./star";

type EntryContextMenuProps = ChildrenProps;

const EntryContextMenu: React.FC<EntryContextMenuProps> = ({ children }) => {
  const { selected } = useCurrentDir();
  const canOpen = useMemo(
    () => selected.get().length === 1 || !selected.get().some(e => e.is_folder),
    [selected.get()]
  );

  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {canOpen && <Open />}
        <Star />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EntryContextMenu };
