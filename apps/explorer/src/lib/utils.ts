import { clsx, ClassValue } from "clsx";
import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

function toAccessor<T>([state, setState]: [T, Dispatch<SetStateAction<T>>]) {
  return {
    get: () => state,
    set: setState
  };
}

export { cn, toAccessor };
