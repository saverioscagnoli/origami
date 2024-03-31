import { useDirectory } from "@hooks/use-directory";
import { Entry } from "./entry";
import { EmptySpaceContextMenu } from "./empty-space-context-menu";
import { EntryContextMenu } from "./entry-context-menu";
import { EntryContextProvider } from "@components/providers/entry";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import React, { CSSProperties, useEffect, useState } from "react";
import { DirEntry } from "@types";
import { cn } from "@utils";
import { Spinner } from "@tredici";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { appConfigDir } from "@tauri-apps/api/path";
import { BsFolderFill } from "react-icons/bs";

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
  const { dir, entries, changing, showHidden, searchTerm } = useDirectory();
  const [starred, setStarred] = useState<string>("");

  useEffect(() => {
    appConfigDir().then(p => setStarred(p + "starred"));
  }, []);

  let filteredEntries = entries
    .get()
    .filter(e => !(e.is_hidden && !showHidden.get()) || !e.can_be_opened);

  if (searchTerm.get()) {
    const term = searchTerm.get().toLowerCase();
    filteredEntries = filteredEntries.filter(e =>
      e.name.toLowerCase().includes(term)
    );
  }

  return (
    <EmptySpaceContextMenu>
      {entries.get().length === 0 ? (
        <div
          className={cn(
            "w-full h-full",
            "flex flex-col justify-center items-center",
            "text-[--gray-10]"
          )}
        >
          {dir.get() === starred ? (
            <>
              <StarFilledIcon width={70} height={70} />
              <p className={cn("text-2xl")}>No starred files.</p>
            </>
          ) : (
            <>
              <BsFolderFill size={70} />
              <p className={cn("text-2xl")}>Folder is empty.</p>
            </>
          )}
        </div>
      ) : changing.get() ? (
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
