import { EventName, listen } from "@tauri-apps/api/event";
import { DependencyList, useEffect } from "react";

type Options<T, K = T> = {
  mutate?: (p: T) => K;
  deps?: DependencyList;
};

function useTauriEvent<T, K = T>(
  name: EventName,
  cb: (p: K) => void,
  options?: Options<T, K>
) {
  const mutate = options?.mutate ?? ((p: T) => p as unknown as K);
  const deps = options?.deps ?? [];

  useEffect(() => {
    const promise = listen<T>(name, ({ payload }) => cb(mutate(payload)));

    return () => {
      promise.then(unlisten => unlisten());
    };
  }, deps);
}

export { useTauriEvent };
