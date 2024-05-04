import {
  GlobalStatesState,
  startCopying as dispatchStartCopying,
  startCutting as dispatchStartCutting,
  startRenaming as dispatchStartRenaming
} from "@redux/global-states-slice";
import { RootState } from "@redux/store";
import { DirEntry } from "@typings/dir-entry";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentDir } from "./use-current-dir";

function useGlobalStates() {
  const dispatch = useDispatch();
  const globalStates = useSelector<RootState, GlobalStatesState>(
    state => state.globalStates
  );

  const startCutting = (cutting: DirEntry[]) => {
    dispatch(dispatchStartCutting(cutting));
  };

  const startCopying = (copying: DirEntry[]) => {
    dispatch(dispatchStartCopying(copying));
  };

  const startRenaming = (renaming: DirEntry) => {
    dispatch(dispatchStartRenaming(renaming));
  };

  const { selected } = useCurrentDir();

  const canCopy = useMemo(() => selected.length > 0, [selected]);
  const canCut = useMemo(() => selected.length > 0, [selected]);
  const canRename = useMemo(() => selected.length === 1, [selected]);
  const canDelete = useMemo(() => selected.length > 0, [selected]);

  const canPaste = useMemo(
    () => globalStates.copying.length > 0 || globalStates.cutting.length > 0,
    [globalStates]
  );

  return {
    ...globalStates,
    startCutting,
    startCopying,
    startRenaming,
    canCopy,
    canCut,
    canRename,
    canPaste,
    canDelete
  };
}

export { useGlobalStates };
