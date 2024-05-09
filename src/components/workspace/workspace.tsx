import { For } from "@components/for";
import { ScrollArea } from "@components/tredici";
import { cn } from "@lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useRef } from "react";
import { Entry } from "./entry";

const Workspace = () => {
  const [entries] = useCurrentDir(state => [state.entries]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24
  });

  return (
    <ScrollArea className={cn("w-full h-full")}>
      <ScrollArea.Viewport
        className={cn("w-full h-full", "rounded-[inherit]")}
        ref={parentRef}
      >
        <div
          className={cn("w-full", "relative")}
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          <For of={virtualizer.getVirtualItems()}>
            {item => (
              <Entry
                key={item.key}
                height={item.size}
                transform={item.start}
                {...entries.at(item.index)!}
              />
            )}
          </For>
        </div>
        <ScrollArea.Scrollbar className={cn("mr-1")} />
      </ScrollArea.Viewport>
    </ScrollArea>
  );
};

export { Workspace };
