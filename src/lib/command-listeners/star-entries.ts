import { useCommandResponse } from "@hooks/use-command-response";
import { DirEntry } from "@typings/dir-entry";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEffect, useState } from "react";

function starEntriesListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const replaceEntries = useCurrentDir(state => state.replaceEntries);

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
      const [id, data, error, isFinished] = payload;

      if (error) {
        updateStatus(id, CommandStatus.Error);
        alert(error);
        return;
      }

      setStarred(prev => [...prev, data!]);

      if (isFinished) {
        updateStatus(id, CommandStatus.Success);
        setFinished(true);
      }
    },
    [starred]
  );
}

export { starEntriesListen };
