import { Accessor } from "@types";
import { useState } from "react";

const useAccessor = <T>(defaultValue: T): Accessor<T> => {
  const [value, setValue] = useState<T>(defaultValue);

  const get = () => value;
  const set = setValue;
  const reset = () => setValue(defaultValue);

  switch (typeof defaultValue) {
    case "boolean": {
      return {
        get,
        set,
        reset,
        toggle: () => setValue(p => !p as T)
      } as unknown as Accessor<T>;
    }
    case "number": {
      return {
        get,
        set,
        // @ts-ignore
        increment: (n: number) => setValue(p => p + n),
        // @ts-ignore
        decrement: (n: number) => setValue(p => p - n),
        reset
      } as unknown as Accessor<T>;
    }
    default: {
      return { get, set, reset } as Accessor<T>;
    }
  }
};

export { useAccessor };
