import { ScrollArea } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useSettings } from "@hooks/use-settings";
import FilterWorker from "@lib/search-worker?worker";
import { cn } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";
import { useEvent } from "@util-hooks/use-event";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import { EmptySpaceContextMenu } from "./empty-space";
import { Entry } from "./entry";
import { SelectedEntriesContextMenu } from "./selected";

const Workspace = () => {
  const { selected, entries, replaceSelected, cd, openFiles } = useCurrentDir();
  const { showHidden, view } = useSettings();
  const { searching, errors, renaming, creating } = useGlobalStates();

  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const [filtered, setFiltered] = useState<DirEntry[]>(entries);
  const worker = useMemo(() => new FilterWorker(), []);

  const filter = async (entries: DirEntry[], query: string): Promise<DirEntry[]> => {
    return new Promise((res, rej) => {
      worker.postMessage([entries, query]);

      worker.onmessage = e => {
        res(e.data);
      };

      worker.onerror = e => {
        rej(e);
      };
    });
  };

  useEffect(() => {
    let filtered = entries.filter(e => showHidden || !e.isHidden);

    if (searching.state || searching.query !== "") {
      filter(filtered, searching.query).then(setFiltered);
    } else {
      setFiltered(filtered);
    }
  }, [entries, showHidden, searching]);

  const goUp = () => {
    if (selected.length === 1) {
      let index = filtered.findIndex(e => e.path === selected[0].path);

      if (index > 0) {
        let entry = filtered.at(index - 1);
        replaceSelected([entry]);
      } else {
        replaceSelected([filtered.at(-1)]);
      }
    }
  };

  const goDown = () => {
    if (selected.length === 1) {
      let index = filtered.findIndex(e => e.path === selected[0].path);

      if (index < filtered.length - 1) {
        let entry = filtered.at(index + 1);
        replaceSelected([entry]);
      } else {
        replaceSelected([filtered.at(0)]);
      }
    }
  };

  // To cycle through entries by pressing the first letter of the entry name
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEvent(
    "keydown",
    e => {
      switch (e.key) {
        case "ArrowUp": {
          e.preventDefault();

          if (e.shiftKey) {
            let index = filtered.findIndex(e => e.path === selected.at(-1).path);
            let aboveIndex = index - 1;

            if (selected.includes(filtered.at(aboveIndex))) {
              let newSelected = [...selected];
              newSelected.pop();
              replaceSelected(newSelected);
            } else if (index > 0) {
              replaceSelected([...selected, filtered.at(aboveIndex)]);
            }

            break;
          } else {
            goUp();
          }
          break;
        }

        case "ArrowDown": {
          e.preventDefault();

          if (e.shiftKey) {
            let index = filtered.findIndex(e => e.path === selected.at(-1).path);
            let belowIndex = index + 1;

            if (selected.includes(filtered.at(belowIndex))) {
              let newSelected = [...selected];
              newSelected.pop();
              replaceSelected(newSelected);
            } else if (index < filtered.length - 1) {
              replaceSelected([...selected, filtered.at(belowIndex)]);
            }

            break;
          } else {
            goDown();
          }
          break;
        }
        case "Tab":
          if (errors !== null) return;
          e.preventDefault();

          if (selected.length === 0) {
            replaceSelected([filtered.at(0)]);
            break;
          }

          if (e.shiftKey) {
            goUp();
          } else {
            goDown();
          }
          break;

        case "Enter": {
          if (errors !== null) return;

          e.preventDefault();

          if (searching.state) {
            let entry = filtered.at(0);

            if (entry) {
              replaceSelected([entry]);
            } else {
              replaceSelected([]);
            }
          } else {
            if (selected.length === 1) {
              let entry = selected.at(0);

              if (entry) {
                if (entry.isDir) {
                  cd(entry.path);
                } else {
                  openFiles([entry.path]);
                }
              }
            }
          }

          break;
        }

        case "Escape": {
          if (searching.state || renaming !== null || errors !== null) return;

          replaceSelected([]);
          break;
        }

        default: {
          if (
            !searching.state &&
            !renaming &&
            !e.ctrlKey &&
            !e.shiftKey &&
            e.key.match(/^[a-zA-Z0-9]$/)
          ) {
            if (errors !== null || renaming !== null || creating.state) return;

            let entries = filtered.filter(entry =>
              entry.name.toLowerCase().startsWith(e.key.toLowerCase())
            );

            if (entries.length > 0) {
              let entry = entries.at(currentIndex % entries.length);

              if (entry) {
                replaceSelected([entry]);
                scrollRef.scrollTo({
                  top: 24 * filtered.findIndex(e => e.name === entry.name)
                });
                setCurrentIndex(p => (p + 1) % entries.length);
              }
            }
          }
        }
      }
    },
    [filtered, renaming, selected, errors]
  );

  return (
    <EmptySpaceContextMenu>
      <ScrollArea
        className={cn("w-full h-full", "focus:outline-none")}
        id="workspace"
        tabIndex={0}
        ref={workspaceRef}
      >
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
                itemContent={(_, entry) => <Entry key={entry.name} {...entry} />}
                components={gridComponents}
              />
            )}

            {/* {(() => {
              const [base64, setBase64] = useState<string>("");

              useEffect(() => {
                if (
                  selected.at(0) &&
                  selected.length === 1 &&
                  selected.at(0).name.endsWith(".png")
                ) {
                  invoke(Command.GetImageBase64, { path: selected.at(0).path }).then(
                    setBase64
                  );
                }
              }, [selected]);

              return (
                <div
                  className={cn(
                    "absolute bottom-0 right-0",
                    selected.length === 1 &&
                      selected.at(0)?.name.endsWith(".png") &&
                      "!block",
                    "hidden"
                  )}
                >
                  <img src={`data:image/png;base64,${base64[0]}`} alt="preview" />
                </div>
              );
            })()} */}
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
