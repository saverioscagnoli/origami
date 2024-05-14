import { useCommandResponse } from "@hooks/use-command-response";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useEffect, useState } from "react";

function starEntriesListen() {
  const replaceEntries = useCurrentDir(state => state.replaceEntries);
  const setError = useGlobalStates(state => state.setError);

  const [starred, setStarred] = useState<DirEntry[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (finished) {
      replaceEntries(starred);
      setStarred([]);
      setFinished(false);
    }
  }, [finished]);

  useCommandResponse(
    CommandName.StarEntries,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        setError(error);
        return;
      }

      setStarred(prev => [...prev, data!]);

      if (isFinished) {
        setFinished(true);
      }
    },
    [starred]
  );
}

export { starEntriesListen };
