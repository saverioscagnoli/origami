import { useCurrentDir } from "@hooks/use-current-dir";
import { useSettings } from "@hooks/use-settings";
import { cn } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";
import { MouseEventHandler, memo, useMemo } from "react";
import { EntryCheckbox } from "./checkbox";
import { EntryFlags } from "./flags";
import { EntryLastModified } from "./last-modified";
import { GridEntryName, ListEntryName } from "./name";
import { EntrySize } from "./size";

const Entry = memo<DirEntry>(entry => {
  const { selected, cd, addSelected, removeSelected, replaceSelected } =
    useCurrentDir();

  const { name, path, isDir, isHidden, isSymlink, isStarred, lastModified, size } =
    entry;

  const isSelected = useMemo(
    () => selected.findIndex(e => e.path === path) !== -1,
    [selected]
  );

  const addOrRemove = () => {
    if (isSelected) {
      removeSelected(entry);
    } else {
      addSelected(entry);
    }
  };

  const onClick: MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault();

    if (e.detail === 1) {
      if (e.ctrlKey) {
        addOrRemove();
      } else {
        replaceSelected([entry]);
      }
    } else if (e.detail === 2) {
      if (isDir) {
        cd(path);
      }
    }
  };

  const onContextMenu = () => {
    if (!isSelected && selected.length < 2) {
      replaceSelected([entry]);
    } else {
      addSelected(entry);
    }
  };

  const { view, showCheckboxes } = useSettings();

  return view === "list" ? (
    <div
      className={cn(
        "w-full h-6",
        "grid grid-cols-[1.25fr,1fr,1fr,1fr] items-center gap-6",
        "px-2",
        "text-sm",
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]",
        "group"
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span className={cn("flex items-center justify-start text-start gap-1.5")}>
        {showCheckboxes && (
          <EntryCheckbox checked={isSelected} onCheckedChange={addOrRemove} />
        )}
        <ListEntryName name={name} path={path} isDir={isDir} />
      </span>
      <EntryFlags isHidden={isHidden} isSymlink={isSymlink} isStarred={isStarred} />
      <EntryLastModified lastModified={lastModified} />
      <EntrySize isDir={isDir} size={size} />
    </div>
  ) : (
    <div
      className={cn(
        "w-28 h-28",
        "p-2",
        "rounded-sm",
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]"
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <GridEntryName name={name} path={path} isDir={isDir} />
    </div>
  );
});

export { Entry };
