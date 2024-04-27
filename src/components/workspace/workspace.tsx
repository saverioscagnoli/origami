import { useCurrentDir } from "@contexts/current-dir";
import { cn } from "@lib/utils";
import { Entry } from "./entry";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef
} from "react";
import { useSettings } from "@contexts/settings";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { useAccessor } from "@hooks/use-accessor";
import { ScrollArea } from "@components/tredici";

const Workspace = () => {
  const { dir, entries } = useCurrentDir();
  const { showHidden } = useSettings();

  const scrollRef = useAccessor<HTMLDivElement | null>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: 0, behavior: "smooth" });
    }
  }, [dir()]);

  const filtered = useMemo(
    () =>
      entries()
        .filter(e => showHidden() || !e.isHidden)
        .sort((a, b) => {
          if (a.isDir && !b.isDir) return -1;
          if (!a.isDir && b.isDir) return 1;
          return a.name.localeCompare(b.name);
        }),
    [entries(), showHidden()]
  );

  return (
    <div className={cn("w-full h-full", "overflow-auto")}>
      <ScrollArea className={cn("w-full h-full")} id="workspace">
        <ScrollArea.Viewport
          className={cn("w-full h-full", "rounded-[inherit]")}
          ref={scrollRef.set}
        >
          <Virtuoso
            data={filtered}
            totalCount={filtered.length}
            fixedItemHeight={24}
            customScrollParent={scrollRef() ?? undefined}
            ref={virtuosoRef}
            itemContent={(_, entry) => <Entry key={entry.name} {...entry} />}
            components={{ List }}
          />
          <ScrollArea.Scrollbar className={cn("mr-1")} />
        </ScrollArea.Viewport>
      </ScrollArea>
    </div>
  );
};

const List = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  (props, ref) => {
    return <div {...props} ref={ref} />;
  }
);

export { Workspace };
