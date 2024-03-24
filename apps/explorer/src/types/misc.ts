import { Dispatch, SetStateAction } from "react";

type Accessor<T> = {
  get: () => T;
  set: Dispatch<SetStateAction<T>>;
};

export type { Accessor };
