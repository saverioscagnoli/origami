import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { OpenMenuItem } from "./open";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useMemo } from "react";
import { StarUnstarMenuItem } from "./star-unstar";
import { CutMenuItem } from "./cut";
import { CopyMenuItem } from "./copy";
import { RenameMenuItem } from "./rename";
import { DeleteMenuItem } from "./delete";

const SelectedEntriesContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  const { selected } = useCurrentDir();

  const canOpen = useMemo(() => {
    const entries = selected().getEntries();
    return entries.every(e => !e.isDir) || entries.length === 1;
  }, [selected()]);

  const canStar = useMemo(() => {
    const entries = selected().getEntries();
    const starred = entries.filter(e => e.isStarred);
    return starred.length === 0 || starred.length === entries.length;
  }, [selected()]);

  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        {canOpen && <OpenMenuItem />}
        {canStar && <StarUnstarMenuItem />}
        {(canOpen || canStar) && <ContextMenu.Separator />}
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
