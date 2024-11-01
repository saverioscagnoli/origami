import { DependencyList, useEffect } from "react";

/**
 * If the dependencies don't change for a certain amount of time, call the callback
 * @param cb The callback to call
 * @param delay The amount of time to wait before calling the callback
 * @param dependencies The dependencies to watch
 */
function useDebounce(
  cb: () => void,
  delay: number,
  dependencies: DependencyList
) {
  useEffect(() => {
    const handler = setTimeout(cb, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies, delay]);
}

export default useDebounce;
