import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { CopyMenuItem } from "./copy";
import { CutMenuItem } from "./cut";
import { DeleteMenuItem } from "./delete";
import { OpenMenuItem } from "./open";
import { RenameMenuItem } from "./rename";
import { StarUnstarMenuItem } from "./star-unstar";

const SelectedEntriesContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <OpenMenuItem />
        <StarUnstarMenuItem />
        <ContextMenu.Separator />
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
