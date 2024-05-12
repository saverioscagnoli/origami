import { cn } from "@lib/utils";
import { RestrictedDirEntry } from "@typings/dir-entry";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useSettings } from "@zustand/settings-store";
import { FC, useMemo } from "react";
import { EntryCheckbox } from "../entry/checkbox";
import { ListEntryName } from "../entry/name";

const RestrictedEntry: FC<RestrictedDirEntry> = entry => {
  const { name, path, isDir } = entry;

  const showCheckboxes = useSettings(state => state.showCheckboxes);
  const [selected, addSelected, removeSelected] = useCurrentDir(state => [
    state.selected,
    state.addSelected,
    state.removeSelected
  ]);

  const isSelected = useMemo(
    () => selected.findIndex(e => e.path === entry.path) !== -1,
    [selected]
  );

  const onCheckedChange = () => {
    if (isSelected) {
      //removeSelected(entry);
    } else {
      //addSelected(entry);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-6",
        "grid grid-cols-[1fr,1fr] items-center gap-6",
        "px-2",
        "text-sm",
        "cursor-default"
      )}
    >
      <span className={cn("flex items-center justify-start text-start gap-1.5")}>
        {showCheckboxes && (
          <EntryCheckbox checked={isSelected} onCheckedChange={onCheckedChange} />
        )}
        <ListEntryName {...{ name, path, isDir }} />
      </span>
      <p className={cn("w-64", "text-sm", "text-[--gray-8]", "truncate")}>{path}</p>
    </div>
  );
};

export { RestrictedEntry };
