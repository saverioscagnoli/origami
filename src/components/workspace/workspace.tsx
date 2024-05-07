import { useCurrentDir } from "@contexts/current-dir";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { Entry } from "./entry";

import { UnkeyedFor } from "@components/unkeyed-for";
import "./workspace.css";

const Workspace = () => {
  const { entries } = useCurrentDir();

  let parent!: HTMLDivElement;

  const virtualizer = createVirtualizer({
    getScrollElement: () => parent,
    estimateSize: () => 25,
    get count() {
      return entries().length;
    },
    overscan: 5
  });

  return (
    <div id="workspace" ref={parent}>
      <div
        id="virtual-list"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        <UnkeyedFor each={virtualizer.getVirtualItems()}>
          {item => {
            const entry = entries().at(item.index)!;

            return (
              <Entry
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  "min-height": `${item.size}px`,
                  transform: `translateY(${item.start}px)`
                }}
                {...entry}
              />
            );
          }}
        </UnkeyedFor>
      </div>
    </div>
  );
};

export { Workspace };
