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

  const setCutting = (cutting: DirEntry[]) => {
    dispatch(dispatchStartCutting(cutting));
  };

  const setCopying = (copying: DirEntry[]) => {
    dispatch(dispatchStartCopying(copying));
  };

  const setRenaming = (renaming: DirEntry | null) => {
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
    setCutting,
    setCopying,
    setRenaming,
    canCopy,
    canCut,
    canRename,
    canPaste,
    canDelete
  };
}

export { useGlobalStates };
