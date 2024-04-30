import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

function useCurrentDir() {
  const { dir, entries, selected } = useSelector(
    (state: RootState) => state.currentDir
  );

  return { dir, entries, selected };
}

export { useCurrentDir };
