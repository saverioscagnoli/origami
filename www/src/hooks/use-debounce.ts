import { DependencyList, useEffect } from "react";

function useDebounce(
  cb: () => void,
  delay: number,
  dependencies: DependencyList[]
) {
  useEffect(() => {
    const handler = setTimeout(cb, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies, delay]);
}

export default useDebounce;
