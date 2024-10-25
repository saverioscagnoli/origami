import { fs } from "@wails/methods/models";
import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useMemo,
  useState
} from "react";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import { ScrollArea } from "~/components/tredici";
import useDebounce from "~/hooks/use-debounce";
import { useWailsEvent } from "~/hooks/use-wails-events";
import { cn, filterWithWorker } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";
import { useSettings } from "~/zustand/settings";
import { useStates } from "~/zustand/states";
import { BlankSpaceContextMenu } from "./context-menu/blank-space";
import { SelectedEntriesContextMenu } from "./context-menu/selected";
import { Entry } from "./entry";

import FilterWorker from "~/lib/filter-worker?worker";

function nameSort(a: fs.DirEntry, b: fs.DirEntry, asc: boolean) {
  // Put directories first
  if (a.IsDir && !b.IsDir) return -1;
  if (!a.IsDir && b.IsDir) return 1;

  // Sort by name
  let comp = a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
  return asc ? comp : -comp;
}

function sizeSort(a: fs.DirEntry, b: fs.DirEntry, asc: boolean) {
  // Put files first
  if (a.IsDir && !b.IsDir) return 1;
  if (!a.IsDir && b.IsDir) return -1;

  // If both are files, sort by size
  if (!a.IsDir && !b.IsDir) {
    return asc ? a.Size - b.Size : b.Size - a.Size;
  }

  // If both are directories, sort by name
  if (a.IsDir && b.IsDir) {
    let comp = a.Name.localeCompare(b.Name);
    return asc ? comp : -comp;
  }

  return 0;
}

function parseDate(date: string) {
  // Date is in format "DD/MM/YYYY HH:MM"
  let [d, m, y, h, min] = date.split(/[ /:]/);
  return new Date(+y, +m - 1, +d, +h, +min);
}

function dateSort(a: fs.DirEntry, b: fs.DirEntry, asc: boolean) {
  let dateA = parseDate(a.LastModified);
  let dateB = parseDate(b.LastModified);

  return asc
    ? dateB.getTime() - dateA.getTime()
    : dateA.getTime() - dateB.getTime();
}

const Workspace: React.FC = () => {
  const [cd, dir, entries, setEntries] = useCurrentDir(s => [
    s.cd,
    s.dir,
    s.entries,
    s.setEntries
  ]);
  const [showHidden, view, filter] = useSettings(s => [
    s.showHidden,
    s.view,
    s.filter
  ]);

  /**
   * Define a worker thread to filter entries.
   * So that the ui doesn't freeze when searching.
   */
  const worker = useMemo(() => new FilterWorker(), []);
  const [searching, setSearching] = useStates(s => [
    s.searching,
    s.setSearching
  ]);
  const [filtered, setFiltered] = useState<fs.DirEntry[]>([]);

  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  const [toAdd, setToAdd] = useState<fs.DirEntry[]>([]);
  const [toDelete, setToDelete] = useState<string[]>([]);

  const [toStar, setToStar] = useState<string[]>([]);
  const [toUnstar, setToUnstar] = useState<string[]>([]);

  const filterFn = useMemo(() => {
    switch (filter.kind) {
      case "name": {
        return nameSort;
      }

      case "size": {
        return sizeSort;
      }

      case "date": {
        return dateSort;
      }

      default: {
        return nameSort;
      }
    }
  }, [filter]);

  /**
   * Every time any of the dependencies change, filter the entries.
   * The first if filter even if the searching state if off, to make
   * filtered entries remain the when the user presses enter, so they can access them using the keyboard, or when the click
   * on the entries they dont reset
   */
  useEffect(() => {
    let filteredEntries = entries
      .filter(e => showHidden || !e.IsHidden)
      .sort((a, b) => filterFn(a, b, filter.asc));

    if (searching.query !== "" && searching.where === "here") {
      filterWithWorker(filteredEntries, searching.query, worker).then(
        setFiltered
      );
    } else {
      setFiltered(filteredEntries);
    }
  }, [entries, showHidden, searching, filterFn, filter.asc]);

  useWailsEvent(
    "f:write",
    entry => {
      setEntries(filtered.map(e => (e.Path === entry.Path ? entry : e)));
    },
    [entries]
  );

  useWailsEvent(
    "f:create",
    entry => {
      setToAdd(t => [...t, entry]);
    },
    [entries]
  );

  useWailsEvent(
    "f:remove",
    path => {
      setToDelete(t => [...t, path]);
    },
    [entries]
  );

  useWailsEvent("f:rename", () => cd(dir), [dir]);

  useWailsEvent(
    "f:star",
    path => {
      setToStar(t => [...t, path]);
    },
    [entries]
  );

  useWailsEvent(
    "f:unstar",
    path => {
      setToUnstar(t => [...t, path]);
    },
    [entries]
  );

  /**
   * Add the incoming entries after a debounce.
   * This is to prevent multiple setEntries from running,
   * because the `f:create` event is emitted for each file,
   * and since more than one file can be created at once,
   * like when extracting a zip, pasting, etc.
   * it can be run too many times, causing problems.
   */
  useDebounce(
    () => {
      if (toAdd.length > 0) {
        setEntries([...toAdd, ...filtered]);
        setToAdd([]);
      }
    },
    50,
    [toAdd]
  );

  /**
   * Delete the selected entries after a debounce.
   * This is to prevent multiple setEntries from running,
   * because the `f:remove` event is emitted for each file,
   * and since more than one file can be deleted at once,
   * it can be run too many times, causing problems.
   */
  useDebounce(
    () => {
      if (toDelete.length > 0) {
        setEntries(filtered.filter(e => !toDelete.includes(e.Path)));
        setToDelete([]);
      }
    },
    50,
    [toDelete]
  );

  // Same as above
  useDebounce(
    () => {
      if (toStar.length > 0) {
        setEntries(
          filtered.map(e =>
            toStar.includes(e.Path) ? { ...e, IsStarred: true } : e
          )
        );
        setToStar([]);
      }
    },
    50,
    [toStar]
  );

  // Same as above
  useDebounce(
    () => {
      if (toUnstar.length > 0) {
        setEntries(
          filtered.map(e =>
            toUnstar.includes(e.Path) ? { ...e, IsStarred: false } : e
          )
        );
        setToUnstar([]);
      }
    },
    50,
    [toUnstar]
  );

  return (
    <BlankSpaceContextMenu>
      <ScrollArea id="workspace" className={cn("w-full h-full", "relative")}>
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={setScrollRef}
        >
          {view == "list" ? (
            <Virtuoso
              data={filtered}
              totalCount={filtered.length}
              fixedItemHeight={24}
              customScrollParent={scrollRef ?? undefined}
              itemContent={(_, entry) => <Entry {...entry} key={entry.Path} />}
              components={listComponents}
            />
          ) : (
            <VirtuosoGrid
              data={filtered}
              totalCount={filtered.length}
              customScrollParent={scrollRef ?? undefined}
              itemContent={(_, entry) => (
                <SelectedEntriesContextMenu>
                  <Entry {...entry} key={entry.Path} />
                </SelectedEntriesContextMenu>
              )}
              components={gridComponents}
            />
          )}

          <ScrollArea.Scrollbar className={cn("mr-1")} />
        </ScrollArea.Viewport>
      </ScrollArea>
    </BlankSpaceContextMenu>
  );
};

const listComponents = {
  List: forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
    (props, ref) => {
      return (
        <SelectedEntriesContextMenu>
          <div {...props} ref={ref} />
        </SelectedEntriesContextMenu>
      );
    }
  )
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
