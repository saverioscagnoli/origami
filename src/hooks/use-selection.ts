import { goDown, goUp } from "@lib";
import { Accessor, Setter, createSignal, onCleanup } from "solid-js";

function useSelection<T>(
  arr: Accessor<T[]>,
  cb: (e: KeyboardEvent, selected: T) => void
): [Accessor<number>, Setter<number>] {
  const [index, setIndex] = createSignal<number>(0);

  const handler = (e: KeyboardEvent) => {
    const currentArr = arr();

    if (e.key === "Tab") {
      if (e.shiftKey) goUp(setIndex, currentArr);
      else goDown(setIndex, currentArr);
    }

    if (e.key === "ArrowUp") goUp(setIndex, currentArr);
    if (e.key === "ArrowDown") goDown(setIndex, currentArr);

    cb(e, currentArr[index()]);
  };

  window.addEventListener("keydown", handler);

  onCleanup(() => {
    window.removeEventListener("keydown", handler);
  });

  return [index, setIndex];
}

export { useSelection };
