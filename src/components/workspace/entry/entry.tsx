import { cn } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useSettings } from "@zustand/settings-store";
import { MouseEventHandler, memo, useMemo } from "react";
import { EntryCheckbox } from "./checkbox";
import { EntryFlags } from "./flags";
import { EntryLastModified } from "./last-modified";
import { EntryName } from "./name";
import { EntrySize } from "./size";

type EntryProps = DirEntry & {
  height: number;
  transform: number;
};

const Entry = memo<EntryProps>(({ height, transform, ...entry }) => {
  const { name, path, isDir, isHidden, isSymlink, isStarred, lastModified, size } =
    entry;

  const push = useCallstack(state => state.push);

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
        push(CommandName.ListDir, { dir: path });
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
    if (selected.length < 2 && selected.findIndex(e => e.path === path) === -1) {
      replaceSelected([entry]);
    } else {
      addSelected(entry);
    }
  };

  const showCheckboxes = useSettings(state => state.showCheckboxes);

  return (
    <div
      className={cn(
        "w-full",
        "absolute top-0 left-0",
        "grid grid-cols-[1.25fr,1fr,1fr,1fr] items-center gap-6",
        "px-2",
        "text-sm",
        {
          "hover:bg-[--gray-3]": !isSelected,
          "bg-[--gray-4]": isSelected
        },
        "group"
      )}
      style={{ height, transform: `translateY(${transform}px)` }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span className={cn("flex items-center justify-start text-start gap-1.5")}>
        {showCheckboxes && (
          <EntryCheckbox checked={isSelected} onCheckedChange={onCheckedChange} />
        )}
        <EntryName {...{ name, path, isDir }} />
      </span>
      <EntryFlags {...{ isHidden, isSymlink, isStarred }} />
      <EntryLastModified lastModified={lastModified} />
      <EntrySize {...{ isDir, size }} />
    </div>
  );
});

export { Entry };
