import { DependencyList, useEffect } from "react";

function useDocumentEvent<T extends keyof DocumentEventMap>(
  name: T,
  cb: (evt: DocumentEventMap[T]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    document.addEventListener(name, cb);

    return () => {
      document.removeEventListener(name, cb);
    };
  }, deps);
}

export { useDocumentEvent };
