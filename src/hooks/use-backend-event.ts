import { Disk } from "@typings/disk";
import { BackendEvent } from "@typings/enums";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type BackendEventMap = {
  [BackendEvent.SendDisks]: Disk[];
  /**
   * @param totalBytes - Total bytes to copy
   * @param copiedBytes - Bytes copied so far
   * @param readRate - Bytes read per second
   */
  [BackendEvent.CopyProgress]: {
    totalBytes: number;
    copiedBytes: number;
    readRate: number;
  };

  /**
   * @param [0] - Total time taken in seconds
   */
  [BackendEvent.CopyOver]: number;
};

const useBackendEvent = buildMappedTauriEventHook<BackendEventMap>();

export { useBackendEvent };
