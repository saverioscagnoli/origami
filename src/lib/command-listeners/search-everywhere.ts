import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function searchEverywhereListen() {
  const [entries, setEntries] = useCurrentDir(state => [
    state.entries,
    state.setEntries
  ]);

  const setError = useGlobalStates(state => state.setError);

  // Create a temporary array to hold the incoming data
  let tempData = [];

  useCommandResponse(
    CommandName.SearchEverywhere,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        setError(error);
        return;
      }

      tempData = tempData.concat(data);

      if (isFinished) {
        setEntries(tempData);

        tempData = [];
      }
    },
    [entries]
  );
}

export { searchEverywhereListen };
