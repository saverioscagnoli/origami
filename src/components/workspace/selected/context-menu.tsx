import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";
import { CopyMenuItem } from "./copy";
import { CutMenuItem } from "./cut";
import { DeleteMenuItem } from "./delete";
import { OpenMenuItem } from "./open";
import { RenameMenuItem } from "./rename";
import { StarUnstarMenuItem } from "./star-unstar";

const SelectedEntriesContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  const selected = useCurrentDir(state => state.selected);

  const canOpen = useMemo(
    () =>
      selected.length > 0 &&
      (selected.every(e => !e.isDir) || selected.length === 1),
    [selected]
  );

  const canStarUnstar = useMemo(
    () => selected.every(e => e.isStarred) || selected.every(e => !e.isStarred),
    [selected]
  );

  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {canOpen && <OpenMenuItem />}
        {canStarUnstar && <StarUnstarMenuItem />}
        {(canOpen || canStarUnstar) && <ContextMenu.Separator />}
        <CutMenuItem />
        <CopyMenuItem />
        <ContextMenu.Separator />
        <RenameMenuItem />
        <DeleteMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { SelectedEntriesContextMenu };
