import { Accessor } from "@typings/accessor";
import { useState } from "react";

function useAccessor<T>(defaultValue: T): Accessor<T> {
  const [state, setState] = useState<T>(defaultValue);

  const accessor: any = () => state;
  accessor.set = setState;
  accessor.reset = () => setState(defaultValue);

  switch (typeof state) {
    case "boolean": {
      accessor.toggle = () => setState(p => !p as T);
      accessor.on = () => setState(true as T);
      accessor.off = () => setState(false as T);
      break;
    }
    case "number": {
      accessor.inc = (n = 1) => setState(p => ((p as number) + n) as T);
      accessor.dec = (n = 1) => setState(p => ((p as number) - n) as T);
      break;
    }
  }

  return accessor as Accessor<T>;
}

export { useAccessor };
