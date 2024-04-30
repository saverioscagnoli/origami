enum OperationType {
  ListDir = "list_dir",
  OpenFile = "open_file",
  PasteEntries = "paste_entries",
  DeleteEntries = "delete_entries"
}

type ArgsMap = {
  [OperationType.ListDir]: { path: string };
  [OperationType.OpenFile]: { path: string };
  [OperationType.PasteEntries]: { paths: string[]; dir: string; isCutting: boolean };
  [OperationType.DeleteEntries]: { paths: string[] };
};

enum OperationStatus {
  Ready = "Ready",
  Pending = "Pending",
  Success = "Success",
  Error = "Error",
  Canceled = "Canceled"
}

interface Operation<T extends OperationType> {
  id: string;
  type: T;
  status: OperationStatus;
  args: ArgsMap[T];
}

export { OperationStatus, OperationType };
export type { ArgsMap, Operation };
