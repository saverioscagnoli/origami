import { Accessor, JSX, createSignal, onCleanup } from "solid-js";

type VirtualListProps<T> = {
  data: Accessor<T[]>;
  count: number;
  height: number;
  itemHeight: number;
  children: (item: T) => JSX.Element;
};

function VirtualList<T>({
  data,
  count,
  height,
  itemHeight,
  children
}: VirtualListProps<T>) {
  const [scrollPos, setScrollPos] = createSignal(0);
  const startIdx = () => Math.floor(scrollPos() / itemHeight);
  const endIdx = () =>
    Math.min(startIdx() + Math.ceil(height / itemHeight), count);

  const onScroll = (e: Event) => {
    setScrollPos((e.target as HTMLElement).scrollTop);
  };

  onCleanup(() => {
    // cleanup logic here if needed
  });

  return (
    <div style={`height: ${height}px; overflow: auto;`} onscroll={onScroll}>
      <div style={`height: ${count * itemHeight}px; position: relative;`}>
        {() =>
          data()
            .slice(startIdx(), endIdx())
            .map((item, i) => (
              <div
                style={`position: absolute; top: ${
                  (startIdx() + i) * itemHeight
                }px;`}
              >
                {children(item)}
              </div>
            ))
        } 
      </div>
    </div>
  );
}

export { VirtualList };
