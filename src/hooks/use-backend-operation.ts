import { OperationType } from "@lib/operations";
import { DirEntry } from "@typings/dir-entry";
import { Payload } from "@typings/payload";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type OperationMap = {
  [OperationType.ListDir]: Payload<{ entries: DirEntry[]; path: string }>;
  [OperationType.OpenFile]: Payload<{ path: string }>;
  [OperationType.PasteEntries]: Payload<null>;
  [OperationType.DeleteEntries]: Payload<{ paths: string[] }>;
};

const useBackendOperation = buildMappedTauriEventHook<OperationMap>();

export { useBackendOperation };
