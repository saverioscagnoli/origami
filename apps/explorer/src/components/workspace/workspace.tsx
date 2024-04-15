import { useCurrentDir } from "@hooks/use-current-dir";
import { useSettings } from "@hooks/use-settings";
import { cn } from "@lib/utils";
import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react";
import { Entry } from "./entry";
import { useNavigation } from "@hooks/use-navigation";
import { Virtuoso } from "react-virtuoso";
import { DirEntry } from "@typings/dir-entry";
import { EmptySpaceContextMenu } from "./empty-space";
import { SelectedEntriesContextMenu } from "./selected";
import { EntryMap } from "@lib/entry-map";
import { useGlobalStates } from "@hooks/use-global-states";
import { ScrollArea } from "@components/tredici";
import { useAccessor } from "@hooks/use-accessor";

const Workspace = () => {
  const { entries, selected } = useCurrentDir();
  const { showHidden, showCheckboxes } = useSettings();
  const { cd, openFile, createEntry, renameEntry } = useNavigation();
  const { renaming, cutting } = useGlobalStates();

  const scrollRef = useAccessor<HTMLDivElement | null>(null);

  const filteredEntries = useMemo(
    () =>
      entries()
        .getKeyValues()
        .filter(([_, e]) => showHidden() || !e.isHidden)
        .sort((a, b) => {
          if (a[1].isDir && !b[1].isDir) return -1;
          if (!a[1].isDir && b[1].isDir) return 1;
          return a[0].localeCompare(b[0]);
        }),
    [entries(), showHidden()]
  );

  const isSelected = (path: string) => selected().has(path);

  const isCutting = (path: string) => cutting()?.has(path);
  const isRenaming = (name: string) => renaming()[1]?.name === name;

  const create = (name: string, isDir: boolean) => {
    createEntry(name, isDir);
  };

  const stopCreating = () => {
    const newEntries = new EntryMap(entries());
    newEntries.delete("");
    entries.set(newEntries);
  };

  const stopRenaming = () => renaming.reset();

  const addSelected = (path: string, e: DirEntry) => () => {
    selected.set(new EntryMap(selected()).set(path, e));
  };

  const removeSelected = (path: string) => () => {
    const newSelected = new EntryMap(selected());
    newSelected.delete(path);
    selected.set(newSelected);
  };

  const replaceSelected = (path: string, e: DirEntry) => () => {
    selected.set(new EntryMap([[path, e]]));
  };

  const onContextMenu = (path: string, e: DirEntry) => () => {
    if (selected().size < 2) {
      replaceSelected(path, e)();
    }
  };

  const renameDispatcher = (path: string) => (newName: string) => {
    renameEntry(path, newName);
    stopRenaming();
  };

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full")}>
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={scrollRef.set}
        >
          <Virtuoso
            data={filteredEntries}
            totalCount={filteredEntries.length}
            fixedItemHeight={24}
            customScrollParent={scrollRef() ?? undefined}
            itemContent={(_, [path, entry]) => (
              <Entry
                key={path}
                {...entry}
                path={path}
                isSelected={isSelected(path)}
                isCutting={isCutting(path)}
                isRenaming={isRenaming(entry.name)}
                create={create}
                stopCreating={stopCreating}
                rename={renameDispatcher(path)}
                stopRenaming={stopRenaming}
                addSelected={addSelected(path, entry)}
                removeSelected={removeSelected(path)}
                replaceSelected={replaceSelected(path, entry)}
                showCheckboxes={showCheckboxes()}
                onDoubleClick={entry.isDir ? cd(path) : openFile([path])}
                onContextMenu={onContextMenu(path, entry)}
              />
            )}
            components={{ List }}
          />
          <ScrollArea.Scrollbar />
        </ScrollArea.Viewport>
      </ScrollArea>
    </EmptySpaceContextMenu>
  );
};

const List = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  (props, ref) => {
    return (
      <SelectedEntriesContextMenu>
        <div {...props} ref={ref} />
      </SelectedEntriesContextMenu>
    );
  }
);

export { Workspace };
