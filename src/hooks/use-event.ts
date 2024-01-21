import { listen } from "@tauri-apps/api/event";
import { onCleanup, onMount } from "solid-js";

function useEvent<T>(event: string, cb: (payload: T) => void) {
  onMount(() => {
    const promise = listen<T>(event, evt => cb(evt.payload));

    onCleanup(() => promise.then(rm => rm()));
  });
}

export { useEvent };
