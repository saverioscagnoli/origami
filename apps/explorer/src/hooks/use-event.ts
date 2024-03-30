import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

const useEvent = <T>(event: string, cb: (payload: T) => void) => {
  useEffect(() => {
    const promise = listen<T>(event, evt => cb(evt.payload));

    return () => {
      promise.then(rm => rm());
    };
  }, []);
};

export { useEvent };
