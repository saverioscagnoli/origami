import React, { ReactNode, useRef } from "react";
import { ContextMenu } from "@tredici";
import {
  ClipboardCopyIcon,
  Pencil1Icon,
  StarFilledIcon,
  TrashIcon
} from "@radix-ui/react-icons";
import { useEntryContext } from "@hooks/use-entry-context";
import { DeleteEntryDialog } from "./delete-entry-dialog";
import { useDirectory } from "@hooks/use-directory";
import { invoke } from "@tauri-apps/api";

type EntryContextMenuProps = {
  children: ReactNode;
};

const EntryContextMenu: React.FC<EntryContextMenuProps> = ({ children }) => {
  const { dir, selected, copying, reload } = useDirectory();
  const { renaming, entry } = useEntryContext();
  const menuRef = useRef<HTMLDivElement>(null);

  const startRenaming = () => {
    renaming.set(true);
  };

  const onDelete = () => {
    menuRef.current.remove();
  };

  const onCopy = () => {
    copying.set(entry);
  };

  const onStar = async () => {
    await invoke("star_entry", {
      dir: dir.get(),
      name: entry.name,
      isFolder: entry.is_folder
    });
    reload();
  };

  const onUnstar = async () => {
    await invoke("unstar_entry", {
      name: entry.name,
      isFolder: entry.is_folder
    });
    reload();
  };

  return (
    <ContextMenu onOpenChange={() => selected.set([entry])}>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content ref={menuRef}>
        <ContextMenu.Item leftIcon={<ClipboardCopyIcon />} onClick={onCopy}>
          Copy
        </ContextMenu.Item>
        <ContextMenu.Item
          leftIcon={<StarFilledIcon />}
          onClick={entry.is_starred ? onUnstar : onStar}
        >
          {entry.is_starred ? "Unstar" : "Star"}
        </ContextMenu.Item>

        <ContextMenu.Separator />

        <ContextMenu.Item leftIcon={<Pencil1Icon />} onSelect={startRenaming}>
          Rename
        </ContextMenu.Item>
        <DeleteEntryDialog>
          <ContextMenu.Item
            colorScheme="red"
            leftIcon={<TrashIcon />}
            onClick={onDelete}
            onSelect={e => e.preventDefault()}
          >
            Delete
          </ContextMenu.Item>
        </DeleteEntryDialog>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EntryContextMenu };
