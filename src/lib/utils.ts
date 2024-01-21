import { Accessor, Setter } from "solid-js";
import { Process } from "./types";

function trimPath(path: string): string {
  return path.split("\\").pop() || "";
}

function goUp(index: Setter<number>, processes: Accessor<Process[]>) {
  index(i => (i - 1 + processes().length) % processes().length);
}

function goDown(index: Setter<number>, processes: Accessor<Process[]>) {
  index(i => (i + 1) % processes().length);
}

export { trimPath, goUp, goDown };
