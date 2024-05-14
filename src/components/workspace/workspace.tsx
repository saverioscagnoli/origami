import { ScrollArea } from "@components/tredici";
import FilterWorker from "@lib/search-worker?worker";
import { cn, filter } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useSettings } from "@zustand/settings-store";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useMemo,
  useState
} from "react";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import { EmptySpaceContextMenu } from "./empty-space";
import { Entry } from "./entry";
import { ImagePreview } from "./image-preview";
import { SelectedEntriesContextMenu } from "./selected";

const Workspace = () => {
  const entries = useCurrentDir(state => state.entries);
  const [view, showHidden] = useSettings(s => [s.view, s.showHidden]);

  const searching = useGlobalStates(state => state.searching);

  const isSearchingEverywhere = useMemo(
    () => searching.where === "everywhere" && searching.state,
    [searching.where]
  );

  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  /**
   * Create a second state for filtered entries.
   */
  const [filtered, setFiltered] = useState<DirEntry[]>(entries);

  /**
   * Define the web worker for filtering entries.
   */
  const worker = useMemo(() => new FilterWorker(), []);

  /**
   * Every time any of the dependencies change, filter the entries.
   * The first if filter even if the searching state if off, to make
   * filtered entries remain the when the user presses enter, so they can access them using the keyboard, or when the click
   * on the entries they dont reset
   */
  useEffect(() => {
    let filtered = entries
      .filter(e => showHidden || !e.isHidden)
      .sort((a, b) => {
        if (a.isDir && !b.isDir) return -1;
        if (!a.isDir && b.isDir) return 1;
        return a.name.localeCompare(b.name);
      });

    if ((searching.state || searching.query !== "") && searching.where === "here") {
      filter(filtered, searching.query, worker).then(setFiltered);
    } else {
      setFiltered(filtered);
    }
  }, [entries, showHidden, searching]);

  return (
    <EmptySpaceContextMenu>
      <ScrollArea className={cn("w-full h-full", "relative")} id="workspace">
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={setScrollRef}
        >
          <>
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
            <ImagePreview />
          </>

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
