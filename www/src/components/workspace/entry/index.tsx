import { OpenFile } from "@wails/methods/fs/Filesystem";
import { fs } from "@wails/methods/models";
import React, { MouseEventHandler, useMemo } from "react";
import { Checkbox } from "~/components/tredici";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useEnv } from "~/zustand/env";
import { useSettings } from "~/zustand/settings";
import { GridEntryDisplay, ListEntryDisplay } from "./display";
import { EntryFlags } from "./flags";

const ListEntry = React.memo<fs.DirEntry>(
  ({ Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }) => {
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
    if (os === "windows" && IsStarred && IsSymlink) {
      IsDir = true;
    }

    const [cd, selected, setSelected] = useCurrentDir(s => [
      s.cd,
      s.selected,
      s.setSelected
    ]);

    const isSelected = useMemo(
      () => selected.some(s => s.Path == Path),
      [selected]
    );

    const showCheckboxes = useSettings(s => s.showCheckboxes);

    const onClick: MouseEventHandler<HTMLParagraphElement> = e => {
      if (e.detail == 1) {
        if (e.ctrlKey) {
          /**
           * If ctrl is pressed, add/remove the entry to the selected list.
           */
          if (isSelected) {
            setSelected(selected.filter(s => s.Path != Path));
          } else {
            setSelected([
              ...selected,
              { Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }
            ]);
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
          setSelected([{ Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }]);
        }
      }

      if (e.detail == 2) {
        if (IsDir) {
          cd(Path);
        } else {
          OpenFile(Path);
        }
      }
    };

    const onCheckedChange = () => {
      if (isSelected) {
        setSelected(selected.filter(s => s.Path != Path));
      } else {
        setSelected([
          ...selected,
          { Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }
        ]);
      }
    };

    const onContextMenu = () => {
      if (selected.length < 2) {
        setSelected([{ Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }]);
      } else {
        setSelected([
          ...selected,
          { Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }
        ]);
      }
    };

    return (
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
          <ListEntryDisplay {...{ Name, IsDir }} />
        </span>
        <EntryFlags {...{ IsHidden, IsStarred, IsSymlink }} />
      </div>
    );
  }
);

const GridEntry = React.memo<fs.DirEntry>(
  ({ Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }) => {
    const [cd, selected, setSelected] = useCurrentDir(s => [
      s.cd,
      s.selected,
      s.setSelected
    ]);

    const isSelected = useMemo(
      () => selected.some(s => s.Path == Path),
      [selected]
    );

    const showCheckboxes = useSettings(s => s.showCheckboxes);

    const onClick: MouseEventHandler<HTMLParagraphElement> = e => {
      if (e.detail == 1) {
        if (e.ctrlKey) {
          /**
           * If ctrl is pressed, add the entry to the selected list.
           */
          setSelected([
            ...selected,
            { Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }
          ]);
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
          setSelected([{ Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }]);
        }
      }

      if (e.detail == 2) {
        if (IsDir) {
          cd(Path);
        } else {
          OpenFile(Path);
        }
      }
    };

    const onCheckedChange = () => {
      if (isSelected) {
        setSelected(selected.filter(s => s.Path != Path));
      } else {
        setSelected([
          ...selected,
          { Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }
        ]);
      }
    };

    const onContextMenu = () => {
      if (selected.length < 2) {
        setSelected([{ Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }]);
      } else {
        setSelected([
          ...selected,
          { Name, Path, IsDir, IsSymlink, IsHidden, IsStarred }
        ]);
      }
    };

    return (
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
        <GridEntryDisplay {...{ Name, IsDir }} />
      </div>
    );
  }
);

export { GridEntry, ListEntry };
