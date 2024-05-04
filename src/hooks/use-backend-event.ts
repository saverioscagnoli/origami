import { Disk } from "@typings/disk";
import { BackendEvent } from "@typings/enums";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type BackendEventMap = {
  [BackendEvent.SendDisks]: Disk[];
};

const useBackendEvent = buildMappedTauriEventHook<BackendEventMap>();

export { useBackendEvent };
