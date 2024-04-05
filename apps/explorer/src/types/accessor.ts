import { Dispatch, SetStateAction } from "react";

type Accessor<T> = {
  get: () => T;
  set: Dispatch<SetStateAction<T>>;
  reset: () => void;
} & (T extends boolean
  ? { toggle: () => void }
  : T extends number
  ? {
      increment: (n: number) => void;
      decrement: (n: number) => void;
      reset: () => void;
    }
  : {});

export type { Accessor };
