import { Disk } from "@typings/disk";
import { BackendEvent } from "@typings/enums";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type BackendEventMap = {
  /**
   * This event is emitted every x seconds. (See src-tauri/src/enums.rs)
   * The payload is an array of disks, used to update the view.
   */
  [BackendEvent.SendDisks]: Disk[];
};

const useBackendEvent = buildMappedTauriEventHook<BackendEventMap>();

export { useBackendEvent };
