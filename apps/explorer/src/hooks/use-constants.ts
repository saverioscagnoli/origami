import { ConstantsContext } from "@contexts/constants";
import { createContextHook } from "@lib/utils";

const useConstants = createContextHook(ConstantsContext, "Constants");

export { useConstants };
