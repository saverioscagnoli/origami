import { CommandName, CommandStatus } from "@typings/enums";
import { CommandArgsMap, invoke } from "./mapped-invoke";

class Operation<T extends CommandName> {
  private id: number;
  private name: CommandName;
  private status: CommandStatus;
  private args: CommandArgsMap[T];

  public constructor(id: number, name: CommandName, args: CommandArgsMap[T]) {
    this.id = id;
    this.name = name;
    this.status = CommandStatus.Ready;
    this.args = args;
  }

  public invoke() {
    invoke.bind(this)(this.name, { ...this.args, id: this.getID() });
  }

  public getID() {
    return this.id;
  }

  public getStatus() {
    return this.status;
  }

  public setStatus(status: CommandStatus) {
    this.status = status;
  }
}

export { Operation };
