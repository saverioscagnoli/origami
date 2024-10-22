import { fs } from "@wails/models";
import { EventsOn } from "@wails/runtime";
import { DependencyList, useEffect } from "react";

type BackendEventMap = {
  "f:write": fs.DirEntry;
  "f:create": fs.DirEntry;
  "f:remove": string;
  "f:rename": string;
  "f:star": string;
  "f:unstar": string;
  "f:progress": [[number, number], string];
  "f:notification": [string, string, string];
  "f:notification-close": string;
  "config:load": string;
  disks: fs.Disk[];
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
