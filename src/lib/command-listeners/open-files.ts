import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";

function openFilesListen() {
  const updateStatus = useCallstack(state => state.updateStatus);

  useCommandResponse(CommandName.OpenFiles, payload => {
    const [id, _, error, isFinished] = payload;

    if (error) {
      updateStatus(id, CommandStatus.Error);
      alert(error);
      return;
    }

    if (isFinished) {
      updateStatus(id, CommandStatus.Success);
    }
  });
}

export { openFilesListen };
