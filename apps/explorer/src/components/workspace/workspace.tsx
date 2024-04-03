import { cn } from "@utils";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { useFlags } from "@hooks/use-flags";
import { Entry as EntryT } from "@types";
import { invoke } from "@tauri-apps/api";
import React, { useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { Row } from "./row";
import { useClickOutside } from "@hooks/use-click-outside";

type WorkspaceDims = {
  width: number;
  height: number;
};

const Workspace = () => {
  const { entries, selected } = useCurrentDir();
  const { changeDir } = useNavigation();
  const { showHidden } = useFlags();

  const ref = useClickOutside(() => selected.set([]));

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

  const onDoubleClick = (entry: EntryT) => async () => {
    if (entry.is_folder) {
      await changeDir(entry.path)();
    } else {
      await invoke("open_file", { path: entry.path });
    }
  };

  const filteredEntries = useMemo(
    () => entries.get().filter(e => showHidden.get() || !e.is_hidden),
    [entries, showHidden]
  );

  return (
    <EmptySpaceContextMenu>
      <div className={cn("w-full h-full", "overflow-auto")}>
        <AutoSizer>
          {({ height, width }: WorkspaceDims) => (
            <FixedSizeList
              innerRef={ref}
              width={width}
              height={height}
              itemCount={filteredEntries.length}
              itemData={{ entries: filteredEntries, onClick, onDoubleClick }}
              itemSize={24}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </EmptySpaceContextMenu>
  );
};

export { Workspace };
