import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useGlobalStates } from "@zustand/global-states-store";

function openFilesListen() {
  const setError = useGlobalStates(state => state.setError);

  useCommandResponse(CommandName.OpenFiles, payload => {
    const [_, error] = payload;

    if (error) {
      setError(error);
      return;
    }
  });
}

export { openFilesListen };
