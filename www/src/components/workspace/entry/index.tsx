import { OpenFiles } from "@wails/methods/fs/Filesystem";
import { fs } from "@wails/methods/models";
import React, { MouseEventHandler, useMemo } from "react";
import { Checkbox } from "~/components/tredici";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { useSettings } from "~/zustand/settings";
import { useStates } from "~/zustand/states";
import { GridEntryDisplay, ListEntryDisplay } from "./display";
import { EntryFlags } from "./flags";
import { EntryLastModified } from "./last-modified";
import { EntrySize } from "./size";

const Entry = React.memo<fs.DirEntry>(entry => {
  const os = useEnv(s => s.os);
  /**
   * Little bit weird, but if the entry is in the starred directory
   * and is a symlink, on windows it doesnt get detected as a folder.
   * So, we need to manually set it.
   * Little bit hacky, will fix it later.
   *
   * This works becase starred files are hard links, not symlinks.
   * So, files are not detected as symlinks, but folders are, since they are junctions.
   * I hate windows
   */
  if (os === "windows" && entry.IsStarred && entry.IsSymlink) {
    // Copy object because IsDir is not writable
    entry = { ...entry, IsDir: true };
  }

  const [cd, selected, setSelected] = useCurrentDir(s => [
    s.cd,
    s.selected,
    s.setSelected
  ]);

  const isSelected = useMemo(
    () => selected.some(s => s.Path == entry.Path),
    [selected]
  );

  const [showCheckboxes, view] = useSettings(s => [s.showCheckboxes, s.view]);

  const onClick: MouseEventHandler<HTMLParagraphElement> = e => {
    if (e.detail == 1) {
      if (e.ctrlKey) {
        /**
         * If ctrl is pressed, add/remove the entry to the selected list.
         */
        if (isSelected) {
          setSelected(selected.filter(s => s.Path != entry.Path));
        } else {
          setSelected([...selected, entry]);
        }
      } else if (e.shiftKey) {
        /**
         * If shift is pressed, select all entries between the
         * current entry and the last selected entry.
         */
      } else {
        /**
         * If nothing is pressed, select the entry and deselect
         * all other entries.
         */
        setSelected([entry]);
      }
    }

    if (e.detail == 2) {
      if (entry.IsDir) {
        cd(entry.Path);
      } else {
        OpenFiles([entry.Path]);
      }
    }
  };

  const onCheckedChange = () => {
    if (isSelected) {
      setSelected(selected.filter(s => s.Path != entry.Path));
    } else {
      setSelected([...selected, entry]);
    }
  };

  const onContextMenu = () => {
    if (selected.length < 2) {
      setSelected([entry]);
    } else {
      setSelected([...selected, entry]);
    }
  };

  const clipboard = useStates(s => s.clipboard);

  const inClipboard = useMemo(
    () => clipboard.entries.findIndex(e => e.Path === entry.Path) !== -1,
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
        ["hover:bg-[--gray-3]"],
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
      <span
        className={cn("flex items-center justify-start text-start gap-1.5")}
      >
        {showCheckboxes && (
          <Checkbox
            size="sm"
            className={cn(
              "w-3.5 h-3.5",
              "!rounded",
              "border-[1px]",
              "z-50",
              isSelected ? "visible" : "invisible",
              "group-hover:visible"
            )}
            checked={isSelected}
            onCheckedChange={onCheckedChange}
            onClick={e => e.stopPropagation()}
          />
        )}
        <ListEntryDisplay {...entry} />
      </span>
      <EntryFlags {...{ ...entry, isCutting, isCopying }} />
      <EntryLastModified {...entry} />
      <EntrySize {...entry} />
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
        <Checkbox
          size="sm"
          className={cn(
            "w-3.5 h-3.5",
            "absolute top-2 left-2",
            "!rounded",
            "border-[1px]",
            "z-50",
            isSelected ? "visible" : "invisible",
            "group-hover:visible"
          )}
          checked={isSelected}
          onCheckedChange={onCheckedChange}
          onClick={e => e.stopPropagation()}
        />
      )}
      <GridEntryDisplay {...entry} />
    </div>
  );
});

export { Entry };
