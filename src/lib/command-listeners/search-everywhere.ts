import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

function searchEverywhereListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const [entries, setEntries] = useCurrentDir(state => [
    state.entries,
    state.setEntries
  ]);

  // Create a temporary array to hold the incoming data
  let tempData = [];

  useCommandResponse(
    CommandName.SearchEverywhere,
    payload => {
      const [id, data, error, isFinished] = payload;

      if (error) {
        updateStatus(id, CommandStatus.Error);
        alert(error);
        return;
      }

      tempData = tempData.concat(data);

      if (isFinished) {
        setEntries(tempData);
        updateStatus(id, CommandStatus.Success);
        tempData = [];
      }
    },
    [entries]
  );
}

export { searchEverywhereListen };
