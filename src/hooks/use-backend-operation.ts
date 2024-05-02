import { OperationType } from "@lib/operations";
import { DirEntry } from "@typings/dir-entry";
import { Payload } from "@typings/payload";
import { buildMappedTauriEventHook } from "@util-hooks/use-tauri-event";

type OperationMap = {
  [OperationType.ListDir]: Payload<{ entries: DirEntry[]; path: string }>;
  [OperationType.OpenFile]: Payload<{ path: string }>;

  // Returns the directory where the file(s) were pasted, so that the frontend can update the UI accordingly.
  [OperationType.PasteEntries]: Payload<{ dir: string }>;
  [OperationType.CreateEntry]: Payload<string>;
  [OperationType.RenameEntry]: Payload<String>;
  [OperationType.DeleteEntries]: Payload<{ dir: string }>;
};

const useBackendOperation = buildMappedTauriEventHook<OperationMap>();

export { useBackendOperation };
