import { CommandName, CommandStatus } from "@typings/enums";
import { Command } from "./command";
import { EventEmitter } from "./event-emitter";
import { CommandArgsMap } from "./mapped-invoke";

class Callstack extends EventEmitter {
  private stack: Command<CommandName>[];

  public constructor() {
    super();
    this.stack = [];
  }

  public listen() {
    this.onChange();

    this.on("push", () => this.onChange());
    this.on("finish", () => this.onChange());
  }

  public push<T extends CommandName>(cmd: CommandName, args: CommandArgsMap[T]) {
    const id = this.stack.length;
    const command = new Command(id, cmd, args);

    this.stack.push(command);
    this.emit("push", command);
  }

  private pop(id: number) {
    this.stack = this.stack.filter(cmd => cmd.getID() !== id);
  }

  public updateStatus(id: number, status: CommandStatus) {
    const cmd = this.stack.find(cmd => cmd.getID() === id);

    if (cmd) {
      cmd.setStatus(status);

      if (cmd.isFinished()) {
        this.emit("finish", cmd);
      }
    }
  }

  public onChange() {
    console.log(this.stack.map(cmd => cmd.getStatus()));

    for (const cmd of this.stack) {
      switch (cmd.getStatus()) {
        case CommandStatus.Ready: {
          this.updateStatus(cmd.getID(), CommandStatus.Pending);
          this.onChange();
          cmd.invoke();
          break;
        }

        case CommandStatus.Pending: {
          break;
        }

        case CommandStatus.Error:
        case CommandStatus.Abort:
        case CommandStatus.Success: {
          this.pop(cmd.getID());
          break;
        }
      }
    }
  }
}

export { Callstack };
