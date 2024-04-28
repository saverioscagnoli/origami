import { OperationType } from "@lib/operations";
import { DirEntry } from "@typings/dir-entry";
import { Disk } from "@typings/disk";
import { EventFromBackend } from "@typings/events";
import { Payload } from "@typings/payload";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type OperationMap = {
  [OperationType.ListDir]: Payload<{ entries: DirEntry[]; path: string }>;
  [OperationType.OpenFile]: Payload<{ path: string }>;
  [OperationType.DeleteEntry]: Payload<{ path: string }>;
  [EventFromBackend.SendDisks]: Disk[];
};

const useTauriEvent = buildMappedTauriEventHook<OperationMap>();

export { useTauriEvent };
