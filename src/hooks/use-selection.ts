import { goDown, goUp } from "@lib";
import { createSignal, onMount } from "solid-js";

function useSelection<T>(
  arr: T[],
  cb: (e: KeyboardEvent, selected: T) => void
) {
  const [index, setIndex] = createSignal<number>(0);

  window.addEventListener("keydown", e => {
    if (e.key === "Tab") {
      if (e.shiftKey) goUp(setIndex, arr);
      else goDown(setIndex, arr);

      console.log(arr.length);
    }

    if (e.key === "ArrowUp") goUp(setIndex, arr);
    if (e.key === "ArrowDown") goDown(setIndex, arr);

    cb(e, arr[index()]);
  });

  return index;
}

export { useSelection };
