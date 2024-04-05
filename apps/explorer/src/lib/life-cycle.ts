import { useAccessor } from "@hooks/use-accessor";
import { DependencyList, useEffect } from "react";

const whenChanges = (
  deps: DependencyList,
  cb: () => Promise<() => void> | (() => void) | void | Promise<void>
) => {
  const changing = useAccessor<boolean>(false);

  useEffect(() => {
    changing.set(true);

    let cleanupFunction: () => void = () => {};

    const callbackResult = cb();

    if (callbackResult instanceof Promise) {
      callbackResult.then(resolvedCleanupFunction => {
        cleanupFunction = resolvedCleanupFunction || cleanupFunction;
        changing.set(false);
      });
    } else {
      cleanupFunction = callbackResult || cleanupFunction;
      changing.set(false);
    }

    return () => {
      if (cleanupFunction) cleanupFunction();
      changing.set(false);
    };
  }, deps);

  return changing.get();
};

const onMount = (
  cb: () => Promise<() => void> | (() => void) | void | Promise<void>
) => {
  whenChanges([], cb);
};

export { whenChanges, onMount };
