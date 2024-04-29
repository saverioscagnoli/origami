import { invoke } from "@tauri-apps/api/core";

enum OperationType {
  ListDir = "list_dir",
  OpenFile = "open_file",
  PasteEntries = "paste_entries",
  DeleteEntry = "delete_entry"
}

type ArgsMap = {
  [OperationType.ListDir]: { path: string };
  [OperationType.OpenFile]: { path: string };
  [OperationType.PasteEntries]: { paths: string[]; dir: string; isCutting: boolean };
  [OperationType.DeleteEntry]: { path: string };
};

enum OperationStatus {
  Ready = "Ready",
  Pending = "Pending",
  Success = "Success",
  Error = "Error",
  Canceled = "Canceled"
}

class Operation<T extends OperationType> {
  private type: T;
  private status: OperationStatus;
  private args: ArgsMap[T];

  public constructor(type: T, args: ArgsMap[T]) {
    this.type = type;
    this.args = args;
    this.status = OperationStatus.Ready;
  }

  public peekArgs(): ArgsMap[T] {
    return this.args;
  }

  public getStatus(): OperationStatus {
    return this.status;
  }

  public setStatus(status: OperationStatus): void {
    this.status = status;
  }

  public getType(): T {
    return this.type;
  }

  public isReady(): boolean {
    return this.status === OperationStatus.Ready;
  }

  public isPending(): boolean {
    return this.status === OperationStatus.Pending;
  }

  public isSuccess(): boolean {
    return this.status === OperationStatus.Success;
  }

  public isError(): boolean {
    return this.status === OperationStatus.Error;
  }

  public isCanceled(): boolean {
    return this.status === OperationStatus.Canceled;
  }

  public isFinished(): boolean {
    return this.isSuccess() || this.isError() || this.isCanceled();
  }

  public invoke(id: string) {
    invoke(this.type, { ...this.args, opId: id });
  }
}

export { Operation, OperationType, OperationStatus };
export type { ArgsMap };
