import { GlobalStatesContext } from "@contexts/global-states";
import { createContextHook } from "@lib/utils";

const useGlobalStates = createContextHook(GlobalStatesContext, "GlobalStates");

export { useGlobalStates };
