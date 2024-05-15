import { getCurrent } from "@tauri-apps/api/window";
import { Disk } from "@typings/disk";
import { BackendEvent } from "@typings/enums";
import { Theme } from "@zustand/settings-store";
import { DependencyList, useEffect } from "react";

type BackendEventMap = {
  /**
   * This event is emitted every x seconds. (See src-tauri/src/enums.rs)
   * The payload is an array of disks, used to update the view.
   */
  [BackendEvent.SendDisks]: Disk[];

  /**
   * This event is emitted when a copy operation starts.
   * The payload is the current theme.
   */
  [BackendEvent.CopyStart]: Theme;

  /**
   * This event is emitted when a copy operation is in progress.
   */
  [BackendEvent.CopyProgress]: [total: number, copied: number, rate: number];

  /**
   * This event is emitted when a copy operation is over.
   * The payload is the time it took to copy the files.
   */
  [BackendEvent.CopyOver]: number;
};

function useBackendEvent<K extends BackendEvent>(
  event: K,
  cb: (payload: BackendEventMap[K]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const promise = getCurrent().listen<BackendEventMap[K]>(event, event =>
      cb(event.payload)
    );

    return () => {
      promise.then(dispose => dispose());
    };
  }, deps);
}

export { useBackendEvent };
