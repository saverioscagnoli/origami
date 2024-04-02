import { DependencyList, useEffect } from "react";

const whenChanges = (
  cb: () => Promise<() => void> | (() => void) | void | Promise<void>,
  deps: DependencyList
) => {
  useEffect(() => {
    let cleanupFunction: () => void = () => {};

    const callbackResult = cb();

    if (callbackResult instanceof Promise) {
      callbackResult.then(resolvedCleanupFunction => {
        cleanupFunction = resolvedCleanupFunction || cleanupFunction;
      });
    } else {
      cleanupFunction = callbackResult || cleanupFunction;
    }

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, deps);
};

const onMount = (
  cb: () => Promise<() => void> | (() => void) | void | Promise<void>
) => {
  whenChanges(cb, []);
};

export { whenChanges, onMount };
