import { whenChanges } from "@life-cycle";
import { EventName, listen } from "@tauri-apps/api/event";
import { DependencyList } from "react";

const useEvent = <T>(
  event: EventName,
  cb: (payload: T) => void,
  deps: DependencyList = []
) => {
  whenChanges(deps, () => {
    const promise = listen<T>(event, evt => cb(evt.payload));

    return () => {
      promise.then(rm => rm());
    };
  });
};

export { useEvent };
