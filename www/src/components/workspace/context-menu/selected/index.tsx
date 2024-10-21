import React, { useMemo } from "react";
import { ContextMenu, Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { CopyMenuItem } from "./copy";
import { CutMenuItem } from "./cut";
import { DeleteMenuItem } from "./delete";
import { OpenMenuItem } from "./open";
import { RenameMenuItem } from "./rename";
import { StarUnstarMenuItem } from "./star-unstar";

type SelectedEntriesContextMenuProps = {
  children: React.ReactNode;
};

const SelectedEntriesContextMenu: React.FC<SelectedEntriesContextMenuProps> = ({
  children
}) => {
  const selected = useCurrentDir(s => s.selected);

  const canOpen = useMemo(
    () =>
      selected.length > 0 &&
      (selected.every(e => !e.IsDir) || selected.length === 1),
    [selected]
  );

  const canStarOrUnstar = useMemo(
    () => selected.every(e => e.IsStarred) || selected.every(e => !e.IsStarred),
    [selected]
  );

  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {canOpen && <OpenMenuItem />}
        {canStarOrUnstar && <StarUnstarMenuItem />}
        {(canOpen || canStarOrUnstar) && <ContextMenu.Separator />}
        <CutMenuItem />
        <CopyMenuItem />
        <Menubar.Separator />
        <RenameMenuItem />
        <DeleteMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { SelectedEntriesContextMenu };
