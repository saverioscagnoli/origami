import { cn } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useSettings } from "@zustand/settings-store";
import { MouseEventHandler, memo, useMemo } from "react";
import { EntryCheckbox } from "./checkbox";
import { EntryFlags } from "./flags";
import { EntryLastModified } from "./last-modified";
import { GridEntryName, ListEntryName } from "./name";
import { EntrySize } from "./size";
import { invoke } from "@lib/mapped-invoke";

const Entry = memo<DirEntry>(entry => {
  const { name, path, isDir, isHidden, isSymlink, isStarred, lastModified, size } =
    entry;

  const [selected, addSelected, removeSelected, replaceSelected] = useCurrentDir(
    state => [
      state.selected,
      state.addSelected,
      state.removeSelected,
      state.replaceSelected
    ]
  );

  const isSelected = useMemo(
    () => selected.findIndex(e => e.path === path) !== -1,
    [selected]
  );

  const onClick: MouseEventHandler = e => {
    if (e.detail === 1) {
      if (e.ctrlKey) {
        if (selected.findIndex(e => e.path === path) !== -1) {
          removeSelected(entry);
        } else {
          addSelected(entry);
        }
      } else if (e.shiftKey) {
        if (selected.length === 0) {
          addSelected(entry);
        } else {
        }
      } else {
        replaceSelected([entry]);
      }
    } else if (e.detail === 2) {
      if (isDir) {
        invoke(CommandName.ListDir, { dir: path });
      } else {
        invoke(CommandName.OpenFiles, { paths: [path] });
      }
    }
  };

  const onCheckedChange = () => {
    if (isSelected) {
      removeSelected(entry);
    } else {
      addSelected(entry);
    }
  };

  const onContextMenu = () => {
    if (selected.length < 2) {
      replaceSelected([entry]);
    } else {
      addSelected(entry);
    }
  };

  const [view, showCheckboxes] = useSettings(s => [s.view, s.showCheckboxes]);

  const clipboard = useGlobalStates(state => state.clipboard);

  const inClipboard = useMemo(
    () => clipboard.entries.findIndex(e => e.path === path) !== -1,
    [clipboard]
  );

  const isCutting = useMemo(() => inClipboard && clipboard.cut, [clipboard]);
  const isCopying = useMemo(() => inClipboard && !clipboard.cut, [clipboard]);

  return view === "list" ? (
    <div
      className={cn(
        "w-full h-6",
        "grid grid-cols-[1.25fr,1fr,1fr,1fr] items-center gap-6",
        "px-2",
        "text-sm",
        "cursor-default",
        {
          "hover:bg-[--gray-3]": !isSelected,
          "bg-[--gray-4]": isSelected
        },
        "group"
      )}
      draggable
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span className={cn("flex items-center justify-start text-start gap-1.5")}>
        {showCheckboxes && (
          <EntryCheckbox checked={isSelected} onCheckedChange={onCheckedChange} />
        )}
        <ListEntryName {...{ name, path, isDir }} />
      </span>
      <EntryFlags {...{ isHidden, isSymlink, isStarred, isCutting, isCopying }} />
      <EntryLastModified lastModified={lastModified} />
      <EntrySize {...{ isDir, size }} />
    </div>
  ) : (
    <div
      className={cn(
        "w-28 h-28",
        "p-2",
        "rounded-sm",
        "relative",
        !isSelected && "hover:bg-[--gray-3]",
        isSelected && "bg-[--gray-4]",
        "group"
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {showCheckboxes && (
        <EntryCheckbox
          className={cn("absolute top-2 left-2")}
          checked={isSelected}
          onCheckedChange={onCheckedChange}
        />
      )}
      <GridEntryName {...{ name, path, isDir }} />
    </div>
  );
});

export { Entry };
