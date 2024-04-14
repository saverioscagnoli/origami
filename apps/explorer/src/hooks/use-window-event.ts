import { DependencyList, useEffect } from "react";

function useWindowEvent<T extends keyof WindowEventMap>(
  name: T,
  cb: (evt: WindowEventMap[T]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    window.addEventListener(name, cb);

    return () => {
      window.removeEventListener(name, cb);
    };
  }, deps);
}

export { useWindowEvent };
