import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/window";
import { CommandName, CommandStatus } from "@typings/enums";
import { CommandArgsMap } from "./mapped-invoke";

class Command<T extends CommandName> {
  private id: number;
  private name: CommandName;
  private status: CommandStatus;
  private args: CommandArgsMap[T];

  public constructor(id: number, name: T, args: CommandArgsMap[T]) {
    this.id = id;
    this.name = name;
    this.args = args;
    this.status = CommandStatus.Ready;
  }

  public getID(): number {
    return this.id;
  }

  public getStatus(): CommandStatus {
    return this.status;
  }

  public setStatus(status: CommandStatus): void {
    this.status = status;
  }

  public invoke() {
    const { label } = getCurrent();

    invoke.bind(this)(this.name, { ...this.args, id: this.getID(), label });
  }

  public isFinished(): boolean {
    return [
      CommandStatus.Success,
      CommandStatus.Error,
      CommandStatus.Abort
    ].includes(this.status);
  }
}

export { Command };
