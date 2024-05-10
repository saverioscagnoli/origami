import { For } from "@components/for";
import { ScrollArea } from "@components/tredici";
import { cn } from "@lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useSettings } from "@zustand/settings-store";
import { useMemo, useRef } from "react";
import { EmptySpaceContextMenu } from "./empty-space";
import { Entry } from "./entry";
import { SelectedEntriesContextMenu } from "./selected";

const Workspace = () => {
  const entries = useCurrentDir(state => state.entries);

  const parentRef = useRef<HTMLDivElement>(null);

  const showHidden = useSettings(state => state.showHidden);

  /**
   * Filter entries, based on:
   * - Hidden files
   */
  const filtered = useMemo(
    () => entries.filter(e => !e.isHidden || showHidden),
    [entries, showHidden]
  );

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24
  });

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full")}>
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={parentRef}
        >
          <SelectedEntriesContextMenu>
            <div
              className={cn("w-full", "relative")}
              style={{ height: `${virtualizer.getTotalSize()}px` }}
            >
              <For of={virtualizer.getVirtualItems()}>
                {item => {
                  const entry = filtered.at(item.index)!;

                  return (
                    <Entry
                      key={entry.path}
                      height={item.size}
                      transform={item.start}
                      {...entry}
                    />
                  );
                }}
              </For>
            </div>
          </SelectedEntriesContextMenu>
          <ScrollArea.Scrollbar className={cn("mr-1")} />
        </ScrollArea.Viewport>
      </ScrollArea>
    </EmptySpaceContextMenu>
  );
};

export { Workspace };
