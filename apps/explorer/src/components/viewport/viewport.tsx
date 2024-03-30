import { useDirectory } from "@hooks/use-directory";
import { Entry } from "./entry";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { EntryContextMenu } from "./entry-context-menu";
import { EntryContextProvider } from "@components/providers/entry";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import React, { CSSProperties } from "react";
import { DirEntry } from "@types";
import { cn } from "@utils";
import { Spinner } from "@tredici";

type RowProps = {
  index: number;
  style: CSSProperties;
  data: DirEntry[];
};

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const f = data[index];
  return (
    <EntryContextProvider entry={f} key={f.name}>
      <EntryContextMenu>
        <Entry style={style} index={index} />
      </EntryContextMenu>
    </EntryContextProvider>
  );
};

type ViewportDims = {
  width: number;
  height: number;
};

const Fallback = () => (
  <div className={cn("w-full h-full", "grid place-items-center")}>
    <Spinner size={30} />
  </div>
);

const Viewport = () => {
  const { entries, changing, showHidden } = useDirectory();

  const filteredEntries = entries
    .get()
    .filter(e => !(e.is_hidden && !showHidden.get()) || !e.can_be_opened);

  return (
    <EmptySpaceContextMenu>
      {changing.get() ? (
        <Fallback />
      ) : (
        <AutoSizer>
          {({ width, height }: ViewportDims) => (
            <List
              width={width}
              height={height}
              itemCount={filteredEntries.length}
              itemData={filteredEntries}
              itemSize={24}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      )}
    </EmptySpaceContextMenu>
  );
};

export { Viewport };
