import clsx from "clsx";
import { ClassValue } from "clsx";
import { Setter } from "solid-js";
import { twMerge } from "tailwind-merge";

function trimPath(path: string): string {
  return path.split("\\").pop() || "";
}

function goUp<T>(index: Setter<number>, arr: T[]) {
  index(i => (i - 1 + arr.length) % arr.length);
}

function goDown<T>(index: Setter<number>, arr: T[]) {
  index(i => (i + 1) % arr.length);
}

function getExeName(path: string): string {
  return path.split("\\").pop()!;
}

function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export { trimPath, goUp, goDown, getExeName, cn };
