import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

function pasteEntriesListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const [dir, addEntries] = useCurrentDir(s => [s.dir, s.addEntries]);

  useCommandResponse(
    CommandName.PasteEntries,
    payload => {
      const [id, data, error, isFinished] = payload;

      if (error) {
        updateStatus(id, CommandStatus.Error);
        alert(error);
        return;
      }

      if (data!.path.startsWith(dir)) {
        addEntries([data!]);
      }

      if (isFinished) {
        updateStatus(id, CommandStatus.Success);
      }
    },
    [dir]
  );
}

export { pasteEntriesListen };
