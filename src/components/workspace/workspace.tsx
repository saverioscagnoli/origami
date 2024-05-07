import { useCurrentDir } from "@contexts/current-dir";

import { VirtualList } from "@components/virtual-list/virtual-list";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { Entry } from "./entry";
import "./workspace.css";

const Workspace = () => {
  const { entries } = useCurrentDir();

  let parent!: HTMLDivElement;

  const virtualizer = createVirtualizer({
    get count() {
      return entries().length;
    },
    getScrollElement: () => parent,
    estimateSize: () => 25
  });

  return (
    <div id="workspace" ref={parent}>
      <VirtualList
        data={entries}
        count={entries().length}
        height={1000}
        itemHeight={24}
      >
        {entry => <Entry {...entry} />}
      </VirtualList>
    </div>
  );
};

export { Workspace };
 