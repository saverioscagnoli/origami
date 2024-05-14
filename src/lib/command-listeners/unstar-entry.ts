import { useCommandResponse } from "@hooks/use-command-response";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEffect, useState } from "react";

function unstarEntryListen() {
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
    const [data, error, isFinished] = payload;

    if (error) {
      alert(error);
      return;
    }

    setUnstarred(prev => [...prev, data!]);

    if (isFinished) {
      setFinished(true);
    }
  });
}

export { unstarEntryListen };
