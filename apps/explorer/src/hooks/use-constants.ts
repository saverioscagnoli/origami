import { ConstantsContext } from "@contexts/constants";
import { createContextHook } from "@utils";

const useConstants = createContextHook(ConstantsContext, "Constants");

export { useConstants };
