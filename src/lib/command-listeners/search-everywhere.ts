import { useCommandResponse } from "@hooks/use-command-response";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

function searchEverywhereListen() {
  const [entries, setEntries] = useCurrentDir(state => [
    state.entries,
    state.setEntries
  ]);

  // Create a temporary array to hold the incoming data
  let tempData = [];

  useCommandResponse(
    CommandName.SearchEverywhere,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        alert(error);
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
