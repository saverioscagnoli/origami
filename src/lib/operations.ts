import { invoke } from "@tauri-apps/api/core";

enum OperationType {
  ListDir = "list_dir",
  OpenFile = "open_file"
}

type ArgsMap = {
  [OperationType.ListDir]: { path: string };
  [OperationType.OpenFile]: { path: string };
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

  public getStatus(): OperationStatus {
    return this.status;
  }

  public setStatus(status: OperationStatus): void {
    this.status = status;
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

  public invoke(id: string) {
    invoke(this.type, { ...this.args, opId: id });
  }
}

export { Operation, OperationType, OperationStatus };
export type { ArgsMap };
