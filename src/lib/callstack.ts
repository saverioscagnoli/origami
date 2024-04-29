import { Dispatch, SetStateAction, useState } from "react";
import { ArgsMap, Operation, OperationStatus, OperationType } from "./operations";

class Callstack<T extends OperationType> {
  private map: Map<string, Operation<T>>;
  private setMap: Dispatch<SetStateAction<Map<string, Operation<T>>>>;

  public constructor(initialValue: Map<string, Operation<T>> = new Map()) {
    const [map, setMap] = useState(initialValue);

    this.map = map;
    this.setMap = setMap;
  }

  public get(id: string) {
    return this.map.get(id);
  }

  public set(id: string, op: Operation<T>) {
    const updatedMap = new Map(this.map.set(id, op));
    this.setMap(updatedMap);
  }

  public delete(id: string) {
    this.map.delete(id);
    const updatedMap = new Map(this.map);
    this.setMap(updatedMap);
  }

  public push(type: T, args: ArgsMap[T]) {
    const op = new Operation(type, args);

    this.set(window.crypto.randomUUID(), op);
  }

  public updateStatus(id: string, status: OperationStatus) {
    const op = this.get(id);

    if (op) {
      op.setStatus(status);
      this.set(id, op);
    }

    return op;
  }

  public getKeyValues() {
    return Array.from(this.map.entries());
  }

  public peek() {
    return this.map;
  }

  public getPendingOperations(): Operation<T>[] {
    return this.getKeyValues()
      .map(([_, op]) => op)
      .filter(op => op.isPending());
  }

  public watchChanges() {
    const { Ready, Success, Error } = OperationStatus;

    console.log(this.getKeyValues().map(([id, op]) => op.getStatus()));

    for (const [id, op] of this.getKeyValues()) {
      switch (op.getStatus()) {
        case Ready: {
          op.setStatus(OperationStatus.Pending);
          op.invoke(id);
          this.set(id, op);
          break;
        }

        case Error:
        case Success: {
          this.delete(id);
          break;
        }

        default:
          break;
      }
    }
  }
}

export { Callstack };
