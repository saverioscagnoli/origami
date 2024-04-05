import { cn } from "@utils";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { useFlags } from "@hooks/use-flags";
import { Entry as EntryT } from "@types";
import React, { useMemo, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { Entry } from "./entry";
import { EntryContextMenu } from "./entry/context-menu/context-menu";
import { Header } from "./header";
import { Spinner } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { useDrop } from "react-dnd";
import { onMount } from "@life-cycle";

const Workspace = () => {
  const { entries, selected } = useCurrentDir();
  const { open, changing } = useNavigation();
  const { searchQuery } = useGlobalStates();
  const { showHidden } = useFlags();

  /*  const ref = useClickOutside<HTMLDivElement>(e => {
    if (e.button !== 2) {
      selected.set([]);
    }
  }); */

  const onClick =
    (entry: EntryT) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.ctrlKey) {
        selected.set([...selected.get(), entry]);
      } else {
        if (e.shiftKey && selected.get().length > 0) {
          const lastSelected = selected.get().slice(-1)[0];
          const lastSelectedIndex = entries
            .get()
            .findIndex(e => e.path === lastSelected.path);
          const currentIndex = entries.get().findIndex(e => e.path === entry.path);
          const newSelected = entries
            .get()
            .slice(
              Math.min(lastSelectedIndex, currentIndex),
              Math.max(lastSelectedIndex, currentIndex) + 1
            );
          selected.set(newSelected);
        } else {
          selected.set([entry]);
        }
      }
    };

  const onContextMenu = (entry: EntryT) => () => {
    if (!selected.get().some(e => e.path === entry.path)) {
      selected.set([entry]);
    }
  };

  const filteredEntries = useMemo(
    () =>
      entries
        .get()
        .filter(
          e =>
            (showHidden.get() || !e.is_hidden) &&
            e.name.toLowerCase().includes(searchQuery.get().toLowerCase())
        ),
    [entries, showHidden, searchQuery]
  );

  const ref = useRef<HTMLDivElement>(null);

  onMount(() => {
    ref.current?.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer?.files;
      if (files) {
        console.log(files);
      }
    });
  });

  return (
    <EmptySpaceContextMenu>
      <div className={cn("w-full h-full")} ref={ref}>
        <Header />
        {changing.get() ? (
          <div className={cn("w-full h-full", "grid place-items-center")}>
            <Spinner size={40} style={{ animationDuration: "500ms" }} />
          </div>
        ) : (
          <Virtuoso
            className={cn("!w-full !h-[calc(100vh-5rem)]")}
            data={filteredEntries}
            totalCount={filteredEntries.length}
            itemContent={(i, e) => (
              <EntryContextMenu>
                <Entry
                  {...e}
                  data-index={i}
                  onClick={onClick(e)}
                  onDoubleClick={open(e)}
                  onContextMenu={onContextMenu(e)}
                />
              </EntryContextMenu>
            )}
          />
        )}
      </div>
    </EmptySpaceContextMenu>
  );
};

export { Workspace };
