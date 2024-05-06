import { Dispatch, SetStateAction } from "react";

type Accessor<T> = {
  (value?: T): T extends undefined ? T : void;
  reset: () => void;
} & (T extends boolean
  ? { toggle: () => void; on: () => void; off: () => void }
  : T extends number
  ? {
      inc: (n?: number) => void;
      dec: (n?: number) => void;
    }
  : {});

export type { Accessor };