import { FolderIcon } from "@components/folder-icon";
import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { EntryMap } from "@lib/entry-map";
import { createDummyEntry } from "@lib/utils";
import { FileIcon, PlusIcon } from "@radix-ui/react-icons";

const NewMenuItem = () => {
  const { entries } = useCurrentDir();
  const { renaming } = useGlobalStates();

  const onNewFile = () => {
    const prevEntries = entries();
    const newFile = createDummyEntry(false);

    const updatedEntries = new EntryMap(prevEntries);
    updatedEntries.set("", newFile);
    entries.set(updatedEntries);
    renaming.set(["", newFile]);
  };

  const onNewFolder = () => {
    const prevEntries = entries();
    const newFolder = createDummyEntry(true);

    const updatedEntries = new EntryMap(prevEntries);
    updatedEntries.set("", newFolder);
    entries.set(updatedEntries);
    renaming.set(["", newFolder]);
  };

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>New</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item leftIcon={<FileIcon />} onClick={onNewFile}>
          File
        </ContextMenu.Item>
        <ContextMenu.Item leftIcon={<FolderIcon />} onClick={onNewFolder}>
          Folder
        </ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  );
};

export { NewMenuItem };
