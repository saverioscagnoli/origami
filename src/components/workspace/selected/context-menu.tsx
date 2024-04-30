import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ChildrenProps } from "@typings/props";
import { useMemo } from "react";
import { CopyMenuItem } from "./copy";
import { CutMenuItem } from "./cut";
import { DeleteMenuItem } from "./delete";
import { OpenMenuItem } from "./open";
import { RenameMenuItem } from "./rename";
import { StarUnstarMenuItem } from "./star-unstar";

const SelectedEntriesContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  const { selected } = useCurrentDir();

  const canOpen = useMemo(() => {
    const entries = selected;
    return entries.every(e => !e.isDir) || entries.length === 1;
  }, [selected]);

  const canStar = useMemo(() => {
    const entries = selected;
    const starred = entries.filter(e => e.isStarred);
    return starred.length === 0 || starred.length === entries.length;
  }, [selected]);

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
