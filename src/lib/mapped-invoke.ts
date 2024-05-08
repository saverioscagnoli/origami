import { invoke as defaultInvoke } from "@tauri-apps/api/core";
import { CommandName } from "@typings/enums";

type CommandArgsMap = {
  [CommandName.ListDir]: { dir: string };
};

async function invoke<K extends CommandName>(
  command: K,
  args: CommandArgsMap[K] & { id: number }
) {
  return defaultInvoke(command, args);
}

export { invoke };
export type { CommandArgsMap };
