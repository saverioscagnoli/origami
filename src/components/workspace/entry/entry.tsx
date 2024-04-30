import { useSettings } from "@contexts/settings";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { cn } from "@lib/utils";
import {
  addSelected,
  removeSelected,
  replaceSelected
} from "@redux/current-dir-slice";
import { DirEntry } from "@typings/dir-entry";
import { MouseEventHandler, forwardRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import { EntryCheckbox } from "./checkbox";
import { EntryFlags } from "./flags";
import { EntryLastModified } from "./last-modified";
import { GridEntryName, ListEntryName } from "./name";
import { EntrySize } from "./size";

const Entry = forwardRef<HTMLDivElement, DirEntry>((entry, ref) => {
  const { selected } = useCurrentDir();
  const dispatch = useDispatch();

  const { cd, open } = useDispatchers();

  const { name, path, isDir, isHidden, isSymlink, isStarred, lastModified, size } =
    entry;

  const isSelected = useMemo(
    () => selected.findIndex(e => e.path === path) !== -1,
    [selected]
  );

  const onClick: MouseEventHandler<HTMLDivElement> = evt => {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.detail === 1) {
      if (evt.ctrlKey) {
        // If the user presses the control key, add the entry to the selected list
        // If the entry is already selected, remove it from the selected list
        if (isSelected) {
          dispatch(removeSelected({ entry }));
        } else {
          dispatch(addSelected({ entry }));
        }
      } else if (evt.shiftKey) {
        // If the user presses the shift key, select all entries between the last selected entry and the current entry
      } else {
        // If the user doesn't press any keys, select only the current entry
        dispatch(replaceSelected({ newSelected: [entry] }));
      }
    }
  };

  const onDoubleClick: MouseEventHandler<HTMLDivElement> = evt => {
    evt.preventDefault();
    evt.stopPropagation();

    if (isDir) {
      cd(path)();
    } else {
      open(path)();
    }
  };

  const onContextMenu = () => {
    if (selected.length <= 1) {
      replaceSelected();
    } else if (selected.findIndex(e => e.path === path) === -1) {
      addSelected();
    }
  };

  const { showCheckboxes, viewType } = useSettings();

  const onCheckedChange = () => {
    if (isSelected) {
      removeSelected();
    } else {
      addSelected();
    }
  };

  return viewType() === "list" ? (
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
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <span className={cn("flex items-center gap-1.5")}>
        {showCheckboxes() && (
          <EntryCheckbox checked={isSelected} onCheckedChange={onCheckedChange} />
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
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <GridEntryName name={name} path={path} isDir={isDir} />
    </div>
  );
});

export { Entry };
