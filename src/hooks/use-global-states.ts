import {
  GlobalStatesState,
  setError as dispatchSetError,
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

  const setError = (error: string | null) => {
    dispatch(dispatchSetError(error));
  };

  return {
    ...globalStates,
    setCutting,
    setCopying,
    setRenaming,
    setError
  };
}

export { useGlobalStates };
