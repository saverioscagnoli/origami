import { EnvironmentState } from "@redux/environment-slice";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

function useEnvironment() {
  const environment = useSelector<RootState, EnvironmentState>(
    state => state.environment
  );

  return { ...environment };
}

export { useEnvironment };
