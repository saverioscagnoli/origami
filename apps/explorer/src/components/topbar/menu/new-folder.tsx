import { FolderIcon } from "@components/folder-icon";
import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { EntryMap } from "@lib/entry-map";
import { createDummyEntry } from "@lib/utils";

const NewFolderMenuItem = () => {
  const { entries } = useCurrentDir();
  const { renaming } = useGlobalStates();

  const onNewFolder = () => {
    const prevEntries = entries();
    const newFolder = createDummyEntry(true);

    const updatedEntries = new EntryMap(prevEntries);
    updatedEntries.set("", newFolder);
    entries.set(updatedEntries);
    renaming.set(["", newFolder]);
  };

  return (
    <Menubar.Item leftIcon={<FolderIcon />} onClick={onNewFolder}>
      New Folder
    </Menubar.Item>
  );
};

export { NewFolderMenuItem };
