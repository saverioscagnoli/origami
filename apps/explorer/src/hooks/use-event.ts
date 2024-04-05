import { onMount } from "@life-cycle";
import { listen } from "@tauri-apps/api/event";

const useEvent = <T>(event: string, cb: (payload: T) => void) => {
  onMount(() => {
    const promise = listen<T>(event, evt => cb(evt.payload));

    return () => {
      promise.then(rm => rm());
    };
  });
};

export { useEvent };
