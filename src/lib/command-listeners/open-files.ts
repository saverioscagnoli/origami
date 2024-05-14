import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";

function openFilesListen() {
  useCommandResponse(CommandName.OpenFiles, payload => {
    const [_, error, isFinished] = payload;

    if (error) {
      alert(error);
      return;
    }

    if (isFinished) {
    }
  });
}

export { openFilesListen };
