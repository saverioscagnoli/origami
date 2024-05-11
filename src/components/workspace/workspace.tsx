import { ScrollArea } from "@components/tredici";
import { cn } from "@lib/utils";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useSettings } from "@zustand/settings-store";
import { ComponentPropsWithoutRef, forwardRef, useMemo, useState } from "react";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import { EmptySpaceContextMenu } from "./empty-space";
import { Entry } from "./entry";
import { SelectedEntriesContextMenu } from "./selected";

const Workspace = () => {
  const entries = useCurrentDir(state => state.entries);
  const [view, showHidden] = useSettings(s => [s.view, s.showHidden]);

  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  /**
   * Filter entries, based on:
   * - Hidden files
   */
  const filtered = useMemo(
    () => entries.filter(e => !e.isHidden || showHidden),
    [entries, showHidden]
  );

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full", "relative")} id="workspace">
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={setScrollRef}
        >
          {view === "list" ? (
            <Virtuoso
              data={filtered}
              totalCount={filtered.length}
              fixedItemHeight={24}
              customScrollParent={scrollRef ?? undefined}
              itemContent={(_, entry) => <Entry key={entry.name} {...entry} />}
              components={listComponents}
            />
          ) : (
            <VirtuosoGrid
              data={filtered}
              totalCount={filtered.length}
              customScrollParent={scrollRef ?? undefined}
              itemContent={(_, entry) => (
                <SelectedEntriesContextMenu>
                  <Entry key={entry.name} {...entry} />
                </SelectedEntriesContextMenu>
              )}
              components={gridComponents}
            />
          )}
          <ScrollArea.Scrollbar className={cn("mr-1")} />
        </ScrollArea.Viewport>
      </ScrollArea>
    </EmptySpaceContextMenu>
  );
};

const listComponents = {
  List: forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>((props, ref) => {
    return (
      <SelectedEntriesContextMenu>
        <div {...props} ref={ref} />
      </SelectedEntriesContextMenu>
    );
  })
};

const gridComponents = {
  List: forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
    ({ className, children, ...props }, ref) => (
      <div className={cn("flex flex-wrap", className)} {...props} ref={ref}>
        {children}
      </div>
    )
  ),
  Item: forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
    ({ className, children, ...props }, ref) => (
      <div
        className={cn("flex flex-none content-stretch", "p-3", className)}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    )
  )
};

export { Workspace };
