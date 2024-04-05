import { whenChanges } from "@life-cycle";
import { DependencyList } from "react";

const useJSEvent = <T extends keyof DocumentEventMap>(
  e: T,
  deps: DependencyList,
  cb: (evt: DocumentEventMap[T]) => void
) => {
  whenChanges(deps, () => {
    document.addEventListener(e, cb);

    return () => {
      document.removeEventListener(e, cb);
    };
  });
};

export { useJSEvent };
