import { ScrollArea } from "@components/tredici";
import { useSettings } from "@contexts/settings";
import { useAccessor } from "@hooks/use-accessor";
import { useCurrentDir } from "@hooks/use-current-dir";
import { cn } from "@lib/utils";
import { ComponentPropsWithoutRef, forwardRef, useMemo, useRef } from "react";
import { Virtuoso, VirtuosoGrid, VirtuosoHandle } from "react-virtuoso";
import { EmptySpaceContextMenu } from "./empty-space";
import { Entry } from "./entry";
import { SelectedEntriesContextMenu } from "./selected";

const Workspace = () => {
  const { entries } = useCurrentDir();
  const { viewType } = useSettings();
  const { showHidden } = useSettings();

  const scrollRef = useAccessor<HTMLDivElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // useEffect(() => {
  //   if (virtuosoRef.current) {
  //     virtuosoRef.current.scrollToIndex({ index: 0, behavior: "smooth" });
  //   }
  // }, [entries]);

  const filtered = useMemo(
    () => entries.filter(e => showHidden() || !e.isHidden),
    [entries, showHidden()]
  );

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full")} id="workspace">
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={scrollRef.set}
        >
          {viewType() === "list" ? (
            <Virtuoso
              data={filtered}
              totalCount={filtered.length}
              fixedItemHeight={24}
              customScrollParent={scrollRef() ?? undefined}
              ref={virtuosoRef}
              itemContent={(_, entry) => <Entry key={entry.name} {...entry} />}
              components={listComponents}
            />
          ) : (
            <VirtuosoGrid
              data={filtered}
              totalCount={filtered.length}
              customScrollParent={scrollRef() ?? undefined}
              ref={virtuosoRef}
              itemContent={(_, entry) => <Entry key={entry.name} {...entry} />}
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
      <SelectedEntriesContextMenu>
        <div
          className={cn("flex flex-none content-stretch", "p-3", className)}
          {...props}
          ref={ref}
        >
          {children}
        </div>
      </SelectedEntriesContextMenu>
    )
  )
};

export { Workspace };
