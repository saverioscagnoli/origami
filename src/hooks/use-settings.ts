import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

function useSettings() {
  return useSelector((state: RootState) => state.settings);
}

export { useSettings };
