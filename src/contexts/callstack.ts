import { CommandArgsMap } from "@lib/mapped-invoke";
import { Operation } from "@lib/operation";
import { createContextHook, createContextProvider } from "@lib/utils";
import { CommandName, CommandStatus } from "@typings/enums";
import { Accessor, createContext, createEffect, createSignal } from "solid-js";

type CallstackContextValue = {
  callstack: Accessor<Operation<CommandName>[]>;
  push: <K extends CommandName>(cmd: K, args: CommandArgsMap[K]) => void;
  updateStatus: (id: number, status: CommandStatus) => void;
};

const CallstackContext = createContext<CallstackContextValue>();

const useCallstack = createContextHook(CallstackContext, "Callstack");

const CallstackProvider = createContextProvider(CallstackContext, () => {
  const [callstack, setCallstack] = createSignal<Operation<CommandName>[]>([]);

  const push = <K extends CommandName>(cmd: K, args: CommandArgsMap[K]) => {
    setCallstack([
      ...callstack(),
      new Operation(callstack().length, cmd, args)
    ]);
  };

  const pop = (id: number) => {
    setCallstack(callstack().filter(op => op.getID() !== id));
  };

  const updateStatus = (id: number, status: CommandStatus) => {
    const cmd = callstack().find(op => op.getID() === id);

    if (cmd) {
      cmd.setStatus(status);
    }

    setCallstack([...callstack()]);
  };

  createEffect(() => {
    console.log(callstack().map(op => op.getStatus()));

    for (const cmd of callstack()) {
      switch (cmd.getStatus()) {
        case CommandStatus.Ready: {
          updateStatus(cmd.getID(), CommandStatus.Pending);
          cmd.invoke();
          break;
        }

        case CommandStatus.Error:
        case CommandStatus.Success: {
          pop(cmd.getID());
          break;
        }
      }
    }
  });

  return {
    callstack,
    push,
    updateStatus
  };
});

export { CallstackProvider, useCallstack };
