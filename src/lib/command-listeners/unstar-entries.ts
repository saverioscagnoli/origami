import { useCommandResponse } from "@hooks/use-command-response";
import { DirEntry } from "@typings/dir-entry";
import { BasicDirLabel, CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useEnvironment } from "@zustand/environment-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useEffect, useState } from "react";

function unstarEntryListen() {
  const [dir, replaceSelected, replaceEntries, removeEntries] = useCurrentDir(
    state => [
      state.dir,
      state.replaceSelected,
      state.replaceEntries,
      state.removeEntries
    ]
  );

  const setError = useGlobalStates(state => state.setError);
  const basicDirs = useEnvironment(s => s.basicDirs);

  const starredDir = basicDirs.find(b => b.label === BasicDirLabel.Starred);

  const [unstarred, setUnstarred] = useState<DirEntry[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (finished) {
      replaceSelected(unstarred);

      if (dir === starredDir?.path) {
        removeEntries(unstarred.map(e => e.path));
      } else {
        replaceEntries(unstarred);
      }

      setUnstarred([]);
      setFinished(false);
    }
  }, [finished, dir, starredDir]);

  useCommandResponse(
    CommandName.UnstarEntries,
    payload => {
      const [data, error, isFinished] = payload;

      if (error) {
        setError(error);
        return;
      }

      setUnstarred(prev => [...prev, data!]);

      if (isFinished) {
        setFinished(true);
      }
    },
    [unstarred]
  );
}

export { unstarEntryListen };
