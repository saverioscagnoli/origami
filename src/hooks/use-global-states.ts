import {
  GlobalStatesState,
  setCreating as dispatchSetCreating,
  setErrors as dispatchSetErrors,
  startCopying as dispatchStartCopying,
  startCutting as dispatchStartCutting,
  startRenaming as dispatchStartRenaming
} from "@redux/global-states-slice";
import { RootState } from "@redux/store";
import { DirEntry } from "@typings/dir-entry";
import { useDispatch, useSelector } from "react-redux";

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

  const setErrors = (error: string[] | null) => {
    dispatch(dispatchSetErrors(error));
  };

  const setCreating = (creating: { state: boolean; isDir: boolean }) => {
    dispatch(dispatchSetCreating(creating));
  };

  return {
    ...globalStates,
    setCutting,
    setCopying,
    setRenaming,
    setErrors,
    setCreating
  };
}

export { useGlobalStates };
