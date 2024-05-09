import { Command } from "@lib/command";
import { CommandArgsMap } from "@lib/mapped-invoke";
import { CommandName, CommandStatus } from "@typings/enums";
import { ChildrenProps } from "@typings/props";
import { FC, useEffect } from "react";
import { create } from "zustand";

////////////////////////////////
//                            //
//         Callstack          //
//                            //
////////////////////////////////

/**
 * This is the store for all the information rrelated to the command callstack.
 * To execute a command, the push function must be called, to push a command to the callstack.
 * Then, when ready, the command gets invoked and its status is updated to Pending.
 * To detect when a command has finished, there's the useCommandResponse hook,
 * which creates a listener for a specific command.
 *
 * @interface CallstackStore
 *
 * @property {Command<CommandName>[]} callstack - The list of commands in the callstack.
 * @property {function} push - A function to push a command to the callstack.
 */
interface CallstackStore {
  callstack: Command<CommandName>[];
  push: <T extends CommandName>(cmdName: T, args: CommandArgsMap[T]) => void;
  pop: (id: number) => void;
  updateStatus: (id: number, status: CommandStatus) => void;
}

const useCallstack = create<CallstackStore>()(set => ({
  callstack: [],
  push: (name, args) => {
    set(state => {
      const id = state.callstack.length;
      const cmd = new Command(id, name, args);
      return { callstack: [...state.callstack, cmd] };
    });
  },

  pop: id => {
    set(state => ({ callstack: state.callstack.filter(cmd => cmd.getID() !== id) }));
  },

  updateStatus: (id, status) => {
    set(state => {
      const cmd = state.callstack.find(cmd => cmd.getID() === id);

      if (cmd) {
        cmd.setStatus(status);
      }

      return { callstack: [...state.callstack] };
    });
  }
}));

const CallstackWatcher: FC<ChildrenProps> = ({ children }) => {
  /**
   * useEffect that watch for changes on the callstack,
   * updating it accordingly.
   */

  const [callstack, updateStatus, pop] = useCallstack(state => [
    state.callstack,
    state.updateStatus,
    state.pop
  ]);

  useEffect(() => {
    console.log(callstack.map(cmd => cmd.getStatus()));

    for (const cmd of callstack) {
      switch (cmd.getStatus()) {
        case CommandStatus.Ready: {
          updateStatus(cmd.getID(), CommandStatus.Pending);
          cmd.invoke();

          break;
        }

        case CommandStatus.Pending: {
          break;
        }

        case CommandStatus.Abort:
        case CommandStatus.Error:
        case CommandStatus.Success: {
          pop(cmd.getID());
          break;
        }
      }
    }
  }, [callstack]);

  return <>{children}</>;
};

export { CallstackWatcher, useCallstack };
