import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

function useCallstack() {
  return useSelector((state: RootState) => state.callstack);
}

export { useCallstack };
