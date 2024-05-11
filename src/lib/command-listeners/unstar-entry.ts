import { useCommandResponse } from "@hooks/use-command-response";
import { DirEntry } from "@typings/dir-entry";
import { CommandName, CommandStatus } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEffect, useState } from "react";

function unstarEntryListen() {
  const updateStatus = useCallstack(state => state.updateStatus);
  const replaceEntries = useCurrentDir(state => state.replaceEntries);

  const [unstarred, setUnstarred] = useState<DirEntry[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (finished) {
      replaceEntries(unstarred);
      setUnstarred([]);
      setFinished(false);
    }
  }, [finished]);

  useCommandResponse(CommandName.UnstarEntries, payload => {
    const [id, data, error, isFinished] = payload;

    if (error) {
      updateStatus(id, CommandStatus.Error);
      alert(error);
      return;
    }

    setUnstarred(prev => [...prev, data!]);

    if (isFinished) {
      updateStatus(id, CommandStatus.Success);
      setFinished(true);
    }
  });
}

export { unstarEntryListen };
