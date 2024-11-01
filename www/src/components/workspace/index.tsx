import { fs } from "@wails/go/models";
import React, { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { ScrollArea } from "~/components/tredici";
import { useWailsEvent } from "~/hooks/use-wails-event";
import { cn } from "~/lib/utils";
import { useConfig } from "~/stores/config";
import { useDir } from "~/stores/dir";
import { Entry } from "./entry";

function nameSort(a: fs.DirEntry, b: fs.DirEntry, asc: boolean) {
  // Put directories first
  if (a.isDir && !b.isDir) return -1;
  if (!a.isDir && b.isDir) return 1;

  // Sort by name
  let comp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  return asc ? comp : -comp;
}

const Workspace: React.FC = () => {
  const [entries, addEntry, deleteEntry, reload] = useDir(s => [
    s.entries,
    s.addEntry,
    s.deleteEntry,
    s.reload
  ]);

  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const showHidden = useConfig(s => s.showHidden);

  const filtered = useMemo(
    () =>
      entries
        .filter(e => showHidden || !e.isHidden)
        .sort((a, b) => nameSort(a, b, true)),
    [entries, showHidden]
  );

  /**
   * Listen for file system events
   */
  useWailsEvent("fs:create", addEntry);
  useWailsEvent("fs:delete", deleteEntry);
  useWailsEvent("fs:rename", reload);

  return (
    <ScrollArea className={cn("w-full h-full", "relative")}>
      <ScrollArea.Viewport className={cn("w-full h-full")} ref={setScrollRef}>
        <Virtuoso
          data={filtered}
          totalCount={filtered.length}
          customScrollParent={scrollRef ?? undefined}
          itemContent={(_, entry) => <Entry key={entry.path} {...entry} />}
        />
        <ScrollArea.Scrollbar className={cn("mr-1")} />
      </ScrollArea.Viewport>
    </ScrollArea>
  );
};

export { Workspace };
