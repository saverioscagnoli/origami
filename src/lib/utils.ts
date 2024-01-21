import { Accessor, Setter } from "solid-js";

function trimPath(path: string): string {
  return path.split("\\").pop() || "";
}

function goUp<T>(index: Setter<number>, arr: T[]) {
  index(i => (i - 1 + arr.length) % arr.length);
}

function goDown<T>(index: Setter<number>, arr: T[]) {
  index(i => (i + 1) % arr.length);
}

export { trimPath, goUp, goDown };
