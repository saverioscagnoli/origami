import { GlobalStatesContext } from "@contexts/global-states";
import { createContextHook } from "@utils";

const useGlobalStates = createContextHook(GlobalStatesContext, "GlobalStates");

export { useGlobalStates };
