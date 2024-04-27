import {
  ArgsMap,
  Operation,
  OperationStatus,
  OperationType
} from "./operations";

class Callstack {
  private static instance: Callstack;

  private map: Map<string, Operation<OperationType>>;

  private constructor() {
    this.map = new Map();
  }

  public static build(): Callstack {
    if (!Callstack.instance) {
      Callstack.instance = new Callstack();
    }

    return Callstack.instance;
  }

  public getState() {
    return this.map;
  }

  public push<T extends OperationType>(type: T, args: ArgsMap[T]) {
    const op = new Operation(type, args);
    const uuid = window.crypto.randomUUID();

    this.set(uuid, op);
  }

  public pop(id: string) {
    this.map.delete(id);
    this.change();
  }

  public get(id: string): Operation<OperationType> | undefined {
    return this.map.get(id);
  }

  public set(id: string, op: Operation<OperationType>) {
    this.map.set(id, op);
    this.change();
  }

  public getKeyValues(): [string, Operation<OperationType>][] {
    return Array.from(this.map.entries());
  }

  public updateStatus(id: string, status: OperationStatus) {
    const op = this.get(id);

    if (op) {
      op.setStatus(status);
      this.set(id, op);
    }

    return op;
  }

  public change() {
    const { Ready, Pending, Success, Error, Canceled } = OperationStatus;

    console.log(this.getKeyValues().map(([_, op]) => op.getStatus()));

    for (const [id, op] of this.getKeyValues()) {
      switch (op.getStatus()) {
        case Ready: {
          op.setStatus(OperationStatus.Pending);
          op.invoke(id);
          this.set(id, op);
          break;
        }

        case Pending: {
          break;
        }

        case Success:
        case Error:
        case Canceled: {
          this.pop(id);
          break;
        }

        default: {
          break;
        }
      }
    }
  }
}

export { Callstack };
