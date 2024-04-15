import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { EntryMap } from "@lib/entry-map";
import { createDummyEntry } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";

const NewFileMenuItem = () => {
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

  return (
    <Menubar.Item leftIcon={<FileIcon />} onClick={onNewFile}>
      New File
    </Menubar.Item>
  );
};

export { NewFileMenuItem };
