import { fs } from "@wails/go/models";
import { EventsOn } from "@wails/runtime";
import { DependencyList, useEffect } from "react";

type BackendEventMap = {
  disks: fs.Disk[];
  "fs:create": fs.DirEntry;
  "fs:delete": string;
  "fs:rename": [string, string];
};

function useWailsEvent<K extends keyof BackendEventMap>(
  event: K,
  cb: (data: BackendEventMap[K]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const destroy = EventsOn(event, cb);

    return () => {
      destroy();
    };
  }, deps);
}

export { useWailsEvent };
